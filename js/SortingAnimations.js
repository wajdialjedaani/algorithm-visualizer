import { Action } from "./Action.js"
import { AnimationController } from "./AnimationController.js"
import Timeline from "./Timeline.js"
import anime from "./anime.es.js"
import { gsap } from "./gsap-core.js"

export class Swap extends Action {
    static duration = 1
    constructor(targets, line=2) {
        super(targets, line)
        Swap.duration = 1000
        this.speed = 1
    }

    get annotation() {
        return `${this.targets[0].value < this.targets[1].value ? this.targets[0].value : this.targets[1].value} is less than 
        ${this.targets[0].value > this.targets[1].value ? this.targets[0].value : this.targets[1].value}, so we will swap them.`
    }

    get duration() {
        return Swap.duration / this.speed
    }

    static AddToTimeline(tl, params) {
        if(params?.target?.length < 2) return

        let target1 = document.querySelector(`${params.target[0]}`)
        let target2 = document.querySelector(`${params.target[1]}`)
        //Convenience vars in order to not have to retrieve the value and convert to number several times
        let [originalPos1, originalPos2] = [Number(target1.style.getPropertyValue('--position')), Number(target2.style.getPropertyValue('--position'))]
        //Used to track the translation at the start of each tween
        let startingPos1, startingPos2

        const innerTL = gsap.timeline()
        innerTL.to(target1, {
            keyframes: [
                {x: ()=>originalPos2+Number(target2.style.getPropertyValue('--translation'))-originalPos1, duration: Swap.duration},
            ],
            ease: "expo.out", 
            //Update the closure var so that the translation can be properly tracked
            onStart: ()=>{startingPos1 = originalPos1 + Number(target1.style.getPropertyValue('--translation'))},
            //Track the movement of each bar for later swaps
            onComplete: ()=>{target1.style.setProperty('--translation', startingPos2 - target1.style.getPropertyValue('--position'))}
        })
        innerTL.to(target2, {
            keyframes: [
                {x: ()=>originalPos1+Number(target1.style.getPropertyValue('--translation'))-originalPos2, duration: Swap.duration},
            ],
            ease: "expo.out", 
            onStart: ()=>{startingPos2 = originalPos2 + Number(target2.style.getPropertyValue('--translation'))},
            onComplete: ()=>{target2.style.setProperty('--translation', startingPos1 - target2.style.getPropertyValue('--position'))}
        }, "<")
        return tl.add(innerTL)
    }

}

export class Comparison extends Action {
    static duration = 0.5
    constructor (targets, line=1) {
        super(targets.filter(obj => typeof obj !== "undefined"), line)
        Comparison.duration = 1000
        this.speed = 1
    }

    get duration() {
        return Comparison.duration / this.speed
    }

    get annotation() {
        if(this.targets.length == 1) {
            return `The element reached the first spot - it is the smallest in the list.`
        }
        return `Checking if ${this.targets[1].value} is less than ${this.targets[0].value}. If it is, then we will swap them.`
    }

    static AddToTimeline(tl, params) {
        params.target = params.target.filter(x => x !== undefined)
        .map((e)=>document.querySelector(e).firstElementChild) //This targets the visual bar itself and not the entire container
        return tl.to(params.target, {
            backgroundColor: "#228C22",
            duration: Comparison.duration,
            yoyo: true,
            repeat: 1
        })
    }

}

export class Sorted extends Action {
    static duration = 0
    constructor(targets, line=3) {
        super(targets, line)
        Sorted.duration = 1
        this.speed = 1
    }

    get duration() {
        return Sorted.duration / this.speed
    }

    static AddToTimeline(tl, params) {
        params.target = params.target.map((e)=>document.querySelector(e).firstElementChild)
        return tl.set(params.target, {
            backgroundColor: "#FFA500"
        })
    }
}

export class PivotToggle extends Action {
    static duration = 0
    constructor(targets, line=1) {
        super(targets, line)
        PivotToggle.duration = 500
        this.speed = 1
    }

    get duration() {
        return PivotToggle.duration / this.speed
    }

    static AddToTimeline(tl, params) {
        const targetElement = document.querySelector(params.target).firstElementChild

        return tl.to(targetElement, {
            onStart: ()=>{console.log(targetElement.style.backgroundColor)},
            onComplete:()=>{console.log("testing")} ,
            backgroundColor: ()=>targetElement.style.backgroundColor !== "rgb(160, 32, 240)" ? "#A020F0" : "#6290C8",
            duration: PivotToggle.duration
        })
    }
}

export class Subarray extends Action {
    static duration = 0
    constructor(targets, line=1) {
        super(targets, line)
        Subarray.duration = 0
        this.speed = 1
    }

    get duration() {
        return Subarray.duration / this.speed
    }

    static AddToTimeline(tl, params) {
        params.target = params.target.map((e)=>document.querySelector(e).firstElementChild)

        return tl.to(params.target, {
            backgroundColor: (index, target)=>{
                return target.style.backgroundColor !== "rgb(246, 143, 88)" ? "#f68f58" : "#6290C8"
            },
            duration: 0,
        })
    }

}
