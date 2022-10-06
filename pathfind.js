document.querySelector("#generate").addEventListener("click", () => {
    FindPath(document.querySelector("tbody"))
})

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
            let path = []
            while(current) {
                path.push(current)
                document.getElementById(`${current.y},${current.x}`).style.backgroundColor = 'yellow'
                current = current.parent
            }
            return path
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