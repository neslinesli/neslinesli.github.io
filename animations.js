const objects = document.querySelectorAll('.flying-object');
const navbarHeight = document.querySelector('.navbar').offsetHeight;
const footerHeight = document.querySelector('footer').offsetHeight;

objects.forEach(obj => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let prevMouse = {x:0, y:0};
    let velocity = {x:(Math.random()-0.5)*4, y:(Math.random()-0.5)*4};
    let rotation = Math.random()*360;
    let rotationSpeed = (Math.random()-0.5)*5;

    const objWidth = obj.offsetWidth;
    const objHeight = obj.offsetHeight;

    function getMaxX() { return window.innerWidth - objWidth; }
    function getMaxY() { return window.innerHeight - footerHeight - objHeight; }

    // Random start
    obj.style.left = Math.random()*getMaxX() + 'px';
    obj.style.top  = (navbarHeight + Math.random()*(getMaxY()-navbarHeight)) + 'px';
    obj.style.transform = `rotate(${rotation}deg)`;

    obj.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - obj.offsetLeft;
        offsetY = e.clientY - obj.offsetTop;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
    });

    document.addEventListener('mousemove', e => {
        if(!isDragging) return;

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        x = Math.min(Math.max(0,x), getMaxX());
        y = Math.min(Math.max(navbarHeight,y), getMaxY());

        // velocity = delta mouse movement
        velocity.x = e.clientX - prevMouse.x;
        velocity.y = e.clientY - prevMouse.y;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;

        obj.style.left = x + 'px';
        obj.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    function animate() {
        if(!isDragging){
            let x = obj.offsetLeft + velocity.x;
            let y = obj.offsetTop  + velocity.y;

            // bounce
            if(x < 0) { x=0; velocity.x*=-1; }
            if(x > getMaxX()) { x=getMaxX(); velocity.x*=-1; }
            if(y < navbarHeight) { y=navbarHeight; velocity.y*=-1; }
            if(y > getMaxY()) { y=getMaxY(); velocity.y*=-1; }

            obj.style.left = x + 'px';
            obj.style.top  = y + 'px';

            rotation += rotationSpeed;
            obj.style.transform = `rotate(${rotation}deg)`;

            // friction
            velocity.x *= 0.95;
            velocity.y *= 0.95;
            rotationSpeed *= 0.95;
        }
        requestAnimationFrame(animate);
    }
    animate();
});
