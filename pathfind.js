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

    //These don't exist yet, names are placeholders

    //Dont forget to undo these ^^^^^

    const open = []
    const closed = []

    open.push(start)
    start.g = 0
    console.log(`end: ${end.x},${end.y}`)
    while (open.length != 0) {
        console.log(`outer loop ${open.length}`)
        open.sort((a, b) => {return a.f-b.f}) //Sort ascending by cost
        //console.log(open)
        let current = open.shift()
        //console.log(`current: ${current.x},${current.y}`)
        closed.push(current)
        //console.log(closed)

        if (current === end) {//If the current node is the end node
            //console.log("GOTTEM")
            let path = []
            while(current) {
                path.push(current)
                document.getElementById(`${current.y},${current.x}`).style.backgroundColor = 'yellow'
                current = current.parent
            }
            //console.log(path)
            return path
        }

        let children = []
        //TODO - for each child of current, append it to children
        for (neighbor of graph.adjList.get(current)) {
            //console.log(`add child ${neighbor.x},${neighbor.y}`)
            children.push(neighbor)
        }

        //for each child
        for (child of children) { //Continue if child has already been searched
            if(closed.some((element) => {return element === child})) {
                //console.log("searched")
                continue
            }

            let g = current.g+1
            //console.log(g)
            let h = Math.abs(child.x - end.x) + Math.abs(child.y - end.y)
            //console.log(h)
            let f = g + h
            //console.log(f)


            if(open.some(element => {return element.x == child.x && element.y == child.y}) && child.g < g) {
                //console.log(g)
                //console.log(`already pathed ${child.x},${child.y}`)
                continue
            }

            if(!child.walkable) {
                continue
            }

            child.g = g
            child.h = h
            child.f = f
            child.parent = current
            
            //console.log(`push child ${child.x},${child.y}`)
            if(!open.some((element) => {return element === child})) {
                open.push(child)
            }
        }
    }
    return []
}