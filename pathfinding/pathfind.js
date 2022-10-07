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

//pathAnimation = function(path) {
//    console.log("pathing")
//    anime({
//    targets: path,
//    delay: anime.stagger(100),
//    backgroundColor: '#FFFF00'
//})}
//searchTimeline.add({
//    targets: closed,
//        delay: anime.stagger(10),
//        backgroundColor: '#A020F0',
//})
//.add({
//    targets: path,
//    delay: anime.stagger(100),
//    backgroundColor: '#FFFF00'
//})
//searchAnimation = function(closed, path) {
//    anime({
//})}

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

function FindPath(table)
{
    document.querySelector("#animate").addEventListener("click", () => {searchTimeline.play()})
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
    searchTimeline = anime.timeline({autoplay: false})
    console.log("start loop")
    for(path of results.untakenPaths)
    {
        //searchTimeline.pause()
        searchTimeline.add({
            targets: path,
            autoplay: false,
            //Zap the whole line red
            backgroundColor: [
                {value: "#FF0000", duration: 10},
                {value: "#A020F0", delay: 20, duration: 10}
            ]
            //Zap the whole line purple
        })
    }
    console.log("end loop")
    searchTimeline.add({
        targets: results.pathCells,
        delay: anime.stagger(50),
        duration: 500,
        backgroundColor: '#FFFF00',
        autoplay: false
    })
    console.log("test")
    //searchTimeline.restart()
}

function AStar(graph, start, end) {
    const open = []
    const closed = []

    open.push(start)
    start.g = 0
    
    while (open.length != 0) {
        console.log(`outer loop ${open.length}`)
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