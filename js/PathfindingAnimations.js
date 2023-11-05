import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import anime from "./anime.es.js"
import { gsap } from "./gsap-core.js"

export class FinalPath extends Action {
    static duration = 5
    constructor(targets, line=2) {
        super(targets, line)
        this.speed = 1
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
        this.speed = 1
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

    // static AddToTimeline(timeline, params) {
    //     return timeline.to(params.target, {
    //         backgroundColor: "#00FF00A0",
    //         duration: SkippedNode.duration,
    //     })
    // }

    //This ATT method is unique in requiring a label parameter to determine where to position the jump node.
    static AddToTimeline(timeline, params) {
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