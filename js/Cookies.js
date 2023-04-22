import Cookies from "./js.cookie.min.mjs"

function CheckFirstVisit(pageName) {
    if(!Cookies.get(pageName)) {
        $('#introModal').modal('show')
        Cookies.set(pageName, '1', {expires: 999})
    }
}

class PathfindingCookies {
    static SetCellSize(size) {
        Cookies.set('cellSize', `${size}`, {expires: 999, sameSite: 'strict'})
    }
    static GetCellSize() {
        if(!Cookies.get('cellSize')) {
            this.SetCellSize(30)
        }
        return Cookies.get('cellSize')
    }
}

export { CheckFirstVisit, PathfindingCookies }