export class AnimationController {
    constructor(params) {
        this.speeds = params?.speeds || [1, 2, 4]
        this.speed = params?.speed || this.speeds[0]
        this.animations = params?.animation || undefined
        this.playing = false
        this.currentAnim = undefined
    }

    //Play entire list of animations from beginning to end
    async PlayAllAnimations() {
        for(let action of this.animations) {
            await Promise.all([action.Animate(this.speed).finished, action.AnimatePseudocode(this.speed).finished])
        }
    }
    //Play given animation
    async PlayAnimation(anim) {
        await anim.Animate().finished
    }
    //Play through animations 1 at a time, returning promise for the animation completing
    *StepThroughAnimation() {
        for(let step of this.animations) {
            yield step.Animate(this.speed)
        }
        //return
    }
    //Play through pseudocode animations 1 at a time, returning promise for the animation completing
    *StepThroughPseudo() {
        for(let step of this.animations) {
            yield step.AnimatePseudocode(this.speed)
        }
        //return
    }
    //Step through both animations and pseudocode, returning array of finish promises
    //Proper use: Promise.all(gen.next())
    *StepThroughAll() {
        const animationGen = this.StepThroughAnimation()
        const pseudoGen = this.StepThroughPseudo()
        let animStep = animationGen.next()
        let pseudoStep = pseudoGen.next()
        while((!animStep.done) && (!pseudoStep.done)) {
            this.currentAnim = new Animation([animStep.value, pseudoStep.value])
            yield [animStep.value, pseudoStep.value]
            animStep = animationGen.next()
            pseudoStep = pseudoGen.next()
        }
    }
    Play() {
        this.currentAnim.Play()
    }
    Pause() {
        this.currentAnim.Pause()
    }
}

class Animation {
    contructor(arr) {
        this.animations = arr
    }
    Pause() {
        for(let animation in this.animations) {
            animation.pause()
        }
    }
    Play() {
        for(let animation in this.animations) {
            animation.play()
        }
    }
}