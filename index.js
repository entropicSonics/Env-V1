let notes = ["C", "D", "E", "F", "G", "A", "B"]
// let weights = new Array(notes.length).fill(1); // Start with equal weights
// Start with random weights
// let weights = [2, 1, 2, 1, 1, 2, 1]; // Corresponding to ["C", "D", "E", "F", "G", "A", "B"]
let weights

let tiles = []
let activeTile = 0
let tileWidth = 36
let tileHeight = 36

let agent

function setup() {
    createCanvas(windowWidth, windowHeight)
    
    // Randomly place notes across the canvas, make sure the notes don't overlap. The notes must be evenly distributed
    // for (let i = 0; i < notes.length; i++) {
    //     let x = random(0, width - tileWidth)
    //     let y = random(0, height - tileHeight)
    //     let note = notes[i]
    //     tiles.push(new NoteTile(x, y, tileWidth, tileHeight, note))
    // }

    // Place the notes in a circle
    let radius = 300
    let angle = TWO_PI / notes.length
    for (let i = 0; i < notes.length; i++) {
        let x = width / 2 + cos(angle * i) * radius
        let y = height / 2 + sin(angle * i) * radius
        let note = notes[i]
        tiles.push(new NoteTile(x, y, tileWidth, tileHeight, note, Math.floor(random(0, 2))))
    }

    // Random weights
    // for (let i = 0; i < notes.length; i++) {
    //     weights.push(random(1, 10))
    // }

    // Get the weights of all tiles and store them in a weights object
    weights = tiles.map(tile => tile.weight)

    // Create an agent
    agent = new Agent(width / 2, height / 2, 16, 16)

}

function draw() {
    background(0)
    
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].draw()
    }

    console.log(weights)

    // Move the agent towards the note
    agent.move(tiles[activeTile])
    agent.draw()
}

class Agent {
    // Create an Agent object that moves around the canvas
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.speed = 1
    }

    draw() {
        ellipse(this.x, this.y, this.w, this.h)
    }

    getNextNoteIndex(weights) {
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        let randomNum = Math.random() * totalWeight;
        let weightSum = 0;
    
        for (let i = 0; i < weights.length; i++) {
            weightSum += weights[i];
            weightSum = +weightSum.toFixed(2);
    
            if (randomNum <= weightSum) {
                return i;
            }
        }        
    }

    // Make the agent move towards the center of a given note, and have it slow down as it reaches the note
    move(note) {
        let dx = note.x - this.x;
        let dy = note.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            let lerpSpeed = 0.05; // Adjust this value to change the speed of the easing
            this.x = lerp(this.x, note.x, this.speed/4)
            this.y = lerp(this.y, note.y, this.speed/4)
        }

        // Change note
        if (distance < this.speed) {
            // activeTile++
            // if (activeTile >= tiles.length) {
            //     activeTile = 0
            // }

            let nextNoteIndex = this.getNextNoteIndex(weights);
            activeTile = nextNoteIndex
        }
    }
}

class NoteTile {
    constructor(x, y, w, h, note, weight) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.note = note
        this.weight = weight
    }

    draw() {
        rectMode(CENTER)
        rect(this.x, this.y, this.w, this.h, 12)

        // Increase text size to 24 px
        textSize(16)
        // Center the text
        textAlign(CENTER, CENTER)

        // Draw the note name
        text(this.note, this.x, this.y)

    }
}