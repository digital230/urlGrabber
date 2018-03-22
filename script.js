
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
      if (isValidUrl(src, type)) arr.push(src)
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

function isValidUrl(url, type) {
  let validExts = ['jpg', 'png', 'mp3', 'mp4', 'jpeg'];
  if (validExts.indexOf(type) > -1) return true;
  if (validExts.indexOf(type) === -1) {
    if (url.split(',')[0] === 'data:image/jpeg;base64') return true; // base64 img data
  } else {
    return false;
  }

}





fetchLinks();
reload(); // get message from view
