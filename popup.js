document.addEventListener('load', askForData())


function askForData() {
  // on load ask content script to send data here
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {load: true});
});
}

function message() {
  // this function recieve data from content script
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    listing(request)
  });
}

function listing({links, cUrl}) {
  let el = document.getElementById('root-ext-#');
  let TEXT = document.createTextNode("Download");
  let DIV = document.createElement('div');
  let IMG = document.createElement('img');
  let BTN = document.createElement("BUTTON");

  DIV.setAttribute('class', 'content-div');
  BTN.setAttribute('class', 'btn');
  IMG.setAttribute('class', 'image');

  for (let i = 0; i <links.length ; i++) {
    let div = DIV.cloneNode(true);
    let img = IMG.cloneNode(true);
    let btn = BTN.cloneNode(true);
    let btnText = TEXT.cloneNode();
    let src = makeupLinks(links[i], cUrl);

    //listener
    btn.addEventListener('click', downloadData.bind(null, src));
    // img.addEventListener('mouseover', onHover.bind(this, src));

    //img
    img.src = src;

    // appending
    btn.appendChild(btnText);
    div.appendChild(img);
    div.appendChild(btn)

    el.appendChild(div);
  }
}

function makeupLinks(link, cUrl) {
  let rgx = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

  if (rgx.test(link)) {
    return link;
  } else {
    return detectOtherTypesOfImages(link, cUrl);
  }
}

function detectOtherTypesOfImages(link, {origin, protocol}) {
  let arr = link.split('/');
  let isBase64 = link.split(',')[0] === 'data:image/jpeg;base64';


  if (isBase64) return link;
  if (arr[0] === "" && arr[1] !== "") return `${origin}${link}`;
  if (arr[0] === "" && arr[1] === "") return `${protocol}${link}`;
}

// function onHover(src, e) {
//   console.log(src);
//   let div = document.createElement('div');
//   let img = document.createElement('img');

//   div.setAttribute('class', 'modal-div');
//   img.src = src;
//   div.appendChild(img)
// }

function downloadData(link, e) {
  chrome.downloads.download({url: link, saveAs: true})
}

message();

