
function fetchLinks() {
  var links = document.querySelectorAll('img[src], img[srcset],a[href],[background-image], i');
  if (links && links.length > 0) {
    createListing(links);
  }
}

function createListing(links) {
  let arr = [];
  let validItems = ['IMG', 'A', 'I'];
  for(var i = 0; i < links.length ; i++) {
    let item = links[i];
    // console.log(item)
    if (validItems.indexOf(item.nodeName) > -1 ) {
      handleImagesUrlStacking(extractUrlFromHtmlTags(item), arr);
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
  let rgx = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]");
  let actualType = type.split(rgx)[0];
  let validExts = ['jpg', 'png', 'mp3', 'mp4', 'jpeg', 'webp'];

  if (validExts.indexOf(actualType) > -1) return true;
  if (validExts.indexOf(actualType) === -1) {
    if (url.split(',')[0] === 'data:image/jpeg;base64') return true; // base64 img data
  } else {
    return false;
  }
}

function extractUrlFromHtmlTags(item) {
  let srcset = [];
  let backgroundImage = extractBackgroundImage(item)
  if (item.getAttribute('srcset')) {
    srcset = [item.getAttribute('srcset').split(',').pop()]; // here i reduce the urls of srcset to last one because page was hanging;
  }
  let src = item.getAttribute('src')
  || item.getAttribute('href')
  || item.getAttribute('background-image');

  if (src) return {src, srcset, backgroundImage};
  return {src: 'no-src', srcset: [], backgroundImage: null};
}

function handleImagesUrlStacking({src, srcset, backgroundImage}, arr) {
  let type = src.split('.').pop();

  if (isValidUrl(src, type)) arr.push(src);
  if (!isValidUrl(src, type) && srcset.length > 0) Array.prototype.push.apply(arr, srcset);
  if (backgroundImage) arr.push(backgroundImage);
}

function extractBackgroundImage(item) {
  let img = item.querySelectorAll('[style]')[0];
  let bcImage;
  if (img) {
    let style = img.currentStyle || window.getComputedStyle(img, false);
    return style.backgroundImage.slice(4, -1).replace(/"/g, "");
  }
  return null;
}


fetchLinks();
reload(); // get message from view
