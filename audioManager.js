// نظام استمرار الصوت عبر الصفحات المتعددة
document.addEventListener("DOMContentLoaded", function() {
    // إنشاء عنصر الصوت برمجياً إذا لم يكن موجوداً
    let bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) {
        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.loop = true;
        bgMusic.src = 'nasheed.wav';
        document.body.appendChild(bgMusic);
    }

    // استعادة وقت التشغيل من الصفحة السابقة لكي يبدو كأنه مستمر وغير منقطع
    const savedTime = sessionStorage.getItem('nasheedTime');
    const wasPlaying = sessionStorage.getItem('nasheedPlaying');

    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
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
