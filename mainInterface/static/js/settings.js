let bottomPanel = document.getElementById('right-side-bottom-panel');

// function visualizeSettings() {
//     chatList.innerHTML = "";
//     const settingsBoxNew0 = document.createElement('div');
//     settingsBoxNew0.id = "fast-responses-settings-button";
//     settingsBoxNew0.classList.add('settings-box');
//     settingsBoxNew0.innerHTML = `
//                     <div class="settings-image">
//                         <img src="../static/img/profile-3.png" alt="">
//                     </div>
//                     <div class = "settings-details">
//                         <div class = "settings-title">
//                             <h3>Настройка быстрых команд</h3>
//                         </div>
//                     </div>
//                     `;
//     settingsBoxNew0.addEventListener('click', function () {
//         chatBoxUserInfo.innerHTML = "";
//         visualizeSettingsFastResponses();
//         bottomPanel.style.display = "none";
//         rightSideContainer.classList.add('active');
//     })
//     chatList.appendChild(settingsBoxNew0);
//
//     const settingsBoxNew1 = document.createElement('div');
//     settingsBoxNew1.classList.add('settings-box');
//     settingsBoxNew1.id = "automatic-responses-settings-button"
//     settingsBoxNew1.innerHTML = `
//                     <div class="settings-image">
//                         <img src="../static/img/profile-3.png" alt="">
//                     </div>
//                     <div class = "settings-details">
//                         <div class = "settings-title">
//                             <h3>Настройка автоматических ответов</h3>
//                         </div>
//                     </div>
//                     `;
//     settingsBoxNew1.addEventListener('click', function () {
//         chatBoxUserInfo.innerHTML = "";
//         visualizeSettingsAutoResponse();
//         bottomPanel.style.display = "none";
//         rightSideContainer.classList.add('active');
//     })
//     chatList.appendChild(settingsBoxNew1);
// }

// function visualizeSettingsFastResponses() {
//     const contentHeader = document.createElement('div');
//     contentHeader.className = 'content-header';
//
//     const image = document.createElement('div');
//     image.className = 'image';
//     const profileImg = document.createElement('img');
//     profileImg.src = "../static/img/profile-3.png";
//     profileImg.alt = '';
//     image.appendChild(profileImg);
//     contentHeader.appendChild(image);
//
//     const details = document.createElement('div');
//     details.className = 'details';
//     const name = document.createElement('h3');
//     name.innerText = "Быстрые команды"
//     details.appendChild(name);
//     contentHeader.appendChild(details);
//
//     chatBoxUserInfo.appendChild(contentHeader);
// }
//
// function visualizeSettingsAutoResponse() {
//     const contentHeader = document.createElement('div');
//     contentHeader.className = 'content-header';
//
//     const image = document.createElement('div');
//     image.className = 'image';
//     const profileImg = document.createElement('img');
//     profileImg.src = "../static/img/profile-2.png";
//     profileImg.alt = '';
//     image.appendChild(profileImg);
//     contentHeader.appendChild(image);
//
//     const details = document.createElement('div');
//     details.className = 'details';
//     const name = document.createElement('h3');
//     name.innerText = "Автоматические ответы"
//     details.appendChild(name);
//     contentHeader.appendChild(details);
//
//     chatBoxUserInfo.appendChild(contentHeader);
// }