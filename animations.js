const objects = document.querySelectorAll('.flying-object');
const navbarHeight = document.querySelector('.navbar').offsetHeight;
const footerHeight = document.querySelector('footer').offsetHeight;

objects.forEach(obj => {
    let isDragging = false;
    let offsetX, offsetY;
    let velocity = {x:0, y:0};

    const objSize = 50;

    // Random initial position inside allowed area
    const maxY = window.innerHeight - footerHeight - objSize;
    const maxX = window.innerWidth - objSize;
    obj.style.left = Math.random() * maxX + 'px';
    obj.style.top = (navbarHeight + Math.random() * (maxY - navbarHeight)) + 'px';

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

        // constrain within viewport excluding navbar & footer
        x = Math.min(Math.max(0, x), maxX);
        y = Math.min(Math.max(navbarHeight, y), maxY);

        velocity.x = x - obj.offsetLeft;
        velocity.y = y - obj.offsetTop;

        obj.style.left = x + 'px';
        obj.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    function animate() {
        if(!isDragging){
            let x = obj.offsetLeft + velocity.x * 0.9;
            let y = obj.offsetTop  + velocity.y * 0.9;

            // bounce off edges
            if(x < 0 || x > maxX) velocity.x *= -1;
            if(y < navbarHeight || y > maxY) velocity.y *= -1;

            obj.style.left = Math.min(Math.max(0,x), maxX) + 'px';
            obj.style.top  = Math.min(Math.max(navbarHeight,y), maxY) + 'px';

            velocity.x *= 0.95;
            velocity.y *= 0.95;
        }
        requestAnimationFrame(animate);
    }
    animate();
});
