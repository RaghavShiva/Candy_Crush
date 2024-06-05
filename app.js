document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const width = 8
  const squares = []
  let score = 0
  const moves = document.querySelector('#moves')
  const maxMoves = 12; // Define maximum number of moves allowed
let movesLeft = maxMoves;
let maxscore = 40
  const candyColors = [
      'images/red_candy.png',
      'images/yellow_candy.png',
      'images/orange_candy.png',
      'images/purple_candy.png',
      'images/green_candy.png',
      'images/blue_candy.png'
  ]

  // Create the board
  function createBoard() {
      for (let i = 0; i < width * width; i++) {
          const square = document.createElement('div')
          square.setAttribute('id', i)
          square.setAttribute('draggable', true)
          const img = document.createElement('img')
          let randomColor = Math.floor(Math.random() * candyColors.length)
          img.src = candyColors[randomColor]
          square.appendChild(img)
          grid.appendChild(square)
          squares.push(square)
      }
  }
  createBoard()

  // Dragging the candy
  let imgBeingDragged
  let imgBeingReplaced
  let squareIdBeingDragged
  let squareIdBeingReplaced

  squares.forEach(square => square.addEventListener('dragstart', dragStart))
  squares.forEach(square => square.addEventListener('dragend', dragEnd))
  squares.forEach(square => square.addEventListener('dragover', dragOver))
  squares.forEach(square => square.addEventListener('dragenter', dragEnter))
  squares.forEach(square => square.addEventListener('dragleave', dragLeave))
  squares.forEach(square => square.addEventListener('drop', dragDrop))

  function dragStart() {
      imgBeingDragged = this.querySelector('img')
      squareIdBeingDragged = parseInt(this.id)
  }

  function dragOver(e) {
      e.preventDefault()
  }

  function dragEnter(e) {
      e.preventDefault()
  }

  function dragLeave() {}

  function dragDrop() {
      imgBeingReplaced = this.querySelector('img')
      squareIdBeingReplaced = parseInt(this.id)
      this.appendChild(imgBeingDragged)
      squares[squareIdBeingDragged].appendChild(imgBeingReplaced)
      moves--;
      updateMovesLeft(); // Update moves left after a valid move
    
  }

  function dragEnd() {
      // What is a valid move?
      let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width]
      let validMove = validMoves.includes(squareIdBeingReplaced)

      if (squareIdBeingReplaced && validMove) {
          squareIdBeingReplaced = null
          movesLeft--
          updateMovesLeft()
      } else if (squareIdBeingReplaced && !validMove) {
          squares[squareIdBeingReplaced].appendChild(imgBeingReplaced)
          squares[squareIdBeingDragged].appendChild(imgBeingDragged)
      } else {
          squares[squareIdBeingDragged].appendChild(imgBeingDragged)
      }

      // Check for matches and move candies into empty squares after drag end
      setTimeout(() => {
          checkMatches()
      }, 100)
  }

  // Drop candies once some have been cleared
  function moveIntoSquareBelow() {
      for (let i = 0; i < 55; i++) {
          if (!squares[i + width].querySelector('img')) {
              squares[i + width].appendChild(squares[i].querySelector('img'))
              if (!squares[i].querySelector('img')) {
                  const img = document.createElement('img')
                  let randomColor = Math.floor(Math.random() * candyColors.length)
                  img.src = candyColors[randomColor]
                  squares[i].appendChild(img)
              }
          }
      }
  }

  // Checking for Matches
  function checkMatches() {
      checkRowForFour()
      checkColumnForFour()
      checkRowForThree()
      checkColumnForThree()
      setTimeout(moveIntoSquareBelow, 100) // delay to allow match checks before moving candies
  }
  // For row of four
