messageInputBox = document.getElementById('message-input-box')

clearMessageInputBoxButton = document.getElementById('clear-message-box-button');


clearMessageInputBoxButton.addEventListener('click', function () {
    clearMessageInputBox();
})

function clearMessageInputBox() {
    messageInputBox.value = "";

}