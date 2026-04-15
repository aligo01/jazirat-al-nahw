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

    // إضافة زر التحكم في الصوت العائم
    const muteBtn = document.createElement('button');
    muteBtn.innerHTML = isMuted ? '🔇 تشغيل الآهات' : '🔊 إيقاف الآهات';
    muteBtn.style.cssText = `
        position: fixed;
        left: 15px;
        z-index: 9999;
        background: #fff;
        border: 2px solid #2196F3;
        color: #2196F3;
        border-radius: 20px;
        padding: 5px 12px;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: inherit;
        transition: all 0.2s ease;
    `;
    
    if (document.getElementById('signsBank')) {
        // في صفحة الجدول، نرفعه لكي لا يغطي بنك الإجابات الملامس للأسفل
        muteBtn.style.bottom = "165px"; 
    } else {
        // في باقي الصفحات يكون بالأسفل كالمعتاد
        muteBtn.style.bottom = "20px";
    }

    muteBtn.onclick = () => {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            muteBtn.innerHTML = '🔊 إيقاف الآهات';
            sessionStorage.setItem('nasheedMuted', 'false');
            if (bgMusic.paused) {
                playMusic();
            }
        } else {
            bgMusic.muted = true;
            muteBtn.innerHTML = '🔇 تشغيل الآهات';
            sessionStorage.setItem('nasheedMuted', 'true');
        }
    };
    document.body.appendChild(muteBtn);

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
