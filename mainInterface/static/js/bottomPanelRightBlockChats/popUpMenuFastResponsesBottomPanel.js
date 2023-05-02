popupBlock = document.getElementById('popup-fast-responses-block')

popupMenuFastResponsesButton = document.getElementById('fast-responses-button')

popupContainer = document.getElementById('popup-container')


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

async function fetchFastResponses() {
    let response;
    let success = false;

    let fastResponses;
    while (!success) {
        try {
            response = await fetch('/fastResponses');
            fastResponses = await response.json();
            success = true;
        } catch (err) {
            console.error('Error fetching chats. Retrying in 0.5 seconds...', err);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

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
}