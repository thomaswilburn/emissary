Emissary
========

A browser request proxy for CORS-violating web apps. **This is probably a bad idea.**

Usage
-----


The first time that you try to make a `runabout` request, it will be refused. Users must authorize the extension for each origin by clicking on the shield icon that appears in the address bar. They can also de-authorize origins at any time. This provides a bare minimum of informed consent before you're allowed to stomp all over the browser's security model.

Sample code
-----------

::

  try {
    var response = await window.runabout("https://google.com");
    console.log("Successful cross-origin fetch!", response);
  } catch (err) {
    if (err.message == "Unauthorized origin") {
      alert("Please click the shield icon to authorize this origin");
    }
  }