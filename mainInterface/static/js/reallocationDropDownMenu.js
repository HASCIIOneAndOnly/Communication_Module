let
// Кнопка "Настройки" в выпадающем меню из левого верхнего угла
    settingsButton = document.getElementById('settings-button-settings'),

// Кнопка "Чаты" в выпадающем меню из левого верхнего угла
    chatsReallocationButton = document.getElementById('settings-button-chats'),

// Кнопка "Контакты" в выпадающем меню из левого верхнего угла
    contactsReallocationButton = document.getElementById('settings-button-contacts');

settingsButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    visualizeSettings();
    addChatButton.style.display = "none";
});

chatsReallocationButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    fetchChats().then(function () {
        console.log("chat fetching in chatsReallocationButton success")
    });
    addChatButton.style.display = "flex";
})

contactsReallocationButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    fetchContacts().then(function () {
        console.log("contacts fetching in chatsReallocationButton success")
    });
    addChatButton.style.display = "flex";
})