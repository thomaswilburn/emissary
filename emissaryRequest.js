(function() {

if (window.emissaryRequest) return;

var requests = {};
var signals = {};

window.addEventListener("message", function({ data }) {
  var { url, body, type, error } = data;
  switch (type) {
    case "emissaryresponse":
      signals[url].ok(body);
      delete requests[url];
    break;

    case "emissaryerror":
      delete requests[url];
      signals[url].fail(new Error(error));
    break;
  }
});

var emissaryRequest = async function(url, options) {
  if (!requests[url]) requests[url] = new Promise(function(ok, fail) {
    signals[url] = { ok, fail };
    window.postMessage({
      type: "emissaryrequest",
      url,
      options
    });
  });
  var body = await requests[url];
  return body;
};

var runabout = async function(url, options) {
  try {
    var fetching = await fetch(url, options);
    var body = await fetching.text();
    return body;
  } catch (err) {
    // swallow errors
    console.log(`Fetch for ${url} failed, trying the wormhole instead...`);
  }
  return emissaryRequest(url, options);
};

window.runabout = runabout;

})();