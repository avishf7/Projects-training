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


// Update the task list UI when 'storage' event is triggered
window.addEventListener('storage', () => { 

    tasksList = JSON.parse(localStorage.getItem("tasks")) || []


    const listItems = []

    for (const task of tasksList) {
        // Create the main list item element
        const liEl = document.createElement("li")
        // If the task is checked, add the "checked" class to the list item
        if (task.isChecked) liEl.classList.add("checked");
        // Toggle the isChecked state and update localStorage when the list item is clicked
        liEl.addEventListener('click' , () => {
            task.isChecked = !task.isChecked
            localStorage.setItem("tasks", JSON.stringify(tasksList))
        })
              
        // Create a div to act as the container for the task description and delete button
        const divEl = document.createElement("div");
        divEl.classList.add("item");

        // Create a paragraph element for the task description
        const pEl = document.createElement("p");
        pEl.textContent = task.desc;

        // Create a button element for deleting the task
        const closeBtn = document.createElement("button");
        closeBtn.classList.add("delete-button");
        closeBtn.textContent = '✕';
        // Remove the task and update localStorage when the delete button is clicked
        closeBtn.addEventListener('click', () => {
        localStorage.setItem("tasks", JSON.stringify(tasksList.filter(t => t.desc !== task.desc)));
        });
        

        liEl.appendChild(divEl)
        .append(pEl,closeBtn)

        listItems.push(liEl)        
    } 

    toDoListEl.replaceChildren(...listItems)

    
})

dispatchEvent(new Event("storage"))