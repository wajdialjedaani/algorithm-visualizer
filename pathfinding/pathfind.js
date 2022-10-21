document.querySelector("#generate").addEventListener("click", () => {
    FindPath(document.querySelector("#grid-container"))
})

let selectedFunction = (new URLSearchParams(window.location.search)).get("func")

if(selectedFunction == "a*") {

    selectedFunction = AStar
}
else if(selectedFunction == "djikstra") {
    selectedFunction = Djikstra
}

function changeAlgo(func) {
    console.log("fire")
    if(func == "a*") {
        selectedFunction = AStar
    }
    else if(func == "djikstra") {
        selectedFunction = Djikstra
    }
}

let drag = false

function cellDrag() {
    drag = true
    this.className = "wall"
}

function cleanUp() {
    document.querySelectorAll("td").forEach((node)=>{
        node.removeEventListener("mousemove", cellDrag)
        node.removeEventListener("mouseup", cleanUp)
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
        node.addEventListener("mousemove", cellDrag)
        node.addEventListener("mouseup", cleanUp)
    })
}

function generateTable() {
    let table = document.querySelector("#grid-container")
    table.innerHTML = ""
    const size = document.body.clientWidth > 800 ? 100 : 50;
  
    columns = Math.floor((document.body.clientWidth / 30));
    rows = Math.floor((document.body.clientHeight / 30));
    console.log(`width: ${document.body.clientWidth}  height: ${document.body.clientHeight}`)
    console.log(`columns: ${columns}, rows: ${rows}`)
    table.style.setProperty("--columns", columns);
    table.style.setProperty("--rows", rows);
    width = document.body.clientWidth / columns
    height = document.body.clientHeight / rows
    for(let y=0; y<rows; y++) {
        for(let x=0; x<columns; x++) {
            let cell = document.createElement("td")
            cell.id = (`${y},${x}`)
            cell.addEventListener('mousedown', cellHandler)
            cell.style.setProperty("--width", width)
            cell.style.setProperty("--height", height)
            table.appendChild(cell)
        }
    }
}

window.onload = generateTable

window.onresize = generateTable

