// UI Logic Content (START)
const dashboard = document.querySelector('.dashBtn')
const allButton = document.querySelectorAll('.dashBtn')
const allContent = document.querySelectorAll('.dashContent')
const hammenu = document.querySelector('.ham-menu')
const sidebar = document.querySelector('.sidebar')

hammenu.addEventListener('click', () => handleSidebarToggle());

function handleSidebarToggle() {
  hammenu.classList.toggle('active-menu');
  sidebar.classList.toggle('active-bar');
}

function setPages(btn) {
  const button = btn.closest('div');
  allButton.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  allContent.forEach(content => content.style.display = "none")
  const activeId = button.id.replace('btn', 'page')
  document.getElementById(activeId).style.display = "block"

  // Save the active page id to local storage
  sessionStorage.setItem('activePageId', activeId);
  handleSidebarToggle(); // toggle sidebar every page changes
}

// Set the active page based on saved value in local storage
document.addEventListener('DOMContentLoaded', () => {
  const activePageId = sessionStorage.getItem('activePageId');
  if (activePageId) {
    document.getElementById(activePageId).style.display = "block";
    const activeBtnId = activePageId.replace('page', 'btn');
    document.getElementById(activeBtnId).classList.add('active');
  } else {
    allContent[0].style.display = "block";
    allButton[0].classList.add('active');
  }
});


allButton.forEach(btn => btn.setAttribute("onclick", "setPages(this)"))
// UI Logic Content (END)

// darkmode
// Ambil elemen toggle dan tema yang akan diubah
const darkModeToggle = document.getElementById("darkMode");
const body = document.body;

// Cek status toggle saat halaman dimuat
if (sessionStorage.getItem("darkMode") === "enabled") {
  enableDarkMode();
}

// Fungsi untuk mengaktifkan dark mode
function enableDarkMode() {
  body.classList.add("darkMode");
  sessionStorage.setItem("darkMode", "enabled");
}

// Fungsi untuk menonaktifkan dark mode
function disableDarkMode() {
  body.classList.remove("darkMode");
  sessionStorage.setItem("darkMode", null);
}

// Event listener untuk toggle switch
darkModeToggle.addEventListener("change", () => {
  darkModeToggle.checked ? enableDarkMode() : disableDarkMode();
});


// TODO - List Logic (START)

// LocalStorage for ToDo's
let todoListData = JSON.parse(localStorage.getItem('todoList')) || [];

const saveTodoLS = () => {
  localStorage.setItem('todoList', JSON.stringify(todoListData));
};

const todoBTN = document.getElementById('todo-btn')
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoBTN.addEventListener('click', function (e) {
  e.preventDefault();

  const itemText = todoInput.value.trim();

  if (itemText) {
    addItem(itemText);
    todoInput.value = ''; // Mengosongkan input setelah ditambahkan

    todoListData.push(itemText)
    saveTodoLS();
  }
});

function getTodoIndex(li) {
  return Array.from(todoList.children).indexOf(li);
}

const createButton = (text, onClick) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  return button;
};

const deleteItem = (li) => {
  const index = getTodoIndex(li);
  todoListData.splice(index, 1);
  saveTodoLS();
  li.remove();
}

