import "jquery-ui";

import "jquery-ui/ui/widgets/mouse";
import "jquery-ui/ui/data";
import "jquery-ui/ui/plugin";
import "jquery-ui/ui/safe-active-element";
import "jquery-ui/ui/scroll-parent";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";

// Taken from https://stackoverflow.com/a/23610388
function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
    touch.screenX, touch.screenY,
    touch.clientX, touch.clientY, false,
    false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}



export { init };
