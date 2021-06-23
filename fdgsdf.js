const tasks = JSON.parse(localStorage.getItem('tasks'));
(function (tasksList) {
  const tasksObj = !tasksList ? {} : tasksList;

  const processedList = document.querySelector('.processed-list');
  const finishedList = document.querySelector('.finished-list');
  const addForm = document.querySelector('.add-form');

  window.addEventListener('beforeunload', setLocalStorage);
  addForm.addEventListener('submit', heandlerAddForm);
  processedList.addEventListener('click', heandlerFinishBtn);
  finishedList.addEventListener('click', heandlerDeleteBtn);

  renderTasks(tasksObj);

  function renderTasks(tasksList) {
    if (!tasksList) return;
    const processedFragment = document.createDocumentFragment();
    const finishedFragment = document.createDocumentFragment();
    for (let task in tasksList) {
      const li = getTemplateTask(tasksList[task]);
      tasksList[task].state === 'processed' ? processedFragment.appendChild(li) : finishedFragment.appendChild(li);
    }
    processedList.appendChild(processedFragment);
    finishedList.appendChild(finishedFragment);
  }

  function getTemplateTask ({
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

  function heandlerDeleteBtn (e) {
    if (e.target.tagName !== 'BUTTON') return;
    const id = e.target.parentElement.id;
    delete tasksObj[id];
    e.target.parentElement.remove();
  }

  function setLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasksObj));
  }
})(tasks);