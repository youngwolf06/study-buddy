//the overlay disappears in a second after detection of mouse movement 
const overlay = document.querySelector('.shush-overlay');
document.addEventListener("mousemove", () => {
  overlay.classList.add("hidden");
  setTimeout(() => overlay.remove(), 1000);
}, { once: true });

//setting up the position of the cursor in light div to generate "light' in that position
const light = document.querySelector('.light');
window.addEventListener('mousemove', e => {
  light.style.setProperty('--x', e.clientX + 'px');
  light.style.setProperty('--y', e.clientY + 'px');
});

//generating messages periodically 
const messageBox = document.getElementById('message-box');
const lines = [
  { text: "You shouldn't be on your device while studying", delay: 1000 },
  { text: "Are you searching for something?", delay: 7000 },
  { text: "Nothing that your Study Buddy can't help you with!", delay: 12000 },
  { text: "This room has several devices that can help you! Finders keepers shushh...", delay: 18000 }
];
lines.forEach(line => {
  setTimeout(() => {
    messageBox.textContent = line.text;
  }, line.delay);
});

//setting up logic to send request to server, receive and display response
async function sendChat() {
  const input = chatInput.value.trim();
  if (!input) return;
  chatResponse.innerText = "AI is thinking...";
  try {
    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }]
      })
    });
    const data = await res.json();
    chatResponse.innerText = data.choices[0].message.content;
    chatInput.value = '';
  } catch {
    chatResponse.innerText = "Error: Could not get response.";
  }
}

//setting up events for sendChat function
const chatgptBtn = document.getElementById('chatgpt-btn');
const chatInput = document.getElementById('chat-input');
const chatResponse = document.getElementById('chat-response');
chatgptBtn.addEventListener('click', sendChat);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendChat();
});


let todos = JSON.parse(localStorage.getItem('todos')) || [];
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');


function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', () => {
      todos[index].completed = !todos[index].completed;
      saveAndRender();
    });
    li.addEventListener('contextmenu', e => {
      e.preventDefault();
      todos.splice(index, 1);
      saveAndRender();
    });

    todoList.appendChild(li);
  });
}
function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}
function addTask() {
  const text = todoInput.value.trim();
  if (!text) 
    return;
  if (todos.some(todo => todo.text.toLowerCase() === text.toLowerCase())) {
    alert("Task already exists!");
    return;
  }
  todos.push({ text, completed: false });
  saveAndRender();
  todoInput.value = '';
}
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
renderTodos();

document.querySelector('.to-do-helper').addEventListener('click', () => {
  toggleDisplay('#todo-container');
});
document.querySelector('.study-buddy').addEventListener('click', () => {
  toggleDisplay('#chatgpt-container');
});
document.querySelector('.calculator-div').addEventListener('click', () => {
  toggleDisplay('#calculator-container');
});
function toggleDisplay(selector) {
  const el = document.querySelector(selector);
  el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

//adding functionality to the buttons of the calculator 
const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll("#calc-buttons button");
let calcInput = "";
calcButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value === "C") {
      calcInput = "";
      calcDisplay.value = "";
    } else if (value === "=") {
      try {
        calcInput = eval(calcInput).toString();
        calcDisplay.value = calcInput;
      } catch {
        calcDisplay.value = "Error";
        calcInput = "";
      }
    } else {
      calcInput += value;
      calcDisplay.value = calcInput;
    }
  });
});

//helping the user find the hidden features
function attachHoverMessage(selector, message) {
  const el = document.querySelector(selector);
  el.addEventListener("mouseenter", () => messageBox.textContent = message);
  el.addEventListener("mouseleave", () => messageBox.textContent = "");
}
attachHoverMessage(".calculator-div", "Bingo! There's the calculator!");
attachHoverMessage(".study-buddy", "Don't hesitate to ask for his help!");
