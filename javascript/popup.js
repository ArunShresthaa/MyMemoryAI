// Access credentials from the global window object
const credentials = window.myCredentials;
let email, password

if (credentials) {
    email = credentials.email;
    password = credentials.password;
} else {
    console.log('Credentials not found!');
}

appendMessage('Hi, I am MyMemory. I am here to recall your Memory.', 'bot');

$('#send-button').click(function () {
    sendQuery();
});

$('#chat-input').keypress(function (e) {
    if (e.which === 13) {
        sendQuery();
    }
});

function sendQuery() {
    const userMessage = $('#chat-input').val();
    appendMessage(userMessage, 'user');
    $('#chat-input').val('');
    
    if (userMessage.startsWith('/summarize')) {
        requestServerForSummary();
    }

    else{
        requestServerForAnswer(userMessage);
    }

}


function appendMessage(message, sender) {
    let messageClass = sender === 'user' ? 'chat-message user' : 'chat-message bot';
    let imageUrl = sender === 'bot' ? 'images/bot.png' : ''; // Add your bot image path here
    let imageTag = sender === 'bot' ? `<img src="${imageUrl}" alt="${sender} image">` : '';
    let messageContent = `
                <div class="${messageClass}">
                    ${imageTag}
                    <div class="message-content">
                        ${message}
                    </div>
                </div>
            `;
    $('#chat-box-body').append(messageContent);
    $('#chat-box-body').scrollTop($('#chat-box-body')[0].scrollHeight);
}

function requestServerForAnswer(userInput) {
    let url = "https://projects.sthaarun.com.np/query";
    let data = { query: userInput, email: email, password: password };

    // Show typing indicator
    let typingIndicator = `<div class="chat-message bot typing-indicator-container">
                <img src="images/bot.png" alt="bot image">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>`;
    $('#chat-box-body').append(typingIndicator);
    $('#chat-box-body').scrollTop($('#chat-box-body')[0].scrollHeight);

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        method: 'POST'
    }).done(function (response) {
        // Remove typing indicator when response is received
        $('.typing-indicator-container').remove();
        addBotResponseToChatBox(response);
    }).fail(function (error) {
        // Remove typing indicator in case of failure
        $('.typing-indicator-container').remove();
        response = [{ text: "I am facing some issues, Please try again later!" }];
        addBotResponseToChatBox(response);
    });
}
function getPageContent() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getPageContent" }, (response) => {
            if (response.error) {
                reject(response.error);
            } else {
                resolve(response.content);
            }
        });
    });
}

async function requestServerForSummary() {
    let url = "https://projects.sthaarun.com.np/summarize";
    let textContent = await getPageContent();

    let data = { content: textContent};
    // Show typing indicator
    let typingIndicator = `<div class="chat-message bot typing-indicator-container">
                <img src="images/bot.png" alt="bot image">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>`;

    $('#chat-box-body').append(typingIndicator);
    $('#chat-box-body').scrollTop($('#chat-box-body')[0].scrollHeight);

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        method: 'POST'
    }).done(function (response) {
        // Remove typing indicator when response is received
        $('.typing-indicator-container').remove();
        console.log(response)
        appendMessage(response.summary, 'bot');
    }).fail(function (error) {
        // Remove typing indicator in case of failure
        $('.typing-indicator-container').remove();
        response = [{ text: "I am facing some issues, Please try again later!" }];
        addBotResponseToChatBox(response);
    });
}

function addBotResponseToChatBox(response) {
    appendMessage(response.answer.trim(), 'bot');
}