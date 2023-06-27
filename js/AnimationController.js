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
        this.currentAnim = []
    }
    
    //Resume the current animation.
    Play() {
        this.timeline.resume()
    }

    //Pause the current animation.
    Pause() {
        this.timeline.pause()
    }

    PlayTimeline() {
        this.timeline.play().timeScale(this.speed)
        return this.timeline
    }

    SetSpeed(speed) {
        this.speed = speed
        this.timeline.timeScale(speed)
    }

    //Called when the timeline is stopped by the cancel button to handle cleanup.
    CancelTimeline() {
        this.timeline.kill()
        this.timeline = undefined
    }

    //Interrupts the current timeline flow and resumes it at another point
    async SeekAnimation(percentage) {
        this.timeline.progress(percentage)
    }

    IsPlaying() {
        return this.timeline.isActive()
    }

    IsInProgress() {
        if(this.timeline?.progress() > 0 && this.timeline?.progress() < 1) {
            return true
        } else {
            return false
        }
    }
}
