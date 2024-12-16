const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const posts = JSON.parse(event.data);
    displayPosts(posts);
};

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
