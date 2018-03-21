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
  // el.appendChild(div);

  for (let i = 0; i <links.length ; i++) {
    let div = document.createElement('div');
    let img = document.createElement('img');
    // let p = document.createElement('p');
    let btn = document.createElement("BUTTON");        // Create a <button> element
    let btnText = document.createTextNode("Download");

    // adding classes div
    div.setAttribute('class', 'content-div');
    btn.setAttribute('class', 'btn');

    //listener
    btn.addEventListener('click', downloadData.bind(null, links[i]));

    //img
    img.setAttribute('class', 'image');
    img.src = links[i];

    //p
    // p.innerHTML = links[i];

    // appending
    // div.appendChild(p);
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

