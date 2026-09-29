// State Aplikasi
let currentDate = new Date();
const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Key Helper untuk LocalStorage Terikat Bulan & Tahun
function getStorageKey(type) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  return `${type}_${year}_${month}`;
}

// Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// DOM Elements
const currentMonthYearEl = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

// Gym Elements
const gymForm = document.getElementById('gymForm');
const gymInput = document.getElementById('gymInput');
const gymDaySelect = document.getElementById('gymDaySelect');
const gymList = document.getElementById('gymList');
const gymProgressBadge = document.getElementById('gymProgressBadge');

// Savings Elements
const savingsForm = document.getElementById('savingsForm');
const savingsAmount = document.getElementById('savingsAmount');
const savingsNote = document.getElementById('savingsNote');
const savingsList = document.getElementById('savingsList');
const totalSavedText = document.getElementById('totalSavedText');
const targetSavingsText = document.getElementById('targetSavingsText');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const setTargetBtn = document.getElementById('setTargetBtn');

// Expense Elements (Baru)
const expenseForm = document.getElementById('expenseForm');
const expenseAmountInput = document.getElementById('expenseAmountInput');
const expenseNoteInput = document.getElementById('expenseNoteInput');
const expenseList = document.getElementById('expenseList');
const totalExpenseText = document.getElementById('totalExpenseText');

// Cust / Debt Elements
const custForm = document.getElementById('custForm');
const custNameInput = document.getElementById('custNameInput');
const custAmountInput = document.getElementById('custAmountInput');
const custNoteInput = document.getElementById('custNoteInput');
const custList = document.getElementById('custList');
const totalCustDeptText = document.getElementById('totalCustDeptText');

// Calendar Elements
const calendarGrid = document.getElementById('calendarGrid');
const calendarCheckCount = document.getElementById('calendarCheckCount');
const calendarMonthYearText = document.getElementById('calendarMonthYearText');

// Initialize
function init() {
  updateHeaderDate();
  loadGymData();
  loadSavingsData();
  loadExpenseData();
  loadCustData();
  renderCalendar();
}

// Header Date Nav
function updateHeaderDate() {
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  currentMonthYearEl.textContent = `${month} ${year}`;
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  init();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  init();
});

// --- FITUR GYM ---
function getGymData() {
  const key = getStorageKey('gym');
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveGymData(data) {
  localStorage.setItem(getStorageKey('gym'), JSON.stringify(data));
}

function loadGymData() {
  const tasks = getGymData();
  gymList.innerHTML = '';
  
  let completedCount = 0;

  tasks.forEach((task, index) => {
    if (task.completed) completedCount++;

    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleGymTask(${index})">
        <span class="todo-text">${task.title}</span>
        <span class="day-tag">${task.day}</span>
      </div>
      <button class="delete-btn" onclick="deleteGymTask(${index})"><i class="fa-solid fa-trash"></i></button>
    `;
    gymList.appendChild(li);
  });

  gymProgressBadge.textContent = `${completedCount}/${tasks.length} Selesai`;
}

gymForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const tasks = getGymData();
  tasks.push({
    title: gymInput.value,
    day: gymDaySelect.value,
    completed: false
  });
  saveGymData(tasks);
  gymInput.value = '';
  loadGymData();
});

window.toggleGymTask = function(index) {
  const tasks = getGymData();
  tasks[index].completed = !tasks[index].completed;
  saveGymData(tasks);
  loadGymData();
};

window.deleteGymTask = function(index) {
  const tasks = getGymData();
  tasks.splice(index, 1);
  saveGymData(tasks);
  loadGymData();
};


// --- FITUR MENABUNG ---
function getSavingsTarget() {
  const key = getStorageKey('savings_target');
  return parseInt(localStorage.getItem(key)) || 300000;
}

function saveSavingsTarget(target) {
  localStorage.setItem(getStorageKey('savings_target'), target);
}

function getSavingsData() {
  const key = getStorageKey('savings');
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveSavingsData(data) {
  localStorage.setItem(getStorageKey('savings'), JSON.stringify(data));
}

function loadSavingsData() {
  const history = getSavingsData();
  const target = getSavingsTarget();
  savingsList.innerHTML = '';

  let totalSaved = 0;

  history.forEach((item, index) => {
    totalSaved += item.amount;
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <span>${item.note}</span>
      <div>
        <span class="history-amount">+${formatRupiah(item.amount)}</span>
        <button class="delete-btn" style="margin-left: 8px;" onclick="deleteSavingsItem(${index})"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;
    savingsList.appendChild(li);
  });

  totalSavedText.textContent = formatRupiah(totalSaved);
  targetSavingsText.textContent = formatRupiah(target);

  const percent = Math.min(Math.round((totalSaved / target) * 100), 100);
  progressBar.style.width = `${percent}%`;
  progressPercentage.textContent = `${percent}% dari target tercapai`;
}

savingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const history = getSavingsData();
  history.push({
    amount: parseInt(savingsAmount.value),
    note: savingsNote.value
  });
  saveSavingsData(history);
  savingsAmount.value = '';
  savingsNote.value = '';
  loadSavingsData();
});

window.deleteSavingsItem = function(index) {
  const history = getSavingsData();
  history.splice(index, 1);
  saveSavingsData(history);
  loadSavingsData();
};

setTargetBtn.addEventListener('click', () => {
  const currentTarget = getSavingsTarget();
  const newTarget = prompt("Masukkan target tabungan bulan ini (Rp):", currentTarget);
  if (newTarget && !isNaN(newTarget) && newTarget > 0) {
    saveSavingsTarget(parseInt(newTarget));
    loadSavingsData();
  }
});


// --- FITUR PENGELUARAN BULANAN (TERIKAT BULAN & TAHUN) ---
function getExpenseData() {
  const key = getStorageKey('expense');
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveExpenseData(data) {
  localStorage.setItem(getStorageKey('expense'), JSON.stringify(data));
}

function loadExpenseData() {
  const expenses = getExpenseData();
  expenseList.innerHTML = '';

  let totalExpense = 0;

  expenses.forEach((item, index) => {
    totalExpense += item.amount;
    const li = document.createElement('li');
    li.className = 'expense-item';
    li.innerHTML = `
      <span>${item.note}</span>
      <div>
        <span class="expense-amount">-${formatRupiah(item.amount)}</span>
        <button class="delete-btn" style="margin-left: 8px;" onclick="deleteExpenseItem(${index})"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;
    expenseList.appendChild(li);
  });

  totalExpenseText.textContent = formatRupiah(totalExpense);
}

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const expenses = getExpenseData();
  expenses.push({
    amount: parseInt(expenseAmountInput.value),
    note: expenseNoteInput.value
  });
  saveExpenseData(expenses);
  expenseAmountInput.value = '';
  expenseNoteInput.value = '';
  loadExpenseData();
});

