const addBtn = document.querySelector(".add-button")
const inputEl = document.querySelector(".input-title")
const toDoListEl = document.querySelector(".to-do-list")
let tasksList = []


// ----------------------------------------------------------------
// --Override the setItem function to trigger the 'storage' event--
// ----------------------------------------------------------------
const origSetItem = window.localStorage.setItem

window.localStorage.setItem = function setItem(key, value) {
  // Store in LocalStorage
  const result = origSetItem.apply(this, arguments)

  // Trigger a "storage" event so this window is alerted.
  window.dispatchEvent(new Event("storage"))

  return result
}
// ---------------------------------------------------------------


addBtn.addEventListener( 'click', () => {

    if (inputEl.value) {

        tasksList.push({
            desc: inputEl.value,
            isChecked: false
        })
    
        inputEl.value = ""
        localStorage.setItem("tasks", JSON.stringify(tasksList))
    }
})


/**
 * Update the task list UI when 'storage' event is triggered.
 */
window.addEventListener('storage', () => { 

    tasksList = JSON.parse(localStorage.getItem("tasks")) || []

    const listItems = []

    for (const task of tasksList) {

        const liEl = createTaskLi(task)
     
        const divEl = createTaskContainer()

        const pEl = createTaskParagraph(task)

        const closeBtn = createTaskDeleteButton(task)
        

        liEl.appendChild(divEl)
        .append(pEl,closeBtn)

        listItems.push(liEl)        
    } 

    toDoListEl.replaceChildren(...listItems)   
})


/**
 * Create a delete button for a task.
 */
function createTaskDeleteButton(task) {
    const closeBtn = document.createElement("button")
    closeBtn.classList.add("delete-button")
    closeBtn.textContent = '✕'
    closeBtn.addEventListener('click', delBtnClickHandler(task))
    return closeBtn
}

/**
 * Creates a click handler for the delete button to remove a task.
 */
function delBtnClickHandler(task) {
    return () => {
        localStorage.setItem("tasks", JSON.stringify(tasksList.filter(t => t.desc !== task.desc)))
    }
}

/**
 * Create a paragraph element for the task description.
 */
function createTaskParagraph(task) {
    const pEl = document.createElement("p")
    pEl.textContent = task.desc
    return pEl
}

/**
 * Create a container div for the task description and delete button.
 */
function createTaskContainer() {
    const divEl = document.createElement("div")
    divEl.classList.add("item")
    return divEl
}

/**
 * Create the main list item element for a task.
 */
function createTaskLi(task) {
    const liEl = document.createElement("li")

    // Set the list item element as draggable
    liEl.setAttribute("draggable", "true")

    if (task.isChecked) liEl.classList.add("checked")

    liEl.addEventListener('click', liClickHandler(task))

    // Drag and drop event listeners
    liEl.addEventListener('dragstart', liDragstartHandler(liEl));
    liEl.addEventListener('dragend', liDragendHandler(liEl));
    liEl.addEventListener('dragover', liDragoverHandler(liEl));
    liEl.addEventListener('dragleave', liDragleaveHandler(liEl));
    liEl.addEventListener('drop', liDropHandler(task));

    return liEl
}

/**
 * Creates a Handler for the 'drop' event to reorder tasks.
 */
function liDropHandler(task) {
    return ev => {
        const draggable = document.querySelector('.dragging')
        const fromIndex = [...toDoListEl.children].indexOf(draggable)
        const toIndex = tasksList.indexOf(task)

        ev.preventDefault()

        const taskToMove = tasksList.splice(fromIndex, 1)[0]
        tasksList.splice(toIndex, 0, taskToMove)

        localStorage.setItem("tasks", JSON.stringify(tasksList))
    }
}

/**
 * Creates a Handler for the 'dragleave' event to remove highlight.
 */
function liDragleaveHandler(liEl) {
    return () => {
        const draggable = document.querySelector('.dragging')

        if (draggable !== liEl) liEl.classList.remove('hovered')
    }
}

/**
 * Creates a Handler for the 'dragover' event to allow dropping and highlight the target.
 */
function liDragoverHandler(liEl) {
    return ev => {

        if (!liEl.classList.contains('dragging')) {

            ev.preventDefault()
            ev.dataTransfer.dropEffect = "move"
            liEl.classList.add('hovered')
        }
    }
}

/**
 * Creates a Handler for the 'dragend' event to remove dragging class.
 */
function liDragendHandler(liEl) {
    return () => {
        liEl.classList.remove('dragging')
    }
}

/**
 * Creates a Handler for the 'dragstart' event to add dragging class.
 */
function liDragstartHandler(liEl) {
    return (ev) => {
        liEl.classList.add('dragging')
        ev.dataTransfer.effectAllowed = "move"
    }
}

/**
 * Creates a Handler for the 'click' event to toggle task completion.
 */
function liClickHandler(task) {
    return function () {
        task.isChecked = !task.isChecked
        localStorage.setItem("tasks", JSON.stringify(tasksList))
    }
}

dispatchEvent(new Event("storage"))

