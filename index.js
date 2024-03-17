let notes = ["C", "D", "E", "F", "G", "A", "B"]

let tiles = []
let activeTile = 0
let tileWidth = 64
let tileHeight = 64

let agent

function setup() {
    createCanvas(windowWidth, windowHeight)
    
    // Randomly place notes across the canvas, make sure the notes don't overlap. The notes must be evenly distributed
    for (let i = 0; i < notes.length; i++) {
        let x = random(0, width - tileWidth)
        let y = random(0, height - tileHeight)
        let note = notes[i]
        tiles.push(new NoteTile(x, y, tileWidth, tileHeight, note))
    }

    // Create an agent
    agent = new Agent(width / 2, height / 2, 16, 16)

}

function draw() {
    background(0)
    
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].draw()
    }

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
        this.speed = 5
    }

    draw() {
        ellipse(this.x, this.y, this.w, this.h)
    }

    // Make the agent move towards the center of a given note, and have it slow down as it reaches the note
    move(note) {
        let dx = note.x - this.x;
        let dy = note.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            let lerpSpeed = 0.05; // Adjust this value to change the speed of the easing
            this.x = lerp(this.x, note.x, lerpSpeed);
            this.y = lerp(this.y, note.y, lerpSpeed);
        }

        // Change note
        if (distance < this.speed) {
            activeTile++
            if (activeTile >= tiles.length) {
                activeTile = 0
            }
        }


    }

}

class NoteTile {
    constructor(x, y, w, h, note) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.note = note
    }

    draw() {
        rectMode(CENTER)
        rect(this.x, this.y, this.w, this.h, 24)

        // Increase text size to 24 px
        textSize(16)
        // Center the text
        textAlign(CENTER, CENTER)

        // Draw the note name
        text(this.note, this.x, this.y)

    }
}