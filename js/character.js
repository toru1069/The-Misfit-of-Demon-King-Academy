// ローカルストレージから魔法のリストをロード
function loadCharacters() {
    const characterList = JSON.parse(localStorage.getItem('characterList')) || [];
    characterList.forEach(character => {
        addCharacterToDOM(character.title, character.description);
    });
}

// 魔法をローカルストレージに保存
function saveCharacters() {
    const characters = [];
    document.querySelectorAll('.character').forEach(character => {
        characters.push({
            title: character.querySelector('h2').innerText,
            description: character.querySelector('p').innerHTML.replace(/<br\s*\/?>/gm, '\n')
        });
    });
    localStorage.setItem('characterList', JSON.stringify(characters));
}

// 魔法をDOMに追加
function addCharacterToDOM(title, description) {
    const newCharacterDiv = document.createElement('div');
    newCharacterDiv.classList.add('character');

    newCharacterDiv.innerHTML = `
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

    document.getElementById('characterList').appendChild(newCharacterDiv);

    // 編集フォームのイベントリスナーを再度追加
    newCharacterDiv.querySelector('.edit-button').addEventListener('click', function() {
        const form = this.closest('.character').querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    newCharacterDiv.querySelector('.save-button').addEventListener('click', function() {
        const form = this.closest('.edit-form');
        const titleInput = form.querySelector('input[type="text"]');
        const contentTextarea = form.querySelector('textarea');
        const characterDiv = form.closest('.character');

        characterDiv.querySelector('h2').innerText = titleInput.value;
        characterDiv.querySelector('p').innerHTML = contentTextarea.value.replace(/\n/g, '<br>');
        form.style.display = 'none';
        saveCharacters();
    });

    // 削除ボタンのイベントリスナーを追加
    newCharacterDiv.querySelector('.delete-button').addEventListener('click', function() {
        newCharacterDiv.remove();
        saveCharacters();
    });
}

// 新しい魔法の追加
document.getElementById('addCharacterButton').addEventListener('click', function() {
    const title = document.getElementById('newCharacterTitle').value;
    const description = document.getElementById('newCharacterDescription').value;

    if (title && description) {
        addCharacterToDOM(title, description);
        saveCharacters();

        // フォームのクリア
        document.getElementById('newCharacterTitle').value = '';
        document.getElementById('newCharacterDescription').value = '';
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.character').forEach(character => {
        const title = character.querySelector('h2').innerText.toLowerCase();
        const description = character.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            character.style.display = 'block';
        } else {
            character.style.display = 'none';
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
loadCharacters();
