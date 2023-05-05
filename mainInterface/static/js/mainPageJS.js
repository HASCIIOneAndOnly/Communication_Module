let header = document.querySelector('.header'), inputSearch = document.querySelector('.search-box input'),
    faArrowLeft = document.querySelector('.fa-arrow-left'), files = document.querySelector('#files'),
    rightSideContainer = document.getElementById('right-side-container'),
    msg = document.querySelector('#left-side-object-from-list'),
    body = document.getElementById('body'), leftSide = document.getElementById('left-side'),
    chatList = document.getElementById('left-side-object-list'), // Script for the add-button for adding new chats
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
    let numberOfAttemptsToFail = 5;
    await new Promise(resolve => setTimeout(resolve, 1000));
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
        chatBoxNew.classList.add('left-side-object-from-list');

        createCircleForLeftSideListObject(chatBoxNew, chatItem);

        chatBoxNew.innerHTML += `
                    <div class="left-side-object-from-list-details">
                        <div class="left-side-object-from-list-details-title">
                            <h3>${chatItem.chat_name}</h3>
                        </div>
                        <div class="left-side-object-from-list-details-subtitle">
                            <p>${chatItem.last_message}</p>
                            <span>${chatItem.unread_messages_counter}</span>
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

function createCircleForLeftSideListObject(itemToCreate, item) {
    if (item.chat_image === null) {
        itemToCreate.innerHTML = `
                <div class="left-side-object-from-list-initials-circle">
                    <span class="initials">${createAbbreviation(item)}</span>
                </div>
                `;
    } else {
        // Assuming `largeBinaryData` is a variable containing your binary data
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(item.chat_image)));

// Build the HTML image tag
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${base64Data}`;
        img.alt = 'LargeBinary Image';

// Append the image to an HTML element
        itemToCreate.appendChild(img);
    }
}

function createAbbreviation(item) {
    let chat_name_abbr = '';
    let splitUserName = item.chat_name.split(' ');
    for (let i = 0; i < splitUserName.length; i++) {
        chat_name_abbr += splitUserName[i][0].toUpperCase();
    }
    return chat_name_abbr;
}

function loadNecessaryDataForChosenChat(chatItem) {

    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const circleImageOrAbbreviationBlock = document.createElement('div');
    if (chatItem.chat_image === null) {
        circleImageOrAbbreviationBlock.className = 'left-side-object-from-list-img';
        const circleImageOrAbbreviation = document.createElement('span');
        circleImageOrAbbreviation.className = 'initials';
        circleImageOrAbbreviation.innerHTML = `${createAbbreviation(chatItem)}`
        circleImageOrAbbreviationBlock.appendChild(circleImageOrAbbreviation);
    } else {
        circleImageOrAbbreviationBlock.className = 'left-side-object-from-list-img';
        const circleImageOrAbbreviation = document.createElement('img');
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(chatItem.chat_image)));
        circleImageOrAbbreviation.src = `data:image/png;base64,${base64Data}`;
        circleImageOrAbbreviation.alt = 'LargeBinary Image';
        circleImageOrAbbreviationBlock.appendChild(circleImageOrAbbreviation);
    }
    contentHeader.appendChild(circleImageOrAbbreviationBlock);

    const details = document.createElement('div');
    details.className = 'details';
    const name = document.createElement('h3');
    name.innerText = chatItem.chat_name;
    // const lastSeen = document.createElement('span');
    // lastSeen.innerText = 'last seen ' + chatItem.last_seen;
    // details.appendChild(lastSeen);
    details.appendChild(name);
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

    // for (let i = 0; i < chatItem.chat.messages.count(); i++) {
    //     const chatMsg = document.createElement('div');
    //     chatMsg.className = 'left-side-object-from-list-details-subtitle';
    //     const message = document.createElement('p');
    //     message.innerText = chatItem.chat.messages[i];
    //     // const time = document.createElement('span');
    //     // time.className = 'time';
    //     // time.innerText = chatItem.time;
    //     // chatMsg.appendChild(time);
    //     chatMsg.appendChild(message);
    //     chatContainer.appendChild(chatMsg);
    // }

    chatBoxUserInfo.appendChild(chatContainer);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    chatBoxUserInfo.appendChild(messageBox);
}

