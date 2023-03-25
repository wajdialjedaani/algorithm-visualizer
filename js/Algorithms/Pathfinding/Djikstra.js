import { FinalPath, SearchedPath, NewChildren } from "../../PathfindingAnimations.js"

function Djikstra(graph, start, end) {
    const open = []
    const closed = []
    const actions = []
    open.push(start)
    start.g = 0
    
    while (open.length != 0) {
        console.log("outer loop")
        open.sort((a, b) => {return a.g - b.g}) //Sort ascending by cost

        let current = open.shift()
        closed.push(current)

        let path = []
        for(let parent = current; parent; parent = parent.parent) {
            path.push(document.getElementById(`${parent.y},${parent.x}`))
        }
        actions.push(new SearchedPath(path))

        if (current === end) {//If the current node is the end node
            const pathArr = []
            const pathCells = []
            while(current) {
                console.log(`${current.y},${current.x}`)
                pathArr.push(current)
                pathCells.push(document.getElementById(`${current.y},${current.x}`))
                current = current.parent
            }
            actions.push(new FinalPath(pathCells.reverse()))
            return actions
        }

        let children = []
        //get list of neighbors
        for (let neighbor of graph.adjList.get(current)) {
            children.push(neighbor)
        }

        //for each child
        let newChildren = []
        for (let child of children) { //Continue if child has already been searched

            let g = current.g+1

            //Continue if better path has already been found
            if(child.g < g) {
                continue
            }
            //Dont add child to search list if its a wall
            if(!child.walkable) {
                continue
            }

            child.g = g
            child.parent = current
            
            //If node isn't already in seearch list, add it
            if(!open.some((element) => {return element === child})) {
                open.push(child)
                newChildren.push(child)
            }
        }
        if(newChildren != []) {
            actions.push(new NewChildren(newChildren.map((element) => {return document.getElementById(`${element.y},${element.x}`)})))
        }
    }
    //Only executed upon failure to find end
    return undefined
}
globalThis.Djikstra = Djikstra
export { Djikstra }