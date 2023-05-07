let sendMessageButton = document.getElementById('send-message-button'),
    messageInputArea = document.getElementById('message-input-box');

sendMessageButton.addEventListener('click', function () {
    console.log("click");
    if (messageInputArea.value === "") {
        console.log("bad click");
    } else {
        // Define the data to send in the request
        const data = {
            chat_id: localStorage.getItem('current_chat_id'),
            message: messageInputArea.value,
        };
        console.log(data.chat_id)
        console.log(data.message)

        // Make a POST request to the API endpoint
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    messageInputArea.value = "";
})