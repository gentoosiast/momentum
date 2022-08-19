import i18n from '../assets/i18n.json';
import state from './state';

let tasks = state.get('tasks'); // { id: 34423423, completed: false, name: 'some task' }
const tasklistInput = document.querySelector('.taskslist-widget__input');
const tasklistTasks = document.querySelector('.tasklist-widget__tasks');
const tasklistClearBtn = document.querySelector('.tasklist-widget__clear');

function tasklistTasksUpdateScroll() {
  tasklistTasks.scrollTop = tasklistTasks.scrollHeight;
}

function addTask(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);
  li.classList.add('tasklist-widget__task');
  li.classList.add('task');
  li.innerHTML = `<input type="checkbox" id="task-${
    task.id
  }" class="task__checkbox"><span class="task__name" ${
    task.completed ? '' : 'contenteditable'
  }>${task.name}</span>`;
  li.querySelector('.task__checkbox').checked = task.completed;
  tasklistTasks.append(li);
  tasklistTasksUpdateScroll();
}

tasklistInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    const taskName = tasklistInput.value;
    if (taskName) {
      const task = { id: Date.now(), completed: false, name: taskName };
      tasks.push(task);
      state.set('tasks', tasks);
      addTask(task);
      tasklistInput.value = '';
    }
  } else if (e.key === 'Escape') {
    tasklistInput.value = '';
    tasklistInput.blur();
  }
});

tasklistTasks.addEventListener('change', (e) => {
  const taskId = Number(e.target.closest('li').getAttribute('data-id'));
  const task = tasks.find((t) => t.id === taskId);
  task.completed = !task.completed;
  state.set('tasks', tasks);
  const span = e.target.nextElementSibling;
  if (task.completed) {
    span.removeAttribute('contenteditable');
  } else {
    span.setAttribute('contenteditable', '');
  }
});

tasklistTasks.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    e.preventDefault();
    const taskId = Number(e.target.closest('li').getAttribute('data-id'));
    const task = tasks.find((t) => t.id === taskId);
    task.name = e.target.textContent;
    state.set('tasks', tasks);
    e.target.blur();
  } else if (e.key === 'Escape') {
    const taskId = Number(e.target.closest('li').getAttribute('data-id'));
    const task = tasks.find((t) => t.id === taskId);
    e.target.textContent = task.name;
    e.target.blur();
  }
});

tasklistClearBtn.addEventListener('click', () => {
  const remaining = [];
  tasks.forEach((task) => {
    if (task.completed) {
      tasklistTasks.querySelector(`[data-id="${task.id}"]`).remove();
    } else {
      remaining.push(task);
    }
  });
  tasks = remaining;
  state.set('tasks', tasks);
});

export default {
  localize() {
    tasklistClearBtn.title = i18n[state.get('locale')].tasklistButtonTitle;
    tasklistInput.placeholder = i18n[state.get('locale')].tasklistPlaceholder;
  },

  init() {
    this.localize();
    tasks.forEach((task) => {
      addTask(task);
    });
    tasklistTasksUpdateScroll();
  },
};
