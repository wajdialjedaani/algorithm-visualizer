import { gsap } from "./gsap-core.js"
import { CSSPlugin } from "./CSSPlugin.js"
gsap.registerPlugin(CSSPlugin)

export default function() {
    const progressBar = document.querySelector("#Progress-Bar-Fill")
    return gsap.timeline({paused: true, onUpdate: progressBar!=null ? function(){progressBar.style.width = `${this.progress()*100}%`} : undefined})
}
