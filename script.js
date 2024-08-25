let currentSymbol;

function initializeApp() {
    console.log('Initializing app...');
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram WebApp is available');
        window.Telegram.WebApp.ready();
        if (window.Telegram.WebApp.initDataUnsafe.start_param === 'game') {
            startGame();
        } else {
            showMainPage();
        }
    } else {
        console.log('Telegram WebApp is not available, running in standalone mode');
        showMainPage();
    }

    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('reload-button').addEventListener('click', reloadApp);  // Изменено здесь
    document.getElementById('alphabet-button').addEventListener('click', showAlphabet);
    document.getElementById('alphabet-button-game').addEventListener('click', showAlphabet);
    document.getElementById('alphabet-popup').addEventListener('click', hideAlphabet);

    document.getElementById('loading').classList.add('hidden');
}

function showMainPage() {
    console.log('Showing main page');
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('game-page').classList.add('hidden');
}

function startGame() {
    console.log('Starting game');
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    nextSymbol();
}

function nextSymbol() {
    currentSymbol = hiragana[Math.floor(Math.random() * hiragana.length)];
    document.getElementById('symbol').textContent = currentSymbol.symbol;
    document.getElementById('result').textContent = '';
    document.getElementById('result').classList.remove('show');

    let options = [currentSymbol].concat(getRandomOptions(3));
    options = shuffleArray(options);

    let optionsHtml = options.map(option =>
        `<div class="option" onclick="checkAnswer('${option.english}')">${option.english} (${option.russian})</div>`
    ).join('');

    document.getElementById('options').innerHTML = optionsHtml;
}

function getRandomOptions(count) {
    let options = [];
    while (options.length < count) {
        let option = hiragana[Math.floor(Math.random() * hiragana.length)];
        if (option !== currentSymbol && !options.includes(option)) {
            options.push(option);
        }
    }
    return options;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(answer) {
    let resultElement = document.getElementById('result');
    if (answer === currentSymbol.english) {
        resultElement.textContent = 'Правильно';
    } else {
        resultElement.textContent = 'Неправильно';
    }
    resultElement.classList.add('show');
    setTimeout(() => {
        resultElement.classList.remove('show');
        setTimeout(nextSymbol, 300);
    }, 1700);
}

function showAlphabet() {
    console.log('Showing alphabet');
    let content = hiragana.map(char =>
        `<p>${char.symbol} - ${char.english} (${char.russian})</p>`
    ).join('');
    document.getElementById('alphabet-content').innerHTML = content;
    document.getElementById('alphabet-popup').classList.remove('hidden');
}

function hideAlphabet() {
    console.log('Hiding alphabet');
    document.getElementById('alphabet-popup').classList.add('hidden');
}

// Добавлена функция для перезагрузки
function reloadApp() {
    console.log('Reloading app');
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('symbol').textContent = '';  // Очистка символа
    document.getElementById('result').textContent = '';  // Очистка результата
    document.getElementById('options').innerHTML = '';  // Очистка опций
}

// Вызов функции initializeApp после загрузки страницы
window.addEventListener('load', initializeApp);