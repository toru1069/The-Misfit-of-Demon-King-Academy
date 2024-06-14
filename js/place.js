// ローカルストレージから魔法のリストをロード
function loadPlaces() {
    const placeList = JSON.parse(localStorage.getItem('placeList')) || [];
    placeList.forEach(place => {
        addPlaceToDOM(place.title, place.description);
    });
}

// 魔法をローカルストレージに保存
function savePlaces() {
    const places = [];
    document.querySelectorAll('.place').forEach(place => {
        places.push({
            title: place.querySelector('h2').innerText,
            description: place.querySelector('p').innerHTML.replace(/<br\s*\/?>/gm, '\n')
        });
    });
    localStorage.setItem('placeList', JSON.stringify(places));
}

// 魔法をDOMに追加
function addPlaceToDOM(title, description) {
    const newPlaceDiv = document.createElement('div');
    newPlaceDiv.classList.add('place');

    newPlaceDiv.innerHTML = `
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

    document.getElementById('placeList').appendChild(newPlaceDiv);

    // 編集フォームのイベントリスナーを再度追加
    newPlaceDiv.querySelector('.edit-button').addEventListener('click', function() {
        const form = this.closest('.place').querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    newPlaceDiv.querySelector('.save-button').addEventListener('click', function() {
        const form = this.closest('.edit-form');
        const titleInput = form.querySelector('input[type="text"]');
        const contentTextarea = form.querySelector('textarea');
        const placeDiv = form.closest('.place');

        placeDiv.querySelector('h2').innerText = titleInput.value;
        placeDiv.querySelector('p').innerHTML = contentTextarea.value.replace(/\n/g, '<br>');
        form.style.display = 'none';
        savePlaces();
    });

    // 削除ボタンのイベントリスナーを追加
    newPlaceDiv.querySelector('.delete-button').addEventListener('click', function() {
        newPlaceDiv.remove();
        savePlaces();
    });
}

// 新しい魔法の追加
document.getElementById('addPlaceButton').addEventListener('click', function() {
    const title = document.getElementById('newPlaceTitle').value;
    const description = document.getElementById('newPlaceDescription').value;

    if (title && description) {
        addPlaceToDOM(title, description);
        savePlaces();

        // フォームのクリア
        document.getElementById('newPlaceTitle').value = '';
        document.getElementById('newPlaceDescription').value = '';
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.place').forEach(place => {
        const title = place.querySelector('h2').innerText.toLowerCase();
        const description = place.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            place.style.display = 'block';
        } else {
            place.style.display = 'none';
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
loadPlaces();
