import { FinalPath, SearchedPath, NewChildren } from "../../PathfindingAnimations.js"

function AStar(graph, start, end) {
    const open = []
    const closed = []
    const actions = []
    const progressBar = document.querySelector("#Progress-Bar-Fill")
    const timeline = gsap.timeline({paused: true, onUpdate: function(){progressBar.style.width = `${this.progress()*100}%`}})
    let childAnimation

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
        let path = []
        for(let parent = current; parent; parent = parent.parent) {
            path.push(document.getElementById(`${parent.y},${parent.x}`))
        }

        if (current === end) {//If the current node is the end node
            const pathArr = []
            const pathCells = []
            while(current) {
                pathArr.push(current)
                pathCells.push(document.getElementById(`${current.y},${current.x}`))
                current = current.parent
            }
            //actions.push(new FinalPath(pathCells.reverse()))
            FinalPath.AddToTimeline(timeline, {target: pathCells.reverse()})
            //return actions
            return timeline
        }

        let children = []
        //get list of neighbors
        for (let neighbor of graph.adjList.get(current)) {
            children.push(neighbor)
        }

        //for each child
        let newChildren = []
        for (let child of children) { //Continue if child has already been searched
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
                newChildren.push(child)
            }
        }
        if(newChildren != []) {
            //childAnimation = new NewChildren(newChildren.map((element) => {return document.getElementById(`${element.y},${element.x}`)}))
            NewChildren.AddToTimeline(timeline, {target: newChildren.map((element) => {return document.getElementById(`${element.y},${element.x}`)})})
        }
        //const animation = new SearchedPath(path, childAnimation)
        //actions.push(animation)
        SearchedPath.AddToTimeline(timeline, {target: path})
    }
    //Only executed upon failure to find end
    return undefined
}
export { AStar }