window.deleteExpenseItem = function(index) {
  const expenses = getExpenseData();
  expenses.splice(index, 1);
  saveExpenseData(expenses);
  loadExpenseData();
};


// --- FITUR PIUTANG CUST (PERMANEN / GLOBAL) ---
function getCustData() {
  return JSON.parse(localStorage.getItem('cust_global_list')) || [];
}

function saveCustData(data) {
  localStorage.setItem('cust_global_list', JSON.stringify(data));
}

function loadCustData() {
  const debts = getCustData();
  custList.innerHTML = '';

  let totalDebt = 0;

  debts.forEach((cust, index) => {
    totalDebt += cust.amount;

    const li = document.createElement('li');
    li.className = 'cust-item';
    li.innerHTML = `
      <div class="cust-info">
        <span class="cust-name">${cust.name}</span>
        <span class="cust-note">${cust.note || 'Tanpa keterangan'}</span>
      </div>
      <div class="cust-action">
        <span class="cust-amount">${formatRupiah(cust.amount)}</span>
        <button class="btn-done" onclick="markAsPaid(${index})"><i class="fa-solid fa-check"></i> Lunas</button>
        <button class="delete-btn" onclick="deleteCustDebt(${index})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    custList.appendChild(li);
  });

  totalCustDeptText.textContent = formatRupiah(totalDebt);
}

custForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const debts = getCustData();
  debts.push({
    name: custNameInput.value,
    amount: parseInt(custAmountInput.value),
    note: custNoteInput.value
  });
  saveCustData(debts);
  custNameInput.value = '';
  custAmountInput.value = '';
  custNoteInput.value = '';
  loadCustData();
});

window.markAsPaid = function(index) {
  if (confirm("Yakin pinjaman ini sudah dilunasi oleh cust?")) {
    deleteCustDebt(index);
  }
};

window.deleteCustDebt = function(index) {
  const debts = getCustData();
  debts.splice(index, 1);
  saveCustData(debts);
  loadCustData();
};


// --- FITUR KALENDER CHECKLIST ---
function getCalendarData() {
  const key = getStorageKey('calendar');
  return JSON.parse(localStorage.getItem(key)) || {};
}

function saveCalendarData(data) {
  localStorage.setItem(getStorageKey('calendar'), JSON.stringify(data));
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (calendarMonthYearText) {
    calendarMonthYearText.textContent = `${monthNames[month]} ${year}`;
  }

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const checkedDays = getCalendarData();

  for (let i = 0; i < firstDay; i++) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'calendar-day-box empty';
    calendarGrid.appendChild(emptyBox);
  }

  let checkedCount = 0;
  for (let day = 1; day <= totalDays; day++) {
    const isChecked = checkedDays[day] === true;
    if (isChecked) checkedCount++;

    const dayBox = document.createElement('div');
    dayBox.className = `calendar-day-box ${isChecked ? 'checked' : ''}`;
    dayBox.innerHTML = `
      <span class="calendar-day-number">${day}</span>
      <i class="fa-solid fa-check calendar-check-icon"></i>
    `;
    dayBox.addEventListener('click', () => toggleCalendarDay(day));
    calendarGrid.appendChild(dayBox);
  }

  calendarCheckCount.textContent = `${checkedCount} Hari Ter-checklist`;
}

function toggleCalendarDay(day) {
  const checkedDays = getCalendarData();
  checkedDays[day] = !checkedDays[day];
  saveCalendarData(checkedDays);
  renderCalendar();
}

// Run Application
init();