// script.js
document.getElementById('JoinButton').addEventListener('mouseenter', (event) => {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    const confettiImg = new Image();
    confettiImg.src = 'img/glitter.png'; 

    const confettiCount = 200; 
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60; 

        const speed = Math.random() * 5 + 1;
        const size = Math.random() * 25 + 10; 

        const posX = buttonX + Math.cos(angle) * distance;
        const posY = buttonY + Math.sin(angle) * distance;

        confetti.push({
            x: posX,
            y: posY,
            size: size,
            image: confettiImg,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            gravity: 0, 
            angle: Math.random() * 360,
            spin: Math.random() * 10,
            opacity: 1, 
            fade: Math.random() * 0.02 + 0.01, 
            fadeDelay: 60 + Math.random() * 20 
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = confetti.length - 1; i >= 0; i--) {
            const particle = confetti[i];
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.angle += particle.spin;

            if (particle.fadeDelay > 0) {
                particle.fadeDelay -= 1;
            } else {
                particle.opacity -= particle.fade;
            }

            if (particle.opacity <= 0) {
                confetti.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.angle * Math.PI / 180);
            ctx.globalAlpha = particle.opacity;
            ctx.drawImage(particle.image, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
        }
        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();
});