//dragElement(document.querySelector(".draggable"));
document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
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
    document.querySelector("#AnimSpeed").addEventListener("click", function() {
        speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]
        this.innerHTML = `${speed}x`
    })
    document.querySelector("#PlayPause").addEventListener("click", function() {
        if(playing) {
            playing = false
            currentAnim.pause()
            this.firstChild.setAttribute("src", "../Assets/play-fill.svg")
        }
        else {
            playing = true
            currentAnim.play()
            this.firstChild.setAttribute("src", "../Assets/pause-fill.svg")
        }
    })
    let start = undefined
    let end = undefined

    const graph = new Graph()
    table.childNodes.forEach(cell => {
            if(cell.nodeName !== "TD"){
                return
            }
            coords = cell.id.split(",")
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

    const results = selectedFunction(graph, start, end)

    const speeds = [1, 2, 4]
    let currentAnim
    let playing = true
    let speed = 1
    progress = document.querySelector("#Progress-Bar")
    //Start each step of the animation with await to keep the thread unblocked, then continue when the step is done
    for(let i=0; i<results.untakenPaths.length; i++) {
        let path = results.untakenPaths[i]
        let node = results.untakenNodes[i][0]
        DisplayAnnotation(`Cost to travel to current node: ${node.g} <br>
        Estimated cost from node to the end: ${node.h} <br>
        Estimated total cost: ${node.g + node.h}`, document.querySelector("#pseudocode>.card-body>p"))

        DisplayAnnotation(`The algorithm is choosing the nodes that it thinks will lead us to the end the fastest.
        We know the distance to get to the searched nodes (g), and we can calculate the approximate distance from a node to the end (h).
        We can add these up to decide on the best node to search next.`, document.querySelector("#annotation>.card-body>p"))

        currentAnim = anime({
            targets: path,
            backgroundColor: [
                {value: "#F26419", duration: 0}, //Zap the line red instantly
                {value: "#28666E", delay: 60 / speed, duration: 1} //Small wait, then zap the whole line purple
            ]
        })
        await currentAnim.finished
        progress.style.width = `${(results.untakenPaths.indexOf(path) + 1) / results.untakenPaths.length * 100}%`
    }
    currentAnim = anime({
        targets: results.pathCells,
        delay: anime.stagger(50),
        duration: 500,
        backgroundColor: '#FEDC97',
        })
    await currentAnim.finished
}

function AStar(graph, start, end) {
    const open = []
    const closed = []

    open.push(start)
    start.g = 0
    
    while (open.length != 0) {
        open.sort((a, b) => {
            if(a.f-b.f !== 0) {
                return a.f-b.f
            }
            else {
                return a.g >= b.g ? -1 : 1
            }}) //Sort ascending by cost

        let current = open.shift()
        closed.push(current)

        if (current === end) {//If the current node is the end node
            const pathArr = []
            const pathCells = []
            while(current) {
                pathArr.push(current)
                pathCells.push(document.getElementById(`${current.y},${current.x}`))
                current = current.parent
            }
            return {
                path: pathArr.reverse(),
                pathCells: pathCells.reverse(),
                searched: closed.map((element) => document.getElementById(`${element.y},${element.x}`)),
                untakenPaths: closed.map((element) => {
                    let path = []
                    while(element) {
                        path.push(document.getElementById(`${element.y},${element.x}`))
                        element = element.parent
                    }
                    return path
                }),
                untakenNodes: closed.map((element) => {
                    let path = []
                    while(element) {
                        path.push(element)
                        element = element.parent
                    }
                    return path
                })
            }
        }

        let children = []
        //get list of neighbors
        for (neighbor of graph.adjList.get(current)) {
            children.push(neighbor)
        }

        //for each child
        for (child of children) { //Continue if child has already been searched
            if(closed.some((element) => {return element === child})) {
                continue
            }

            let g = current.g+1
            let h = Math.abs(child.x - end.x) + Math.abs(child.y - end.y)
            let f = g + h

            //Continue if better path has already been found
            if(open.some(element => {return element.x == child.x && element.y == child.y}) && child.g < g) {
                continue
            }
            //Dont add child to search list if its a wall
            if(!child.walkable) {
                continue
            }

            child.g = g
            child.h = h
            child.f = f
            child.parent = current
            
            //If node isn't already in seearch list, add it
            if(!open.some((element) => {return element === child})) {
                open.push(child)
            }
        }
    }
    //Only executed upon failure to find end
    return []
}

function Djikstra(graph, start, end) {
    const open = []
    const closed = []
    const backtrace = 
    open.push(start)
    start.g = 0
    
    while (open.length != 0) {
        console.log("outer loop")
        open.sort((a, b) => {return a.g - b.g}) //Sort ascending by cost

        let current = open.shift()
        closed.push(current)

        if (current === end) {//If the current node is the end node
            const pathArr = []
            const pathCells = []
            while(current) {
                console.log(`${current.y},${current.x}`)
                pathArr.push(current)
                pathCells.push(document.getElementById(`${current.y},${current.x}`))
                current = current.parent
            }
            console.log("found end")
            return {
                path: pathArr.reverse(),
                pathCells: pathCells.reverse(),
                searched: closed.map((element) => document.getElementById(`${element.y},${element.x}`)),
                untakenPaths: closed.map((element) => {
                    let path = []
                    while(element) {
                        path.push(document.getElementById(`${element.y},${element.x}`))
                        element = element.parent
                    }
                    return path
                }),
                untakenNodes: closed.map((element) => {
                    let path = []
                    while(element) {
                        path.push(element)
                        element = element.parent
                    }
                    return path
                })
            }
        }

        let children = []
        //get list of neighbors
        for (neighbor of graph.adjList.get(current)) {
            children.push(neighbor)
        }

        //for each child
        for (child of children) { //Continue if child has already been searched
            //if(closed.some((element) => {return element === child})) {
            //    continue
            //}

            let g = current.g+1
            //let h = Math.abs(child.x - end.x) + Math.abs(child.y - end.y)
            //let f = g + h

            //Continue if better path has already been found
            if(child.g < g) {
                continue
            }
            //Dont add child to search list if its a wall
            if(!child.walkable) {
                continue
            }

            child.g = g
            //child.h = h
            //child.f = f
            child.parent = current
            
            //If node isn't already in seearch list, add it
            if(!open.some((element) => {return element === child})) {
                open.push(child)
            }
        }
    }
    //Only executed upon failure to find end
    return []
}

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}