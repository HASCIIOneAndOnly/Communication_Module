let header = document.querySelector('.header'),
    inputSearch = document.querySelector('.search-box input'),
    faArrowLeft = document.querySelector('.fa-arrow-left'),
    files = document.querySelector('#files'),
    rightSideContainer = document.getElementById('right-side-container');
msg = document.querySelector('#Msg');
body = document.getElementById('body');

leftSide = document.getElementById('left-side');


inputSearch.addEventListener('focus', () => {
    header.classList.add('focus');
    files.classList.add('active');
});

faArrowLeft.addEventListener('click', () => {
    header.classList.remove('focus');
    files.classList.remove('active');
});

msg.addEventListener('click', () => {
    rightSideContainer.classList.add('active');
});

chatList = document.getElementById('chat-list');

body.addEventListener('loadstart', function () {
    chatList.load();
})

// Script for the add-button for adding new chats
chatBoxUserInfo = document.getElementById('chatBoxUserInfo');

document.addEventListener('DOMContentLoaded', function () {
    // fetch chat data from server
    fetchChats();
});

function fetchChats() {
    // fetch chat data from server
    fetch('/chats')
        .then(response => response.json())
        .then(chatData => {
            // clear existing chat list content
            chatList.innerHTML = '';
            // create chat box for each chat item
            chatData.forEach(chatItem => {
                const chatBoxNew = document.createElement('div');
                chatBoxNew.classList.add('chat-box');
                chatBoxNew.innerHTML = `
                    <div class="chat-img">
                        <img src="${chatItem.profile_image}" alt="">
                    </div>
                    <div class="chat-details">
                        <div class="chat-title">
                            <h3>${chatItem.name}</h3>
                            <span>${chatItem.time}</span>
                        </div>
                        <div class="chat-msg">
                            <p>${chatItem.messages[0]}</p>
                            <span>${chatItem.unreadCount}</span>
                        </div>
                    </div>
                `;
                chatBoxNew.addEventListener('click', () => {
                    chatBoxUserInfo.innerHTML = '';
                    loadNecessaryDataForChosenChat(chatItem);
                    bottomPanel.style.display = "flex";
                    rightSideContainer.classList.add('active');
                    fetchFastResponses();
                })
                chatList.appendChild(chatBoxNew);
            });
        });
}


function loadNecessaryDataForChosenChat(chatItem) {

    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const image = document.createElement('div');
    image.className = 'image';
    const profileImg = document.createElement('img');
    profileImg.src = chatItem.profile_image;
    profileImg.alt = '';
    image.appendChild(profileImg);
    contentHeader.appendChild(image);

    const details = document.createElement('div');
    details.className = 'details';
    const name = document.createElement('h3');
    name.innerText = chatItem.name;
    const lastSeen = document.createElement('span');
    lastSeen.innerText = 'last seen ' + chatItem.last_seen;
    details.appendChild(name);
    details.appendChild(lastSeen);
    contentHeader.appendChild(details);

    const icons = document.createElement('div');
    icons.className = 'icons';
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    const ellipsisIcon = document.createElement('i');
    ellipsisIcon.className = 'fas fa-ellipsis-v';
    icons.appendChild(searchIcon);
    icons.appendChild(ellipsisIcon);
    contentHeader.appendChild(icons);

    chatBoxUserInfo.appendChild(contentHeader);

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    for (let i = 0; i < chatItem.messages.length; i++) {
        const chatMsg = document.createElement('div');
        chatMsg.className = 'chat-msg';
        const message = document.createElement('p');
        message.innerText = chatItem.messages[i];
        const time = document.createElement('span');
        time.className = 'time';
        time.innerText = chatItem.time;
        chatMsg.appendChild(message);
        chatMsg.appendChild(time);
        chatContainer.appendChild(chatMsg);
    }

    chatBoxUserInfo.appendChild(chatContainer);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    chatBoxUserInfo.appendChild(messageBox);
}

popupBlock = document.getElementById('popup-fast-responses-block')

popupMenuFastResponsesButton = document.getElementById('fast-responses-button')

popupContainer = document.getElementById('popup-container')

messageInputBox = document.getElementById('message-input-box')

popupMenuFastResponsesButton.addEventListener('click', function () {
    activateVisualPartFastResponses();
})

function activateVisualPartFastResponses() {
    if (popupBlock.classList.contains('active')) {
        popupBlock.classList.remove('active');
    } else {
        popupBlock.classList.add('active');
    }
}

