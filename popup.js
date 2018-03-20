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
  let ul = document.createElement('ul');
  el.appendChild(ul);

  for (let i = 0; i <links.length ; i++) {
    let li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML = links[i]
  }
}

message();
