const pathfindingColorsDefault = Object.freeze({
    finalPath: "#FEDC97",
    searchedPathInProgress: "#F26419",
    searchedPath: "#28666E",
    newChildren: "#696464",
    skippedNode: "#808080F0",
    jumpNode: "#F26419",
    startNode: "#008000",
    endNode: "#ff0000",
    wall: "#6290c8",
});

export const pathfindingColors = new Proxy(
  {
    finalPath: "#FEDC97",
    searchedPathInProgress: "#F26419",
    searchedPath: "#28666E",
    newChildren: "#696464",
    skippedNode: "#808080F0",
    jumpNode: "#F26419",
    startNode: "#008000",
    endNode: "#ff0000",
    wall: "#6290c8",
    reset: function () {
      Object.assign(this, pathfindingColorsDefault);
    },
  },
  {
    get: (obj, prop) => obj[prop] || "#000000",

    set: (obj, prop, value) => {
      obj[prop] = value;
      document.documentElement.style.setProperty(`--${prop}`, value);
      document.querySelector(`.intro-${prop}`)?.value ? (document.querySelector(`.intro-${prop}`).value = value) : null;
 value;
      return true;
    },
  }
);

