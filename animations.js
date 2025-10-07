const objects = document.querySelectorAll('.flying-object');
const damping = 0.97;     // retains more energy on bounce
const friction = 0.9995;  // very light decay
const speedBoost = 1.8;   // multiplies initial throw speed
const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
const footerHeight = document.querySelector('footer')?.offsetHeight || 0;

// Initialize
objects.forEach(obj => {
    obj.dataset.x = Math.random() * (window.innerWidth - obj.offsetWidth);
    obj.dataset.y = navbarHeight + Math.random() * (window.innerHeight - footerHeight - obj.offsetHeight - navbarHeight);
    obj.dataset.vx = (Math.random() - 0.5) * 6;
    obj.dataset.vy = (Math.random() - 0.5) * 6;
    obj.dataset.rotation = Math.random() * 360;
    obj.dataset.vr = (Math.random() - 0.5) * 5;
    obj.dataset.active = "false";

    obj.style.transform = `translate(${obj.dataset.x}px, ${obj.dataset.y}px) rotate(${obj.dataset.rotation}deg)`;

    obj.addEventListener("mousedown", e => {
        obj.dataset.active = "true";
        obj.style.cursor = "grabbing";
        obj.dataset.offsetX = e.clientX - parseFloat(obj.dataset.x);
        obj.dataset.offsetY = e.clientY - parseFloat(obj.dataset.y);
        obj.dataset.lastX = e.clientX;
        obj.dataset.lastY = e.clientY;
    });
});

// Mouse move
window.addEventListener("mousemove", e => {
    objects.forEach(obj => {
        if (obj.dataset.active === "true") {
            const x = e.clientX - obj.dataset.offsetX;
            const y = e.clientY - obj.dataset.offsetY;

            obj.dataset.vx = (e.clientX - obj.dataset.lastX) * speedBoost;
            obj.dataset.vy = (e.clientY - obj.dataset.lastY) * speedBoost;
            obj.dataset.lastX = e.clientX;
            obj.dataset.lastY = e.clientY;

            obj.dataset.rotation = parseFloat(obj.dataset.rotation) + e.movementX * 0.8;
            obj.dataset.x = x;
            obj.dataset.y = y;
            obj.style.transform = `translate(${x}px, ${y}px) rotate(${obj.dataset.rotation}deg)`;
            makeTrail(obj);
        }
    });
});

// Mouse up
window.addEventListener("mouseup", () => {
    objects.forEach(obj => {
        if (obj.dataset.active === "true") {
            obj.dataset.active = "false";
            obj.style.cursor = "grab";
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
        dot.style.transition = "opacity 1.8s ease-out, transform 1.8s ease-out";
        dot.style.opacity = "0";
        dot.style.transform += " scale(0.1)";
    }, 20);
    setTimeout(() => dot.remove(), 1900);
}

// Animate
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

            if (x < 0) { x = 0; vx = -vx * damping; vr = -vr * damping; }
            if (y < navbarHeight) { y = navbarHeight; vy = -vy * damping; vr = -vr * damping; }
            if (x > maxX) { x = maxX; vx = -vx * damping; vr = -vr * damping; }
            if (y > maxY) { y = maxY; vy = -vy * damping; vr = -vr * damping; }

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
