const app = document.getElementById('app');

function goHome() {
    window.location.hash = '';
    renderPostList();
}

async function renderPostList() {
    app.innerHTML = '<div class="list1" style="text-align:center;">Memuat daftar postingan...</div>';
    try {
        // Mengambil file data/post.json (sesuai nama file Anda)
        const response = await fetch('data/post.json');
        if (!response.ok) throw new Error('File data/post.json tidak ditemukan.');
        
        const posts = await response.json();
        let html = '';
        posts.forEach(post => {
            html += `
                <div class="list1">
                    <img src="${post.image}" style="float:left; margin-right:10px; width:16px;">
                    <a href="#post/${post.id}" onclick="renderSinglePost('${post.id}')"><b>${post.title}</b></a>
                    <br><small>${post.date}</small>
                    <p>${post.excerpt}</p>
                </div>
            `;
        });
        app.innerHTML = html;
    } catch (error) {
        app.innerHTML = `<div class="list1" style="color:red;">Error: ${error.message}</div>`;
    }
}

async function renderSinglePost(id) {
    app.innerHTML = '<div class="list1" style="text-align:center;">Memuat isi artikel...</div>';
    try {
        const response = await fetch(`data/${id}.json`);
        if (!response.ok) throw new Error('Artikel tidak ditemukan.');
        
        const post = await response.json();
        // Menggunakan marked untuk merubah teks jadi artikel
        const contentHtml = marked.parse(post.content);
        
        app.innerHTML = `
            <div class="phdr"><b>${post.title}</b></div>
            <div class="list1">
                <small>Oleh: ${post.author} | ${post.date}</small>
                <hr noshade size="1">
                <div class="content">${contentHtml}</div>
                <hr noshade size="1">
                <a href="javascript:void(0)" onclick="renderPostList()">« Kembali ke Daftar</a>
            </div>
        `;
    } catch (error) {
        app.innerHTML = `<div class="list1" style="color:red;">Error: ${error.message}</div>`;
    }
}

// Jalankan fungsi saat halaman dibuka
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#post/')) {
        const id = hash.replace('#post/', '');
        renderSinglePost(id);
    } else {
        renderPostList();
    }
});
