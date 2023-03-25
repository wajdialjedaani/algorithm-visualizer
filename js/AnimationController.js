export class AnimationController {
    constructor(params) {
        this.speeds = params?.speeds || [1, 2, 4]
        this.speed = params?.speed || this.speeds[0]
        this.animation = params?.animation || undefined
        this.playing = false
    }
    static animationSpeed = 1
    static speeds = [1, 2, 4]
    static animation = undefined

    //Play entire list of animations from beginning to end
    async PlayAllAnimations() {
        for(let action of this.animation) {
            await Promise.all([action.Animate(), action.AnimatePseudocode()])
        }
    }
    //Play given animation
    async PlayAnimation(anim) {
        await anim.Animate()
    }
    //Play through animations 1 at a time, returning promise for the animation completing
    *StepThroughAnimation() {
        for(let step of this.animation) {
            yield step.Animate()
        }
        return
    }
    //Play through pseudocode animations 1 at a time, returning promise for the animation completing
    *StepThroughPseudo() {
        for(let step of this.animation) {
            yield step.AnimatePseudocode()
        }
        return
    }
    //Step through both animations and pseudocode, returning array of finish promises
    //Proper use: Promise.all(gen.next())
    *StepThroughAll() {
        const animationGen = this.StepThroughAnimation()
        const pseudoGen = this.StepThroughPseudo()
        let animStep = animationGen.next()
        let pseudoStep = pseudoGen.next()
        while((!animStep.done) && (!pseudoStep.done)) {
            yield [animStep.value, pseudoStep.value]
            animStep = animationGen.next()
            pseudoStep = pseudoGen.next()
        }
    }
}