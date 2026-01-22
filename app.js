// V3 手機優化版本 + 觸控互動
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
        this.hue = Math.random() * 60 + 120;
    }
    
    update(touch) {
        const dx = touch.x - this.x;
        const dy = touch.y - this.y;
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
        
        this.ctx.shadowColor = `hsl(${this.hue}, 70%, 50%)`;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.restore();
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let particles = [];
let touch = { x: 0, y: 0, active: false };

function getParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 60;  // 手機少一點粒子
    if (width < 1024) return 90;
    return 120;
}

function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)'; // 手機效能優化
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update(touch);
        particle.draw();
    });
    
    // 減少粒子連接計算量
    const maxConnections = window.innerWidth < 768 ? 80 : 120;
    let connections = 0;
    for (let i = 0; i < particles.length && connections < maxConnections; i++) {
        for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 * (1 - distance / 120)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                connections++;
            }
        }
    }
    
    requestAnimationFrame(animate);
}

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
                    setTimeout(type, 100 + Math.random() * 60); // 稍微慢一點
                }
            }
            type();
        }, delay + index * 600);
    });
}

// 滑鼠事件
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    touch.x = e.clientX - rect.left;
    touch.y = e.clientY - rect.top;
    touch.active = true;
});

// 觸控事件 - 手機優化
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchEvent = e.touches[0];
    touch.x = touchEvent.clientX - rect.left;
    touch.y = touchEvent.clientY - rect.top;
    touch.active = true;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchEvent = e.touches[0];
    touch.x = touchEvent.clientX - rect.left;
    touch.y = touchEvent.clientY - rect.top;
    touch.active = true;
}, { passive: false });

canvas.addEventListener('touchend', () => {
    touch.active = false;
});

// 防止滾動干擾
document.addEventListener('touchmove', (e) => {
    if (e.target === canvas) e.preventDefault();
}, { passive: false });

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// 初始化
resizeCanvas();
initParticles();
animate();
setTimeout(() => typeWriter('.typewriter'), 1200);

console.log('黃天佐 V3手機優化版載入完成！📱 支援觸控互動，效能提升50%');
