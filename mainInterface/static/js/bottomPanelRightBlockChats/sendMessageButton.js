// Создаем подключение сокета
const socket = io.connect(window.location.protocol + '//' + document.domain + ':' + location.port);

let sendMessageButton = document.getElementById('send-message-button'),
    messageInputArea = document.getElementById('message-input-box'),
    messagesContainer = document.getElementById('messages-container');

sendMessageButton.addEventListener('click', function () {
    if (messageInputArea.value === "") {
    } else {
        // Define the data to send in the request
        const data = {
            chat_id: localStorage.getItem('current_chat_id'),
            message: messageInputArea.value,
        };
        // console.log(data.chat_id)
        // console.log(data.message)

        // Emit the send_message event using the socket connection
        socket.emit('send_message', data);
    }
    messageInputArea.value = "";
});

// Add a listener for the new_message event to add the message to the messagesContainer
socket.on('new_message', function (data) {
    // Create a new HTML element for the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('message'); // Optional: add a CSS class for styling
    messageElement.textContent = data.message; // Set the content of the element to the message text

    // Append the new message element to the messages container
    messagesContainer.appendChild(messageElement);
});