"use strict";

import { PathfindingCookies } from "./Cookies.js";

/*
Holds the TD elements displayed in the canvas.
*/
class Table {
    constructor() {
        this.elementTable = []
        this.cellSize = PathfindingCookies.GetCellSize()
    }

    //generates a table based on the specs of the page
    CreateTable() {
        //Clear existing table data
        this.elementTable = []

        //Calculate new table dimensions
        let columns = Math.floor((window.innerWidth / this.cellSize));
        let rows = Math.floor((window.innerHeight / this.cellSize));

        let width = window.innerWidth / columns
        let height = window.innerHeight / rows

        for(let y=0; y<rows; y++) {
            //Create new row
            this.elementTable.push([])
            for(let x=0; x<columns; x++) {
                //Fill in the newly created row
                let node = document.createElement("td")
                node.id = (`${y},${x}`)
                node.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler.bind(this), {passive: false})
                node.style.setProperty("--width", width)
                node.style.setProperty("--height", height)
                this.elementTable[y].push(node)
            }
        }
        this.DisplayTable()
    }

    //Modify the current elementTable when changes are made to the page
    UpdateTable() {
        let newColumns = Math.floor((window.innerWidth / this.cellSize));
        let newRows = Math.floor((window.innerHeight / this.cellSize));

        let width = window.innerWidth / newColumns
        let height = window.innerHeight / newRows
        //Adjust rows to match change in page dimensions
        //Remove excess rows
        for(let rowDiff = newRows - this.elementTable.length; rowDiff < 0; rowDiff++) {
            this.elementTable.pop()
        }
        //Add new rows
        for(let rowDiff = newRows - this.elementTable.length; rowDiff > 0; rowDiff--) {
            //Create a new row filled with default nodes
            let x = 0 //Used to track coordinates when filling new row
            this.elementTable.push(Array.from(Array(newColumns), ()=>{
                let node = document.createElement("td")
                node.id = (`${this.elementTable.length},${x}`)
                x = x+1
                node.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler.bind(this), {passive: false})
                node.style.setProperty("--width", width)
                node.style.setProperty("--height", height)
                return node
            }))
        }
        //Remove excess columns
        for(let columnDiff = newColumns - this.elementTable[0].length; columnDiff < 0; columnDiff++) {
            //Pop 1 element off each row
            for(let row of this.elementTable) {
                row.pop()
            }
        }
        //Add new columns
        for(let row of this.elementTable) {
            //Iterate through each row, add 1 element each time
            let y=0
            for(let columnDiff = newColumns - row.length; columnDiff > 0; columnDiff--) {
                row.push((()=>{
                    let node = document.createElement("td")
                    node.id = (`${y},${row.length}`)
                    y = y+1
                    node.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler, {passive: false})
                    node.style.setProperty("--width", width)
                    node.style.setProperty("--height", height)
                    return node
                }).call(this))
            }
        }

        console.log(`Expected columns: ${newColumns}
Actual columns: ${this.elementTable[0].length}

Expected rows: ${newRows}
Actual rows: ${this.elementTable.length}
`)
        this.DisplayTable()
    }

    //Takes in a graph and makes it this Table's elementTable, displaying it
    NewTable(graph) {
        this.elementTable = []
        let columns = Math.max(...graph.vertices.map((element)=>{return element.x})) + 1
        let rows = Math.max(...graph.vertices.map((element)=>{return element.y})) + 1

        let width = window.innerWidth / columns
        let height = window.innerHeight / rows

        graph.vertices.sort((a, b)=>{return a.y - b.y || a.x - b.x})
        for(let y=0; y<rows; y++) {
            this.elementTable.push([])
            for(let x=0; x<columns; x++) {
                let node = document.createElement("td")
                node.id = `${y},${x}`
                node.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler.bind(this), {passive: false})
                node.style.setProperty("--width", width)
                node.style.setProperty("--height", height)
                graph.vertices[y*columns+x].walkable ? 0 : node.className="wall"
                graph.vertices[y*columns+x].start ? node.className="startnode" : 0
                graph.vertices[y*columns+x].end ? node.className="endnode" : 0
                this.elementTable[y].push(node)
            }
        }
        this.DisplayTable()
    }

    DisplayTable() {
        //Clear existing table
        let displayArea = document.querySelector("#grid-container")
        displayArea.innerHTML = ""

        //Set new table dimensions
        displayArea.style.setProperty("--columns", this.elementTable[0].length);
        displayArea.style.setProperty("--rows", this.elementTable.length);

        //Populate page with data held in elementTable
        for(let y=0; y<this.elementTable.length; y++) {
            for(let x=0; x<this.elementTable[y].length; x++) {
                displayArea.appendChild(this.elementTable[y][x])
            }
        }
    }
    //Grabs a Element from the elementTable, modifies it, and updates the DOM
    EditNode(y, x, func) {
        let node = this.elementTable[y][x]
        func(node)
        //document.getElementById(`${y},${x}`).replaceWith(node)
    }

    UpdateCellSize() {
        this.cellSize = PathfindingCookies.GetCellSize()
    }

}

