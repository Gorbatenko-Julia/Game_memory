//Здесь определены четыре вида карт — пик, черва, бубна и трефа, каждая представлена именем и изображением.
const cardsArray = [
    {name: 'card1', img: 'images/free-icon-clubs-1.png'},
    {name: 'card2', img: 'images/free-icon-diamond-2.png'},
    {name: 'card3', img: 'images/free-icon-heart-3.png'},
    {name: 'card4', img: 'images/free-icon-spades-4.png'},
];

//Эти переменные используются для отслеживания текущего хода игрока:
//
// firstCard хранит первую открытую карту,
// secondCard — вторую открытую карту,
// lockBoard блокирует взаимодействие с полями во время ожидания результата открытия второй карты.
let firstCard = null;
let secondCard = null;
let thirdCard = null;
let lockBoard = false;

//Получение списка всех карточек:Используется селектор document.querySelectorAll('.card'),
// который возвращает коллекцию всех элементов с классом .card. Эти элементы представляют собой наши игровые карточки.
// Применение класса flipped:Каждый элемент коллекции получает класс flipped, который вызывает переворот карты.
// Благодаря этому классу карта переходит в открытое состояние, показывая свое изображение.
function showAllCards() {
    const allCards = document.querySelectorAll('.card-container');
    allCards.forEach(card => card.classList.add('flipped'));
    setTimeout(hideAllCards, 3000);
}

//Получение списка всех карточек:Точно такая же операция, как и в предыдущей функции. Получаем список всех карточек с классом .card.
// Удаление класса flipped:Удаляя класс flipped у каждой карточки, мы отменяем действие предыдущего метода.
// Таким образом, карточки возвращаются в исходное закрытое состояние, пряча изображение и оставляя лишь пустые лица.
function hideAllCards() {
    const allCards = document.querySelectorAll('.card-container');
    allCards.forEach(card => card.classList.remove('flipped'));
}

//Функция createBoard
// Эта функция создает игровое поле:
//Функция создаёт контейнеры для карт, добавляет картинки и размещает карточки случайным образом на игровом поле.
// После загрузки страницы запускается эта функция, создавая игровой интерфейс.
function createBoard() {
    const gameBoard = document.querySelector('.game-board');
    const shuffledCards = [...cardsArray, ...cardsArray, ...cardsArray].sort(() => 0.5 - Math.random());

    shuffledCards.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.dataset.name = card.name;

        //Создаём front face (оборотную сторону)
        const frontFace = document.createElement('div');
        frontFace.classList.add('card-face', 'front-face')
        cardContainer.appendChild(frontFace);

        //Создаём back face (лицевую сторону)
        const backFace = document.createElement('div');
        backFace.classList.add('card-face', 'back-face');
        const image = document.createElement('img');
        image.src = card.img;
        backFace.appendChild(image);
        cardContainer.appendChild(backFace);

        gameBoard.appendChild(cardContainer);
        cardContainer.addEventListener('click', flipCard);
        //Каждая карточка создается как контейнер (card-container), содержащий две части: переднюю (front-face) и заднюю (back-face).
        // Стили позволяют создавать трёхмерный эффект переворота благодаря свойствам CSS: transform, transition, backface-visibility.
        // Класс flipped управляет процессом переворота карты при клике.
    });
    showAllCards();
}


//Функция flipCard
// При клике на любую карту игра проверяет её состояние и открывает её, запоминая последовательность открытых карт:
function flipCard() {
    if (lockBoard || this === firstCard || this === secondCard || this === thirdCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }
    if (!secondCard) {
        secondCard = this;
        lockBoard = true; // Блокируем доску
        setTimeout(() => {
            if (firstCard.dataset.name !== secondCard.dataset.name) {
                unflipCards(firstCard, secondCard); // Сворачиваем, если не совпадают
            } else {
                thirdCard = this; // Если первая и вторая совпадают, ожидаем третью карту
            }
            lockBoard = false;//разблокировка доски
        }, 1000); // Пауза в 1 секунду для просмотра результата
        return;
    }
    thirdCard = this;
    lockBoard = true;//ждём пока откроются все три карты
    setTimeout(() => {
        checkForMatch(); // Проверка всех трёх карт
        resetBoard();
    }, 1000);//пауза ещё раз для визуального эффекта

}


// Проверка совпадения трех карт
function checkForMatch() {
    if (
        firstCard.dataset.name === secondCard.dataset.name &&
        firstCard.dataset.name === thirdCard.dataset.name
    ) {
        disableCards(); // Совпадение, блокируем карты
    } else {
        unflipCards(firstCard, secondCard, thirdCard); // Несовпадение, сворачиваем все три карты
    }
    resetBoard(); // Всегда сбрасываем состояние после проверки
    checkWinCondition();
}


//Отключение и переворот карт
// Если карты совпали:
// Деактивация карт при совпадении
// function disableCards() {
//     firstCard.removeEventListener('click', flipCard);
//     secondCard.removeEventListener('click', flipCard);
//     thirdCard.removeEventListener('click', flipCard);
//     resetBoard();
// }
function disableCards() {
    firstCard.classList.add('disabled');
    secondCard.classList.add('disabled');
    thirdCard.classList.add('disabled');
    resetBoard(); // Очистка состояния
}


//Если карты разные:

function unflipCards(firstCard, secondCard, thirdCard) {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    if (thirdCard) thirdCard.classList.remove('flipped');
    resetBoard();

}


//Эта функция сбрасывает ключевые переменные игры в исходное состояние:
//
// firstCard: устанавливается в значение null, значит больше нет первой открытой карты.
// secondCard: также становится равной null, означая отсутствие второй открытой карты.
// lockBoard: возвращается к значению false, что позволяет снова взаимодействовать с игральным полем.
//Она используется после каждого этапа игры, будь то успешное открытие совпадающей пары карт или неуспешная попытка,
// когда игрок ошибся и должен перевернуть карты обратно.
function resetBoard() {
    firstCard = null;
    secondCard = null;
    thirdCard = null;
    lockBoard = false;
}

// Новая функция для проверки условий победы
function checkWinCondition() {
    const disabledCardsCount = document.querySelectorAll('.card-container.disabled').length;
    const totalCardsCount = document.querySelectorAll('.card-container').length;
    if (disabledCardsCount === totalCardsCount) {
        showWinPopup();
    }
} // Функция для отображения окна с победой
function showWinPopup() {
    const winMessage = document.getElementById('winMessage');
    winMessage.style.display = 'block';
    winMessage.querySelector('.popup-button').addEventListener('click', () => {
        restartGame();
    });
}

// Функция для перезапуска игры
function restartGame() {
    const gameBoard = document.querySelector('.game-board');
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.lastChild);
    }
    createBoard();
    closeWinPopup();

} // Закрыть окно с сообщением
function closeWinPopup() {
    const winMessage = document.getElementById('winMessage');
    winMessage.style.display = 'none';
}



//Это стандартный способ JavaScript, используемый для запуска функций сразу
// после полной загрузки HTML-документа и построения дерева DOM (Document Object Model).
document.addEventListener('DOMContentLoaded', createBoard);