function fetchFastResponses() {
    fetch('/fastResponses')
        .then(response => response.json())
        .then(fastResponses => {
            // clear existing chat list content
            popupContainer.innerText = '';
            // create chat box for each chat item
            fastResponses.forEach(response => {
                const responseBox = document.createElement('li');
                responseBox.classList.add('response')
                responseBox.innerHTML = `
                    <p class="short-version" id="short-version">${response.short_version}</p>
                    <p class="full-version" id="full-version"> ${response.full_version}</p>
                `;
                responseBox.addEventListener('click', () => {
                    messageInputBox.value = responseBox.querySelector('.full-version').textContent;
                    popupBlock.classList.remove('active');
                })
                popupContainer.appendChild(responseBox);
            });
        });
}

clearMessageInputBoxButton = document.getElementById('clear-message-box-button');

clearMessageInputBoxButton.addEventListener('click', function () {
    clearMessageInputBox();
})

function clearMessageInputBox() {
    messageInputBox.value = "";

}


toggleReallocationButton = document.getElementById('toggle-reallocation-button');

dropDownReallocationBlock = document.getElementById('drop-down-reallocation-block');

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

settingsButton = document.getElementById('settings-button-settings');

settingsButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    visualizeSettings();
    addChatBtn.style.display = "none";
});


addChatBtn = document.getElementById('add-chat-box-btn');

function visualizeSettingsFastResponses() {
    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const image = document.createElement('div');
    image.className = 'image';
    const profileImg = document.createElement('img');
    profileImg.src = "../static/img/profile-3.png";
    profileImg.alt = '';
    image.appendChild(profileImg);
    contentHeader.appendChild(image);

    const details = document.createElement('div');
    details.className = 'details';
    const name = document.createElement('h3');
    name.innerText = "Быстрые команды"
    details.appendChild(name);
    contentHeader.appendChild(details);

    chatBoxUserInfo.appendChild(contentHeader);
}

bottomPanel = document.getElementById('right-side-bottom-panel');

function visualizeSettings() {
    chatList.innerHTML = "";
    const settingsBoxNew0 = document.createElement('div');
    settingsBoxNew0.id = "fast-responses-settings-button";
    settingsBoxNew0.classList.add('settings-box');
    settingsBoxNew0.innerHTML = `
                    <div class="settings-image">
                        <img src="../static/img/profile-3.png" alt="">
                    </div>
                    <div class = "settings-details">
                        <div class = "settings-title">
                            <h3>Настройка быстрых команд</h3>
                        </div>
                    </div>
                    `;
    settingsBoxNew0.addEventListener('click', function () {
        chatBoxUserInfo.innerHTML = "";
        visualizeSettingsFastResponses();
        bottomPanel.style.display = "none";
        rightSideContainer.classList.add('active');
    })
    chatList.appendChild(settingsBoxNew0);

    const settingsBoxNew1 = document.createElement('div');
    settingsBoxNew1.classList.add('settings-box');
    settingsBoxNew1.id = "automatic-responses-settings-button"
    settingsBoxNew1.innerHTML = `
                    <div class="settings-image">
                        <img src="../static/img/profile-3.png" alt="">
                    </div>
                    <div class = "settings-details">
                        <div class = "settings-title">
                            <h3>Настройка автоматических ответов</h3>
                        </div>
                    </div>
                    `;
    settingsBoxNew1.addEventListener('click', function () {
        chatBoxUserInfo.innerHTML = "";
        visualizeSettingsAutoResponse();
        bottomPanel.style.display = "none";
        rightSideContainer.classList.add('active');
    })
    chatList.appendChild(settingsBoxNew1);
}

function visualizeSettingsAutoResponse() {
    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const image = document.createElement('div');
    image.className = 'image';
    const profileImg = document.createElement('img');
    profileImg.src = "../static/img/profile-2.png";
    profileImg.alt = '';
    image.appendChild(profileImg);
    contentHeader.appendChild(image);

    const details = document.createElement('div');
    details.className = 'details';
    const name = document.createElement('h3');
    name.innerText = "Автоматические ответы"
    details.appendChild(name);
    contentHeader.appendChild(details);

    chatBoxUserInfo.appendChild(contentHeader);
}

chatsReallocationButton = document.getElementById('settings-button-chats')

chatsReallocationButton.addEventListener('click', function () {
    fetchChats();
    addChatBtn.style.display = "flex";
})
