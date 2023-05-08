contactsReallocationButton.addEventListener('click', function () {
    chatBoxUserInfo.innerHTML = "";
    fetchContacts().then(function () {
        console.log("contacts fetching in Contacts success")
    });
    addChatButton.style.display = "flex";
})

async function fetchContacts() {
    let response;
    let contacts;
    let success = false;
    let numberOfAttemptsToFail = 10;
    await new Promise(resolve => setTimeout(resolve, 500));
    while (!success) {
        if (numberOfAttemptsToFail === 0) {
            console.log("Failed while fetching contacts");
            throw new Error("Can't fetch contacts");
        }
        try {
            numberOfAttemptsToFail--;
            response = await fetch('/getUsers');

            contacts = await response.json();

            success = true;
        } catch (err) {
            console.error('Error fetching contacts. Retrying in 0.5 seconds...', err);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    chatList.innerHTML = '';
    // create chat box for each chat item

    contacts.forEach(contact => {
        const contactBox = document.createElement('div');
        contactBox.classList.add('left-side-object-from-list');
        let initials = '';
        let splitUserName = contact.username.split(' ');
        for (let i = 0; i < splitUserName.length; i++) {
            initials += splitUserName[i][0].toUpperCase();
        }
        if (contact.profile_image === null) {
            contactBox.innerHTML = `
                <div class="left-side-object-from-list-initials-circle">
                    <span class="initials">${initials}</span>
                </div>
                `;
        } else {
            contactBox.innerHTML = `
                <div class="left-side-object-from-list-img">
                    <img src="${contact.profile_image}" alt="">
                </div>
                `;
        }
        contactBox.innerHTML += `
                    <div class="left-side-object-from-list-details">
                        <div class="left-side-object-from-list-details-title-contacts">
                            <h3>${contact.username}</h3>
                        </div>
                        <div class="left-side-object-from-list-details-last-seen">
                            <p>${contact.last_seen}</p>
                        </div>
                    </div>
                `;
        contactBox.addEventListener('click', () => {
            console.log(contact.user_chats);
            console.log(contact.id);
            const data = {
                user_chats: contact.user_chats,
            };
            fetch('/get_personal_chat_for_contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            }).then(response => response.json()).then(response => {
                console.log(response);
                chatBoxUserInfo.innerHTML = '';
                bottomPanel.style.display = "inherit";
                loadNecessaryDataForChosenChat(response);
                rightSideContainer.classList.add('active');
                fetchFastResponses();
            })
        })
        chatList.appendChild(contactBox);

    })
}
