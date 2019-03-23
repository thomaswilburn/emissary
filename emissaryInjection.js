var browser = browser || chrome;

var wormhole = browser.runtime.connect();

window.addEventListener("message", function({ data, source }) {
  if (source != window) return;
  switch (data.type) {
    case "emissaryrequest":
      wormhole.postMessage(data);
    break;

    case "emissaryauth":
      browser.runtime.sendMessage({ type: "authrequest" });
    break;
  }
});

wormhole.onMessage.addListener(function(data) {
  window.postMessage(data);
});

wormhole.onDisconnect.addListener(function(data) {
  wormhole = browser.runtime.connect();
  console.log(wormhole);
});

var helper = browser.runtime.getURL("emissaryRequest.js");
var script = document.createElement("script");
script.src = helper;
document.head.appendChild(script);