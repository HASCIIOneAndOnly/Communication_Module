// Создаем подключение сокета
const socket = io.connect(window.location.protocol + '//' + document.domain + ':' + location.port);

let sendMessageButton = document.getElementById('send-message-button'),
    messageInputArea = document.getElementById('message-input-box'),
    messagesContainer = document.getElementById('messages-container');


// Execute a function when the user presses a key on the keyboard
messageInputArea.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendMessageButton.click();
    }
});

sendMessageButton.addEventListener('click', function () {
    if (messageInputArea.value === "") {
    } else {
        // Define the data to send in the request
        const data = {
            chat_id: localStorage.getItem('current_chat_id'),
            message: messageInputArea.value,
        };
        socket.emit('send_message', data);
    }
    messageInputArea.value = "";
});

// Add a listener for the new_message event to add the message to the messagesContainer
socket.on('new_message', function (data) {
    // Create a new HTML element for the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-content'); // Add a CSS class for styling
    messageElement.textContent = data.message; // Set the content of the element to the message text

    // Create a message container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container')
    if (data.sender_id == CURRENT_USER_ID) { // Replace with the actual current user id
        messageContainer.classList.add('sent-message');
    } else {
        messageContainer.classList.add('received-message');
    }

    // Append message element to the message container
    messageContainer.appendChild(messageElement);

    // Append the new message container to the messages container
    messagesContainer.appendChild(messageContainer);
    messagesContainer.prepend(messageContainer);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    let startingMessage = document.getElementById('starting-chat-message');
    if (startingMessage != null) {
        startingMessage.style.display = 'none';
    }
    fetchChats();
});
