const objects = document.querySelectorAll('.flying-object');

objects.forEach(obj => {
    let isDragging = false;
    let offsetX, offsetY;
    let velocity = {x:0, y:0};

    // Random initial position
    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top  = Math.random() * (window.innerHeight - 50) + 'px';

    obj.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - obj.offsetLeft;
        offsetY = e.clientY - obj.offsetTop;
        velocity = {x:0, y:0};
    });

    document.addEventListener('mousemove', e => {
        if(!isDragging) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        velocity.x = x - obj.offsetLeft;
        velocity.y = y - obj.offsetTop;
        obj.style.left = x + 'px';
        obj.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        if(!isDragging) return;
        isDragging = false;
    });

    function animate() {
        if(!isDragging){
            // Simple inertia
            let x = obj.offsetLeft + velocity.x * 0.9;
            let y = obj.offsetTop  + velocity.y * 0.9;

            // Bounce walls
            if(x < 0 || x > window.innerWidth - 50) velocity.x *= -1;
            if(y < 0 || y > window.innerHeight - 50) velocity.y *= -1;

            obj.style.left = Math.min(Math.max(x,0), window.innerWidth-50) + 'px';
            obj.style.top  = Math.min(Math.max(y,0), window.innerHeight-50) + 'px';

            // friction
            velocity.x *= 0.95;
            velocity.y *= 0.95;
        }
        requestAnimationFrame(animate);
    }
    animate();
});
