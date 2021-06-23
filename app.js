const themes = {
  'default': {
    '--text-color': '#000',
    '--reverse-text-color': '#fff',
    '--body-bg': '#fff',
    '--container-bg': '#fafafa',
    '--input-bg': '#fff',
    '--form-btn-bg': '#2f80ed',
    '--task-bg': '#fff',
    '--finish-btn': '#66ff00',
    '--delete-btn': '#ff033e',
    '--switch-bg': '#fafafa',
    '--dot-btn': '#ffffff',
  },
  'dark': {
    '--text-color': '#fff',
    '--reverse-text-color': '#000',
    '--body-bg': '#fff',
    '--container-bg': '#273851',
    '--input-bg': '#3f5072',
    '--form-btn-bg': '#2f80ed',
    '--task-bg': '#3f5072',
    '--finish-btn': '#66ff00',
    '--delete-btn': '#ff033e',
    '--switch-bg': '#3f5072',
    '--dot-btn': '#ffffff',
  },
}
const tasksList = JSON.parse(localStorage.getItem('tasks'));
(function (tasksObj) {
  if (!tasksObj) tasksObj = {};

  const processedList = document.querySelector('.processed-list');
  const finishedList = document.querySelector('.finished-list');
  const addForm = document.querySelector('.add-form');
  const swithThemeBtn = document.querySelector('.switch-theme-btn');

  window.addEventListener('beforeunload', setLocalStorage);
  addForm.addEventListener('submit', heandlerAddForm);
  processedList.addEventListener('click', heandlerFinishBtn);
  finishedList.addEventListener('click', heandlerDeleteBtn);
  swithThemeBtn.addEventListener('click', heandleSwitchThemeBtn);

  renderTaskFromLocalStorage(tasksObj);

  function renderTaskFromLocalStorage(tasksObj) {
    const processedFragment = document.createDocumentFragment();
    const finishedFragment = document.createDocumentFragment();
    for (let task in tasksObj) {
      const li = getTemplateTask(tasksList[task]);
      tasksList[task].state === 'processed' ? processedFragment.appendChild(li) : finishedFragment.appendChild(li);
    }
    processedList.appendChild(processedFragment);
    finishedList.appendChild(finishedFragment);
  }

  function getTemplateTask({
    id,
    title,
    state
  }) {
    const li = document.createElement('li');
    li.setAttribute('id', id);
    li.classList.add('task');
    li.classList.add(state === 'processed' ? 'processed-task' : 'finished-task');
    const span = document.createElement('span');
    span.textContent = title;
    const btn = document.createElement('button');
    btn.classList.add('btn', state === 'processed' ? 'btn-finish' : 'btn-delete');
    li.appendChild(span);
    li.appendChild(btn);
    return li;
  }

  function heandlerAddForm(e) {
    e.preventDefault();
    const title = addForm.querySelector('.add-form-title').value;
    if (!title) {
      alert('Write task title!')
      return;
    }
    const task = createTask(title);
    const li = getTemplateTask(task);
    addTaskAtList(li);
    addForm.reset();
  }

  function createTask(title) {
    const id = '6b56' + Math.random() + Math.random();
    const taskObj = {
      id,
      title,
      state: 'processed',
    }
    tasksObj[id] = taskObj;
    return taskObj;
  }

  function addTaskAtList(li) {
    if (li.classList.contains('processed-task')) processedList.appendChild(li);
    else finishedList.appendChild(li);
  }

  function heandlerFinishBtn(e) {
    if (e.target.tagName !== 'BUTTON') return;
    const id = e.target.parentElement.id;
    const title = e.target.previousElementSibling.textContent;
    const state = 'finished';
    const taskObj = {
      id,
      title,
      state,
    }
    e.target.parentElement.remove();
    const li = getTemplateTask(taskObj);
    tasksObj[id] = taskObj;
    addTaskAtList(li);
  }

  function heandlerDeleteBtn(e) {
    if (e.target.tagName !== 'BUTTON') return;
    const id = e.target.parentElement.id;
    delete tasksObj[id];
    e.target.parentElement.remove();
  }

  function setLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasksObj));
  }

  function heandleSwitchThemeBtn(e) {
    const selectedTheme = swithThemeBtn.classList.contains('active');
    const setedTheme = selectedTheme ? 'default' : 'dark';
    const selectedThemObj = themes[setedTheme];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    swithThemeBtn.classList.toggle('active');
  }
})(tasksList);