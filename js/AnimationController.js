export class AnimationController {
    constructor(params) {
        console.log("constructing animation controller")
        this.speeds = params?.speeds || [1, 2, 4]
        this.speed = params?.speed || this.speeds[0]
        this.animations = params?.animation || undefined
        this.playing = false
        this.currentAnim = []
    }

    //Play entire list of animations from beginning to end
    async PlayAllAnimations() {
        for(let action of this.animations) {
            this.currentAnim = [action.Animate(this.speed), action.AnimatePseudocode(this.speed)]
            await Promise.all([this.currentAnim[0].finished, this.currentAnim[1].finished])
        }
        this.currentAnim = []
    }
    //Play given animation
    async PlayAnimation(anim) {
        this.currentAnim = [anim.Animate()]
        await this.currentAnim[0].finished
        this.currentAnim = []
    }
    //Play through animations 1 at a time, returning promise for the animation completing
    *StepThroughAnimation() {
        for(let step of this.animations) {
            yield step.Animate(this.speed)
        }
    }
    //Play through pseudocode animations 1 at a time, returning promise for the animation completing
    *StepThroughPseudo() {
        for(let step of this.animations) {
            yield step.AnimatePseudocode(this.speed)
        }
    }
    //Step through both animations and pseudocode, returning array of finish promises
    //Proper use: Promise.all(gen.next())
    *StepThroughAll() {
        const animationGen = this.StepThroughAnimation()
        const pseudoGen = this.StepThroughPseudo()
        let animStep = animationGen.next()
        let pseudoStep = pseudoGen.next()
        while((!animStep.done) && (!pseudoStep.done)) {
            this.currentAnim = [animStep.value, pseudoStep.value]
            yield [animStep.value, pseudoStep.value]
            animStep = animationGen.next()
            pseudoStep = pseudoGen.next()
        }
    }
    Play() {
        for(let animation of this.currentAnim) {
            animation.play()
        }
    }
    Pause() {
        for(let animation of this.currentAnim) {
            animation.pause()
        }
    }
}
