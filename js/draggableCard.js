function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      elmnt.onmousedown = dragMouseDown;
  
      while(elmnt.offsetWidth + elmnt.offsetLeft > window.innerWidth - 20) {
          elmnt.style.left = ((elmnt.offsetLeft - 10) / window.innerWidth * 100) + "%"
      }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      //elmnt.onmouseup = closeDragElement;
      document.addEventListener('mouseup', closeDragElement)
      document.addEventListener('mousemove', elementDrag)
      // call a function whenever the cursor moves:
      //elmnt.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = ((elmnt.offsetTop - pos2) / window.innerHeight * 100) + "%"
      elmnt.style.left = ((elmnt.offsetLeft - pos1) / window.innerWidth * 100) + "%"
  }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.removeEventListener('mouseup', closeDragElement)
      document.removeEventListener('mousemove', elementDrag)
    }
}

function ResizeHandler(element) {
    var x =0; var y = 0; var w = 0; var h = 0;
    const parent = element.parentNode

    element.addEventListener('mousedown', ResizeMouseDown)
    function ResizeMouseDown(event) {
        event.stopPropagation()
        event.preventDefault()
        x = event.clientX
        y = event.clientY

        w = parent.getBoundingClientRect().width
        h = parent.getBoundingClientRect().height

        document.addEventListener('mousemove', ResizeMouseMove)
        document.addEventListener('mouseup', ResizeMouseUp)
    }

    function ResizeMouseMove(event) {
        event.stopPropagation()
        event.preventDefault()
        const dx = event.clientX - x
        const dy = event.clientY - y

        x = event.clientX
        y = event.clientY

        w = parent.getBoundingClientRect().width
        h = parent.getBoundingClientRect().height

        parent.style.width = `${w + dx}px`
        parent.style.height = `${h + dy}px`
    }

    function ResizeMouseUp() {
        document.removeEventListener('mousemove', ResizeMouseMove)
        document.removeEventListener('mouseup', ResizeMouseUp)
    }
}

export { dragElement, ResizeHandler }