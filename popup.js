function message() {
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
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
