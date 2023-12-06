const SERVER_URL = "http://localhost:3000"

async function serverAddStud(obj) {   //добавляем на сервер
  const response = await fetch(SERVER_URL + '/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'aplication/json' },
    body: JSON.stringify(obj)
  })
  return  await response.json()
}

async function serverGetStud() {    //отражаем с сервера
  const response = await fetch(SERVER_URL + '/api/students', {
    method: 'GET',
    headers: { 'Content-Type': 'aplication/json' },
  })
  return  await response.json()
}
let serverData = await serverGetStud()

async function serverDeleteStud(id) {   //удаляем с сервера
  const response = await fetch(SERVER_URL + '/api/students/'+id, {
    method: 'DELETE',
  })
  return  await response.json()
}

let listStudent = []



if (serverData !== null) {
  listStudent = serverData
}

let sortColumnFlag = 'fio'

//Создание элементов
const $app = document.getElementById('app'),
  $table = document.createElement('table'),
  $tableHead = document.createElement('thead'),
  $tableBody = document.createElement('tbody'),

  $addForm = document.getElementById('add-form'),
  $nameInp = document.getElementById('name-inp'),
  $lastnameInp = document.getElementById('lastname-inp'),
  $surnameInp = document.getElementById('surname-inp'),
  $birthdayInp = document.getElementById('birthday-inp'),
  $facultyInp = document.getElementById('faculty-inp'),
  $studyStartInp = document.getElementById('start-inp'),

  $sortFio = document.getElementById('sort-fio'),
  $sortFaculty = document.getElementById('sort-faculty'),
  $sortBirthday = document.getElementById('sort-birthday'),
  $sortStart = document.getElementById('sort-start'),

  $filterForm = document.getElementById('filter-form'),
  $filterFormFio = document.getElementById('filter-form__fio-inp'),
  $filterFormFaculty = document.getElementById('filter-faculty__faculty-inp'),
  $filterFormStart = document.getElementById('filter-form__start-inp'),
  $filterFormEnd = document.getElementById('filter-form__end-inp'),

  $tableHeadTr = document.createElement('tr'),
  $tableHeadThFio = document.createElement('th'),
  $tableHeadThAge = document.createElement('th'),
  $tableHeadThFaculty = document.createElement('th'),
  $tableHeadThStart = document.createElement('th'),
  $tableDelete = document.createElement('th')

$table.classList.add('table')

$tableHeadTr.append($tableHeadThFio)
$tableHeadTr.append($tableHeadThAge)
$tableHeadTr.append($tableHeadThFaculty)
$tableHeadTr.append($tableHeadThStart)
$tableHeadTr.append($tableDelete)

$tableHeadThFio.textContent = 'ФИО'
$tableHeadThAge.textContent = 'Дата рождения'
$tableHeadThFaculty.textContent = 'Факультет'
$tableHeadThStart.textContent = 'Дата поступления'
$tableDelete.textContent = ''

$table.append($tableHead)
$table.append($tableBody)
$app.append($table)
$tableHead.append($tableHeadTr)



