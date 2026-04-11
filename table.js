const tableData = [
    { type: "المفرد وجمع التكسير", answers: ["الضمة", "الفتحة", "الكسرة", "--"] },
    { type: "الممنوع من الصرف", answers: ["الضمة", "الفتحة", "الفتحة", "--"] },
    { type: "جمع المؤنث السالم", answers: ["الضمة", "الكسرة", "الكسرة", "--"] },
    { type: "جمع المذكر السالم", answers: ["الواو", "الياء", "الياء", "--"] },
    { type: "المثنى", answers: ["الألف", "الياء", "الياء", "--"] },
    { type: "الأسماء الخمسة", answers: ["الواو", "الألف", "الياء", "--"] },
    { type: "فعل مضارع صحيح الآخر", answers: ["الضمة", "الفتحة", "--", "السكون"] },
    { type: "فعل مضارع معتل الآخر", answers: ["الضمة", "الفتحة", "--", "حذف حرف العلة"] },
    { type: "الأفعال الخمسة", answers: ["ثبوت النون", "حذف النون", "--", "حذف النون"] }
];

const availableSigns = [
    "الضمة", "الفتحة", "الكسرة", 
    "الواو", "الياء", "الألف",
    "السكون", "حذف حرف العلة", 
    "ثبوت النون", "حذف النون", "--"
];

let selectedSign = null;
let currentLives = 3;
const successAudio = new Audio('clap.mp3'); // ملف التصفيق

// متغيرات العداد الزمني
let timerInterval = null;
let secondsElapsed = 0;
let gameStarted = false;

// دالة تنسيق الثواني إلى (دقيقة:ثانية)
function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// دالة بدء العداد
function startTimer() {
    if (gameStarted) return; // لضمان عدم تشغيل أكثر من عداد
    gameStarted = true;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        document.getElementById("timerDisplay").textContent = `الوقت: ${formatTime(secondsElapsed)}`;
    }, 1000);
}

// دالة إيقاف العداد
function stopTimer() {
    clearInterval(timerInterval);
}

// دالة تصفير العداد
function resetTimer() {
    stopTimer();
    secondsElapsed = 0;
    gameStarted = false;
    document.getElementById("timerDisplay").textContent = "الوقت: 00:00";
}

// تحديث عرض القلوب
function updateLivesDisplay() {
    const livesEl = document.getElementById("livesVal");
    if(livesEl) livesEl.textContent = '❤️'.repeat(currentLives) + '💔'.repeat(3 - currentLives);
}

// بناء بنك العلامات
function renderSignsBank() {
    const bank = document.getElementById("signsBank");
    bank.innerHTML = '';
    availableSigns.forEach(sign => {
        const span = document.createElement("span");
        span.className = "sign-badge";
        span.textContent = sign;
        span.onclick = () => selectSign(span, sign);
        bank.appendChild(span);
    });
}

// تحديد علامة من البنك
function selectSign(element, sign) {
    // إزالة التحديد السابق
    document.querySelectorAll(".sign-badge").forEach(el => el.classList.remove("selected"));
    element.classList.add("selected");
    selectedSign = sign;

    // تمييز الخانات القابلة للإسقاط
    document.querySelectorAll(".drop-slot:not(.success)").forEach(slot => {
        slot.classList.add("selected-target");
    });
}

