const objects = document.querySelectorAll('.flying-object');

objects.forEach(obj => {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    obj.style.left = x + 'px';
    obj.style.top = y + 'px';

    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;

    function animate() {
        x += speedX;
        y += speedY;

        // wrap around screen
        if(x > window.innerWidth) x = 0;
        if(x < 0) x = window.innerWidth;
        if(y > window.innerHeight) y = 0;
        if(y < 0) y = window.innerHeight;

        obj.style.left = x + 'px';
        obj.style.top = y + 'px';

        requestAnimationFrame(animate);
    }
    animate();
});
