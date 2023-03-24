function CheckFirstVisit(pageName) {
    if(!Cookies.get(pageName)) {
        $('#introModal').modal('show')
        Cookies.set(pageName, '1', {expires: 999})
    }
}

export { CheckFirstVisit }