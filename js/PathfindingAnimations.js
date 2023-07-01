import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import anime from "./anime.es.js"

export class FinalPath extends Action {
    static duration = 5
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

    static AddToTimeline(timeline, params) {
        return timeline.to(params.target, {
            keyframes: [
                {backgroundColor: "#FEDC97", duration: FinalPath.duration},
            ],
            stagger: {
                amount: FinalPath.duration,
            },
        })
    }
}

export class SearchedPath extends Action {
    static duration = .6
    constructor(targets, childAnimation, line=1) {
        super(targets, line)
        this.speed = 1
        this.childAnimation = childAnimation
    }

    get duration() {
        return (SearchedPath.duration / this.speed) || SearchedPath.duration
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

    static AddToTimeline(timeline, params) {
        return timeline.to(params.target, {
            keyframes: [
                {backgroundColor: "#F26419", duration: 0},
                {backgroundColor: "#28666E", delay: SearchedPath.duration - 0.01, duration: 0.01},
            ],
        })
    }
}

export class NewChildren extends Action {
    static duration = 0
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

    static AddToTimeline(timeline, params) {
        return timeline.to(params.target, {
            backgroundColor: "#696464",
            duration: 0,
        })
    }
}

export class SkippedNode extends Action {
    static duration = 0.02
    static AddToTimeline(timeline, params) {
        return timeline.to(params.target, {
            backgroundColor: "#808080F0",
            duration: SkippedNode.duration,
        })
    }
}

export class JumpNode extends Action {
    static duration = 1
    static AddToTimeline(timeline, params) {
        return timeline.to(params.target, {
            backgroundColor: "#00FF00A0",
            duration: SkippedNode.duration,
        })
    }
    static InsertToTimeline(timeline, params) {
        const tween = gsap.to(params.target, {
            keyframes: [
                {backgroundColor: "#F26419", duration: 0},
                {backgroundColor: "#F26419", duration: JumpNode.duration},
            ], 
        })
        timeline.shiftChildren(JumpNode.duration, true, params.label)
        return timeline.add(tween, params.label)
    }
}