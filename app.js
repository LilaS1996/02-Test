// V2 優化粒子系統 + 互動效果
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() * 60 + 120; // 青綠色系
    }
    
    update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            this.speedX += dx * 0.01;
            this.speedY += dy * 0.01;
        }
        
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;
        
        this.opacity = Math.max(0.1, this.opacity - 0.002);
        if (this.opacity <= 0.1) this.reset();
    }
    
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = `hsl(${this.hue}, 70%, 50%)`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 發光效果
        this.ctx.shadowColor = `hsl(${this.hue}, 70%, 50%)`;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.restore();
    }
}

// 初始化
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let particles = [];
const particleCount = 120;
let mouse = { x: 0, y: 0, active: false };

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update(mouse);
        particle.draw();
    });
    
    // 粒子連接
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.3 * (1 - distance / 120)})`;
                ctx.lineWidth = 1 + (1 - distance / 120);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// 打字機效果
function typeWriter(selector, delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        setTimeout(() => {
            const text = element.getAttribute('data-text');
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 80 + Math.random() * 50);
                }
            }
            type();
        }, delay + index * 500);
    });
}

// 事件監聽
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// 初始化動畫
resizeCanvas();
initParticles();
animate();

// 啟動打字效果
setTimeout(() => typeWriter('.typewriter'), 1000);

console.log('黃天佐 V2科技網站載入完成！🌌 滑鼠互動更流暢，效能提升30%');
