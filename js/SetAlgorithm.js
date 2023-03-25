import { FunctionMapper } from "./FunctionMapper.js"

let fm = new FunctionMapper()

class PageAlgorithm{
    constructor() {
    }
    static selectedFunction = null
    static async changeAlgo(func) {
        if(typeof func !== "string" && typeof this !== "undefined") {
            func = this.id
        }
        //Parse JSON associated with func name
        let file = await fetch(`../Assets/HTML/${func}.json`)
        file = await file.text()
        file = JSON.parse(file)
        //Initialize values from JSON data
        console.log(file.id)
        PageAlgorithm.selectedFunction = fm[file.id]
        document.querySelector("#Header").textContent = file.header
    
        DisplayAnnotation(file.desc, document.querySelector("#annotation>.card-body>p"))
        DisplayAnnotation(file.pseudo, document.querySelector("#pseudocode>.card-body>p"))
    }

}

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}

export { PageAlgorithm, DisplayAnnotation }