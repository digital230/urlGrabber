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

function listing({links}) {
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

    //listener
    btn.addEventListener('click', downloadData.bind(null, links[i]));

    //img
    img.src = links[i];

    // appending
    btn.appendChild(btnText);
    div.appendChild(img);
    div.appendChild(btn)

    el.appendChild(div);
  }

}


function downloadData(link, e) {
  chrome.downloads.download({url: link, saveAs: true})
}

message();

