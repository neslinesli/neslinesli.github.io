const objects = document.querySelectorAll('.flying-object');
const damping = 0.5;
const friction = 0.295;
const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
const footerHeight = document.querySelector('footer')?.offsetHeight || 0;

// Initialize each object
objects.forEach(obj => {
    obj.dataset.x = Math.random() * (window.innerWidth - obj.offsetWidth);
    obj.dataset.y = navbarHeight + Math.random() * (window.innerHeight - footerHeight - obj.offsetHeight - navbarHeight);
    obj.dataset.vx = (Math.random() - 0.5) * 4;
    obj.dataset.vy = (Math.random() - 0.5) * 4;
    obj.dataset.rotation = Math.random() * 360;
    obj.dataset.vr = (Math.random() - 0.5) * 5;
    obj.dataset.active = "false";

    obj.style.transform = `translate(${obj.dataset.x}px, ${obj.dataset.y}px) rotate(${obj.dataset.rotation}deg)`;

    // Drag handlers
    obj.addEventListener("mousedown", e => {
        obj.dataset.active = "true";
        obj.style.cursor = "grabbing";
        obj.dataset.offsetX = e.clientX - parseFloat(obj.dataset.x);
        obj.dataset.offsetY = e.clientY - parseFloat(obj.dataset.y);
        obj.dataset.lastX = e.clientX;
        obj.dataset.lastY = e.clientY;
    });
});

// Mouse events
window.addEventListener("mousemove", e => {
    objects.forEach(obj => {
        if (obj.dataset.active === "true") {
            const x = e.clientX - obj.dataset.offsetX;
            const y = e.clientY - obj.dataset.offsetY;

            obj.dataset.vx = e.clientX - obj.dataset.lastX;
            obj.dataset.vy = e.clientY - obj.dataset.lastY;
            obj.dataset.lastX = e.clientX;
            obj.dataset.lastY = e.clientY;

            // Rotate while dragging
            obj.dataset.rotation = parseFloat(obj.dataset.rotation) + e.movementX * 0.5;

            obj.dataset.x = x;
            obj.dataset.y = y;
            obj.style.transform = `translate(${x}px, ${y}px) rotate(${obj.dataset.rotation}deg)`;
            makeTrail(obj);
        }
    });
});

window.addEventListener("mouseup", e => {
    objects.forEach(obj => {
        if (obj.dataset.active === "true") {
            obj.dataset.active = "false";
            obj.style.cursor = "grab";
            // velocity already updated during drag
        }
    });
});

// Trail
function makeTrail(obj) {
    const rect = obj.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + window.scrollX;
    const cy = rect.top + rect.height / 2 + window.scrollY;

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

// Animation loop
function animate() {
    objects.forEach(obj => {
        if (obj.dataset.active === "false") {
            let x = parseFloat(obj.dataset.x);
            let y = parseFloat(obj.dataset.y);
            let vx = parseFloat(obj.dataset.vx) * friction;
            let vy = parseFloat(obj.dataset.vy) * friction;
            let rotation = parseFloat(obj.dataset.rotation) + parseFloat(obj.dataset.vr);
            let vr = parseFloat(obj.dataset.vr) * friction;

            const width = obj.offsetWidth;
            const height = obj.offsetHeight;
            const maxX = window.innerWidth - width;
            const maxY = window.innerHeight - footerHeight - height;

            x += vx;
            y += vy;
            rotation += vr;

            // Bounce
            if (x < 0) { x=0; vx=-vx*damping; vr=-vr*damping; }
            if (y < navbarHeight) { y=navbarHeight; vy=-vy*damping; vr=-vr*damping; }
            if (x > maxX) { x=maxX; vx=-vx*damping; vr=-vr*damping; }
            if (y > maxY) { y=maxY; vy=-vy*damping; vr=-vr*damping; }

            obj.dataset.x = x;
            obj.dataset.y = y;
            obj.dataset.vx = vx;
            obj.dataset.vy = vy;
            obj.dataset.rotation = rotation;
            obj.dataset.vr = vr;

            obj.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            makeTrail(obj);
        }
    });

    requestAnimationFrame(animate);
}

animate();

