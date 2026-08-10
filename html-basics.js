import { loginWithFetch } from './mock-api.js'
const loginForm = document.querySelector('.login-form')
const usernameInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')
const messageElement = document.querySelector('#form-message')
const learningList = document.querySelector('#learning-list')
const courseNameInput = document.querySelector('#course-name')
const courseStatusSelect = document.querySelector('#course-status')
const addCourseButton = document.querySelector('#add-course')
const filterStatusSelect = document.querySelector('#filter-status')
const courseCount = document.querySelector('#course-count')
const totalCourseCount = document.querySelector('#total-course-count')
const completedCourseCount = document.querySelector('#completed-course-count')
const courseProgressText = document.querySelector('#course-progress-text')
const courseProgressBar = document.querySelector('#course-progress-bar')
const loginButton = document.querySelector('#login-button')
const STORAGE_KEY = 'learning_courses'

const defaultCourses = [
  { name: 'HTML', status: '已完成' },
  { name: 'CSS', status: '已完成' },
  { name: 'JavaScript', status: '已完成' },
  { name: 'Vue', status: '待学习' },
  { name: 'TypeScript', status: '待学习' },
]
const courseStatuses = ['待学习', '学习中', '已完成']

const savedCourses = localStorage.getItem(STORAGE_KEY)

let courses = defaultCourses

if (savedCourses !== null) {
  courses = JSON.parse(savedCourses)
}
function saveCourses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

function deleteCourse(index) {
  courses.splice(index, 1)
  saveCourses()
  renderLearningList()
}
function updateCourseStatus(index, newStatus) {
  courses[index].status = newStatus
  saveCourses()
  renderLearningList()
}

function renderCourseSummary() {
  // const courseNames = courses.map(function (course) {
  //   return course.name
  // })

  // console.log(courseNames)
  const completedCount = courses.reduce(function (total, course) {
    if (course.status === '已完成') {
      return total + 1
    }

    return total
  }, 0)

  let progress = 0

  if (courses.length > 0) {
    progress = Math.round((completedCount / courses.length) * 100)
  }

  totalCourseCount.textContent = courses.length
  completedCourseCount.textContent = completedCount
  courseProgressText.textContent = progress + '%'
  courseProgressBar.style.width = progress + '%'
}
function renderLearningList() {
  learningList.textContent = ''
  renderCourseSummary()
  const selectedStatus = filterStatusSelect.value

  const visibleCourses = courses.filter(function (course) {
    if (selectedStatus === '全部') {
      return true
    }

    return course.status === selectedStatus
  })
  courseCount.textContent =
    '显示 ' + visibleCourses.length + ' / 共 ' + courses.length
  if (visibleCourses.length === 0) {
    const emptyItem = document.createElement('li')

    if (courses.length === 0) {
      emptyItem.textContent = '还没有学习课程，请添加一门课程。'
    } else {
      emptyItem.textContent = '没有符合当前筛选条件的课程。'
    }

    learningList.appendChild(emptyItem)
    return
  }

  visibleCourses.forEach(function (course) {
    const courseIndex = courses.indexOf(course)
    const listItem = document.createElement('li')
    const courseText = document.createElement('span')
    const courseActions = document.createElement('div')
    const statusSelect = document.createElement('select')
    const deleteButton = document.createElement('button')

    courseText.textContent = courseIndex + 1 + '. ' + course.name

    courseActions.className = 'course-actions'
    statusSelect.className = 'course-status-select'

    courseStatuses.forEach(function (status) {
      const option = document.createElement('option')

      option.value = status
      option.textContent = status

      statusSelect.appendChild(option)
    })

    statusSelect.value = course.status

    statusSelect.addEventListener('change', function () {
      updateCourseStatus(courseIndex, statusSelect.value)
    })

    deleteButton.type = 'button'
    deleteButton.className = 'delete-course-button'
    deleteButton.textContent = '删除'

    deleteButton.addEventListener('click', function () {
      deleteCourse(courseIndex)
    })

    courseActions.appendChild(statusSelect)
    courseActions.appendChild(deleteButton)

    listItem.appendChild(courseText)
    listItem.appendChild(courseActions)

    learningList.appendChild(listItem)
  })
}

renderLearningList()
function showMessage(message, type) {
  messageElement.textContent = message
  messageElement.classList.remove('error', 'success', 'info')
  messageElement.classList.add(type)
}
function clearMessage() {
  messageElement.textContent = ''
  messageElement.classList.remove('error', 'success', 'info')
}
function validateUsername() {
  const username = usernameInput.value.trim()

  if (username === '') {
    usernameInput.classList.add('input-error')
    showMessage('请输入用户名', 'error')
    return false
  }

  usernameInput.classList.remove('input-error')
  return true
}
function validatePassword() {
  const password = passwordInput.value

  if (password === '') {
    passwordInput.classList.add('input-error')
    showMessage('请输入密码', 'error')
    return false
  }

  if (password.length < 6) {
    passwordInput.classList.add('input-error')
    showMessage('密码不能少于 6 位', 'error')
    return false
  }

  passwordInput.classList.remove('input-error')
  return true
}
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault()

  if (!validateUsername()) {
    return
  }

  if (!validatePassword()) {
    return
  }

  const username = usernameInput.value.trim()
  const password = passwordInput.value

  loginButton.disabled = true
  loginButton.textContent = '登录中...'
  showMessage('正在验证账号，请稍候...', 'info')

  try {
    const result = await loginWithFetch(username, password)

    showMessage('登录成功，欢迎你：' + result.username, 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    loginButton.disabled = false
    loginButton.textContent = '登录'
  }
})
loginForm.addEventListener('reset', function () {
  usernameInput.classList.remove('input-error')
  passwordInput.classList.remove('input-error')
  clearMessage()
})
usernameInput.addEventListener('blur', validateUsername)
passwordInput.addEventListener('blur', validatePassword)
usernameInput.addEventListener('input', function () {
  usernameInput.classList.remove('input-error')
  clearMessage()
})

passwordInput.addEventListener('input', function () {
  passwordInput.classList.remove('input-error')
  clearMessage()
})

addCourseButton.addEventListener('click', function () {
  const courseName = courseNameInput.value.trim()
  const courseStatus = courseStatusSelect.value

  if (courseName === '') {
    alert('请输入课程名称')
    courseNameInput.focus()
    return
  }

  courses.push({
    name: courseName,
    status: courseStatus,
  })
  saveCourses()
  renderLearningList()

  courseNameInput.value = ''
  courseStatusSelect.value = '待学习'
  courseNameInput.focus()
})
courseNameInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    addCourseButton.click()
  }
})
filterStatusSelect.addEventListener('change', function () {
  renderLearningList()
})
