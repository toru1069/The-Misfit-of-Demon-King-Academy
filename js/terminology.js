// ローカルストレージから魔法のリストをロード
function loadTerminologys() {
    const terminologyList = JSON.parse(localStorage.getItem('terminologyList')) || [];
    terminologyList.forEach(terminology => {
        addTerminologyToDOM(terminology.title, terminology.description);
    });
}

// 魔法をローカルストレージに保存
function saveTerminologys() {
    const terminologys = [];
    document.querySelectorAll('.terminology').forEach(terminology => {
        terminologys.push({
            title: terminology.querySelector('h2').innerText,
            description: terminology.querySelector('p').innerHTML.replace(/<br\s*\/?>/gm, '\n')
        });
    });
    localStorage.setItem('terminologyList', JSON.stringify(terminologys));
}

// 魔法をDOMに追加
function addTerminologyToDOM(title, description) {
    const newTerminologyDiv = document.createElement('div');
    newTerminologyDiv.classList.add('terminology');

    newTerminologyDiv.innerHTML = `
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

    document.getElementById('terminologyList').appendChild(newTerminologyDiv);

    // 編集フォームのイベントリスナーを再度追加
    newTerminologyDiv.querySelector('.edit-button').addEventListener('click', function() {
        const form = this.closest('.terminology').querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    newTerminologyDiv.querySelector('.save-button').addEventListener('click', function() {
        const form = this.closest('.edit-form');
        const titleInput = form.querySelector('input[type="text"]');
        const contentTextarea = form.querySelector('textarea');
        const terminologyDiv = form.closest('.terminology');

        terminologyDiv.querySelector('h2').innerText = titleInput.value;
        terminologyDiv.querySelector('p').innerHTML = contentTextarea.value.replace(/\n/g, '<br>');
        form.style.display = 'none';
        saveTerminologys();
    });

    // 削除ボタンのイベントリスナーを追加
    newTerminologyDiv.querySelector('.delete-button').addEventListener('click', function() {
        newTerminologyDiv.remove();
        saveTerminologys();
    });
}

// 新しい魔法の追加
document.getElementById('addTerminologyButton').addEventListener('click', function() {
    const title = document.getElementById('newTerminologyTitle').value;
    const description = document.getElementById('newTerminologyDescription').value;

    if (title && description) {
        addTerminologyToDOM(title, description);
        saveTerminologys();

        // フォームのクリア
        document.getElementById('newTerminologyTitle').value = '';
        document.getElementById('newTerminologyDescription').value = '';
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.terminology').forEach(terminology => {
        const title = terminology.querySelector('h2').innerText.toLowerCase();
        const description = terminology.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            terminology.style.display = 'block';
        } else {
            terminology.style.display = 'none';
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
loadTerminologys();