const addItem = (text) => {
  var li = document.createElement('li');
  li.textContent = text;

  const deleteBtn = createButton("Hapus", () => deleteItem(li));
  const editBtn = createButton("Edit", () => editItem(li, editBtn, deleteBtn));

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

const editItem = (li, editBtn, deleteBtn) => {
  editBtn.remove();
  deleteBtn.remove();

  const text = li.textContent.trim();

  const input = document.createElement('input');
  input.type = 'text';
  input.value = text;

  const saveBtn = createButton("Save", () => saveItem(li, input, editBtn, deleteBtn));

  li.innerHTML = ''; // clear html element in li
  li.appendChild(input); // add inputs
  li.appendChild(saveBtn); // add buttons
}

const saveItem = (li, input, editBtn, deleteBtn) => {
  li.innerHTML = ''; // clear html element in li

  const newText = input.value.trim();
  li.textContent = newText;

  const index = getTodoIndex(li);
  todoListData[index] = newText;
  saveTodoLS();

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
}

todoListData.forEach(item => addItem(item)); // initialize todo's (app start)
// TODO - List Logic (END)


// CALCULATOR STAR
const calcTyped = document.getElementById('calc-typed');

let currentInput = '';
let isError = false;

function updateDisplay() {
  calcTyped.value = currentInput;
}

function appendToDisplay(value) {
  if (isError) {
    currentInput = '';
    isError = false;
  }

  const operators = ['+', '-', '*', '/'];

  switch (value) {
    case "AC":
      clear();
      break;
    case "DEL":
      deleteLast();
      break;
    case "=":
      calculate();
      break;
    default:
      if (operators.includes(value) && operators.includes(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1) + value;
      } else {
        currentInput += value;
      }
      break;
  }

  updateDisplay();
}

function clear() {
  currentInput = '';
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    const result = math.evaluate(currentInput);
    currentInput = result.toString();
  } catch (error) {
    isError = true;
    currentInput = 'Error';
  } finally {
    updateDisplay();
  }
}

document.querySelector('.calc-button-row').addEventListener('click', (e) => {
  const target = e.target;
  if (target.closest('button')) {
    const buttonText = target.textContent;
    appendToDisplay(buttonText);
  }
})
// CALCULATOR END


// Sign Logic (START)
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let writingMode = false;
let lastX, lastY; // Store the previous position

// Adapt getCursorPosition for touch events
const getCursorPosition = (event) => {
  const rect = canvas.getBoundingClientRect();
  let positionX, positionY;

  if (event.touches) {
    positionX = event.touches[0].clientX - rect.left;
    positionY = event.touches[0].clientY - rect.top;
  } else {
    positionX = event.clientX - rect.left;
    positionY = event.clientY - rect.top;
  }

  return [positionX, positionY];
}

// Handle touch events
const handleTouchStart = (event) => {
  event.preventDefault(); // Prevent scrolling when touching canvas
  handlePointerDown(event);
}

const handleTouchMove = (event) => {
  event.preventDefault(); // Prevent scrolling when touching canvas
  handlePointerMove(event);
}

const handleTouchEnd = (event) => {
  event.preventDefault();
  handlePointerUp();
}

const handlePointerDown = (event) => {
  writingMode = true;
  ctx.beginPath();
  const [positionX, positionY] = getCursorPosition(event);
  ctx.moveTo(positionX, positionY);
  lastX = positionX;
  lastY = positionY;
  // Ketika pengguna mulai menandatangani, ubah teks tombol menjadi 'Clear'
  clrButton.textContent = 'Clear';
}

const handlePointerUp = () => {
  writingMode = false;
  // Ubah teks tombol menjadi 'Save' setelah pengguna selesai menandatangani
  saveButton.textContent = 'Save Signature';
}

const handlePointerMove = (event) => {
  if (!writingMode) return;
  const [positionX, positionY] = getCursorPosition(event);
  ctx.lineTo(positionX, positionY);
  ctx.stroke();
  lastX = positionX;
  lastY = positionY;
}

canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
canvas.addEventListener('pointerup', handlePointerUp, { passive: false });
canvas.addEventListener('pointermove', handlePointerMove, { passive: false });

// Adding touch event listeners
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

ctx.lineWidth = 2;
ctx.lineJoin = ctx.lineCap = 'round';

const saveButton = document.querySelector('.clear-button'); // Tombol yang awalnya untuk 'Clear' sekarang untuk 'Save'
const clrButton = document.querySelector('.submit-button');
// Ubah event listener untuk tombol save
saveButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (saveButton.textContent === 'Save Signature') {
    const imageURL = canvas.toDataURL();
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'digitalSignature.png'; // Set the desired file name
    downloadLink.click(); // Trigger download
  }
});

// Fungsionalitas untuk menghapus gambar pada canvas
clrButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (clrButton.textContent === 'Clear') {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus seluruh isi canvas
  }
});
// Sign Logic (END)

