const app = document.getElementById('app');

function goHome() {
    window.location.hash = '';
    renderPostList();
}

async function renderPostList() {
    app.innerHTML = '<div class="list1" style="text-align:center;">Memuat daftar...</div>';
    try {
        // Memanggil post.json (tanpa s)
        const response = await fetch('data/post.json');
        const posts = await response.json();
        let html = '';
        posts.forEach(post => {
            html += `
                <div class="list1">
                    <img src="${post.image}" style="vertical-align:middle; margin-right:5px; width:16px;">
                    <a href="#post/${post.id}" onclick="renderSinglePost('${post.id}')"><b>${post.title}</b></a>
                    <div style="font-size: 10px; color: #888; margin-top: 2px;">${post.date}</div>
                </div>
            `;
        });
        app.innerHTML = html;
    } catch (error) {
        app.innerHTML = '<div class="list1" style="color:red;">Gagal memuat artikel. Pastikan folder data/post.json sudah ada.</div>';
    }
}

async function renderSinglePost(id) {
    app.innerHTML = '<div class="list1" style="text-align:center;">Memuat isi...</div>';
    try {
        const response = await fetch(`data/${id}.json`);
        const post = await response.json();
        // Mengubah teks markdown menjadi HTML
        const contentHtml = marked.parse(post.content);
        
        app.innerHTML = `
            <div class="phdr">${post.title}</div>
            <div class="list1">
                <small>Oleh: ${post.author} | ${post.date}</small>
                <div style="margin-top:10px; line-height:1.5;">${contentHtml}</div>
                <div class="func">
                    <a href="javascript:void(0)" onclick="goHome()">« Kembali</a>
                </div>
            </div>
        `;
    } catch (error) {
        app.innerHTML = '<div class="list1" style="color:red;">Artikel tidak ditemukan.</div>';
    }
}

window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#post/')) {
        renderSinglePost(hash.replace('#post/', ''));
    } else {
        renderPostList();
    }
});