class Graph {
    constructor(table) {
        this.adjList = new Map()
        this.vertices = []

        //Make graph from an HTML table if provided
        if(table instanceof Element) {
            other = ParseTable(table)
            this.adjList = other.adjList
            this.vertices = other.vertices
        }
    }

    get start() {
        return this.vertices.find((element)=>{return element.start})
    }

    get end() {
        return this.vertices.find((element)=>{return element.end})
    }

    addVertex(vertex) {
        this.vertices.push(vertex)
        this.adjList.set(vertex, [])
    }

    addEdge(a, b) {
        this.adjList.get(a).push(b)
        this.adjList.get(b).push(a)
    }

    //Take a DOM element table and return a graph object
    static ParseTable(table) {
        if(!(table instanceof Element)) {
            throw new Error("Invalid table")
        }
        
        let start = undefined
        let end = undefined

        const graph = new Graph()

        //Parse each cell in the table individually
        table.childNodes.forEach(cell => {
                if(cell.nodeName !== "TD"){
                    return
                }
                //Populate vertex with data from table
                const coords = cell.id.split(",").map((coord)=>{return Number(coord)})
                let isWalkable = cell.className !== "wall"
                //isWalkable ? console.log(coords) : 0
                let vertex = new Vertex(coords[1], coords[0], {walkable: isWalkable, start: cell.className=="startnode", end: cell.className=="endnode"})
                //console.log(vertex)
                if(vertex.start) {
                    start = vertex
                }
                if(vertex.end) {
                    end = vertex
                }
                
                //Add the new node and whatever new edges the node may have
                graph.addVertex(vertex)
                for(const key of graph.adjList.keys()) {
                    if (((key.x == vertex.x+1 || key.x == vertex.x-1) && key.y == vertex.y) || (key.x == vertex.x && (key.y == vertex.y+1 || key.y == vertex.y-1))) {
                        graph.addEdge(key, vertex)
                    }
                }
            })
        return graph
    }

    //Takes in a graph and returns the graph with walls separating all nodes
    static PartitionGraph(graph) {
        const newGraph = new Graph()
        const emptyNodes = []
        //graph.adjList.clear()
        graph.vertices.forEach((vertex)=>{
            newGraph.addVertex(vertex)
            //Make every other node empty, all others walls
            if(vertex.x%2==0 && vertex.y%2==0) {
                //newGraph.EditNode(vertex.y, vertex.x, element=>element.className="")
                vertex.walkable = true
                emptyNodes.push(vertex)
                for(const node of emptyNodes) {
                    if((Math.abs(vertex.x-node.x)==2 && vertex.y==node.y) || (Math.abs(vertex.y-node.y)==2 && vertex.x==node.x)) {
                        newGraph.addEdge(node, vertex)
                    }
                }
            } else {
                //newGraph.EditNode(vertex.y, vertex.x, element=>element.className="wall")
                vertex.walkable = false
            }
        })
        return newGraph
    }
}

class Vertex {
    constructor(x, y, options) {
        this.x = x
        this.y = y
        this.f = 999999999
        this.g = 999999999
        this.h = 0
        this.walkable = options?.walkable ?? true
        this.start = options?.start || false
        this.end = options?.end || false
    }
}

