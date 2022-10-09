document.querySelector("#generate").addEventListener("click", () => {
    FindPath(document.querySelector("tbody"))
})

window.onload = () => {
    let table = document.createElement("tbody")
    document.querySelector("table").appendChild(table)
    for(let y=0; y<15; y++) {
        let row = document.createElement("tr")
        for(let x=0; x<20; x++) {
            let cell = document.createElement("td")
            cell.id = (`${y},${x}`)
            cell.addEventListener('mousedown', function(){this.className="wall"})
            cell.addEventListener('auxclick', function(){this.className="startnode"})
            if(x==18 && y==13) {
                cell.className = "endnode"
            }
            row.appendChild(cell)
        }
        table.appendChild(row)
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
    table.childNodes.forEach(row => {
        row.childNodes.forEach((cell) => {
            coords = cell.id.split(",")
            let vertex
            if(cell.className == "wall") {
                vertex = new Vertex(coords[1], coords[0], false)
            }
            else {
                vertex = new Vertex(coords[1], coords[0], true, cell.className=="startnode", cell.className=='endnode')
                if (cell.className=="startnode") {
                    //console.log("start")
                    start = vertex
                }
                if(cell.className=="endnode") {
                    //console.log("end")
                    end = vertex
                }
            }
            graph.addVertex(vertex)
            //console.log(`Vertex: ${vertex.x},${vertex.y}`)
            for(const key of graph.adjList.keys()) {
                if (((key.x == vertex.x+1 || key.x == vertex.x-1) && key.y == vertex.y) || (key.x == vertex.x && (key.y == vertex.y+1 || key.y == vertex.y-1))) {
                    //console.log(`Keymatch: ${key.x},${key.y}`)
                    graph.addEdge(key, vertex)
                }
            }
        })
    });

    const results = AStar(graph, start, end)

    //Start each step of the animation with await to keep the thread unblocked, then continue when the step is done
    for(path of results.untakenPaths) {
            await anime({
                targets: path,
                backgroundColor: [
                    {value: "#FF0000", duration: 0}, //Zap the line red instantly
                    {value: "#A020F0", delay: 15, duration: 1} //Small wait, then zap the whole line purple
                ]
            }).finished
        }
    await anime({
    targets: results.pathCells,
    delay: anime.stagger(50),
    duration: 500,
    backgroundColor: '#FFFF00',
    }).finished
}

function AStar(graph, start, end) {
    const open = []
    const closed = []

    open.push(start)
    start.g = 0
    
    while (open.length != 0) {
        open.sort((a, b) => {return a.f-b.f}) //Sort ascending by cost

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