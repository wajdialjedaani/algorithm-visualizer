import { default as anime } from "./anime.es.js"

class Action {
    constructor(targets, line) {
        this.targets = targets
        this.line = `#pseudo${line}`
        this.speed = 1
    }

    static InsertHighlight(timeline, highlight) {
        if(highlight.active === undefined || highlight.deactive === undefined) {
            console.log("Error creating highlight animation")
            return
        }


    }

    static InsertAnnotation(timeline, annotation) {
        if(annotation.active === undefined || annotation.deactive === undefined) {
            console.log("Error creating annotation animation")
            return
        }

        
    }

    AnimatePseudocode(speed) {
        this.speed = speed || this.speed
        return anime({
            targets: this.line,
            backgroundColor: [{value: "#000000", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "backgroundColor"), duration: 1}],
            color: [{value: "#FFFFFF", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "color"), duration: 1}]
        })
    }
}

export { Action }