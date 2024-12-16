document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var password = document.getElementById('password').value;
    // パスワード検証ロジック
    if (password === 'your_password') {
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.board-container').style.display = 'block';
    } else {
        alert('パスワードが間違っています');
    }
});

let threads = [
    { id: 1, name: 'トップスレッド' },
    // 他のスレッドデータ
];
let posts = [
    { id: 1, author: 'ユーザーA', content: 'これは最初の投稿です', date: '2024-12-16', threadId: 1 },
    // 他の投稿データ
];

function displayThreads() {
    const threadContainer = document.getElementById('threads');
    threadContainer.innerHTML = '';
    threads.forEach(thread => {
        const div = document.createElement('div');
        div.textContent = thread.name;
        div.onclick = function() {
            displayPosts(thread.id);
        };
        threadContainer.appendChild(div);
    });
}

function displayPosts(threadId) {
    const postContainer = document.getElementById('posts');
    postContainer.innerHTML = '';
    const threadPosts = posts.filter(post => post.threadId === threadId);
    threadPosts.forEach(post => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${post.author}</h3><p>${post.content}</p><span>${post.date}</span>`;
        postContainer.appendChild(div);
    });
}

document.getElementById('create-thread').addEventListener('click', function() {
    const newThreadName = document.getElementById('new-thread').value;
    if (newThreadName) {
        const newThread = { id: threads.length + 1, name: newThreadName };
        threads.push(newThread);
        displayThreads();
        document.getElementById('new-thread').value = '';
    } else {
        alert('スレッド名を入力してください');
    }
});

displayThreads();
