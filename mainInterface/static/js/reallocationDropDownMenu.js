// Значок-кнопка в левом верхнем углу, слева от поиска, отвечающая за выпадение меню
toggleReallocationButton = document.getElementById('toggle-reallocation-button');

// Выпадающее при нажатии на значок в левом верхнем углу, слева от поиска, меню
dropDownReallocationBlock = document.getElementById('drop-down-reallocation-block');

// Кнопка "Настройки" в выпадающем меню из левого верхнего угла
settingsButton = document.getElementById('settings-button-settings');

// Кнопка "Чаты" в выпадающем меню из левого верхнего угла
chatsReallocationButton = document.getElementById('settings-button-chats')

toggleReallocationButton.addEventListener('click', function () {
    activateVisualPartReallocation();
})

function activateVisualPartReallocation() {
    if (dropDownReallocationBlock.classList.contains('active')) {
        dropDownReallocationBlock.classList.remove('active');
    } else {
        dropDownReallocationBlock.classList.add('active');
    }
}

settingsButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    visualizeSettings();
    addChatBtn.style.display = "none";
});

chatsReallocationButton.addEventListener('click', function () {
    fetchChats();
    addChatBtn.style.display = "flex";
})