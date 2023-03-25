import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import anime from "./anime.es.js"

class Comparison extends Action {
    constructor(targets, line = 1) {
        super(targets.filter(obj => typeof obj !== "undefined"), line)
        Comparison.duration = 999  // duration of comparison at 1x speed
    }

    get duration() {    // duration of comparison based on speed
        return Comparison.duration / AnimationController.animationSpeed
    }

    get annotation() {
        if(this.targets.length == 1) {
            return `This is the only element in the list`
        }
        return `Checking if ${this.targets[0].value} is equal to ${this.targets[1].value}`
    }

    get Animation() {
        this.target = [this.targets[1]] // get singleton in array form
        const animations = this.target.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#84A98C",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class Found extends Action {
    constructor(targets, line = 2) {
        super(targets, line)
        Found.duration = 1
    }

    get annotation() {
        return `${this.targets[0].value} has been found.`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#F26419", 
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateSingle extends Action {
    constructor(targets, goal, line = 3) {
        super(targets, line)
        this.goal = goal
        EliminateSingle.duration = 1
    }

    get annotation() {
        return `${this.goal.value} does not equal ${this.targets[0].value}`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateLeft extends Action {
    constructor(targets, goal, line = 4) {
        super(targets, line)
        this.goal = goal
        EliminateLeft.duration = 1
    }

    get annotation() {
        console.log(this.targets)
        return `${this.goal.value} > ${this.targets[this.targets.length - 1].value}<br>
        ${this.goal.value} is in the right side.<br>
        Elimitate the left side.<br>`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateRight extends Action {
    constructor(targets, goal, line = 5) {
        super(targets, line)
        this.goal = goal
        EliminateRight.duration = 1
    }

    get annotation() {
        return `${this.goal.value} < ${this.targets[this.targets.length - 1].value}<br>
        ${this.goal.value} is in the left side.<br>
        Elimitate the right side.<br>`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

export { Comparison, Found, EliminateSingle, EliminateLeft, EliminateRight }