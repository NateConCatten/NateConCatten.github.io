document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.getElementById("gameBoard");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const highScoreDisplay = document.getElementById("highScoreDisplay");
  const currentScore = document.getElementById('currentScore')

  let flippedCards = [];
  let score = 0;
  let matchedPairs = 0;

  function duplicateNums(arr) {
      return arr.concat(arr.slice());
  }

  let cardNums = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  ];

  let deck = duplicateNums(cardNums);

  function shuffle(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
  }

  function createCards() {
      let shuffledDeck = shuffle(deck);

      shuffledDeck.forEach(card => {
          let cardDiv = document.createElement('div');
          cardDiv.className = 'card';

          let cardInner = document.createElement('div');
          cardInner.className = 'card-inner';

          let cardBack = document.createElement('div');
          cardBack.className = 'card-back';
          cardBack.style.backgroundImage = `url('images/${card}.jpeg')`;

          let cardFront = document.createElement('div');
          cardFront.className = 'card-front';
          cardFront.style.backgroundImage = `url('images/coverShot.jpeg')`;

          cardInner.appendChild(cardFront);
          cardInner.appendChild(cardBack);
          cardDiv.appendChild(cardInner);
          cardDiv.dataset.image = card;

          gameBoard.appendChild(cardDiv);

          cardDiv.addEventListener('click', function() {
              flipCard(cardDiv);
          });
      });
  }

  function flipCard(card) {
      if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
          setTimeout(checkMatch, 500);
      }
  }

  function checkMatch() {
      const [card1, card2] = flippedCards;
      const img1 = card1.dataset.image;
      const img2 = card2.dataset.image;

      if (img1 === img2) {
          score += 10;
          matchedPairs += 1;
          fadeOutCards(card1, card2);
          if (matchedPairs === 12) {
              endGame();
          }
      } else {
          score -= 1;
          if (score < 0) {
              score = 0;
          }
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
      }

      currentScore.textContent = `Score: ${score}`;
      flippedCards = [];
  }

  function fadeOutCards(card1, card2) {
      card1.classList.add('fade-out');
      card2.classList.add('fade-out');
      setTimeout(() => {
          card1.style.visibility = 'hidden';
          card2.style.visibility = 'hidden';
      }, 500);
  }

  function endGame() {
      gameBoard.classList.add('hidden');
      restartButton.classList.remove('hidden');
      currentScore.textContent = `Final Score: ${score}`;

      updateHighScore(score);
  }

  function updateHighScore(finalScore) {
      let highScore = localStorage.getItem('highScore');
      if (highScore === null) {
          highScore = finalScore;
      } else {
          highScore = parseInt(highScore, 10);
          if (finalScore > highScore) {
              highScore = finalScore;
          }
      }
      localStorage.setItem('highScore', highScore);
      highScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  function showHighScore() {
      let highScore = localStorage.getItem('highScore');
      if (highScore === null) {
          highScore = "None";
      } else {
          highScore = parseInt(highScore, 10);
      }
      highScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);

  function startGame() {
      startButton.classList.add('hidden');
      createCards();
      gameBoard.classList.remove('hidden');
      scoreDisplay.classList.remove('hidden');
  }

  function restartGame() {
      restartButton.classList.add('hidden');
      matchedPairs = 0;
      gameBoard.innerHTML = '';
      createCards();
      showHighScore();
      currentScore.textContent ="Score: 0";
  }

  showHighScore();
});

