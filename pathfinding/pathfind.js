import { dragElement, ResizeHandler } from "../js/draggableCard.js";
import { Action } from "../js/Action.js";
import { Alert } from "../js/Alert.js"
import { CheckFirstVisit } from "../js/Cookies.js";
import anime from "../js/anime.es.js"
import { PageAlgorithm, DisplayAnnotation } from "../js/SetAlgorithm.js";
import { AnimationController } from "../js/AnimationController.js";

let columns = Math.floor((document.body.clientWidth / 30));
let rows = Math.floor((document.body.clientHeight / 30));
let playing = false
let inProgress = false
const alertContainer = document.getElementById('alertContainer')

const animationController = new AnimationController()
const pageAlgorithm = new PageAlgorithm()

//Initialize the card listeners
document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})
document.querySelectorAll(".resizer").forEach((element) => {ResizeHandler(element)})
//Initialize the dropdown menus
document.getElementById("astar").onclick = pageAlgorithm.changeAlgo.bind(pageAlgorithm)
document.getElementById("djikstra").onclick = pageAlgorithm.changeAlgo.bind(pageAlgorithm)

CheckFirstVisit('pathVisited')

document.querySelector("#AnimSpeed").addEventListener("click", function() {
    AnimationController.animationSpeed = AnimationController.speeds[(AnimationController.speeds.indexOf(AnimationController.animationSpeed)+1)%AnimationController.speeds.length]
    this.innerHTML = `${AnimationController.animationSpeed}x`
})

pageAlgorithm.changeAlgo((new URLSearchParams(window.location.search)).get("func") || "astar")

let drag = false

function cellDrag(e) {
    drag = true
    if(e.type == "mousemove") {
        this.className = "wall"
    }
    else {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY

        let element = document.elementFromPoint(x, y)
        if(element.tagName === "TD") {
            element.className = "wall"
        }
    }
}

function cleanUp(e) {
    document.querySelectorAll("td").forEach((node)=>{
        node.removeEventListener(e.type == "mouseup" ? "mousemove" : "touchmove", cellDrag)
        node.removeEventListener(e.type == "mouseup" ? "mouseup" : "touchend", cleanUp)
    })
    if(!drag) {
        console.log("clicking")
        if(this.className == "startnode") {
            this.className = "endnode"
        }
        else if(this.className == "endnode" || this.className == "wall") {
            this.className = ""
        }
        else {
            this.className = "startnode"
        }
    }
    drag = false;
}

function cellHandler(event) {
    document.querySelectorAll("td").forEach((node)=>{
        node.addEventListener(event.type == "mousedown" ? "mousemove" : "touchmove", cellDrag)
        node.addEventListener(event.type == "mousedown" ? "mouseup" : "touchend", cleanUp)
    })
}

function generateTable() {
    let table = document.querySelector("#grid-container")
    table.innerHTML = ""
  
    let cellSize = 30

    columns = Math.floor((window.innerWidth / cellSize));
    rows = Math.floor((window.innerHeight / cellSize));

    table.style.setProperty("--columns", columns);
    table.style.setProperty("--rows", rows);

    let width = window.innerWidth / columns
    let height = window.innerHeight / rows

    for(let y=0; y<rows; y++) {
        for(let x=0; x<columns; x++) {
            let cell = document.createElement("td")
            cell.id = (`${y},${x}`)
            cell.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler, {passive: false})
            //cell.addEventListener('touchstart', cellHandler)
            cell.style.setProperty("--width", width)
            cell.style.setProperty("--height", height)
            table.appendChild(cell)
        }
    }
}

window.onload = () => {
    let vh = window.innerHeight * 0.01
    document.body.style.setProperty('--vh', `${vh}px`)
    generateTable()
}

window.onresize = () => {
    let vh = window.innerHeight * 0.01
    document.body.style.setProperty('--vh', `${vh}px`)
    generateTable()
}

class Vertex {
    constructor(x, y, walkable, start=false, end=false) {
        this.x = x
        this.y = y
        this.f = 999999999
        this.g = 999999999
        this.h = 0
        this.walkable = walkable
        this.start = start
        this.end = end
    }
}

class Graph {
    constructor() {
        this.adjList = new Map()
        this.vertices = []
    }

    addVertex(vertex) {
        this.vertices.push(vertex)
        this.adjList.set(vertex, [])
    }

    addEdge(a, b) {
        this.adjList.get(a).push(b)
        this.adjList.get(b).push(a)
    }
}

async function FindPath(table)
{
    let start = undefined
    let end = undefined

    const graph = new Graph()
    table.childNodes.forEach(cell => {
            if(cell.nodeName !== "TD"){
                return
            }
            const coords = cell.id.split(",")
            let vertex
            if(cell.className == "wall") {
                vertex = new Vertex(coords[1], coords[0], false)
            }
            else {
                vertex = new Vertex(coords[1], coords[0], true, cell.className=="startnode", cell.className=='endnode')
                if (cell.className=="startnode") {
                    start = vertex
                }
                if(cell.className=="endnode") {
                    end = vertex
                }
            }
            graph.addVertex(vertex)
            for(const key of graph.adjList.keys()) {
                if (((key.x == vertex.x+1 || key.x == vertex.x-1) && key.y == vertex.y) || (key.x == vertex.x && (key.y == vertex.y+1 || key.y == vertex.y-1))) {
                    graph.addEdge(key, vertex)
                }
            }
        });
    if(typeof start == "undefined") {
        throw new Error("Please place a start node.")
    } else if (typeof end == "undefined") {
        throw new Error("Please place an end node.")
    }
    const actions = pageAlgorithm.selectedFunction(graph, start, end)
    if(typeof actions === "undefined") {
        throw new Error("No path was found.")
    }
    playing = true
    await animateResults(actions);
}

async function animateResults(actions) {
    const progress = document.querySelector("#Progress-Bar");
    for(let action of actions)
    {
        DisplayAnnotation(action.annotation, document.querySelector("#annotation>.card-body>p"))
        action.AnimatePseudocode()
        await action.Animate()
        progress.style.width = `${(actions.indexOf(action) + 1) / actions.length * 100}%`
    }
    playing = false
}

document.querySelector("#generate").addEventListener("click", () => {
    if(inProgress) {
        console.log("Animation in progress, can't play")
        return
    }
    inProgress = true
    FindPath(document.querySelector("#grid-container"))
    .then(
        function(value) {
            document.querySelector("#generate").style.display = "none"
            document.querySelector("#reset").style.display = "inline"
    })
    .catch(
        function(error) {
            Alert(alertContainer, error.message, 'danger')
    })
    .finally(
        () => {
            console.log("finally")
            inProgress = false
        }
    )
})

document.querySelector("#reset").addEventListener("click", () => {
    generateTable()
    document.querySelector("#Progress-Bar").style.width = "0%"
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#generate").style.display = "inline"
    inProgress = false;
})

document.querySelector("#PlayPause").onclick = function() {
    if(typeof AnimationController.currentAnim === "undefined" || !inProgress) {
        console.log("No animation playing")
        return
    }
    if(playing) {
        console.log("first")
        playing = false
        AnimationController.currentAnim.pause()
        this.firstChild.setAttribute("src", "../Assets/play-fill.svg")
    }
    else {
        console.log("second")
        playing = true
        AnimationController.currentAnim.play()
        this.firstChild.setAttribute("src", "../Assets/pause-fill.svg")
    }
}