//This listener is always active on the nodes. Listens for inital click/touch to begin listening for further input
function cellHandler(event) {
    let dragFunc = cellDrag.bind(this)
    let cleanupFunc = cleanUp.bind(this)
    document.querySelectorAll("td").forEach((node)=>{
        //Checks for mousedown as a way to check if the device is a touchscreen.
        node.addEventListener(event.type == "mousedown" ? "mousemove" : "touchmove", dragFunc)
        node.addEventListener(event.type == "mousedown" ? "mouseup" : "touchend", cleanupFunc)
    })

    let drag = false

    //Handles all events after the initial click
    function cellDrag(e) {
        drag = true
        //Dragging requires different handling, so check for that first. Otherwise, default to mouse inputs
        let x = e.touches?.[0].clientX || e.clientX
        let y = e.touches?.[0].clientY || e.clientY
        let pageElement = document.elementFromPoint(x, y)

        //Because we use elementFromPoint, we may get non-table elements. Ignore those
        if(pageElement.tagName !== "TD") {
            return
        }
        let coords = pageElement.id.split(",").map(coord => Number(coord))
        this.EditNode(coords[0], coords[1], (element)=>{element.className = "wall"})

        //if(e.type == "mousemove") {
        //    this.EditNode(coords[0], coords[1], (element)=>{element.className = "wall"})
        //    //e.currentTarget.className = "wall"
        //}
        //else {
        //    if(pageElement.tagName === "TD") {
        //        pageElement.className = "wall"
        //    }
        //}
    }

    //Called upon mouseup or end of touch.
    function cleanUp(e) {
        document.querySelectorAll("td").forEach((node)=>{
            node.removeEventListener(e.type == "mouseup" ? "mousemove" : "touchmove", dragFunc)
            node.removeEventListener(e.type == "mouseup" ? "mouseup" : "touchend", cleanupFunc)
        })

        let x = e.clientX
        let y = e.clientY
        let pageElement = document.elementFromPoint(x, y)
        if(pageElement.tagName !== "TD") {
            return
        }
        let coords = pageElement.id.split(",").map(coord => Number(coord))

        //If input ended without dragging:
        if(!drag) {
            if(e.currentTarget.className == "startnode") {
                this.EditNode(coords[0], coords[1], (element)=>{element.className = "endnode"})
            }
            else if(e.currentTarget.className == "endnode" || e.currentTarget.className == "wall") {
                this.EditNode(coords[0], coords[1], (element)=>{element.className = ""})
            }
            else {
                this.EditNode(coords[0], coords[1], (element)=>{element.className = "startnode"})
            }
        }
        //this.elementTable[coords[0]][coords[1]] = e.currentTarget
        //console.log(this.elementTable[coords[0]][coords[1]])

        drag = false;
    }
}

function DFSMaze(graph) {
    const walkableNodes = graph.vertices.filter(element=>element.walkable)
    const visited = new Array(walkableNodes.length).fill(false) //Parallel array to the vertices made to track what's been visited
    const stack = []
    let cell = walkableNodes[Math.floor(Math.random() * walkableNodes.length)] //Initialize to a random starting point
    visited[walkableNodes.indexOf(cell)] = true //Mark cell as visited
    stack.push(cell)

    while(stack.length > 0) {
        console.log(stack.length)
        //Pop a cell and make it current cell
        cell = stack.pop()
        //If current cell has unvisited neighbors,
        let unvisited = []
        for(let neighbor of graph.adjList.get(cell)) {
            if(!visited[walkableNodes.indexOf(neighbor)]) {
                unvisited.push(neighbor)
            }
        }
        if(unvisited.length==0) {
            continue
        }
        //Push current cell to stack
        stack.push(cell)
        //Choose one of unvisited neighbors
        let neighbor = unvisited[Math.floor(Math.random() * unvisited.length)]
        //Remove the wall between the two
        graph.vertices.find(element => element.x == (cell.x + neighbor.x) / 2 && element.y == (cell.y + neighbor.y) / 2).walkable = true
        //Mark chosen neighbor as visited and push to stack
        visited[walkableNodes.indexOf(neighbor)] = true
        stack.push(neighbor)
    }
}

export { Table, Graph, DFSMaze }