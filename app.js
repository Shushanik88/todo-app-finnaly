Shushan's Pyton, [11/10/2025 12:25 AM]
/* базовый сброс */
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --glass: rgba(255,255,255,0.08);
  --accent-1:#ff7eb3;
  --accent-2:#c7f9cc;
  --accent-3:#7afcff;
  --accent-4:#ffd86b;
  --card-text: #0b1020;
  --muted: rgba(11,16,32,0.55);
  --shadow: 0 12px 30px rgba(11,16,32,0.28);
}

/* фон страницы — очень яркий и насыщенный */
html,body{height:100%}
body{
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:36px;
  background:
    radial-gradient(900px 500px at 10% 10%, #ffd6e7 0%, transparent 20%),
    radial-gradient(700px 350px at 90% 80%, #d6f6ff 0%, transparent 18%),
    linear-gradient(135deg, #ff7eb3 0%, #ffb199 15%, #ffd86b 35%, #c1ff8a 55%, #8fe3ff 75%, #cda4ff 100%);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

/* панель с glassmorphism */
.panel{
  width:min(980px,96vw);
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border-radius:20px;
  padding:28px;
  backdrop-filter: blur(10px) saturate(1.1);
  box-shadow: var(--shadow);
  border: 1px solid rgba(255,255,255,0.12);
  position:relative;
  overflow:hidden;
}

/* декоративные радужные полосы */
.panel::before, .panel::after{
  content:"";
  position:absolute;
  left:-10%;
  right:-10%;
  height:200px;
  pointer-events:none;
  background: conic-gradient(from 180deg, #ff9a9e, #fad0c4, #f6d365, #fbc2eb, #a6c1ee);
  opacity:0.08;
  transform: rotate(-6deg);
  top:-70px;
  filter: blur(36px);
}
.panel::after{transform:rotate(6deg);top:auto;bottom:-70px;opacity:0.05;filter:blur(46px)}

/* шапка */
.top{display:flex;gap:18px;align-items:center;margin-bottom:18px}
.logo{
  width:72px;height:72px;border-radius:16px;
  display:grid;place-items:center;font-weight:800;font-size:20px;
  background: conic-gradient(from 120deg, #ff9a9e, #fad0c4, #f6d365, #fbc2eb, #a6c1ee);
  color:var(--card-text); box-shadow: 0 8px 26px rgba(0,0,0,0.18);
}
.title-wrap{flex:1}
.title{font-size:20px;color:var(--card-text);margin-bottom:4px}
.subtitle{font-size:13px;color:var(--muted)}

.controls{display:flex;gap:8px}
.btn{
  border:0;padding:8px 12px;border-radius:10px;font-weight:600;cursor:pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}
.btn.subtle{background:rgba(255,255,255,0.06);color:var(--card-text);font-weight:600}
.btn.add{background:linear-gradient(90deg,var(--accent-1),var(--accent-4));color:#071126}
.btn:hover{transform:translateY(-2px);transition:transform .18s ease}

/* форма добавления */
.todo-form{display:flex;gap:12px;margin-bottom:14px}
.input{
  flex:1;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  color:var(--card-text);font-size:15px;outline:none;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
}
.input::placeholder{color:rgba(11,16,32,0.35)}

/* список задач */
.list-wrap{max-height:52vh;overflow:auto;padding-right:6px}
.todo-list{list-style:none;display:flex;flex-direction:column;gap:12px;padding:6px}
.todo-item{
  display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border:1px solid rgba(255,255,255,0.04); box-shadow: 0 6px 18px rgba(11,16,32,0.06);
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.todo-item.dragging{opacity:0.6;transform:scale(0.995);box-shadow:0 8px 28px rgba(11,16,32,0.14)}
.handle{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;cursor:grab;
  background: linear-gradient(180deg,var(--accent-3), #baf0ff);color:#05202a;font-weight:700}
.checkbox{
  width:18px;height:18px;border-radius:4px;border:2px solid rgba(11,16,32,0.12);cursor:pointer;
  display:inline-grid;place-items:center;
}
.text{
  flex:1;font-size:15px;color:var(--card-text);cursor:text;min-width:0;
  word-break:break-word;
}
.

Shushan's Pyton, [11/10/2025 12:29 AM]
/* app.js — функционал To-Do */
(() => {
  const STORAGE_KEY = 'bright-todo-list:v1';

  // элементы
  const form = document.getElementById('todoForm');
  const input = document.getElementById('todoInput');
  const listEl = document.getElementById('todoList');
  const countEl = document.getElementById('count');
  const clearAllBtn = document.getElementById('clearAll');

  let todos = []; // {id, text, done}

  // helpers
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
    } catch(e) {
      todos = [];
    }
  };

  function render() {
    listEl.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');
      li.draggable = true;
      li.dataset.id = todo.id;
      li.innerHTML = `
        <div class="handle" title="Перетащи">⋮⋮</div>
        <div class="checkbox" role="button" aria-pressed="${todo.done}">${todo.done ? '✓' : ''}</div>
        <div class="text" contenteditable="false" spellcheck="false">${escapeHtml(todo.text)}</div>
        <div class="meta">
          <button class="btn small edit">✎</button>
          <button class="btn small del">🗑</button>
        </div>
      `;
      // события
      const checkbox = li.querySelector('.checkbox');
      const textEl = li.querySelector('.text');
      const editBtn = li.querySelector('.edit');
      const delBtn = li.querySelector('.del');

      checkbox.addEventListener('click', () => toggleDone(todo.id));
      delBtn.addEventListener('click', () => removeTodo(todo.id));
      editBtn.addEventListener('click', () => startEdit(textEl));
      // double click to edit
      textEl.addEventListener('dblclick', () => startEdit(textEl));

      // commit edit on Enter or blur
      textEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          finishEdit(textEl);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit(textEl, todo.text);
        }
      });
      textEl.addEventListener('blur', () => finishEdit(textEl));

      // drag handlers
      li.addEventListener('dragstart', dragStart);
      li.addEventListener('dragend', dragEnd);
      li.addEventListener('dragover', dragOver);
      li.addEventListener('drop', drop);

      listEl.appendChild(li);
    });
    countEl.textContent = todos.length;
    save();
  }

  function addTodo(text) {
    const t = text.trim();
    if (!t) return;
    todos.unshift({ id: uid(), text: t, done: false });
    render();
  }

  function removeTodo(id) {
    todos = todos.filter(t => t.id !== id);
    render();
  }

  function toggleDone(id) {
    todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
    render();
  }

  function startEdit(textEl) {
    textEl.dataset.orig = textEl.innerText;
    textEl.contentEditable = 'true';
    textEl.focus();
    placeCaretAtEnd(textEl);
  }

  function finishEdit(textEl) {
    if (!textEl.isContentEditable) return;
    textEl.contentEditable = 'false';
    const newText = textEl.innerText.trim();
    const id = textEl.closest('.todo-item').dataset.id;
    if (!newText) {
      // если пусто — удаляем
      removeTodo(id);
      return;
    }
    todos = todos.map(t => t.id === id ? {...t, text: newText} : t);
    render();
  }

  function cancelEdit(textEl, original) {
    textEl.textContent = original  textEl.dataset.orig  '';
    textEl.contentEditable = 'false';
  }

  // drag & drop implementation (vertical reorder)
  let draggingEl = null;
  function dragStart(e) {
    draggingEl = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', this.dataset.id); } catch {}
  }
  function dragEnd() {
    if (draggingEl) draggingEl.classList.remove('dragging');
    draggingEl = null;
  }
  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.currentTarget;
    if (!target || target === draggingEl) return;
    const rect = target.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const parent = listEl;
    if (e.clientY < mid) {
      parent.insertBefore(draggingEl, target);
    } else {
      parent.insertBefore(draggingEl, target.nextSibling);
    }
  }
  function drop(e) {
    e.preventDefault();
    // rebuild todos order from DOM
    const ids = Array.from(listEl.children).map(li => li.dataset.id);
    todos = ids.map(id => todos.find(t => t.id === id)).filter(Boolean);
    render();
  }

  // helpers
  function placeCaretAtEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function escapeHtml(str) {
    return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

  // события формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('Очистить все задачи?')) return;
    todos = [];
    render();
  });

  // клавиши: Ctrl+K фокус на input
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
    }
  });

  // init
  load();
  render();

  // expose for debug (optional)
  window.__brightTodo = { get: () => todos, save, load, render };

})();
