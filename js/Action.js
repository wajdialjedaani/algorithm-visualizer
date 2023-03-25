import { default as anime } from "./anime.es.js"

class Action {
    constructor(targets, line) {
        this.targets = targets
        this.line = `#pseudo${line}`
        this.speed = 1
    }

    get duration() {
        return 1000 / this.speed
    }

    get animation() {
        return {

        }
    }

    AnimatePseudocode() {
        return anime({
            targets: this.line,
            backgroundColor: [{value: "#000000", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "backgroundColor"), duration: 1}],
            color: [{value: "#FFFFFF", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "color"), duration: 1}]
        }).finished
    }

    async Animate(speed) {
        this.speed = speed || this.speed
        return anime(this.animation).finished
    }
}

export { Action }