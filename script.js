
function links() {
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
      src = item.getAttribute('src') || item.getAttribute('href')
      let type = src.split('.').pop();
      if (type === 'jpg'||type === 'png') {
        arr.push(src)
      }
    }
  }
  if (arr.length > 0) {
    sendToView(arr);
  }
}

function sendToView(links) {
  chrome.runtime.sendMessage({links});
}

links();
