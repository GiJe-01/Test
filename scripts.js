const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const posts = JSON.parse(event.data);
    displayPosts(posts);
};

// パスワード確認
function verifyPassword() {
    const password = document.getElementById('password').value;
    if (password === 'kakegawa.nishi') { // ここにパスワードを設定してください
        document.getElementById('password-prompt').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        generateUniqueID();
        displayThreads();
        // サーバーからの投稿を表示
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'init' }));
        };
    } else {
        alert('パスワードが違います');
    }
}

// ユニークID生成
function generateUniqueID() {
    const uniqueID = Math.random().toString(36).substring(2, 7);
    sessionStorage.setItem('uniqueID', uniqueID);
}

// スレッド作成
function createThread() {
    const threadName = prompt('スレッド名を入力してください');
    if (threadName) {
        const threadList = document.getElementById('thread-list');
        const li = document.createElement('li');
        li.textContent = threadName;
        li.onclick = function() { selectThread(threadName) };
        threadList.appendChild(li);
    }
}

// スレッド一覧表示
function displayThreads() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const threadList = document.getElementById('thread-list');
    const threads = [...new Set(posts.map(post => post.thread).filter(thread => thread !== null))];
    threads.forEach(thread => {
        if (![...threadList.children].some(li => li.textContent === thread)) {
            const li = document.createElement('li');
            li.textContent = thread;
            li.onclick = function() { selectThread(thread) };
            threadList.appendChild(li);
        }
    });
}

// スレッド選択
function selectThread(threadName) {
    document.getElementById('current-thread-title').textContent = threadName;
    displayPosts(JSON.parse(localStorage.getItem('posts')) || []);
}

// 新しい投稿
function postMessage(replyTo = null) {
    const postContent = document.getElementById('new-post').value;
    if (postContent) {
        const threadName = document.getElementById('current-thread-title').textContent;
        const uniqueID = sessionStorage.getItem('uniqueID');
        const post = {
            content: postContent,
            author: uniqueID,
            date: new Date().toLocaleString(),
            thread: threadName !== 'トップ' ? threadName : null,
            replyTo: replyTo
        };
        ws.send(JSON.stringify(post));
        document.getElementById('new-post').value = '';
    }
}

// 投稿表示
function displayPosts(posts) {
    const threadName = document.getElementById('current-thread-title').textContent;
    const filteredPosts = posts.filter(post => post.thread === threadName || (threadName === 'トップ' && !post.thread));
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    filteredPosts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <p>${post.content}</p>
            <small>投稿者: ${post.author}, 投稿日時: ${post.date}</small>
            <button onclick="replyToPost('${post.author}')">返信</button>
            <button onclick="deletePost('${post.date}')">削除</button>
        `;
        postsDiv.appendChild(postDiv);
    });
}

// 投稿返信
function replyToPost(author) {
    const replyContent = `>>>${author} `;
    document.getElementById('new-post').value = replyContent;
}

// 投稿削除
function deletePost(date) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPosts = posts.filter(post => post.date !== date);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    displayPosts(newPosts);
    checkThreadDeletion();
}

// スレッド削除チェック
function checkThreadDeletion() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const threadList = document.getElementById('thread-list');
    const threads = [...threadList.children].map(li => li.textContent);
    threads.forEach(thread => {
        if (thread !== 'トップ' && !posts.some(post => post.thread === thread)) {
            const threadItem = [...threadList.children].find(li => li.textContent === thread);
            threadList.removeChild(threadItem);
        }
    });
}

// 投稿期限設定
setInterval(() => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const now = new Date().getTime();
    const newPosts = posts.filter(post => {
        const postTime = new Date(post.date).getTime();
        return (now - postTime) < 48 * 60 * 60 * 1000; // 48時間以内の投稿
    });
    localStorage.setItem('posts', JSON.stringify(newPosts));
    displayPosts(newPosts);
    checkThreadDeletion();
    displayThreads();
}, 60 * 1000); // 1分ごとにチェック
