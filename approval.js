var domain = document.querySelector(".domain");
var input = document.querySelector(".approval");

var here = new URL(window.location);
var origin = here.searchParams.get("domain");
domain.innerHTML = origin;
var whitelisted = here.searchParams.get("approved") == "true";
input.checked = whitelisted;
var tab = here.searchParams.get("tab") * 1;

input.addEventListener("change", function() {
  var checked = this.checked;
  var here = new URL(window.location);
  browser.runtime.sendMessage({
    type: checked ? "approve" : "disapprove",
    domain: origin,
    tab
  });
})