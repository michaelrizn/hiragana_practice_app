let currentSymbol;
let symbolQueue = []; // Очередь символов для текущего цикла
let correctCount = 0;
let incorrectCount = 0;

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
    document.getElementById('reload-button').addEventListener('click', reloadApp);
    document.getElementById('alphabet-button').addEventListener('click', showAlphabet);
    document.getElementById('alphabet-button-game').addEventListener('click', showAlphabet);
    document.getElementById('total-count-display').addEventListener('click', showCounterPopup); // Добавляем обработчик для отображения статистики
    document.getElementById('alphabet-popup').addEventListener('click', hideAlphabet);
    document.getElementById('counter-popup').addEventListener('click', closeCounterPopup); // Закрытие статистики по клику

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
    initSymbolQueue();
    nextSymbol();
}

function initSymbolQueue() {
    symbolQueue = shuffleArray([...hiragana]); // Создаем новый цикл, перемешивая символы
}

function nextSymbol() {
    if (symbolQueue.length === 0) {
        initSymbolQueue(); // Если символы закончились, инициализируем новый цикл
    }
    currentSymbol = symbolQueue.shift(); // Берем первый символ из очереди
    document.getElementById('symbol').textContent = currentSymbol.symbol;
    document.getElementById('result').textContent = '';
    document.getElementById('result').classList.remove('show');

    let options = [currentSymbol].concat(getRandomOptions(3));
    options = shuffleArray(options);

    let optionsHtml = options.map(option =>
        `<div class="option" onclick="checkAnswer('${option.english}', this)">${option.english} (${option.russian})</div>`
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

function checkAnswer(answer, element) {
    disableButtons(); // Отключение кнопок после нажатия
    let resultElement = document.getElementById('result');
    if (answer === currentSymbol.english) {
        resultElement.textContent = 'Правильно';
        correctCount++;
    } else {
        resultElement.textContent = 'Неправильно';
        incorrectCount++;
    }
    updateCounter(); // Обновление счетчика после каждого ответа
    resultElement.classList.add('show');
    setTimeout(() => {
        resultElement.classList.remove('show');
        setTimeout(() => {
            nextSymbol();
            enableButtons(); // Включение кнопок после обновления
        }, 300);
    }, 1700);
}

function disableButtons() {
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(button => {
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';  // Визуальное указание на то, что кнопка неактивна
    });
}

function enableButtons() {
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';  // Возвращение кнопок в активное состояние
    });
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

function reloadApp() {
    console.log('Reloading app');
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('symbol').textContent = '';  // Очистка символа
    document.getElementById('result').textContent = '';  // Очистка результата
    document.getElementById('options').innerHTML = '';  // Очистка опций
    correctCount = 0;
    incorrectCount = 0;
    updateCounter(); // Сброс счетчика
}

// Обновление счетчика
function updateCounter() {
    let totalCount = correctCount + incorrectCount;
    let correctPercent = totalCount ? ((correctCount / totalCount) * 100).toFixed(1) : 0;
    let incorrectPercent = totalCount ? ((incorrectCount / totalCount) * 100).toFixed(1) : 0;

    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('total-count-display').textContent = totalCount; // Обновляем отображение общего числа ответов
    document.getElementById('correct-percent').textContent = correctPercent;
    document.getElementById('incorrect-percent').textContent = incorrectPercent;
}

// Показ всплывающего окна с текущими данными счетчика
function showCounterPopup() {
    document.getElementById('counter-popup').classList.remove('hidden');
    document.getElementById('counter-popup').classList.add('show');
}

// Закрытие всплывающего окна счетчика
function closeCounterPopup() {
    document.getElementById('counter-popup').classList.remove('show');
    document.getElementById('counter-popup').classList.add('hidden');
}

// Вызов функции initializeApp после загрузки страницы
window.addEventListener('load', initializeApp);
