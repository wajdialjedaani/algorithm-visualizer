import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import anime from "./anime.es.js"

class FinalPath extends Action {
    constructor(targets, line=2) {
        super(targets, line)
        FinalPath.duration = 50 * targets.length
        this.speed = 1
    }

    get duration() {
        return FinalPath.duration / this.speed
    }

    get annotation() {
        return `The algorithm found the end. To find the path, it backtracks to the parent of the end node, then continues backtracking until the start.`
    }

    get animation() {
        return {
            targets: this.targets,
            delay: anime.stagger(50/this.speed),
            duration: this.duration,
            backgroundColor: '#FEDC97',
        }
    }

    Animate(speed) {
        return super.Animate.call(this, speed)
    }
}

class SearchedPath extends Action {
    constructor(targets, childAnimation, line=1) {
        super(targets, line)
        SearchedPath.duration = 600
        this.speed = 1
        this.childAnimation = childAnimation
    }

    get duration() {
        return SearchedPath.duration / this.speed
    }

    get annotation() {
        return `This was the best available path, but it did not reach the end. The algorithm will add any new neighbors and pick the next best path.`
    }

    get animation() {
        let childAnimation = this.childAnimation
        return {
            targets: this.targets,
            backgroundColor: [
                { value: "#F26419", duration: 0 },
                { value: "#28666E", delay: this.duration-0.01, duration: 0.01 }, //Small wait, then zap the whole line purple
            ],
            complete: function() {childAnimation?.Animate(this.speed)}
        }
    }

    Animate(speed) {
        return super.Animate.call(this, speed)
    }
}

class NewChildren extends Action {
    constructor(targets, line=3) {
        super(targets, line)
        NewChildren.duration = 1
        this.speed = 1
    }

    get duration() {
        return NewChildren.duration / this.speed
    }

    get annotation() {
        return `Adding any new neighbors to the list of potential paths.`
    }

    get animation() {
        return {
            targets: this.targets,
            duration: this.duration,
            backgroundColor: "#696464"
        }
    }

    Animate(speed) {
        return super.Animate.call(this, speed)
    }
}

export { FinalPath, SearchedPath, NewChildren }