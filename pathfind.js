document.querySelector("#generate").addEventListener("click", () => {
    FindPath(document.querySelector("tbody"))
})

class Node {
    constructor(x, y, walkable) {
        this.x = x
        this.y = y
        this.f = Infinity
        this.g = Infinity
        this.h = 0
        this.walkable = walkable
    }
}

function FindPath(table)
{
    const nodes = []
    table.childNodes.forEach(row => {
        let temp = []
        row.childNodes.forEach((cell) => {
            if(cell.className !== "wall") {
                coords = cell.id.split(",")
                temp.push(new Node(coords[0], coords[1]))
            }
            else {
                temp.push(new Node(coords[0], coords[1], undefined))
            }
        })
        nodes.push(temp)
    });

    //let str = ""
    //for(let i=0; i<nodes.length; i++)
    //{
    //    for(let j=0; j<nodes[i].length; j++)
    //    {
    //        if(nodes[i][j] !== undefined)
    //        str = str + (`${nodes[i][j].x},${nodes[i][j].y} `)
    //    }
    //    str = str + "\n"
    //}
    //console.log(str)
    //These don't exist yet, names are placeholders
    let start = 1
    let end = 1
    //Dont forget to undo these ^^^^^

    const open = []
    const closed = []

    open.push(start)
    while (open.length != 0) {
        open.sort((a, b) => {a.f-b.f}) //Sort ascending by cost
        let current = open.pop()
        closed.push(current)

        if (current === end) //If the current node is the end node
        {
            let path = []
            //TODO - Get the path from the current node to start
            //return it
        }

        let children = []
        //TODO - for each child of current, append it to children

        //for each child
        for (child of children) { //Continue if child has already been searched
            if(closed.some((element) => {element.coord == child.coord})) {
                continue
            }
            child.g = current.g+1
            child.h = (child.x * child.x) + (child.y + child.y)
            child.f = child.g + child.h
        }

        if(open.some((element) => {element.h < child.h})) {
            continue
        }
        open.push(child)
    }
}