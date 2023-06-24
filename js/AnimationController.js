export class AnimationController {
    constructor(params) {
        this.speeds = params?.speeds || [1, 5, 10]
        this.speed = params?.speed || this.speeds[0]
        this.animations = params?.animation || undefined
        this.playing = false
        this.currentAnim = []
        this.progress = 0
        this.cancel = false
        this.inProgress = false
        this.shortCircuitFunc = undefined
    }

    //Play entire list of animations from beginning to end
    async PlayAllAnimations(options) {
        const progress = options?.progressBar || document.querySelector("#Progress-Bar")
        const animationGen = this.StepThroughAll()
        let currentStep = animationGen.next()
        while(!currentStep.done) {
            progress.style.width = `${this.progress}%`

            //Custom promise to handle animation interrupts
            const animationController = this
            const shortCircuit = new Promise(async (resolve, reject) => {
                this.shortCircuitFunc = reject
                //Called when cancel is pressed, rejects the promise short circuiting the promise.all
                function handler() {
                    animationController.CancelAnimation()
                    options?.cancel?.removeEventListener('click', handler)
                }
                options?.cancel?.addEventListener('click', handler, {once: true})

                //Wait for animation to finish normally. Will resolve if animation is not cancelled
                await Promise.all([currentStep.value[0].finished, currentStep.value[1].finished])
                options?.cancel?.removeEventListener('click', handler)
                resolve()
            })

            //Start animations and await their finish.
            try {
                await Promise.all([currentStep.value[0].finished, currentStep.value[1].finished, shortCircuit])
            } catch(error) {
                //Runs in the case of the animation being cancelled.
                
                this.Pause()
                this.inProgress = false
                return
            }
            currentStep = animationGen.next()
        }
        this.currentAnim = []
        this.inProgress = false
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
    *StepThroughAll(animationList) {
        for(let action of animationList || this.animations) {
            this.progress = (this.animations.indexOf(action)+1) / this.animations.length * 100
            this.currentAnim = [action.Animate(this.speed), action.AnimatePseudocode.call(action, this.speed)]
            yield this.currentAnim
        }
        this.currentAnim = []
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

    CancelAnimation() {
        this.cancel = true
        this.progress = 0
        this.shortCircuitFunc("Animation cancelled")
    }
}
