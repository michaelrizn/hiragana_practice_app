// script.js
let currentSymbol;
let symbolQueue = [];
let correctCount = 0;
let incorrectCount = 0;
let currentAlphabet = hiragana;

function initializeApp() {
  console.log("Initializing app...");
  if (window.Telegram && window.Telegram.WebApp) {
    console.log("Telegram WebApp is available");
    window.Telegram.WebApp.ready();
    if (window.Telegram.WebApp.initDataUnsafe.start_param === "game") {
      startGame(currentAlphabet);
    } else {
      showMainPage();
    }
  } else {
    console.log("Telegram WebApp is not available, running in standalone mode");
    showMainPage();
  }

  // Обработчики для кнопок справки на главной странице
  document
    .getElementById("hiragana-help-button")
    .addEventListener("click", () => showAlphabet(hiragana));
  document
    .getElementById("katakana-help-button")
    .addEventListener("click", () => showAlphabet(katakana));
  document
    .getElementById("hiraganaandkatakana-help-button")
    .addEventListener("click", () => showAlphabet(hiraganaAndKatakana)); // Обработчик для новой справки

  // Обработчики для кнопок справки на странице игры
  document
    .getElementById("hiragana-button-game")
    .addEventListener("click", () => showAlphabet(hiragana));
  document
    .getElementById("katakana-button-game")
    .addEventListener("click", () => showAlphabet(katakana));
  document
    .getElementById("hiraganaandkatakana-button-game")
    .addEventListener("click", () => showAlphabet(hiraganaAndKatakana)); // Обработчик для новой справки

  document.getElementById("reload-button").addEventListener("click", reloadApp);
  document
    .getElementById("total-count-display")
    .addEventListener("click", showCounterPopup);
  document
    .getElementById("alphabet-popup")
    .addEventListener("click", hideAlphabet);
  document
    .getElementById("counter-popup")
    .addEventListener("click", closeCounterPopup);

  document.getElementById("loading").classList.add("hidden");
}

function showMainPage() {
  console.log("Showing main page");
  document.getElementById("main-page").classList.remove("hidden");
  document.getElementById("game-page").classList.add("hidden");
}

function startGame(alphabet) {
  console.log("Starting game");
  currentAlphabet = alphabet;
  document.getElementById("main-page").classList.add("hidden");
  document.getElementById("game-page").classList.remove("hidden");
  initSymbolQueue();
  nextSymbol();
}

function initSymbolQueue() {
  symbolQueue = shuffleArray([...currentAlphabet]);
}

function nextSymbol() {
  if (symbolQueue.length === 0) {
    initSymbolQueue();
  }
  currentSymbol = symbolQueue.shift();
  document.getElementById("symbol").textContent = currentSymbol.symbol;
  document.getElementById("result").textContent = "";
  document.getElementById("result").classList.remove("show");

  let options = [currentSymbol].concat(getRandomOptions(3));
  options = shuffleArray(options);

  let optionsHtml = options
    .map(
      (option) =>
        `<div class="option" onclick="checkAnswer('${option.english}', this)">${option.english} (${option.russian})</div>`,
    )
    .join("");

  document.getElementById("options").innerHTML = optionsHtml;
}

function getRandomOptions(count) {
  let options = [];
  while (options.length < count) {
    let option =
      currentAlphabet[Math.floor(Math.random() * currentAlphabet.length)];
    if (
      option !== currentSymbol &&
      !options.some((opt) => opt.english === option.english)
    ) {
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
  disableButtons();
  let resultElement = document.getElementById("result");
  if (answer === currentSymbol.english) {
    resultElement.textContent = "Правильно";
    correctCount++;
  } else {
    resultElement.textContent = "Неправильно";
    incorrectCount++;
  }
  updateCounter();
  resultElement.classList.add("show");
  setTimeout(() => {
    resultElement.classList.remove("show");
    setTimeout(() => {
      nextSymbol();
      enableButtons();
    }, 300);
  }, 1700);
}

function disableButtons() {
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((button) => {
    button.style.pointerEvents = "none";
    button.style.opacity = "0.5";
  });
}

function enableButtons() {
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((button) => {
    button.style.pointerEvents = "auto";
    button.style.opacity = "1";
  });
}

function showAlphabet(alphabet) {
  let content = alphabet
    .map((char) => `<p>${char.symbol} - ${char.english} (${char.russian})</p>`)
    .join("");
  document.getElementById("alphabet-content").innerHTML = content;
  document.getElementById("alphabet-popup").classList.remove("hidden");
}

function hideAlphabet() {
  document.getElementById("alphabet-popup").classList.add("hidden");
}

function reloadApp() {
  document.getElementById("main-page").classList.remove("hidden");
  document.getElementById("game-page").classList.add("hidden");
  document.getElementById("symbol").textContent = "";
  document.getElementById("result").textContent = "";
  document.getElementById("options").innerHTML = "";
  correctCount = 0;
  incorrectCount = 0;
  updateCounter();
}

function updateCounter() {
  let totalCount = correctCount + incorrectCount;
  let correctPercent = totalCount
    ? ((correctCount / totalCount) * 100).toFixed(1)
    : 0;
  let incorrectPercent = totalCount
    ? ((incorrectCount / totalCount) * 100).toFixed(1)
    : 0;

  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("incorrect-count").textContent = incorrectCount;
  document.getElementById("total-count").textContent = totalCount;
  document.getElementById("total-count-display").textContent = totalCount;
  document.getElementById("correct-percent").textContent = correctPercent;
  document.getElementById("incorrect-percent").textContent = incorrectPercent;
}

function showCounterPopup() {
  document.getElementById("counter-popup").classList.remove("hidden");
  document.getElementById("counter-popup").classList.add("show");
}

function closeCounterPopup() {
  document.getElementById("counter-popup").classList.remove("show");
  document.getElementById("counter-popup").classList.add("hidden");
}

window.addEventListener("load", initializeApp);
