// ローカルストレージから魔法のリストをロード
function loadMagics() {
    const magicList = JSON.parse(localStorage.getItem('magicList')) || [];
    magicList.forEach(magic => {
        addMagicToDOM(magic.title, magic.description);
    });
}

// 魔法をローカルストレージに保存
function saveMagics() {
    const magics = [];
    document.querySelectorAll('.magic').forEach(magic => {
        magics.push({
            title: magic.querySelector('h2').innerText,
            description: magic.querySelector('p').innerHTML.replace(/<br\s*\/?>/gm, '\n')
        });
    });
    localStorage.setItem('magicList', JSON.stringify(magics));
}

// 魔法をDOMに追加
function addMagicToDOM(title, description) {
    const newMagicDiv = document.createElement('div');
    newMagicDiv.classList.add('magic');

    newMagicDiv.innerHTML = `
        <h2>${title}</h2>
        <p>${description.replace(/\n/g, '<br>')}</p>
        <div class="button-container">
            <button class="edit-button">編集</button>
            <button class="delete-button">削除</button>
        </div>
        <div class="edit-form" style="display: none;">
            <input type="text" value="${title}">
            <textarea>${description}</textarea>
            <button class="save-button">保存</button>
        </div>
    `;

    document.getElementById('magicList').appendChild(newMagicDiv);

    // 編集フォームのイベントリスナーを再度追加
    newMagicDiv.querySelector('.edit-button').addEventListener('click', function() {
        const form = this.closest('.magic').querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    newMagicDiv.querySelector('.save-button').addEventListener('click', function() {
        const form = this.closest('.edit-form');
        const titleInput = form.querySelector('input[type="text"]');
        const contentTextarea = form.querySelector('textarea');
        const magicDiv = form.closest('.magic');

        magicDiv.querySelector('h2').innerText = titleInput.value;
        magicDiv.querySelector('p').innerHTML = contentTextarea.value.replace(/\n/g, '<br>');
        form.style.display = 'none';
        saveMagics();
    });

    // 削除ボタンのイベントリスナーを追加
    newMagicDiv.querySelector('.delete-button').addEventListener('click', function() {
        newMagicDiv.remove();
        saveMagics();
    });
}

// 新しい魔法の追加
document.getElementById('addMagicButton').addEventListener('click', function() {
    const title = document.getElementById('newMagicTitle').value;
    const description = document.getElementById('newMagicDescription').value;

    if (title && description) {
        addMagicToDOM(title, description);
        saveMagics();

        // フォームのクリア
        document.getElementById('newMagicTitle').value = '';
        document.getElementById('newMagicDescription').value = '';
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.magic').forEach(magic => {
        const title = magic.querySelector('h2').innerText.toLowerCase();
        const description = magic.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            magic.style.display = 'block';
        } else {
            magic.style.display = 'none';
        }
    });
});

// JavaScriptのダークモードの切り替えコードを確認します。
const toggleButton = document.querySelector('.dark-mode-toggle');

if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        toggleButton.textContent = newTheme === 'dark' ? 'ライトモード' : 'ダークモード';
        localStorage.setItem('theme', newTheme);
    });

    // ユーザーの選択を保存
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggleButton.textContent = savedTheme === 'dark' ? 'ライトモード' : 'ダークモード';

    // システムのカラースキームの変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
            toggleButton.textContent = event.matches ? 'ライトモード' : 'ダークモード';
        }
    });
}


// 初期ロード
loadMagics();
