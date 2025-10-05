const dragItem = document.getElementById("draggable");
let active = false;
let x = 100, y = 100;
let vx = 0, vy = 0;
let rotation = 0;
let vr = (Math.random()-0.5) * 5; // random initial rotation speed
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
    setPos(x, y, rotation);
    makeTrail();

    lastPositions.push({x: e.clientX, y: e.clientY, t: Date.now()});
    if (lastPositions.length > 5) lastPositions.shift();
  }
});

function setPos(x, y, r) {
  dragItem.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
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

  setTimeout(() => {
    dot.style.transition = "opacity 2s ease-out, transform 2s ease-out";
    dot.style.opacity = "0";
    dot.style.transform += " scale(0.1)";
  }, 30);
  setTimeout(() => dot.remove(), 2100);
}

function animate() {
  const width = dragItem.offsetWidth;
  const height = dragItem.offsetHeight;

  if (!active) {
    x += vx;
    y += vy;

    rotation += vr;

    // bounce boundaries
    if (x < 0) { x = 0; vx = -vx * damping; vr = -vr * damping; }
    if (y < 0) { y = 0; vy = -vy * damping; vr = -vr * damping; }
    if (x + width > window.innerWidth) { 
      x = window.innerWidth - width; 
      vx = -vx * damping; 
      vr = -vr * damping; 
    }
    if (y + height > window.innerHeight) { 
      y = window.innerHeight - height; 
      vy = -vy * damping; 
      vr = -vr * damping; 
    }

    vx *= friction;
    vy *= friction;
    vr *= friction;

    setPos(x, y, rotation);

    // comet effect
    makeTrail();
    makeTrail();
  }

  requestAnimationFrame(animate);
}

animate();
