document.addEventListener('DOMContentLoaded', function () {
    // fetch chat data from server
    fetchChats().then(function () {
        console.log("chats fetching on load success")
    });
});