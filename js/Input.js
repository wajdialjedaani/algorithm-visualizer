//Singleton class used to manage the input values along with their retreiving and
//updating. All UI events should use this class's methods to interact with the array.
export class Input {
    static s_instance = undefined;
    static s_inputElement = document.querySelector("#input");
    constructor() {
        this.input = []
    }

    static GetInstance() {
        if (this.s_instance === undefined) {
            this.s_instance = new Input;
        }
        return this.s_instance;
    }

    UpdateInputBox() {
        Input.s_inputElement.value = this.input.map(e=>e.value)
    }

    GetInput() {
        //Remove this eventually
        let max = window.innerWidth < 768 ? 15 : 25
        max = window.innerWidth < 300 ? 10 : max

        return this.input.length > max ? this.input.slice(0, max) : this.input
    }

    AddNumber(num) {
        const element = {
            value: num,
            id: `#arrBar${i}`
        }
        this.input.push(element)
        this.UpdateInputBox()
    }

    RemoveNumber(num) {
        const index = this.input.findIndex((e)=>e.value === num)
        this.input = this.input.splice(index, 1)
        this.UpdateInputBox()
    }

    SetInput(arr) {
        this.input = arr.map((val, i) => {
            if(Number.isNaN(Number(val))) {
                throw new Error("Something went wrong with the input - check to make sure you put all necessary commas and only inserted numbers.")
            }
            return {
            value: Number(val),
            id: `#arrBar${i}`
            }})
        this.UpdateInputBox()
    }

}
