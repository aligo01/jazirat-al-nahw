// قاعدة بيانات الكلمات الواسعة لتعزيز الفهم بالتشابه والتكرار
const wordDatabase = [
    // المفرد
    { word: "طفل", type: "مفرد" }, { word: "كتاب", type: "مفرد" }, { word: "قلم", type: "مفرد" },
    { word: "بحر", type: "مفرد" }, { word: "سماء", type: "مفرد" }, { word: "ولد", type: "مفرد" },
    { word: "طبيب", type: "مفرد" }, { word: "مهندس", type: "مفرد" }, { word: "معلم", type: "مفرد" },
    { word: "شجرة", type: "مفرد" }, { word: "جبل", type: "مفرد" }, { word: "قمر", type: "مفرد" },
    
    // المثنى
    { word: "طفلان", type: "مثنى" }, { word: "كتابان", type: "مثنى" }, { word: "قلمان", type: "مثنى" },
    { word: "رجلان", type: "مثنى" }, { word: "شجرتان", type: "مثنى" }, { word: "طبيبان", type: "مثنى" },
    { word: "مهندسان", type: "مثنى" }, { word: "ولدان", type: "مثنى" }, { word: "بنتان", type: "مثنى" },
    { word: "عينان", type: "مثنى" }, { word: "قمرين", type: "مثنى" }, { word: "صديقين", type: "مثنى" },

    // جمع المذكر السالم
    { word: "مسلمون", type: "جمع مذكر سالم" }, { word: "مؤمنون", type: "جمع مذكر سالم" }, 
    { word: "معلمون", type: "جمع مذكر سالم" }, { word: "صابرون", type: "جمع مذكر سالم" }, 
    { word: "فائزون", type: "جمع مذكر سالم" }, { word: "مهندسون", type: "جمع مذكر سالم" }, 
    { word: "فلاحون", type: "جمع مذكر سالم" }, { word: "لاعبون", type: "جمع مذكر سالم" }, 
    { word: "كاتبون", type: "جمع مذكر سالم" }, { word: "مسلمين", type: "جمع مذكر سالم" }, 
    
    // جمع المؤنث السالم
    { word: "مسلمات", type: "جمع مؤنث سالم" }, { word: "مؤمنات", type: "جمع مؤنث سالم" }, 
    { word: "طالبات", type: "جمع مؤنث سالم" }, { word: "معلمات", type: "جمع مؤنث سالم" }, 
    { word: "شجرات", type: "جمع مؤنث سالم" }, { word: "سماوات", type: "جمع مؤنث سالم" }, 
    { word: "تلميذات", type: "جمع مؤنث سالم" }, { word: "طبيبات", type: "جمع مؤنث سالم" }, 
    { word: "مهندسات", type: "جمع مؤنث سالم" }, { word: "سيارات", type: "جمع مؤنث سالم" },

    // جمع التكسير
    { word: "أطفال", type: "جمع تكسير" }, { word: "كتب", type: "جمع تكسير" }, 
    { word: "أقلام", type: "جمع تكسير" }, { word: "بحار", type: "جمع تكسير" }, 
    { word: "أولاد", type: "جمع تكسير" }, { word: "أطباء", type: "جمع تكسير" }, 
    { word: "جبال", type: "جمع تكسير" }, { word: "مساجد", type: "جمع تكسير" }, 
    { word: "مدارس", type: "جمع تكسير" }, { word: "رجال", type: "جمع تكسير" }, 
    { word: "ألوان", type: "جمع تكسير" }, { word: "نجوم", type: "جمع تكسير" },

    // الأسماء الخمسة
    { word: "أبوك", type: "الأسماء الخمسة" }, { word: "أخوك", type: "الأسماء الخمسة" }, 
    { word: "حموك", type: "الأسماء الخمسة" }, { word: "فوك", type: "الأسماء الخمسة" }, 
    { word: "ذو", type: "الأسماء الخمسة" }, { word: "أباك", type: "الأسماء الخمسة" }, 
    { word: "أخاك", type: "الأسماء الخمسة" }, { word: "أبيك", type: "الأسماء الخمسة" }, 
    { word: "أخيك", type: "الأسماء الخمسة" }
];

let currentWordObj = null;
let score = 0;
let isAnimating = false;
let currentLives = 3;
const successAudio = new Audio('clap.mp3'); // ملف التصفيق

// استدعاء وتحديث القلوب
function updateLivesDisplay() {
    const livesEl = document.getElementById("livesVal");
    if(livesEl) livesEl.textContent = '❤️'.repeat(currentLives) + '💔'.repeat(3 - currentLives);
}

// دالة الخسارة للقطار
function gameOver() {
    alert(`انتهت كل محاولاتك! التذاكر التي جمعتها: ${score}. هل نُحاول من جديد؟`);
    score = 0;
    currentLives = 3;
    document.getElementById("scoreVal").textContent = score;
    updateLivesDisplay();
    loadNewTicket();
}

// دالة لجلب كلمة عشوائية
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordDatabase.length);
    return wordDatabase[randomIndex];
}

// دالة لتهيئة التذكرة الجديدة
function loadNewTicket() {
    currentWordObj = getRandomWord();
    
    const ticketCard = document.getElementById("currentTicket");
    const wordDisplay = document.getElementById("wordDisplay");
    
    // إزالة آثار الأنيميشن السابق
    ticketCard.className = "ticket-card ticket-in";
    
    // تحديث النص
    wordDisplay.textContent = currentWordObj.word;

    // تنظيف الأنيميشن بعد انتهائه
    setTimeout(() => {
        ticketCard.classList.remove("ticket-in");
        isAnimating = false;
    }, 500);
}

// دالة فحص الإجابة عند النقر على المقطورات
function checkAnswer(selectedType) {
    if (isAnimating) return; // منع النقر السريع المتعدد أثناء الحركة

    const ticketCard = document.getElementById("currentTicket");

    if (selectedType === currentWordObj.type) {
        // إجابة صحيحة
        successAudio.currentTime = 0;
        successAudio.play().catch(e => {});

        isAnimating = true;
        score++;
        document.getElementById("scoreVal").textContent = score;

        // ميزة الاحتفال كل 5 نقاط صحيحة كتعزيز إيجابي
        if (score % 5 === 0 && typeof throwConfetti === 'function') {
            throwConfetti();
        }

        // تأثير الطيران للخارج (تطير التذكرة للمقطورة)
        ticketCard.className = "ticket-card ticket-out";

        // تحميل التذكرة الجديدة بعد اختفاء الحالية
        setTimeout(() => {
            loadNewTicket();
        }, 500);

    } else {
        // إجابة خاطئة
        isAnimating = true;

        // إزالة الأنيميشن القديم ثم إضافة الاهتزاز
        ticketCard.classList.remove("ticket-shake");
        // حيلة لإعادة تشغيل الأنيميشن
        void ticketCard.offsetWidth; 
        ticketCard.classList.add("ticket-shake");

        // خصم القلب هنا
        currentLives--;
        updateLivesDisplay();

        // فك القفل بعد انتهاء الاهتزاز ليحاول مجدداً
        setTimeout(() => {
            ticketCard.classList.remove("ticket-shake");
            isAnimating = false;
            
            // تحقق من نهاية اللعبة
            if(currentLives <= 0) {
                gameOver();
            }
        }, 400);
    }
}

// تشغيل اللعبة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    loadNewTicket();
});
