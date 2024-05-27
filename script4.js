let deck = [];
let dealerHand = [];
let playerHand = [];

const dealerCardsElement = document.getElementById("dealer-cards");
const playerCardsElement = document.getElementById("player-cards");
const dealerScoreElement = document.getElementById("dealer-score");
const playerScoreElement = document.getElementById("player-score");
const messageElement = document.getElementById("message");
const dealButton = document.getElementById("deal-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

dealButton.addEventListener("click", startGame);
hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", playerStand);

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    updateUI();
    checkForBlackjack();
}

function playerHit() {
    playerHand.push(deck.pop());
    updateUI();
    if (calculateHandValue(playerHand) > 21) {
        endGame("バースト! 君の負けだ...");
    }
}

function playerStand() {
    hitButton.disabled = true;
    standButton.disabled = true;
    dealerTurn();
}

function dealerTurn() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateUI();
    if (calculateHandValue(dealerHand) > 21) {
        endGame("君の勝ちだ！");
    } else {
        checkWinner();
    }
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        if (card.value === 'A') {
            aceCount++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function updateUI() {
    dealerCardsElement.innerHTML = "";
    playerCardsElement.innerHTML = "";

    dealerHand.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.textContent = card.value;
        dealerCardsElement.appendChild(cardDiv);
    });

    playerHand.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.textContent = card.value;
        playerCardsElement.appendChild(cardDiv);
    });

    dealerScoreElement.textContent = "Score: " + calculateHandValue(dealerHand);
    playerScoreElement.textContent = "Score: " + calculateHandValue(playerHand);
}

function checkForBlackjack() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if (playerScore === 21) {
        if (dealerScore === 21) {
            endGame("Push! It's a tie.");
        } else {
            endGame("ブラックジャック！？ 君の勝ちだ!! 凄い豪運だな！！！");
        }
    } else if (dealerScore === 21) {
        endGame("ディーラがブラックジャックだ...! この負けはしょうがない....");
    }
}

function checkWinner() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if (playerScore > dealerScore) {
        endGame("君の勝ちだ!");
    } else if (playerScore < dealerScore) {
        endGame("君の負けだ...");
    } else {
        endGame("ドローだ！");
    }
}

function endGame(message) {
    messageElement.textContent = message;
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
}
