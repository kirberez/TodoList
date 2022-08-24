(() => {
  const savedTodos = JSON.parse(localStorage.getItem(token)); // Загружаем массив со всеми объектами из ЛС
  const defaultTodos = [
    {id: 1, name: 'Открыть список дел', done: true},
    {id: 2, name: 'Начать пользоваться списком дел', done: false},
  ]; // Дела по умолчанию
  // Здесь объекты формата {id:.., name:..., done:true/false}
  let todos = [];
  let idCounter = 3; // для выставления id новым делам

  document.addEventListener('DOMContentLoaded', function() {
    createTodoApp(savedTodos);
  });

  function createTodoApp(userTodos) {
    todos = userTodos ? userTodos : defaultTodos; // Если нет дел, добавленных пользователем, то будут выведены дела по умолчанию
    const mainForm = document.querySelector('.create-form'); // Форма для добавления нового дела
    let mainInput = document.querySelector('.create-form__input'); // Инпут, в к-рый записываем новое дело
    const mainBtn = document.querySelector('.create-form__add-btn'); // Кнопка добавления нового дела

    mainInput.addEventListener('input', function(elem) {
      elem.preventDefault(); 
      mainBtn.disabled = !elem.target.value; // Если в инпуте будет текст, то кнопка станет кликабельной
    });

    // Создание новых эл-тов через событие submit
    // Получаем значение инпута, создаём объект, где name - значение инпута, 
    // новый объект добавляем  в todos. Далее в todos он станет DOM-элементом li и добавится на страницу
    mainForm.addEventListener('submit', elem => {
      elem.preventDefault(); // Предотвращаем отправку формы
      if (!mainInput.value) return;
      const newTodoObject = {
        name: mainInput.value,
        done: false,
        id: idCounter,
      } 
      ++idCounter;
      todos.push(newTodoObject);
      refreshLocal(todos);
      objToDomElem(newTodoObject);
      mainInput.value = ''; // Очищаем инпут после добавления дела
    });

    // Выгружаем все имеющиеся на текущий момент дела
    for (let todo of todos) {
      objToDomElem(todo);
    };
  };

  // Получает на вход объект формата {id:.., name:..., done:true/false}
  // Возвращает DOM-элемент li
  function createTodoItem(objTodo) {
    let item = document.createElement('li');
    let btnWrapper =  document.createElement('div');
    let btnDone = document.createElement('button');
    let btnDelete = document.createElement('button');

    item.textContent = objTodo.name;
    item.id = objTodo.id;
    item.classList.add('todos__item');

    btnWrapper.classList.add('todos__inner');
    btnDone.classList.add('todos__done-btn');
    btnDelete.classList.add('todos__delete-btn');
    btnDone.type = 'button';
    btnDelete.type = 'button';
    btnDone.textContent = 'Выполнено';
    btnDelete.textContent = 'Удалить';

    if (objTodo.done) {
      item.classList.add('done');
    }

    btnWrapper.append(btnDone);
    btnWrapper.append(btnDelete);
    item.append(btnWrapper);

    return {
      item,
      btnDone,
      btnDelete,
    }
  };

  // Обновляет Локарсторейдж
  // Получает на вход массив с объектами дел todos
  // Приводит к JSON-формату и добавляет в ЛС
  function refreshLocal(objList) {
    localStorage.setItem(token, JSON.stringify(objList));
  }

  // Получаем ДОМ-элемент, находим там кнопку и вешаем обработчики
  // Обработчики ничего не возвращают
  function handlerDone(obj) {
    let btnDone = obj.querySelector('.todos__done-btn');
    btnDone.addEventListener('click', function() {
      obj.classList.toggle('done');
      const curTodo = todos.find(e => e.id === Number(obj.id));
      curTodo.done = !curTodo.done;
      refreshLocal(todos);
    });
  };
  function handlerDelete(obj) {
    let eBtnDelete = obj.querySelector('.todos__delete-btn');
    eBtnDelete.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        todos = todos.filter(e => e.id !== Number(obj.id));
        obj.remove();
        refreshLocal(todos);
      };
    });
  };

  // Добавляем новый элемент li в список дел ul
  // Ф-ция ничего не возвращает
  function objToDomElem(anyObj) {
    const newItem = createTodoItem(anyObj).item;
    handlerDone(newItem);
    handlerDelete(newItem);
    const list = document.querySelector('.main__list');
    list.append(newItem);
  };
}) ()
