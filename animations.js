const dragItem = document.getElementById("draggable");
let active = false;
let x = 100, y = 100;
let vx = 0, vy = 0;
const damping = 0.9;
const friction = 0.995;
let lastPositions = [];

// Drag start
dragItem.addEventListener("mousedown", e => {
  active = true;
  dragItem.style.cursor = "grabbing";
  lastPositions = [{x: e.clientX, y: e.clientY, t: Date.now()}];
});

// Drag end
window.addEventListener("mouseup", e => {
  if (!active) return;
  active = false;
  dragItem.style.cursor = "grab";

  const now = Date.now();
  const recent = lastPositions.filter(p => now - p.t <= 50);
  if (recent.length >= 2) {
    const first = recent[0];
    const last = recent[recent.length - 1];
    vx = (last.x - first.x) / ((last.t - first.t) / 16);
    vy = (last.y - first.y) / ((last.t - first.t) / 16);
  }
  lastPositions = [];
});

// Dragging
window.addEventListener("mousemove", e => {
  if (active) {
    x += e.movementX;
    y += e.movementY;
    setPos(x, y);
    makeTrail();

    lastPositions.push({x: e.clientX, y: e.clientY, t: Date.now()});
    if (lastPositions.length > 5) lastPositions.shift();

    // extra dots for comet effect
    makeTrail(); 
  }
});

function setPos(x, y) {
  dragItem.style.transform = `translate(${x}px, ${y}px)`;
}

function makeTrail() {
  const rect = dragItem.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dot = document.createElement("div");
  dot.className = "trail";
  dot.style.left = `${cx}px`;
  dot.style.top = `${cy}px`;
  document.body.appendChild(dot);

  // Fade and shrink gradually
  setTimeout(() => {
    dot.style.transition = "opacity 2s ease-out, transform 2s ease-out";
    dot.style.opacity = "0";
    dot.style.transform += " scale(0.1)";
  }, 30);
  setTimeout(() => dot.remove(), 2100);
}

function animate() {
  if (!active) {
    x += vx;
    y += vy;

    if (x < 0) { x = 0; vx = -vx * damping; }
    if (y < 0) { y = 0; vy = -vy * damping; }
    if (x + dragItem.offsetWidth > window.innerWidth) {
      x = window.innerWidth - dragItem.offsetWidth;
      vx = -vx * damping;
    }
    if (y + dragItem.offsetHeight > window.innerHeight) {
      y = window.innerHeight - dragItem.offsetHeight;
      vy = -vy * damping;
    }

    vx *= friction;
    vy *= friction;

    setPos(x, y);

    // multiple dots for smooth comet
    makeTrail();
    makeTrail();
  }

  requestAnimationFrame(animate);
}

animate();
