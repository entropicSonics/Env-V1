// Create a notes array for all 12 notes
// let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Create a notes array from C2 to C4
let notes = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"]

// Create a notes array from C3 to B4
// let notes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C4"]

// Create an array for only white notes
// let notes = ["C", "D", "E", "F", "G", "A", "B"]
// 
// let weights = new Array(notes.length).fill(1); // Start with equal weights
// Start with random weights
// let weights = [2, 1, 2, 1, 1, 2, 1]; // Corresponding to ["C", "D", "E", "F", "G", "A", "B"]
let weights = []

let tiles = []
let activeTile = null
let tileWidth = 48
let tileHeight = 36

let agent

let collisionCheckers = []

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
    // let radius = 300
    // let angle = TWO_PI / notes.length
    // for (let i = 0; i < notes.length; i++) {
    //     let x = width / 2 + cos(angle * i) * radius
    //     let y = height / 2 + sin(angle * i) * radius
    //     let note = notes[i]
    //     tiles.push(new NoteTile(x, y, tileWidth, tileHeight, note, Math.floor(random(0))))
    // }

    // Place the notes in two columns
    let x = width / 4 - 49
    let y = height / 4
    let xSpacing = 100
    let ySpacing = 100
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i]
        tiles.push(new NoteTile(x, y, tileWidth, tileHeight, note, 0))
        y += ySpacing
        if (y > height - height / 4) {
            y = height / 4
            x += xSpacing
        }
    }


    // Random weights
    // for (let i = 0; i < notes.length; i++) {
    //     weights.push(random(1, 10))
    // }

    // Create collision checkers for each tile. Each checker is a boolean set by default to false.
    for (let i = 0; i < tiles.length; i++) {
        collisionCheckers.push(false)
    }

    // Get the weights of all tiles and store them in a weights array
    weights = tiles.map(tile => tile.weight)

    // Create an agent
    agent = new Agent(width / 2, 140, 16, 16)

    // Accessing MIDI with webmidi.js
    WebMidi
        .enable()
        .then(onMidiEnabled)
        .catch(err => alert(err));

}

function draw() {
    background(0)
    
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].draw()
    }

    // console.log(weights)
    console.log(activeTile)

    // Check if the values of all elements of the weights array are 0. If yes, log to the console
    if (weights.every(weight => weight === 0)) {
        // Move the agent to the center of the canvas
        agent.move({x: width / 2, y: 140})
    } else {
        agent.move(tiles[activeTile])
    }

    // Move the agent towards the note
    
    agent.draw()

    // Check collisions between agent and note
    checkCollision(agent, tiles)


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
        fill(255)
        ellipse(this.x, this.y, this.w, this.h) 
    }

    getNextNoteIndex(weights) {
        // console.log(weights)
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        // console.log(totalWeight)
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
        this.fill = 80  
    }

    // Check if agent is over the tile
    contains(x, y) {
        return (x > this.x - this.w / 2 && x < this.x + this.w / 2 && y > this.y - this.h / 2 && y < this.y + this.h / 2)
    }

    draw() {
        rectMode(CENTER)  

        // Change the fill color if the agent is over the tile
        if (this.contains(agent.x, agent.y)) {
            // this.fill = 255
            // Change the color smoothly
            this.fill = lerp(this.fill, 255, 0.1)

            // Increase the size of the rectangly smoothly
            this.w = lerp(this.w, 64, 0.1)
            this.h = lerp(this.h, 48, 0.1)
        } else {
            // this.fill = 160
            // Change the color back smoothly
            this.fill = lerp(this.fill, 80, 0.1)

            // Decrease the size of the rectangly smoothly
            this.w = lerp(this.w, 48, 0.1)
            this.h = lerp(this.h, 36, 0.1)
        }

        // If the weight is 0, don't change the fill color and the size of the rectangle
        if (this.weight === 0) {
            this.fill = 80
            this.w = 48
            this.h = 36
        }

        fill(this.fill)
        rect(this.x, this.y, this.w, this.h)

        // Slider fill
        // Map the fill to the weight
        let sliderFill = map(this.weight, 0, 3, 200, 255)
        fill(sliderFill)
        // Create a similar sliderHeight variable that maps the weight to the height of the note
        let sliderHeight = map(this.weight, 0, 3, 0, this.h)
        // Create a rectangle that uses sliderHeight
        rect(this.x, this.y + this.h / 2 - sliderHeight / 2, this.w, sliderHeight)

        // If mouse is over slider, and the user clicks and drags, change the height of the fill
        if (mouseIsPressed && this.contains(mouseX, mouseY)) {
            this.weight = Math.floor(map(mouseY, this.y - this.h / 2, this.y + this.h / 2, 4, 0))
            // Update the weights array
            weights = tiles.map(tile => tile.weight)
            // Change the activeTile to the tile that is being clicked
            activeTile = tiles.indexOf(this)
        }

        fill(255)
        // Increase text size to 24 px
        textSize(12)
        // Center the text
        textAlign(CENTER, CENTER)

        // Draw the note name
        // text(this.note, this.x, this.y)

        // Draw the note name under the rectangle
        text(this.note, this.x, this.y + this.h / 2 + 16)

    }
}

function onMidiEnabled() {
    console.log("WebMidi enabled!") 
  
    // Inputs
    console.log("Inputs:") 
    WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name));
    
    // Outputs
    console.log("Outputs:") 
    WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));
  
    midiOut = WebMidi.getOutputByName("IAC Driver Bus 1");
}

function checkCollision(agent, tiles) {
    // Check collisions between agent and note

    // For every element in the chords array
    for (let i = 0; i < tiles.length; i++) {
    // Check if the tile has a weight greater than 0
    if (tiles[i].weight > 0) {
        // Check if the agent is over the tile
        if(tiles[i].contains(agent.x, agent.y)) {
            // If the agent is over the tile, check if the collision checker is false
            if (collisionCheckers[i] == false) {
                    // If the collision checker is false, play a note and set the collision checker to true
                    collisionCheckers[i] = true

                    // Get note from the tile
                    let note = tiles[i].note
                    // Convert note to MIDI note number
                    let midiNote = noteToMidi(note)

                    midiOut.sendNoteOn(midiNote)
            }
        } else {
            if (collisionCheckers[i] == true) {
                    // If the collision checker is true, stop the note and set the collision checker to false
                    collisionCheckers[i] = false
                    
                    // Get note from the tile
                    let note = tiles[i].note
                    // Convert note to MIDI note number
                    let midiNote = noteToMidi(note)

                    midiOut.sendNoteOff(midiNote)
                }
            }
        }
    }
}

// Create a noteToMidi function that is able to account for octave numbers
function noteToMidi(note) {
    let noteName = note.slice(0, -1);
    let octave = note.slice(-1);
    let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let noteIndex = notes.indexOf(noteName);
    let midiNote = noteIndex + 12 * (parseInt(octave) + 1);
    return midiNote;
}