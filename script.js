// In your manifest.json file, make sure you have the "activeTab" permission.

// Your content script (content.js)
function scrapeEmailsFromPage() {
    alert('hi');
}

// Your popup script or other HTML document
let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');
 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    let emails = request.emails;
    
    if(emails==null || emails.length==0){
        let li =document.createElement("li");
        li.innerText ="No Emails found";
        list.appendChild(li);

    } // Assuming you have an HTML element with the id "list" as shown above

    else {
        
    
        emails.forEach((email) => {
            let li = document.createElement("li");
            li.innerText = email;
            list.appendChild(li);
        });
    
    
    }
});
 

scrapeEmails.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapeEmailsFromPage, 
    });
});

function scrapeEmailsFromPage() {
    const emailRegEx = /[\w\.\-]+@[\w\.\-]+\.[a-zA-Z]{2,4}/g;
    
    let emails = document.body.innerHTML.match(emailRegEx);
    chrome.runtime.sendMessage({emails});
}
