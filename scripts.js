document.addEventListener('DOMContentLoaded', () => {
    const userId = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('user-id').innerText = `ID: ${userId}`;
    
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('change', () => {
        const password = passwordInput.value;
        // パスワード検証ロジックを追加
    });
    
    const createGroupButton = document.getElementById('create-group');
    createGroupButton.addEventListener('click', () => {
        const userToAdd = prompt('追加するユーザーIDを入力してください:');
        if (userToAdd) {
            const groupList = document.getElementById('group-list');
            const newGroup = document.createElement('li');
            newGroup.innerText = `Group with ${userToAdd}`;
            groupList.appendChild(newGroup);
        }
    });
    
    const sendMessageButton = document.getElementById('send-message');
    sendMessageButton.addEventListener('click', () => {
        const messageInput = document.getElementById('chat-input');
        const message = messageInput.value;
        if (message) {
            const currentTime = new Date().toLocaleTimeString();
            const chatMessages = document.getElementById('chat-messages');
            const newMessage = document.createElement('li');
            newMessage.innerHTML = `<strong>${userId}</strong> (${currentTime}): ${message}`;
            chatMessages.appendChild(newMessage);
            messageInput.value = '';
        }
    });
});
