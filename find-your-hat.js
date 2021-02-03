// Import dependencies
const prompt = require("prompt-sync")()

// Print game title
const title = "Find your hat"
console.log(`\n${title.toUpperCase()}\n`)

// Get game preferences
const nameResponse = prompt("Enter player name: ")
const difficultyResponse = prompt("Set difficulty ([1] Easy [2] Normal [3] Harder): ")

// Set game preferences
const name = setName(nameResponse)
const difficulty = setDifficulty(difficultyResponse)

// Print controls
const controls = `
Controls:
  [w] Move north
  [a] Move west
  [s] Move south
  [d] Move east
  [Enter] Submit
`
console.log(controls)

// Prompt ready 
let response = prompt("Press [Enter] to begin: ")
response === "^C" ? hasHat = -1 : console.clear()

// Print brief
const brief = `
Oh, no! A gust of wind just stolen your favourite hat!
It seems to have landed somewhere in the nearby field.
See if you can find it - and look out for holes!
`
console.log(brief)

// Set field parameters
const width = difficulty * 10
const holeThreshold = setHoleThreshold(difficulty)

// Generate field map
const grass = "░"
const hole = "O"
const hat = "^"
const path = "*"
const map = generateMap(width, holeThreshold)
const legend = `
  [*] Your path
  [^] Your hat
`

// Handle player moves until game over
let hasHat = false
let playerPosX = playerPosY = 0

while (!hasHat) {
  // Re-render the map on each move
  console.clear()
  printMap(map, legend)

  const currentMove = prompt("Which way?: ")
  switch(currentMove) {
    // Update player position
    case "w":
      playerPosX -= 1;
      break;
    case "a":
      playerPosY -= 1;
      break;
    case "s":
      playerPosX += 1;
      break;
    case "d":
      playerPosY += 1;
      break;
    default:
      // Show controls if invalid input
      console.log(controls);
      prompt("Press [Enter] to continue: ");
  }

  const charAtPlayerPos = map[playerPosX][playerPosY] || undefined
  if (!charAtPlayerPos) {
    // Game end when player leaves map
    console.log(`
      *** GAME OVER ***
      ${ name } left the field to buy a new hat! : (
    `)
    hasHat = -1
  } else {
    switch(charAtPlayerPos) {
      case hole:
        // Game end when character at player position is hole
        console.log(`
          *** GAME OVER ***
          ${name} fell down a hole, never to be seen again!
          A passer-by scores a new hat...
        `)
        hasHat = -1
        break
      case hat:
        // Game end when character at player position is hat
        console.log(`
          *** YOU FOUND YOUR HAT!!! ***
          Historians will tell of ${name}, the skilled orienteer!
        `)
        hasHat = true
        break
      default: 
        // Update map with last move
        map[playerPosX][playerPosY] = path
    }
  }
}

// FUNCTIONS -----------------------------------------------
function printMap(map, legend) {
  map.forEach(row => console.log(row.join("")))
  console.log(legend)
}

function generateMap(width, holeThreshold) {
  const map = []

  // Locate grass and holes
  while (map.length < width) {
    const row = []
    while (row.length < width) {
      row.push(Math.random() >= holeThreshold ? grass : hole)
    }
    map.push(row)
  }

  // Locate hat
  const hatRowIndex = getRandomInt(width)
  const hatColIndex = getRandomInt(width)
  map[hatRowIndex][hatColIndex] = hat

  // Locate start position
  map[0][0] = path

  // Ensure holes don't surround start position
  map[0][1] = map[1][0] = map[1][1] = grass

  return map
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function setHoleThreshold(difficulty) {
  switch(difficulty) {
    case 1:
      return 0.2
    case 2:
      return 0.225
    case 3:
      return 0.25
  }
}

function setDifficulty(num) {
  return (num === "1" || num === "3")
  ? parseInt(num)
  : 2
}

function setName(str) {
  const regex = /[a-z]/gi
  const letters = str.match(regex)
  if (letters) {
    letters[0] = letters[0].toUpperCase()
    return letters.join("")
  } else return "Player 1"
}

