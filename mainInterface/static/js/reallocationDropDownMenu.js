let
// Кнопка "Настройки" в выпадающем меню из левого верхнего угла
    settingsButton = document.getElementById('settings-button-settings'),

// Кнопка "Чаты" в выпадающем меню из левого верхнего угла
    chatsReallocationButton = document.getElementById('settings-button-chats'),

// Кнопка "Контакты" в выпадающем меню из левого верхнего угла
    contactsReallocationButton = document.getElementById('settings-button-contacts');

settingsButton.addEventListener('click', function () {
    rightSideContainer.classList.remove('active');
    visualizeSettings();
    addChatButton.style.display = "none";
});

chatsReallocationButton.addEventListener('click', function () {
    rightSideContainer.classList.remove('active');
    // loadRegularRightSideAttributes();
    fetchChats().then(function () {
        console.log("chat fetching in chatsReallocationButton success")
    });
    addChatButton.style.display = "flex";
})

contactsReallocationButton.addEventListener('click', function () {

    fetchContacts().then(function () {
        console.log("contacts fetching in chatsReallocationButton success")
    });
    addChatButton.style.display = "flex";
})


function visualizeSettings() {
    chatList.innerHTML = "";
    const settingsBoxNew0 = document.createElement('div');
    settingsBoxNew0.id = "fast-responses-settings-button";
    settingsBoxNew0.classList.add('settings-box');
    settingsBoxNew0.innerHTML = `
                    <div class="settings-image">
                        <img src="../static/img/fastReplies.png" alt="">
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
                        <img src="../static/img/automaticResponses.png" alt="">
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

    const settingsBoxNew2 = document.createElement('div');
    settingsBoxNew2.classList.add('settings-box');
    settingsBoxNew2.id = "automatic-responses-settings-button"
    settingsBoxNew2.innerHTML = `
                    <div class="settings-image">
                        <img src="../static/img/sourcesConnection.png" alt="">
                    </div>
                    <div class = "settings-details">
                        <div class = "settings-title">
                            <h3>Источники</h3>
                        </div>
                    </div>
                    `;
    settingsBoxNew2.addEventListener('click', function () {
        chatBoxUserInfo.innerHTML = "";
        // visualizeSettingsSources();
        connectTelegramSource();
        bottomPanel.style.display = "none";
        rightSideContainer.classList.add('active');
    })
    chatList.appendChild(settingsBoxNew2);
}

function connectTelegramSource() {
    fetch('/telegram_source_connection', {method: "POST"})
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed while fetching telegram source bot in response");
            }
            // return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error fetching data", error);
        })
}

function visualizeSettingsSources() {
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
    name.innerText = "Источники"
    details.appendChild(name);
    contentHeader.appendChild(details);

    chatBoxUserInfo.appendChild(contentHeader);


    const rightSideContainer = document.getElementById("messages-container");
    rightSideContainer.innerHTML = "";

    // const tokenEnterField = document.createElement('input');
    // tokenEnterField.id = 'token-enter-field';
    // tokenEnterField.type = "text";
    // tokenEnterField.name = "token";
    // tokenEnterField.placeholder = "Введите токен подключения"

    // const sourceAdditionButton = document.createElement('button');
    // sourceAdditionButton.id = "source-addition-button";
    // sourceAdditionButton.className = "source-addition-button";
    // sourceAdditionButton.addEventListener('click', function () {
    //
    // });
}

// function visualizeSources() {
//
// }

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