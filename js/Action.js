class Action {
    constructor(targets, line) {
        this.targets = targets
        this.line = `#pseudo${line}`
    }

    get duration() {
        return 1000
    }

    AnimatePseudocode() {
        anime({
            targets: this.line,
            backgroundColor: [{value: "#000000", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "backgroundColor"), duration: 1}],
            color: [{value: "#FFFFFF", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "color"), duration: 1}]
        })
    }
}

export { Action }