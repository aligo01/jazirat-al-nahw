// البيانات الأساسية لجدول الإعراب
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

// بنك العلامات (إمداد غير محدود ليسهل الاستخدام)
const availableSigns = [
    "الضمة", "الفتحة", "الكسرة", 
    "الواو", "الياء", "الألف",
    "السكون", "حذف حرف العلة", 
    "ثبوت النون", "حذف النون", "--"
];

// متغير لحفظ العلامة المحددة حالياً من بنك العلامات
let selectedSign = null;

// دالة لبناء بنك العلامات
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

// دالة اختيار علامة من البنك
function selectSign(element, sign) {
    // إزالة التحديد من جميع العلامات
    document.querySelectorAll(".sign-badge").forEach(el => el.classList.remove("selected"));
    
    // تحديد العلامة الجديدة
    element.classList.add("selected");
    selectedSign = sign;

    // تمييز الجدول بصرياً لإشعار المستخدم بأنه جاهز للنقر
    document.querySelectorAll(".drop-slot:not(.success)").forEach(slot => {
        slot.classList.add("selected-target");
    });
}

// دالة لبناء جدول الإعراب
function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = '';

    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        
        // خلية نوع الكلمة (ثابتة)
        const headerTd = document.createElement("td");
        headerTd.className = "row-header";
        headerTd.textContent = row.type;
        tr.appendChild(headerTd);

        // خلايا الحالات الإعرابية الأربع (مربعات فارغة للإجابة)
        row.answers.forEach((correctAnswer, colIndex) => {
            const td = document.createElement("td");
            td.className = "drop-slot";
            td.dataset.answer = correctAnswer; // تخزين الإجابة الصحيحة مخفية في الخلية
            td.onclick = () => attemptDrop(td);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// دالة محاولة وضع العلامة في الجدول
function attemptDrop(cell) {
    // إذا لم يتم تحديد علامة، أو الخلية محلولة مسبقاً، نخرج
    if (!selectedSign || cell.classList.contains("success")) {
        // تنبيه بسيط لمن لم يختر علامة
        if(!selectedSign) {
            const bankTitle = document.querySelector(".bank-title");
            bankTitle.style.color = "red";
            setTimeout(() => bankTitle.style.color = "", 1000);
        }
        return;
    }

    const expectedAnswer = cell.dataset.answer;

    if (selectedSign === expectedAnswer) {
        // إجابة صحيحة
        cell.textContent = selectedSign;
        cell.classList.remove("error", "selected-target");
        cell.classList.add("success");
        checkTableWin();
    } else {
        // إجابة خاطئة
        cell.textContent = selectedSign;
        cell.classList.remove("success");
        cell.classList.add("error");
        
        // إفراغ الخلية بعد لحظة قصيرة وإزالة الاهتزاز
        setTimeout(() => {
            cell.textContent = "";
            cell.classList.remove("error");
        }, 800);
    }
}

// تشغيل الدوال عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    renderSignsBank();
    renderTable();
});

// دالة فحص الفوز باكمال الجدول
function checkTableWin() {
    const allSlots = document.querySelectorAll('.drop-slot');
    const successSlots = document.querySelectorAll('.drop-slot.success');
    if(allSlots.length > 0 && allSlots.length === successSlots.length) {
        if(typeof throwConfetti === 'function') throwConfetti();
        
        // إظهار رسالة للطفل
        setTimeout(() => {
            const tb = document.querySelector('.bank-title');
            tb.innerHTML = "🎉 بطل الأبطال! لقد رتبت الجدول بالكامل بنجاح! 🎉";
            tb.style.color = "var(--success-color)";
            tb.style.fontWeight = "bold";
            tb.style.fontSize = "1.2rem";
        }, 500);
    }
}
