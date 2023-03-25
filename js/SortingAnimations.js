import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import anime from "./anime.es.js"

class Swap extends Action {
    constructor(targets, line=2) {
        super(targets, line)
        Swap.duration = 1000
    }

    get annotation() {
        return `${this.targets[0].value < this.targets[1].value ? this.targets[0].value : this.targets[1].value} is less than 
        ${this.targets[0].value > this.targets[1].value ? this.targets[0].value : this.targets[1].value}, so we will swap them.`
    }

    get duration() {
        return Swap.duration / AnimationController.animationSpeed
    }

    get Animation() {
        let selected1 = document.querySelector(`${this.targets[0].id}`)
        let selected2 = document.querySelector(`${this.targets[1].id}`)
        let currentPos1 = Number(selected1.style.getPropertyValue('--position')) + Number(selected1.style.getPropertyValue('--translation'))
        let currentPos2 = Number(selected2.style.getPropertyValue('--position')) + Number(selected2.style.getPropertyValue('--translation'))
        let duration = this.duration
        return [{
            targets: selected1,
            translateX: Number(selected1.style.getPropertyValue('--translation')) + currentPos2 - currentPos1,
            //backgroundColor: [
            //    {value: "#FFFFFF", duration: duration-1},
            //    {value: anime.get(selected1, "backgroundColor"), duration: 1}
            //],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function() {selected1.style.setProperty('--translation', currentPos2 - selected1.style.getPropertyValue('--position'))}
        },
        {
            targets: selected2,
            translateX: Number(selected2.style.getPropertyValue('--translation')) + currentPos1 - currentPos2,
            //backgroundColor: [
            //    {value: "#000000", duration: duration-1},
            //    {value: anime.get(selected2, "backgroundColor"), duration: 1}
            //],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function() {selected2.style.setProperty('--translation', currentPos1 - selected2.style.getPropertyValue('--position'))}
        }]
    }

    async Animate() {
        let animations = this.Animation
        for(let i=0; i<animations.length; i++) {
            console.log("animating")
            await anime(animations[i]).finished
        }
    }

    AddToTimeline(tl) {
        let animations = this.Animation
        console.log("timeline")
        tl.add(animations[0])
        .add(animations[1], `-=${this.duration}`)
    }

}

class Comparison extends Action {
    constructor (targets, line=1) {
        super(targets.filter(obj => typeof obj !== "undefined"), line)
        Comparison.duration = 1000
    }

    get duration() {
        return Comparison.duration / AnimationController.animationSpeed
    }

    get annotation() {
        if(this.targets.length == 1) {
            return `The element reached the first spot - it is the smallest in the list.`
        }
        return `Checking if ${this.targets[1].value} is less than ${this.targets[0].value}. If it is, then we will swap them.`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: [{value: "#228C22", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${element.id}`), "backgroundColor"), duration: 1}],
            duration: this.duration,
        }})
        return animations
    }

    async Animate() {

    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
        //tl.add(animations[0])
        //.add(animations[1], `-=${this.duration}`)
    }

}

class Sorted extends Action {
    constructor(targets, line=3) {
        super(targets, line)
        Sorted.duration = 1
    }

    get duration() {
        return Sorted.duration / AnimationController.animationSpeed
    }

    get Animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            backgroundColor: "#FFA500",
            duration: this.duration,
        }
    }

    AddToTimeline(tl) {
        tl.add(this.Animation)
    }
}

class PivotToggle extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        PivotToggle.duration = 500
    }

    get duration() {
        return PivotToggle.duration / AnimationController.animationSpeed
    }

    get Animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            duration: this.duration,
            backgroundColor: anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#A020F0" : "#6290C8",
            begin: console.log(anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor"))
        }
    }

    AddToTimeline(tl) {
        tl.add(this.Animation)
    }
}

class Subarray extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        Subarray.duration = 0
    }

    get duration() {
        return Subarray.duration / AnimationController.animationSpeed
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: anime.get(document.querySelector(`${element.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#f68f58" : "#6290C8",
            duration: this.duration,
        }})
        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
    }

}

export { Swap, Comparison, Sorted, PivotToggle, Subarray }