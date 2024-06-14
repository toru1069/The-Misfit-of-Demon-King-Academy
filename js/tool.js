// ローカルストレージから魔法のリストをロード
function loadTools() {
    const toolList = JSON.parse(localStorage.getItem('toolList')) || [];
    toolList.forEach(tool => {
        addToolToDOM(tool.title, tool.description);
    });
}

// 魔法をローカルストレージに保存
function saveTools() {
    const tools = [];
    document.querySelectorAll('.tool').forEach(tool => {
        tools.push({
            title: tool.querySelector('h2').innerText,
            description: tool.querySelector('p').innerHTML.replace(/<br\s*\/?>/gm, '\n')
        });
    });
    localStorage.setItem('toolList', JSON.stringify(tools));
}

// 魔法をDOMに追加
function addToolToDOM(title, description) {
    const newToolDiv = document.createElement('div');
    newToolDiv.classList.add('tool');

    newToolDiv.innerHTML = `
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

    document.getElementById('toolList').appendChild(newToolDiv);

    // 編集フォームのイベントリスナーを再度追加
    newToolDiv.querySelector('.edit-button').addEventListener('click', function() {
        const form = this.closest('.tool').querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    newToolDiv.querySelector('.save-button').addEventListener('click', function() {
        const form = this.closest('.edit-form');
        const titleInput = form.querySelector('input[type="text"]');
        const contentTextarea = form.querySelector('textarea');
        const toolDiv = form.closest('.tool');

        toolDiv.querySelector('h2').innerText = titleInput.value;
        toolDiv.querySelector('p').innerHTML = contentTextarea.value.replace(/\n/g, '<br>');
        form.style.display = 'none';
        saveTools();
    });

    // 削除ボタンのイベントリスナーを追加
    newToolDiv.querySelector('.delete-button').addEventListener('click', function() {
        newToolDiv.remove();
        saveTools();
    });
}

// 新しい魔法の追加
document.getElementById('addToolButton').addEventListener('click', function() {
    const title = document.getElementById('newToolTitle').value;
    const description = document.getElementById('newToolDescription').value;

    if (title && description) {
        addToolToDOM(title, description);
        saveTools();

        // フォームのクリア
        document.getElementById('newToolTitle').value = '';
        document.getElementById('newToolDescription').value = '';
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.tool').forEach(tool => {
        const title = tool.querySelector('h2').innerText.toLowerCase();
        const description = tool.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            tool.style.display = 'block';
        } else {
            tool.style.display = 'none';
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
loadTools();