function createUserTr(oneUser) {
  const $userTr = document.createElement('tr'),
    $userFio = document.createElement('th'),
    $userAge = document.createElement('th'),
    $userFaculty = document.createElement('th'),
    $userStart = document.createElement('th'),
    $userDelete = document.createElement('th'),
    $userDeleteBtn = document.createElement('button')

  $userFio.textContent = oneUser.fio
  $userAge.textContent = getBirthDate(oneUser) + " " + "(" + oneUser.bir + " " + oneUser.birName + ")"
  $userFaculty.textContent = oneUser.faculty
  $userStart.textContent = oneUser.studyStart + "-" + oneUser.end + ' ' + "(" + oneUser.cours + ")"
  $userDeleteBtn.textContent = 'Удалить'

  $userTr.append($userFio)
  $userTr.append($userAge)
  $userTr.append($userFaculty)
  $userTr.append($userStart)

  $userDelete.append($userDeleteBtn)
  $userTr.append($userDelete)
  $userDeleteBtn.classList.add('btn-danger', 'btn','w-100')

  $userDeleteBtn.addEventListener('click',async function(){//удаляем с сервера
   await serverDeleteStud(oneUser.id)
   $userTr.remove()
  })
  return $userTr
}
//Рендер (отрисовка массива в таблицу)
function render(arrData) {
  $tableBody.innerHTML = "";
  let copyListData = [...arrData]
  //1.Подготовка
  for (const oneUser of copyListData) {
    oneUser.fio = oneUser.lastname + " " + oneUser.name + " " + oneUser.surname

    function getAge(object) { //ВОЗРАСТ
      const today = new Date()
      let age = today.getFullYear() - new Date(object.birthday).getFullYear()
      let month = today.getMonth() - new Date(object.birthday).getMonth()
      if (month < 0 || (month === 0 && today.getDate() < new Date(object.birthday).getDate())) age--
      return age
    }
    oneUser.bir = getAge(oneUser);

    function getAgeString(age) { // ф-ция выводит ЛЕТ,ГОД,ГОДА
      let count = age % 100
      if (count >= 10 && count <= 20) {
        return "лет"
      } else {
        count = age % 10
        if (count === 1) {
          return "год"
        } else if (count >= 2 && count <= 4) {
          return "года"
        } else {
          return "лет"
        }
      }
    }
    oneUser.birName = getAgeString(oneUser.bir)
    oneUser.endStudy = Number(oneUser.studyStart)
    oneUser.end = `${oneUser.endStudy + 4}`

    // функция получения номера курса
    function getCourse(object) {
      const today = new Date()
      let course = today.getFullYear() - oneUser.studyStart
      if (today.getMonth() >= 8) course++
      if (course > 4) course = 'закончил'
      if (course < 1) course = 'Еще не поступил'
      if (course < 4 && course > 0) course = `курс: ${course}`
      return course
    }
    oneUser.cours = getCourse(oneUser)
  }
  //Сортировка
  copyListData = copyListData.sort(function (a, b) {
    if (a[sortColumnFlag] < b[sortColumnFlag]) return -1
  })

  //Фильтрация
  function filter(arr, prop, value) {
    return arr.filter(function (oneUser) {
      if (oneUser[prop].toString().includes(value.trim())) return true
    });
  }
  if ($filterFormFio.value.trim() !== '') {
    copyListData = filter(copyListData, 'fio', $filterFormFio.value)
  }
  if ($filterFormFaculty.value.trim() !== '') {
    copyListData = filter(copyListData, 'faculty', $filterFormFaculty.value)
  }
  if ($filterFormStart.value.trim() !== '') {
    copyListData = filter(copyListData, 'studyStart', $filterFormStart.value)
  }
  if ($filterFormEnd.value.trim() !== '') {
    copyListData = filter(copyListData, 'end', $filterFormEnd.value)
  }
  //2.Отрисовка
  for (const oneUser of copyListData) {
    const newTr = createUserTr(oneUser)
    $tableBody.append(newTr)
  }
}
render(serverData)
//3.Добавление
$addForm.addEventListener('submit', async function (event) {
  event.preventDefault()
  //Валидация
  if ($nameInp.value.trim() == '') {
    alert = "Имя не введено!"
    return //ф-ция прекратит свою работу
  }
  const newStudOb = {
    name: $nameInp.value.trim(),
    lastname: $lastnameInp.value.trim(),
    surname: $surnameInp.value.trim(),
    birthday: parseInt($birthdayInp.value.trim()),
    faculty: $facultyInp.value.trim(),
    studyStart: $studyStartInp.value.trim()
  }
  let serverDataObj = await serverAddStud(newStudOb);
  serverDataObj.birthday = new Date(serverDataObj.birthday)

  serverData.push(serverDataObj)

  render(serverData)

  $nameInp.value=''
  $lastnameInp.value=''
  $surnameInp.value=''
  $birthdayInp.value=''
  $facultyInp.value=''
  $studyStartInp.value=''
})

function getBirthDate(object) {
  const yyyy = new Date(object.birthday).getFullYear()
  let mm = new Date(object.birthday).getMonth() + 1
  let dd = new Date(object.birthday).getDate()
  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm
  return dd + '.' + mm + '.' + yyyy
}
//Клики сортировки
$sortFio.addEventListener('click', function () {
  sortColumnFlag = 'fio'
  render(serverData)
})

$sortFaculty.addEventListener('click', function () {
  sortColumnFlag = 'faculty'
  render(serverData)
})

$sortBirthday.addEventListener('click', function () {
  sortColumnFlag = 'birthday'
  render(serverData)
})
$sortStart.addEventListener('click', function () {
  sortColumnFlag = 'studyStart'
  render(serverData)
})

//Фильтр
$filterForm.addEventListener('submit', function (event) {
  event.preventDefault()
})
$filterFormFio.addEventListener('input', function () {
  render(serverData)
})

$filterFormFaculty.addEventListener('input', function () {
  render(serverData)
})
$filterFormStart.addEventListener('input', function () {
  render(serverData)
})
$filterFormEnd.addEventListener('input', function () {
  render(serverData)
})


