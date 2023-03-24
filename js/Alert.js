function Alert(container, msg, type) {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible position-absolute start-50 translate-middle-x" style="z-index: 999;" role="alert">`,
        `   <div>${msg}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
      console.log(wrapper.innerHTML)
      container.append(wrapper)
}

export { Alert }