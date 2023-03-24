function dragElement(element) {
    var deltaX = 0, deltaY = 0, startingX = 0, startingY = 0;
      element.onmousedown = dragMouseDown;
  
      while(element.offsetWidth + element.offsetLeft > window.innerWidth - 20) {
          element.style.left = ((element.offsetLeft - 10) / window.innerWidth * 100) + "%"
      }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      startingX = e.clientX;
      startingY = e.clientY;
      document.addEventListener('mouseup', closeDragElement)
      // call a function whenever the cursor moves:
      document.addEventListener('mousemove', elementDrag)
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      deltaX = startingX - e.clientX;
      deltaY = startingY - e.clientY;
      startingX = e.clientX;
      startingY = e.clientY;
      // set the element's new position:
      //If deltaX is negative (moving right) & the card is about to move offscreen, cap it at the edge
      if(deltaX < 0 && element.offsetWidth + element.offsetLeft - deltaX > window.innerWidth)
      { 
          element.style.left = ((window.innerWidth - element.offsetWidth) / window.innerWidth * 100) + "%"
      }
      else if(deltaX > 0 && element.offsetLeft - deltaX < 0)
      {
        element.style.left = 0 + "%"
      }
      else //If deltaX is positive (moving left):
      {
        element.style.left = ((element.offsetLeft - deltaX) / window.innerWidth * 100) + "%"
      }
      //If deltaY is negative (moving down):
      if(deltaY < 0 && element.offsetHeight + element.offsetTop - deltaY > window.innerHeight)
      {
        element.style.top = ((window.innerHeight - element.offsetHeight) / window.innerHeight * 100) + "%"
      }
      else if(deltaY > 0 && element.offsetTop - deltaY < 0)
      {
        element.style.top = 0 + "%"
      }
      else //If deltaY is positive (moving up):
      {
        element.style.top = ((element.offsetTop - deltaY) / window.innerHeight * 100) + "%"
      }
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