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
    messagesBox.innerHTML = "";
    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const image = document.createElement('div');
    image.className = 'image';
    const profileImg = document.createElement('img');
    profileImg.src = "../static/img/fastReplies.png";
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

    const fastCommandBlock = document.createElement('label');
    fastCommandBlock.id = "fast-command-block";
    const shortVersionTextArea = document.createElement('textarea');
    shortVersionTextArea.id = "short-version-text-area";
    shortVersionTextArea.placeholder = "Сокращение";
    shortVersionTextArea.maxLength = 32;

    fastCommandBlock.appendChild(shortVersionTextArea);
    const fullVersionTextArea = document.createElement('textarea');
    fullVersionTextArea.id = "full-version-text-area";
    fullVersionTextArea.placeholder = "Полная версия фразы";
    fullVersionTextArea.maxLength = 512;

    fastCommandBlock.appendChild(fullVersionTextArea);

    const fastCommandChangeButton = document.createElement('button');
    fastCommandChangeButton.id = "fast-command-change-button";
    fastCommandChangeButton.innerHTML = "Сохранить";

    fastCommandChangeButton.addEventListener('click', function () {
        let shortVersion = document.getElementById('short-version-text-area').value;
        let fullVersion = document.getElementById('full-version-text-area').value;

        console.log(fullVersion);

        let data = {
            short_version: shortVersion,
            full_version: fullVersion
        };
        console.log(JSON.stringify(data));
        fetch('/add_fast_command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(result => {
                console.log(result);
                getShortCommandsAndVisualizeThem();
                // Handle the response or perform any necessary actions
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error
            });
    });
    fastCommandBlock.appendChild(fastCommandChangeButton);

    messagesBox.appendChild(fastCommandBlock);

    getShortCommandsAndVisualizeThem();
}

function getShortCommandsAndVisualizeThem() {
    if (document.getElementById("fast-commands-list-container") === null) {
        const fast_commands_list_container = document.createElement('ul');
        fast_commands_list_container.id = "fast-commands-list-container";
        fetch('/get_short_versions')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.forEach(item => {
                    const fast_command = document.createElement('li');
                    const fast_command_short = document.createElement('p');
                    fast_command_short.innerHTML = item.short_version;
                    const fast_command_full = document.createElement('p');
                    fast_command_short.className = "short_fast_command";
                    fast_command_full.innerHTML = item.full_version;
                    fast_command_full.className = "full_fast_command";
                    const delete_button_fast_command = document.createElement('button');
                    delete_button_fast_command.id = "fast-command-delete";
                    delete_button_fast_command.innerHTML = "X";
                    fast_command.appendChild(fast_command_short);
                    fast_command.appendChild(fast_command_full);
                    fast_commands_list_container.appendChild(fast_command);
                })
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error
            });
        rightSideContainer.appendChild(fast_commands_list_container);
    } else {
        let fast_commands_list_container;
        console.log("Good");
        fast_commands_list_container = document.getElementById("fast-commands-list-container");
        fast_commands_list_container.innerHTML = "";
        fetch('/get_short_versions')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.forEach(item => {
                    const fast_command = document.createElement('li');
                    const fast_command_short = document.createElement('p');
                    fast_command_short.innerHTML = item.short_version;
                    const fast_command_full = document.createElement('p');
                    fast_command_short.className = "short_fast_command";
                    fast_command_full.innerHTML = item.full_version;
                    fast_command_full.className = "full_fast_command";
                    const delete_button_fast_command = document.createElement('button');
                    delete_button_fast_command.id = "fast-command-delete";
                    delete_button_fast_command.innerHTML = "X";
                    fast_command.appendChild(fast_command_short);
                    fast_command.appendChild(fast_command_full);
                    fast_commands_list_container.appendChild(fast_command);
                })
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error
            });
        rightSideContainer.appendChild(fast_commands_list_container);
    }
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