function checkRowForFour() {
  for (let i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3]
      let decidedColor = squares[i].querySelector('img') ? squares[i].querySelector('img').src : ''
      const isBlank = !squares[i].querySelector('img')

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
      if (notValid.includes(i)) continue

      if (rowOfFour.every(index => squares[index].querySelector('img') && squares[index].querySelector('img').src === decidedColor && !isBlank)) {
          score += 4
          scoreDisplay.innerHTML = `${score}/${maxscore}`
          rowOfFour.forEach(index => {
              squares[index].querySelector('img').remove()
              const img = document.createElement('img')
              let randomColor = Math.floor(Math.random() * candyColors.length)
              img.src = candyColors[randomColor]
              squares[index].appendChild(img)
          })
      }
  }
}


 // For column of four
function checkColumnForFour() {
  for (let i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      let decidedColor = squares[i].querySelector('img') ? squares[i].querySelector('img').src : ''
      const isBlank = !squares[i].querySelector('img')

      if (columnOfFour.every(index => squares[index].querySelector('img') && squares[index].querySelector('img').src === decidedColor && !isBlank)) {
          score += 4
          scoreDisplay.innerHTML = `${score}/${maxscore}`
          columnOfFour.forEach(index => {
              squares[index].querySelector('img').remove()
              const img = document.createElement('img')
              let randomColor = Math.floor(Math.random() * candyColors.length)
              img.src = candyColors[randomColor]
              squares[index].appendChild(img)
          })
      }
  }
}

// For row of three
function checkRowForThree() {
  for (let i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2]
      let decidedColor = squares[i].querySelector('img') ? squares[i].querySelector('img').src : ''
      const isBlank = !squares[i].querySelector('img')

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
      if (notValid.includes(i)) continue

      if (rowOfThree.every(index => squares[index].querySelector('img') && squares[index].querySelector('img').src === decidedColor && !isBlank)) {
          score += 3
          scoreDisplay.innerHTML = `${score}/${maxscore}`
          rowOfThree.forEach(index => {
              squares[index].querySelector('img').remove()
              const img = document.createElement('img')
              let randomColor = Math.floor(Math.random() * candyColors.length)
              img.src = candyColors[randomColor]
              squares[index].appendChild(img)
          })
      }
  }
}

// For column of three
function checkColumnForThree() {
  for (let i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2]
      let decidedColor = squares[i].querySelector('img') ? squares[i].querySelector('img').src : ''
      const isBlank = !squares[i].querySelector('img')

      if (columnOfThree.every(index => squares[index].querySelector('img') && squares[index].querySelector('img').src === decidedColor && !isBlank)) {
          score += 3
          scoreDisplay.innerHTML = `${score}/${maxscore}`
          columnOfThree.forEach(index => {
              squares[index].querySelector('img').remove()
              const img = document.createElement('img')
              let randomColor = Math.floor(Math.random() * candyColors.length)
              img.src = candyColors[randomColor]
              squares[index].appendChild(img)
          })
      }
  }
}





let lastScore = 0 // Store the last score to detect valid moves
const intervalId = window.setInterval(function () {
    checkMatches()
    if (score > lastScore) {
        // Increment moves counter only if the score increases
        lastScore = score; // Update last score
       // Decrease moves left after each valid move
        if (movesLeft === 0 && score < maxscore) {
            clearInterval(intervalId); // Stop the game when moves left become zero and score is less than 30
            endGame("You lose! Score: " + score)
        } else if (score >= maxscore) {
            clearInterval(intervalId); // Stop the game when score reaches 30
            endGame("You won! Score: " + score)  
          }
    }
    updateMovesLeft() // Update moves left display
}, 100)

function updateMovesLeft() {
    // Display moves left below the score card
    if (movesLeft === 0 && score < maxscore) {
      clearInterval(intervalId); // Stop the game when moves left become zero and score is less than 30
      endGame("You lose! Score: " + score)
  }
    moves.innerHTML = movesLeft;
}

// Update moves left display initially
updateMovesLeft()
function endGame(message) {
  alert(message)
  // Make all squares undraggable
  squares.forEach(square => {
      square.removeAttribute('draggable');
      square.removeEventListener('dragstart', dragStart);
      square.removeEventListener('dragover', dragOver);
      square.removeEventListener('dragenter', dragEnter);
      square.removeEventListener('dragleave', dragLeave);
      square.removeEventListener('drop', dragDrop);
  });
}
 
})
