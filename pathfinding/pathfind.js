const speeds = [1, 2, 4]
let selectedFunction = (new URLSearchParams(window.location.search)).get("func")
let columns = Math.floor((document.body.clientWidth / 30));
let rows = Math.floor((document.body.clientHeight / 30));
let speed = 1
let playing = false
let inProgress = false
let currentAnim = undefined


if(!Cookies.get('pathVisited')) {
    $('#introModal').modal('show')
    Cookies.set('pathVisited', '1', {expires: 999})
}

document.querySelector("#AnimSpeed").addEventListener("click", function() {
    speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]
    this.innerHTML = `${speed}x`
})

function changeAlgo(func) {
    let text
    if(func == "a*") {
        text = `A* knows where the end is, but it <b>doesn't know about the walls in between.</b> <br>
        For every tile that it searches, it will track how long it took to get there (g) and how much longer it will take to reach the end if there's no walls in the way (h).<br>
        This is how A* decides where to search next - it adds (g) and (h) to calculate a 'cost', and searches the <b>'cheapest' tile.</b>`
        selectedFunction = AStar
        document.querySelector("#Header").textContent = "A* Pathfinding"
    }
    else if(func == "djikstra") {
        text = `Djikstra's is a <b>blind algorithm</b> - it doesn't know where the end is until it reaches it.<br>
        It loops, each time choosing the closest tile to the start that <b>hasn't already been searched</b> and adding all the tiles around it to the queue.`
        selectedFunction = Djikstra
        document.querySelector("#Header").textContent = "Djikstra's Pathfinding"
    }
    DisplayAnnotation(text, document.querySelector("#annotation>.card-body>p"))
}

changeAlgo(selectedFunction)

let drag = false

function cellDrag(e) {
    drag = true
    e.preventDefault()
    if(e.type == "mousemove") {
        this.className = "wall"
    }
    else {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY

        let element = document.elementFromPoint(x, y)
        element.className = "wall"
    }
}

function cleanUp(e) {
    e.preventDefault()
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
    event.preventDefault()
    document.querySelectorAll("td").forEach((node)=>{
        node.addEventListener(event.type == "mousedown" ? "mousemove" : "touchmove", cellDrag)
        node.addEventListener(event.type == "mousedown" ? "mouseup" : "touchend", cleanUp)
    })
}

function generateTable() {
    let table = document.querySelector("#grid-container")
    table.innerHTML = ""
  
    let cellSize = 30

    columns = Math.floor((document.body.clientWidth / cellSize));
    rows = Math.floor((document.body.clientHeight / cellSize));

    //console.log(`width: ${document.body.clientWidth}  height: ${document.body.clientHeight}`)
    //console.log(`columns: ${columns}, rows: ${rows}`)

    table.style.setProperty("--columns", columns);
    table.style.setProperty("--rows", rows);

    width = document.body.clientWidth / columns
    height = document.body.clientHeight / rows

    for(let y=0; y<rows; y++) {
        for(let x=0; x<columns; x++) {
            let cell = document.createElement("td")
            cell.id = (`${y},${x}`)
            cell.addEventListener('ontouchstart' in document.documentElement === true ? 'touchstart' : 'mousedown', cellHandler)
            //cell.addEventListener('touchstart', cellHandler)
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
    elmnt.style.top = ((elmnt.offsetTop - pos2) / window.innerHeight * 100) + "%";
    elmnt.style.right = ((window.innerWidth - parseFloat(window.getComputedStyle(elmnt, null).getPropertyValue("width")) - elmnt.offsetLeft + pos1) / window.innerWidth * 100) + "%";
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
    if(typeof results === "undefined") {
        window.alert("No path can be found, please remove some walls.")
        throw new Error("No path")
    }
    playing = true
    await animateResults(results);
    playing = false
}

async function animateResults(results) {
    progress = document.querySelector("#Progress-Bar");
    //Start each step of the animation with await to keep the thread unblocked, then continue when the step is done
    for (let i = 0; i < results.untakenPaths.length; i++) {
        let path = results.untakenPaths[i];
        let node = results.untakenNodes[i][0];
        DisplayAnnotation(`Cost to travel to current node: ${node.g} <br>
        Estimated cost from node to the end: ${node.h} <br>
        Estimated total cost: ${node.g + node.h}`, document.querySelector("#pseudocode>.card-body>p"));

        DisplayAnnotation(`A* is choosing the tiles that it thinks will lead us to the end fastest.<br>
        The current tile is the cheapest we have, costing <b>${node.f}.</b> A* will continue towards the end until it hits a wall - then it'll search for another tile that costs <b>${node.f}</b>`,
            document.querySelector("#annotation>.card-body>p"));

        currentAnim = anime({
            targets: path,
            backgroundColor: [
                { value: "#F26419", duration: 0 },
                { value: "#28666E", delay: 60 / speed, duration: 1 } //Small wait, then zap the whole line purple
            ]
        });
        await currentAnim.finished;
        progress.style.width = `${(results.untakenPaths.indexOf(path) + 1) / results.untakenPaths.length * 100}%`;
    }
    currentAnim = anime({
        targets: results.pathCells,
        delay: anime.stagger(50),
        duration: 500,
        backgroundColor: '#FEDC97',
    });
    await currentAnim.finished;
    
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
    return undefined
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
    return undefined
}

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
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
            console.log("Path promise rejected")
            console.log(error)
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
    if(typeof currentAnim === "undefined" || !inProgress) {
        console.log("No animation playing")
        return
    }
    if(playing) {
        console.log("first")
        playing = false
        currentAnim.pause()
        this.firstChild.setAttribute("src", "../Assets/play-fill.svg")
    }
    else {
        console.log("second")
        playing = true
        currentAnim.play()
        this.firstChild.setAttribute("src", "../Assets/pause-fill.svg")
    }
}