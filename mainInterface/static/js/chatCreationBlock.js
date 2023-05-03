let addChatButton = document.getElementById('add-chat-btn'),
    popUpMenuChatCreation = document.getElementById('popup-chat-creation-block');


addChatButton.addEventListener('click', function () {
    activateVisualPartChatCreation();

})

function activateVisualPartChatCreation() {
    if (popUpMenuChatCreation.classList.contains('active')) {
        popUpMenuChatCreation.classList.remove('active');
    } else {
        popUpMenuChatCreation.classList.add('active');
    }
}