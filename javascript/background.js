let email = ""; // Your email
let password = ""; // Your password

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "memorizeText",
        title: "Memorize",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "memorizeText") {
        let selectedText = info.selectionText;

        // Send the selected text to FastAPI
        fetch('https://projects.sthaarun.com.np/memorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: selectedText, email: email, password: password })
        }).then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }
});
