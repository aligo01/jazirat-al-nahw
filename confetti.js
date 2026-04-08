// مكتبة قصاصات الورق الاحتفالية (Confetti) المصغرة
function throwConfetti() {
    const colors = ['#2F80ED', '#F2994A', '#27AE60', '#EB5757', '#FFD700', '#9B51E0'];
    const amount = 80; // عدد القصاصات
    
    for (let i = 0; i < amount; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color) {
    const piece = document.createElement('div');
    piece.style.position = 'fixed';
    piece.style.width = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 16 + 8) + 'px';
    piece.style.backgroundColor = color;
    piece.style.top = '-20px';
    piece.style.left = (Math.random() * 100) + 'vw';
    piece.style.opacity = Math.random() + 0.5;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.pointerEvents = 'none';
    piece.style.zIndex = '9999';
    piece.style.borderRadius = (Math.random() > 0.5) ? '50%' : '2px';
    document.body.appendChild(piece);

    // حركة السقوط لأسفل الشاشة
    const fallDuration = Math.random() * 2000 + 2000;
    const animation = piece.animate([
        { transform: `translate3d(0,0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate3d(${Math.random() * 150 - 75}px, 110vh, 0) rotate(${Math.random() * 500}deg)`, opacity: 0 }
    ], {
        duration: fallDuration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => piece.remove();
}
