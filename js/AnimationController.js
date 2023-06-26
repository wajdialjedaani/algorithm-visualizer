import { CreateShortCircuit } from "./ShortCircuitPromise.js"
import { ClearAnimation } from "../pathfinding/pathfind.js"

export class AnimationController {
    #progressBar
    #cancelButton
    #shortCircuitFunc

    constructor(params) {
        this.speeds = params?.speeds || [1, 5, 10]
        this.speed = params?.speed || this.speeds[0]
        this.timeline = params?.timeline || undefined
        this.#progressBar = params?.progressBar || document.querySelector("#Progress-Bar-Fill")
        this.#cancelButton = params?.cancelButton || document.querySelector("#cancel")
        this.playing = false
        this.currentAnim = []
        this.progress = 0
        this.inProgress = false
    }

    //Play entire list of animations from beginning to end
    async PlayTimeline(options) {
        this.playing = true
        this.inProgress = true

        //Create generator and step through the timeline
        const animationGen = this.#StepThroughAll(options?.timeline || this.timeline)
        let currentStep = animationGen.next()
        while(!currentStep.done) {

            this.#progressBar.style.width = `${this.progress}%`

            //Custom promise to handle animation interrupts
            const [shortCircuitPromise, shortCircuitFunc] = CreateShortCircuit({rejectElement: this.#cancelButton,
                rejectCallback: this.CancelTimeline.bind(this),
                otherPromises: [currentStep.value[0].finished, currentStep.value[1].finished],
                rejectionMessage: "Cancelled"})
            this.#shortCircuitFunc = shortCircuitFunc

            //Start each action in the animation and await their finish.
            try {
                await Promise.all([currentStep.value[0].finished, currentStep.value[1].finished, shortCircuitPromise])
            } catch(message) {
                //Runs in the case of the animation being cancelled.
                return message
            }
            currentStep = animationGen.next()
        }
        this.currentAnim = []
        this.inProgress = false
        this.playing = false
    }
    //Play given animation
    async #PlayAnimation(anim) {
        this.currentAnim = [anim.Animate()]
        await this.currentAnim[0].finished
        this.currentAnim = []
    }

    //Play through animations 1 at a time, returning promise for the animation completing
    *#StepThroughAnimation() {
        for(let step of this.timeline) {
            yield step.Animate(this.speed)
        }
    }
    //Play through pseudocode animations 1 at a time, returning promise for the animation completing
    *#StepThroughPseudo() {
        for(let step of this.timeline) {
            yield step.AnimatePseudocode(this.speed)
        }
    }
    //Step through timeline, each step yielding an array of the actions in the next animation
    *#StepThroughAll(timeline) {
        for(let anim of timeline) {
            this.progress = (this.timeline.indexOf(anim)+1) / this.timeline.length * 100
            this.currentAnim = [anim.Animate(this.speed), anim.AnimatePseudocode.call(anim, this.speed)]
            yield this.currentAnim
        }
    }
    
    //Resume the current animation.
    Play() {
        for(let action of this.currentAnim) {
            action.play()
        }
    }

    //Pause the current animation.
    Pause() {
        for(let action of this.currentAnim) {
            action.pause()
        }
    }

    //Called when the timeline is stopped by the cancel button to handle cleanup.
    CancelTimeline() {
        this.progress = 0
        this.Pause()
        this.inProgress = false
        this.playing = false
    }

    //Interrupts the current timeline flow and resumes it at another point
    async SeekAnimation(percentage) {
        let startPosition = Math.floor((this.timeline.length-1) * percentage / 100)
        const newTimeline = this.timeline.slice(startPosition, this.timeline.length)
        this.#shortCircuitFunc("Seeking")
        this.Pause()
        ClearAnimation()
        for(let i=0; i<startPosition; i++) {
            const animation = this.timeline[i].Animate()
            animation.seek(animation.duration)
        }

        return await this.PlayTimeline({timeline: newTimeline})
    }
}
