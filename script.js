
function fetchLinks() {
  var links = document.querySelectorAll('[src],[href]');
  if (links && links.length > 0) {
    createListing(links);
  }
}

function createListing(links) {
  let arr = [];
  for(var i = 0; i < links.length ; i++) {
    let item = links[i];
    let src;
    if (item.nodeName === 'IMG' || item.nodeName === 'A') {
      src = item.getAttribute('src') || item.getAttribute('href');
      let type = src.split('.').pop();
      if (type === 'jpg'||type === 'png' || type === 'mp3') {
        arr.push(src)
      }
    }
  }
  if (arr.length > 0) {
    sendToView(arr);
  }
}

function sendToView(links) {
  // send data to popup.html
  let obj = {origin: window.location.origin, protocol: window.location.protocol};
  chrome.runtime.sendMessage({links, cUrl: obj}); // cUrl == current page url + protocal
}

function reload() {
  /* recieve "send data" call from view and start
    process of extracting links from dom main send back to popup.html
  */
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.load === true) {
      fetchLinks();
    }
  });
}

fetchLinks();
reload(); // get message from view
