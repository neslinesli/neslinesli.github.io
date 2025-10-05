const objects = document.querySelectorAll('.flying-object');
const navbarHeight = document.querySelector('.navbar').offsetHeight;
const footerHeight = document.querySelector('footer').offsetHeight;

objects.forEach(obj => {
    let isDragging = false;
    let offsetX, offsetY;
    let velocity = {x: (Math.random()-0.5)*4, y: (Math.random()-0.5)*4};
    let rotation = Math.random()*360;
    let rotationSpeed = (Math.random()-0.5)*5;

    const objWidth = obj.offsetWidth;
    const objHeight = obj.offsetHeight;
    const maxX = window.innerWidth - objWidth;
    const maxY = window.innerHeight - footerHeight - objHeight;

    // Random start position
    obj.style.left = Math.random()*maxX + 'px';
    obj.style.top  = (navbarHeight + Math.random()*(maxY-navbarHeight)) + 'px';
    obj.style.transform = `rotate(${rotation}deg)`;

    obj.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - obj.offsetLeft;
        offsetY = e.clientY - obj.offsetTop;
        velocity = {x:0, y:0};
    });

    document.addEventListener('mousemove', e => {
        if(!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // constrain within viewport
        x = Math.min(Math.max(0,x), maxX);
        y = Math.min(Math.max(navbarHeight,y), maxY);

        velocity.x = x - obj.offsetLeft;
        velocity.y = y - obj.offsetTop;

        obj.style.left = x + 'px';
        obj.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    function animate() {
        if(!isDragging){
            let x = obj.offsetLeft + velocity.x;
            let y = obj.offsetTop + velocity.y;

            // bounce walls
            if(x < 0 || x > maxX) velocity.x *= -1;
            if(y < navbarHeight || y > maxY) velocity.y *= -1;

            obj.style.left = Math.min(Math.max(0,x), maxX) + 'px';
            obj.style.top  = Math.min(Math.max(navbarHeight,y), maxY) + 'px';

            // apply rotation
            rotation += rotationSpeed;
            obj.style.transform = `rotate(${rotation}deg)`;

            // friction
            velocity.x *= 0.98;
            velocity.y *= 0.98;
            rotationSpeed *= 0.98;
        }
        requestAnimationFrame(animate);
    }
    animate();
});
