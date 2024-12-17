function postMessage() {
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    if (name && message) {
        const messageBoard = document.getElementById('messageBoard');

        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.innerHTML = `<strong>${name}</strong>: ${message}`;

        messageBoard.appendChild(newMessage);

        // Clear the input fields
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('名前とメッセージを入力してください。');
    }
}
