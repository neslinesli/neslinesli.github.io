document.addEventListener("DOMContentLoaded", () => {
  const objs = document.querySelectorAll('.flying-object');
  const speed = 0.3;

  const states = Array.from(objs).map(obj => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * speed * 10,
    vy: (Math.random() - 0.5) * speed * 10,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 2
  }));

  // trail container
  const trailCanvas = document.createElement('canvas');
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
  trailCanvas.style.position = 'fixed';
  trailCanvas.style.top = '0';
  trailCanvas.style.left = '0';
  trailCanvas.style.pointerEvents = 'none';
  trailCanvas.style.zIndex = '0';
  document.body.appendChild(trailCanvas);
  const ctx = trailCanvas.getContext('2d');

  function animate() {
    // fade old trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // adjust fade strength here
    ctx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);

    objs.forEach((obj, i) => {
      const s = states[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vrot;
      if (s.x < -50 || s.x > window.innerWidth + 50) s.vx *= -1;
      if (s.y < -50 || s.y > window.innerHeight + 50) s.vy *= -1;

      // Draw faint trail
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      obj.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
});
