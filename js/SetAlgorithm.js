import { FunctionMapper } from "./FunctionMapper.js"

class PageAlgorithm{
    constructor() {
        this.fm = new FunctionMapper()
        console.log(this.fm)
        this.selectedFunction = null
    }
    
    //Method usage: 
    //If called directly: func is a String.
    //If called as callback: func should be an Event object, assign func as the id of the HTML element that triggered it.
    async changeAlgo(func) {
        if(func instanceof Event) {
            func = func.target.id
        }
        //Parse JSON associated with func name
        let file = await fetch(`../Assets/HTML/${func}.json`)
        file = await file.text()
        file = JSON.parse(file)
        //Initialize values from JSON data
        console.log(file.id)
        //Modify state
        this.selectedFunction = this.fm[file.id]
        //Update page contents to match state
        document.querySelector("#Header").textContent = file.header
        DisplayAnnotation(file.desc, document.querySelector("#annotation>.card-body>p"))
        DisplayAnnotation(file.pseudo, document.querySelector("#pseudocode>.card-body>p"))
    }

}

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}

export { PageAlgorithm, DisplayAnnotation }