// بناء الجدول (بدون عشوائية كما طلبت)
function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = '';

    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        
        // الخلية الجانبية (نوع الكلمة)
        const headerTd = document.createElement("td");
        headerTd.className = "row-header";
        headerTd.textContent = row.type;
        tr.appendChild(headerTd);

        // خلايا العلامات الأربع
        row.answers.forEach((correctAnswer, colIndex) => {
            const td = document.createElement("td");
            td.className = "drop-slot";
            td.dataset.answer = correctAnswer; 
            // نمرر الصف والخلية الرأسية لدالة المحاولة لكي نلونها إذا اكتملت
            td.onclick = () => attemptDrop(td, tr, headerTd);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
    
    // نصيحة البنك المعتادة
    const bankTitle = document.getElementById("bankTitle");
    bankTitle.innerHTML = "اختر العلامة من هنا 👇";
    bankTitle.style.color = "var(--text-muted)";
}

// محاولة وضع الإجابة
function attemptDrop(cell, rowElement, headerElement) {
    startTimer(); // يبدأ العداد مع أول نقرة يقوم بها الطالب في الجدول

    if (!selectedSign || cell.classList.contains("success")) {
        if(!selectedSign) {
            const bankTitle = document.getElementById("bankTitle");
            bankTitle.style.color = "red";
            setTimeout(() => bankTitle.style.color = "", 1000);
        }
        return;
    }

    const expectedAnswer = cell.dataset.answer;

    if (selectedSign === expectedAnswer) {
        // إجابة صحيحة وتشغيل التصفيق
        successAudio.currentTime = 0;
        successAudio.play().catch(e => {});

        cell.textContent = selectedSign;
        cell.classList.remove("error", "selected-target");
        cell.classList.add("success");
        
        checkRowWin(rowElement, headerElement); // فحص إذا اكتمل السطر
        checkTableWin(); // فحص إذا اكتمل الجدول
    } else {
        // إجابة خاطئة
        cell.textContent = selectedSign;
        cell.classList.remove("success");
        cell.classList.add("error");
        
        currentLives--;
        updateLivesDisplay();

        setTimeout(() => {
            cell.textContent = "";
            cell.classList.remove("error");
            
            if (currentLives <= 0) {
                gameOver();
            }
        }, 800);
    }
}

// دالة فحص اكتمال سطر معين
function checkRowWin(rowElement, headerElement) {
    const allSlotsInRow = rowElement.querySelectorAll('.drop-slot');
    const successSlotsInRow = rowElement.querySelectorAll('.drop-slot.success');
    
    if (allSlotsInRow.length > 0 && allSlotsInRow.length === successSlotsInRow.length) {
        // السطر اكتمل، قم بتلوينه ووضع علامة الصح
        headerElement.classList.add('row-done');
        // تفادي تكرار التحديد إذا تم النقر عليه بطريقة ما عبر حدث آخر
        if(!headerElement.textContent.includes("✅")) {
            headerElement.innerHTML = headerElement.textContent + " ✅";
        }
    }
}

// دالة فحص الفوز باكمال الجدول كله
function checkTableWin() {
    const allSlots = document.querySelectorAll('.drop-slot');
    const successSlots = document.querySelectorAll('.drop-slot.success');
    
    if(allSlots.length > 0 && allSlots.length === successSlots.length) {
        stopTimer(); // إيقاف العداد
        if(typeof throwConfetti === 'function') throwConfetti();
        
        // إظهار رسالة النجاح والوقت
        setTimeout(() => {
            const tb = document.getElementById("bankTitle");
            tb.innerHTML = `🎉 ممتاز! لقد أنهيت الجدول في: <span style="background:#FFEB3B; padding:2px 8px; border-radius:5px; color:#333;">${formatTime(secondsElapsed)}</span> 🎉`;
            tb.style.color = "var(--success-color)";
            tb.style.fontWeight = "bold";
            tb.style.fontSize = "1.1rem";
        }, 500);
    }
}

// دالة الخسارة وإعادة اللعب
function gameOver() {
    stopTimer();
    alert("انتهت كل محاولاتك! ركز واستعن بالله وحاول مرة أخرى.");
    currentLives = 3;
    updateLivesDisplay();
    resetTimer(); // تصفير الوقت للبدء من جديد
    renderTable(); // إعادة بناء الجدول
}

// التشغيل الأولي
document.addEventListener("DOMContentLoaded", () => {
    updateLivesDisplay();
    renderSignsBank();
    renderTable();
});
