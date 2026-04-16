// نظام استمرار الصوت عبر الصفحات المتعددة
document.addEventListener("DOMContentLoaded", function() {
    // إنشاء عنصر الصوت برمجياً إذا لم يكن موجوداً
    let bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) {
        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.loop = true;
        bgMusic.src = 'nasheed.wav';
        bgMusic.volume = 0.2; // خفض الصوت ليكون في الخلفية
        document.body.appendChild(bgMusic);
    }

    // استعادة وقت التشغيل من الصفحة السابقة لكي يبدو كأنه مستمر وغير منقطع
    const savedTime = sessionStorage.getItem('nasheedTime');
    const wasPlaying = sessionStorage.getItem('nasheedPlaying');
    const isMuted = sessionStorage.getItem('nasheedMuted') === 'true';

    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }
    
    if (isMuted) {
        bgMusic.muted = true;
    }

    // محاولة التشغيل المستمر
    const playMusic = () => {
        bgMusic.play().then(() => {
            sessionStorage.setItem('nasheedPlaying', 'true');
        }).catch(() => {
            // إذا منع المتصفح التشغيل، ننتظر أول نقرة في أي مكان بالصفحة
            document.body.addEventListener('click', function playOnClick() {
                bgMusic.play();
                sessionStorage.setItem('nasheedPlaying', 'true');
                document.body.removeEventListener('click', playOnClick);
            }, { once: true });
        });
    };

    // تشغيل مباشر إذا كان يعمل في الصفحة السابقة، أو انتظار النقرة الأولى
    if (wasPlaying === 'true') {
        playMusic();
    } else {
        document.body.addEventListener('click', playOnClickInit = () => {
             playMusic();
             document.body.removeEventListener('click', playOnClickInit);
        }, { once: true });
    }

    // إضافة زر التحكم في الصوت
    const muteBtn = document.createElement('button');
    const updateBtnText = () => {
        muteBtn.innerHTML = bgMusic.muted ? '🔇' : '🔊';
        muteBtn.title = bgMusic.muted ? 'تشغيل الآهات' : 'إيقاف الآهات';
    };
    updateBtnText();

    // تصميم الزر ليكون متوافقاً مع زر العودة
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
        margin-right: 8px;
        height: 34px;
        font-family: inherit;
    `;

    muteBtn.onclick = () => {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            sessionStorage.setItem('nasheedMuted', 'false');
            if (bgMusic.paused) playMusic();
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
        // إذا وجد زر العودة (في صفحات الألعاب) الإضافة بجانبه
        backBtn.style.display = 'inline-flex';
        backBtn.style.alignItems = 'center';
        
        // نضعهم في حاوية واحدة لضمان الالتصاق
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        
        backBtn.parentNode.insertBefore(container, backBtn);
        container.appendChild(backBtn);
        container.appendChild(muteBtn);
    } else if (header) {
        // في الصفحة الرئيسية، نضعه أسفل العنوان بشكل أنيق
        muteBtn.style.background = 'white';
        muteBtn.style.color = '#2196F3';
        muteBtn.style.border = '2px solid #2196F3';
        muteBtn.style.margin = '10px auto';
        muteBtn.innerHTML = bgMusic.muted ? '🔇 تشغيل الآهات' : '🔊 إيقاف الآهات';
        updateBtnText = () => {
            muteBtn.innerHTML = bgMusic.muted ? '🔇 تشغيل الآهات' : '🔊 إيقاف الآهات';
        };
        header.appendChild(muteBtn);
    } else {
        // حالة احتياطية
        muteBtn.style.position = 'fixed';
        muteBtn.style.bottom = '20px';
        muteBtn.style.left = '15px';
        muteBtn.style.zIndex = '9999';
        muteBtn.style.background = 'white';
        muteBtn.style.color = '#2196F3';
        document.body.appendChild(muteBtn);
    }

    // حفظ مكان ثانية التشغيل عند القفز للألعاب أو الخروج منها (ليستمر النشيد بدقة)
    window.addEventListener('beforeunload', () => {
        if(!bgMusic.paused) {
            sessionStorage.setItem('nasheedTime', bgMusic.currentTime);
            sessionStorage.setItem('nasheedPlaying', 'true');
        } else {
            sessionStorage.setItem('nasheedPlaying', 'false');
        }
    });
});
