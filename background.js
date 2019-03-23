var browser = browser || chrome;

var getStorage = function(keys) {
  return new Promise(function(ok) {
    var result = browser.storage.local.get(keys, ok);
    if (result) ok(result);
  });
};

var updatePageAction = function(id, domain, approved) {
  browser.pageAction.setPopup({
    tabId: id,
    popup: `approval.html?domain=${domain}&approved=${approved.toString()}&tab=${id}`
  })
}

browser.runtime.onMessage.addListener(async function(data, sender) {
  var { whitelist = [] } = await getStorage("whitelist");

  switch (data.type) {
    case "approve":
      whitelist.push(data.domain);
      updatePageAction(data.tab, data.domain, true)
    break;

    case "disapprove":
      whitelist = whitelist.filter(w => w != data.domain);
      updatePageAction(data.tab, data.domain, false);
    break;
  }

  browser.storage.local.set({ whitelist });
});

// browser.pageAction.onClicked.addListener(function(tab) {
//   browser.pageAction.
// })

browser.runtime.onConnect.addListener(function(wormhole) {
  wormhole.onMessage.addListener(async function(data) {
    var { url, options = {} } = data;

    var { sender } = wormhole;
    var { origin } = new URL(wormhole.sender.url);
    var { whitelist = [] } = await getStorage("whitelist");
    var whitelisted = whitelist.some(w => w == origin);

    updatePageAction(sender.tab.id, origin, whitelisted);
    browser.pageAction.show(sender.tab.id);

    if (!whitelisted) {
      return wormhole.postMessage({
        type: "emissaryerror",
        url,
        error: "Unauthorized origin"
      });
    }

    options.credentials = "omit";
    if (!url) return;
    var response = await fetch(url, options);
    if (response.statusCode >= 400) return wormhole.postMessage({
      type: "emissaryerror",
      url,
      error: response.statusCode
    });
    var body = await response.text();
    wormhole.postMessage({
      type: "emissaryresponse",
      url,
      body
    });
  });
});