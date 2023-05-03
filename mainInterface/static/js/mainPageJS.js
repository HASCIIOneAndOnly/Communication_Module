let header = document.querySelector('.header'), inputSearch = document.querySelector('.search-box input'),
    faArrowLeft = document.querySelector('.fa-arrow-left'), files = document.querySelector('#files'),
    rightSideContainer = document.getElementById('right-side-container'), msg = document.querySelector('#Msg'),
    body = document.getElementById('body'), leftSide = document.getElementById('left-side'),
    chatList = document.getElementById('chat-list'), // Script for the add-button for adding new chats
    chatBoxUserInfo = document.getElementById('chatBoxUserInfo');


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

body.addEventListener('loadstart', function () {
    chatList.load();
})

async function fetchChats() {
    let response;
    let chatData;
    let success = false;
    let numberOfAttemptsToFail = 10;
    await new Promise(resolve => setTimeout(resolve, 500));
    while (!success) {
        if (numberOfAttemptsToFail === 0) {
            console.log("Failed while fetching chats");
            throw new Error("Can't fetch chats");
        }
        try {
            numberOfAttemptsToFail--;
            response = await fetch('/chats');
            chatData = await response.json();
            success = true;
        } catch (err) {
            console.error('Error fetching chats. Retrying in 0.5 seconds...', err);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
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
            bottomPanel.style.display = "inherit";
            loadNecessaryDataForChosenChat(chatItem);
            rightSideContainer.classList.add('active');
            fetchFastResponses();
        })
        chatList.appendChild(chatBoxNew);
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

// import pRetry, {AbortError} from 'p-retry';
// import fetch from 'node-fetch';

