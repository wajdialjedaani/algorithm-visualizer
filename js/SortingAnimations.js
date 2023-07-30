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

    get animation() {
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

    Animate(speed) {
        this.speed = speed || this.speed
        let anims = [anime(this.animation[0]), anime(this.animation[1])]
        return {
            animations: anims,
            finished: Promise.all([anims[0].finished, anims[1].finished]),
            pause: function() {
                this.animations.forEach((animation) => {animation.pause()})
            },
            play: function() {
                this.animations.forEach((animation) => {animation.play()})
            }
        }
    }

    static AddToTimeline(tl, params) {
        if(params?.target?.length < 2) return

        let selected1 = document.querySelector(`${params.target[0].id}`)
        let selected2 = document.querySelector(`${params.target[1].id}`)
        //Convenience vars in order to not have to retrieve the value and convert to number several times
        let [originalPos1, originalPos2] = [Number(selected1.style.getPropertyValue('--position')), Number(selected2.style.getPropertyValue('--position'))]
        //Used to track the translation at the start of each tween
        let startingPos1, startingPos2

        const innerTL = gsap.timeline()
        innerTL.to(selected1, {
            keyframes: [
                {x: ()=>originalPos2+Number(selected2.style.getPropertyValue('--translation'))-originalPos1, duration: Swap.duration},
            ],
            ease: "expo.out", 
            onStart: ()=>{startingPos1 = originalPos1 + Number(selected1.style.getPropertyValue('--translation'))},
            onComplete: ()=>{selected1.style.setProperty('--translation', startingPos2 - selected1.style.getPropertyValue('--position'))}
        })
        innerTL.to(selected2, {
            keyframes: [
                {x: ()=>originalPos1+Number(selected1.style.getPropertyValue('--translation'))-originalPos2, duration: Swap.duration},
            ],
            ease: "expo.out", 
            onStart: ()=>{startingPos2 = originalPos2 + Number(selected2.style.getPropertyValue('--translation'))},
            onComplete: ()=>{selected2.style.setProperty('--translation', startingPos1 - selected2.style.getPropertyValue('--position'))}
        }, "<")
        return tl.add(innerTL)
    }

}

export class Comparison extends Action {
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

    get animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: [{value: "#228C22", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${element.id}`), "backgroundColor"), duration: 1}],
            duration: this.duration,
        }})
        return animations
    }

    Animate(speed) {
        this.speed = speed || this.speed
        const animList = []
        for(let anim of this.animation) {
            animList.push(anime(anim))
        }
        return {
            animations: animList,
            finished: Promise.all(animList.map((element) => {
                return element.finished
            })),
            pause: function() {
                this.animations.forEach((animation) => {animation.pause()})
            },
            play: function() {
                this.animations.forEach((animation) => {animation.play()})
            }
        }
    }

    AddToTimeline(tl) {
        this.animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
        //tl.add(animations[0])
        //.add(animations[1], `-=${this.duration}`)
    }

}

export class Sorted extends Action {
    constructor(targets, line=3) {
        super(targets, line)
        Sorted.duration = 1
        this.speed = 1
    }

    get duration() {
        return Sorted.duration / this.speed
    }

    get animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            backgroundColor: "#FFA500",
            duration: this.duration,
        }
    }

    Animate(speed) {
        return super.Animate.call(this, speed)
    }

    AddToTimeline(tl) {
        tl.add(this.animation)
    }
}

export class PivotToggle extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        PivotToggle.duration = 500
        this.speed = 1
    }

    get duration() {
        return PivotToggle.duration / this.speed
    }

    get animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            duration: this.duration,
            backgroundColor: anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#A020F0" : "#6290C8"
            //,begin: console.log(anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor"))
        }
    }

    Animate(speed) {
        return super.Animate.call(this, speed)
    }

    AddToTimeline(tl) {
        tl.add(this.animation)
    }
}

export class Subarray extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        Subarray.duration = 0
        this.speed = 1
    }

    get duration() {
        return Subarray.duration / this.speed
    }

    get animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: anime.get(document.querySelector(`${element.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#f68f58" : "#6290C8",
            duration: this.duration,
        }})
        return animations
    }

    Animate(speed) {
        this.speed = speed || this.speed
        const animList = []
        for(let anim of this.animation) {
            animList.push(anime(anim))
        }
        return {
            animations: animList,
            finished: Promise.all(animList.map((element) => {
                return element.finished
            })),
            pause: function() {
                this.animations.forEach((animation) => {animation.pause()})
            },
            play: function() {
                this.animations.forEach((animation) => {animation.play()})
            }
        }
    }

    AddToTimeline(tl) {
        this.animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
    }

}

/**
 * Gets computed translate values
 * @param {HTMLElement} element
 * @returns {Object}
 */
function getTranslateValues(element) {
    const style = window.getComputedStyle(element)
    const matrix =
      style['transform'] || style.webkitTransform || style.mozTransform
  
    // No transform property. Simply return 0 values.
    if (matrix === 'none' || typeof matrix === 'undefined') {
      return {
        x: 0,
        y: 0,
        z: 0,
      }
    }
  
    // Can either be 2d or 3d transform
    const matrixType = matrix.includes('3d') ? '3d' : '2d'
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
  
    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === '2d') {
      return {
        x: Number(matrixValues[4]),
        y: Number(matrixValues[5]),
        z: 0,
      }
    }
  
    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === '3d') {
      return {
        x: Number(matrixValues[12]),
        y: Number(matrixValues[13]),
        z: Number(matrixValues[14]),
      }
    }
  }
  