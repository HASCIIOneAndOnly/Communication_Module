let header = document.querySelector('.header'),
    inputSearch = document.querySelector('.search-box input'),
    faArrowLeft = document.querySelector('.fa-arrow-left'),
    files = document.querySelector('#files'),
    rightSideContainer = document.getElementById('right-side-container'),
    leftSideObjectFromList = document.querySelector('#left-side-object-from-list'),
    body = document.getElementById('body'),
    leftSide = document.getElementById('left-side'),
    chatList = document.getElementById('left-side-object-list'), // Script for the add-button for adding new chats
    chatBoxUserInfo = document.getElementById('chatBoxUserInfo'),
    bottomPanel = document.getElementById('right-side-bottom-panel'),
    messagesBox = document.getElementById('messages-container');

faArrowLeft.addEventListener('click', () => {
    header.classList.remove('focus');
    files.classList.remove('active');
});

leftSideObjectFromList.addEventListener('click', () => {
    rightSideContainer.classList.add('active');
});

body.addEventListener('loadstart', function () {
    chatList.load();
})

async function fetchChats() {
    let response;
    let chatData;
    let success = false;
    let numberOfAttemptsToFail = 8;
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
            // loadRegularRightSideAttributes();
            loadNecessaryDataForChosenChat(chatItem);
            localStorage.setItem('current_chat_id', chatItem.chat_id);
            rightSideContainer.classList.add('active');
            fetchFastResponses();
        })
        chatList.appendChild(chatBoxNew);
    });
    return chatData;
}

function createCircleForLeftSideListObject(itemToCreate, item) {
    if (item.chat_image === null) {
        itemToCreate.innerHTML = `
                <div class="left-side-object-from-list-initials-circle" id="left-side-object-from-list-initials-circle">
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
    messagesBox.innerHTML = "";

    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const circleImageOrAbbreviationBlock = document.createElement('div');
    if (chatItem.chat_image === null) {
        circleImageOrAbbreviationBlock.className = 'left-side-object-from-list-initials-circle';
        circleImageOrAbbreviationBlock.id = "left-side-object-from-list-initials-circle";
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


    const lastSeen = document.createElement('span');
    lastSeen.innerText = 'last seen ' + chatItem.user_last_seen;
    details.appendChild(lastSeen);


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

    loadMessages(chatItem).then(messages => {
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (messages.length > 0) {
            messagesBox.innerHTML = "";
            messages.forEach(message => {
                    console.log(message);
                    const messageContainer = document.createElement('div');
                    messageContainer.classList.add('message-container');
                    const messageContent = document.createElement('div');
                    messageContent.classList.add('message-content');
                    messageContent.textContent = message.message;
                    const senderInfo = document.createElement('div');
                    messageContainer.appendChild(messageContent);
                    messageContainer.appendChild(senderInfo);
                    if (message.sender_id === chatItem.user_id) {
                        messageContainer.classList.add('sent-message');
                    } else {
                        messageContainer.classList.add('received-message');
                    }
                    messagesBox.appendChild(messageContainer);
                }
            )
        } else {
            const startingChatMessage = document.createElement('div');
            startingChatMessage.id = "starting-chat-message";
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            messageContent.textContent = chatItem.last_message;
            startingChatMessage.appendChild(messageContent);
            messagesBox.appendChild(startingChatMessage);
        }

    })
}

function loadMessages(chatItem) {
    return fetch('/get_last_100_messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: chatItem.chat_id, user_id: chatItem.user_id})
    }).then(response => response.json())
        .then(messages => {
            return messages;
        })
        .catch(error => console.error(error));
}

async function filterChats(query) {
    // Fetch all chats
    let chats = await fetchChats();
    // Filter chats based on query
    let filteredChats = chats.filter(chat => chat.chat_name.toLowerCase().includes(query.toLowerCase()));
    // Clear the chat list
    chatList.innerHTML = '';
    // Create chat box for each chat item
    filteredChats.forEach(chatItem => {
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
            // loadRegularRightSideAttributes();
            loadNecessaryDataForChosenChat(chatItem);
            localStorage.setItem('current_chat_id', chatItem.chat_id);
            rightSideContainer.classList.add('active');
            fetchFastResponses();
        })
        chatList.appendChild(chatBoxNew);
    });
}

// Add event listener to the search box
inputSearch.addEventListener('input', async () => {
    let searchQuery = inputSearch.value;
    if (searchQuery !== '') {
        await filterChats(searchQuery);
    } else {
        // If the search box is empty, display all chats
        await fetchChats();
    }
});

