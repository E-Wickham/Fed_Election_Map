const svg = document.getElementById("canada_map");
let viewBox = { x: 0, y: 0, width: 800, height: 868 };
let zoomFactor = 1.1;

// ADD ZOOM IN AND ZOOM OUT BUTTONS ON THE SVG. GIVE THE BUTTON STYLING
const zoom_in = document.querySelector('.zoom-in')
const zoom_out = document.querySelector('.zoom-out')

zoom_in.addEventListener("click", (event) => {
    event.preventDefault
    zoom(0, 0, event.deltaY > 0 ? zoomFactor : 1 / zoomFactor);
})

zoom_out.addEventListener("click", (event) => {
    event.preventDefault
    zoomOut(0, 0, event.deltaY > 0 ? zoomFactor : 1 / zoomFactor);
})


let isPanning = false, startX, startY;
let touchStartDist = 0;
let lastTouchCenter = { x: 0, y: 0 };

// Zoom with mouse wheel
svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom(event.offsetX, event.offsetY, event.deltaY > 0 ? zoomFactor : 1 / zoomFactor);
});

//reset
let reset_button = document.querySelector(".reset")
reset_button.addEventListener("click", (event) => {
    resetZoom(viewBox)
});
function resetZoom(viewBox) {
    //svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    window.location.reload();
}

function zoom(clientX, clientY, scale) {
    let { width, height } = viewBox;
    let svgRect = svg.getBoundingClientRect();

    // Convert screen coordinates to SVG coordinates
    let mouseX = (clientX - svgRect.left) / svgRect.width * width + viewBox.x;
    let mouseY = (clientY - svgRect.top) / svgRect.height * height + viewBox.y;

    viewBox.width *= scale;
    viewBox.height *= scale;
    viewBox.x = mouseX - (mouseX - viewBox.x) * scale;
    viewBox.y = mouseY - (mouseY - viewBox.y) * scale;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    //console.log(`clientX: ${clientX} \n clientY: ${clientY}`)
    //console.log(`scale: ${scale} \n viewBox.width: ${viewBox.width}\n viewBox.height: ${viewBox.height} \n viewBox.x: ${viewBox.x}\n viewBox.y: ${viewBox.y}`)
}
function zoomOut(clientX, clientY, scale) {
    let { width, height } = viewBox;
    let svgRect = svg.getBoundingClientRect();

    // Convert screen coordinates to SVG coordinates
    let mouseX = (clientX - svgRect.left) / svgRect.width * width + viewBox.x;
    let mouseY = (clientY - svgRect.top) / svgRect.height * height + viewBox.y;

    viewBox.width *= scale+0.25;
    viewBox.height *= scale+0.25;
    viewBox.x = mouseX - (mouseX - viewBox.x) * scale;
    viewBox.y = mouseY - (mouseY - viewBox.y) * scale;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    //console.log(scale)
}

// Panning with mouse
svg.addEventListener("mousedown", (event) => {
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    svg.style.cursor = "grabbing";
});

svg.addEventListener("mousemove", (event) => {
    if (!isPanning) return;
    pan(event.clientX, event.clientY);
});

svg.addEventListener("mouseup", () => stopPan());
svg.addEventListener("mouseleave", () => stopPan());

function pan(clientX, clientY) {
    let dx = (startX - clientX) * (viewBox.width / svg.clientWidth);
    let dy = (startY - clientY) * (viewBox.height / svg.clientHeight);

    viewBox.x += dx;
    viewBox.y += dy;

    startX = clientX;
    startY = clientY;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

function stopPan() {
    isPanning = false;
    svg.style.cursor = "grab";
}

// pinch zoom/pan YOU NEED TO TEST THIS TO SEE IF IT WORKS
svg.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
        touchStartDist = getTouchDistance(event.touches);
        lastTouchCenter = getTouchCenter(event.touches);
    } else if (event.touches.length === 1) {
        isPanning = true;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }
});

svg.addEventListener("touchmove", (event) => {
    event.preventDefault();

    if (event.touches.length === 2) {
        let newDist = getTouchDistance(event.touches);
        let scale = touchStartDist / newDist;
        let newCenter = getTouchCenter(event.touches);

        zoom(newCenter.x, newCenter.y, scale);
        touchStartDist = newDist;
        lastTouchCenter = newCenter;
    } else if (event.touches.length === 1 && isPanning) {
        pan(event.touches[0].clientX, event.touches[0].clientY);
    }
});

svg.addEventListener("touchend", () => {
    isPanning = false;
});

function getTouchDistance(touches) {
    let dx = touches[0].clientX - touches[1].clientX;
    let dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touches) {
    return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
    };
}