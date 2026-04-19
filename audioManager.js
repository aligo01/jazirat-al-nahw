// نظام استمرار الصوت عبر الصفحات المتعددة
document.addEventListener("DOMContentLoaded", function() {
    // إنشاء عنصر الصوت برمجياً إذا لم يكن موجوداً
    let bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) {
        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.loop = true;
        bgMusic.preload = 'auto'; // تحميل مسبق تلقائي
        bgMusic.src = 'Forest Ambient Sound.m4a'; // صوت الغابة
        bgMusic.volume = 0.2; 
        document.body.appendChild(bgMusic);
    }

    // استعادة حالة الصوت
    const savedTime = sessionStorage.getItem('nasheedTime');
    const wasPlaying = sessionStorage.getItem('nasheedPlaying');
    const isMuted = sessionStorage.getItem('nasheedMuted') === 'true';

    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }
    
    if (isMuted) {
        bgMusic.muted = true;
    }

    // دالة التشغيل بذكاء
    const attemptPlay = () => {
        if (sessionStorage.getItem('nasheedMuted') === 'true') return;
        
        bgMusic.play().then(() => {
            sessionStorage.setItem('nasheedPlaying', 'true');
        }).catch(() => {
            // إذا فشل (بسبب قيود المتصفح)، ننتظر أول تفاعل
            console.log("Audio waiting for user interaction...");
        });
    };

    // المحاولة عند التحميل
    attemptPlay();

    // أي نقرة في أي مكان تبدأ الصوت فوراً إذا لم يكن قد بدأ
    document.addEventListener('click', function globalClick() {
        if (!bgMusic.muted && bgMusic.paused) {
            attemptPlay();
        }
    }, { once: false }); // نبقيها مستمعة لأي نقرة لضمان البدء

    // إضافة زر التحكم في الصوت
    const muteBtn = document.createElement('button');
    const updateBtnText = () => {
        // في الصفحة الرئيسية نستخدم نص، في الصفحات الأخرى أيقونة فقط
        const isMainPage = !document.querySelector('.back-btn');
        if (isMainPage) {
            muteBtn.innerHTML = bgMusic.muted ? '🔇 تشغيل صوت الخلفية' : '🔊 غلق صوت الخلفية';
        } else {
            muteBtn.innerHTML = bgMusic.muted ? '🔇' : '🔊';
            muteBtn.title = bgMusic.muted ? 'تشغيل صوت الخلفية' : 'غلق صوت الخلفية';
        }
    };
    updateBtnText();

    // تصميم الزر
    muteBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        border-radius: 20px;
        padding: 5px 12px;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        height: 34px;
        font-family: inherit;
        -webkit-tap-highlight-color: transparent;
    `;

    muteBtn.onclick = (e) => {
        e.stopPropagation(); // منع تداخل النقرات
        if (bgMusic.muted) {
            bgMusic.muted = false;
            sessionStorage.setItem('nasheedMuted', 'false');
            attemptPlay();
        } else {
            bgMusic.muted = true;
            sessionStorage.setItem('nasheedMuted', 'true');
        }
        updateBtnText();
    };

    // تحديد مكان الإضافة
    const backBtn = document.querySelector('.back-btn');
    const header = document.querySelector('.header');

    if (backBtn) {
        muteBtn.style.marginRight = '8px';
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            // نضع الزر بجانب زر العودة
            backBtn.insertAdjacentElement('afterend', muteBtn);
        }
    } else if (header) {
        muteBtn.style.background = 'white';
        muteBtn.style.color = '#2196F3';
        muteBtn.style.border = '2px solid #2196F3';
        muteBtn.style.margin = '15px auto';
        header.appendChild(muteBtn);
    }

    // حفظ التقدم عند الخروج
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('nasheedTime', bgMusic.currentTime);
        sessionStorage.setItem('nasheedPlaying', bgMusic.paused ? 'false' : 'true');
    });
});
