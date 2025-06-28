document.addEventListener('DOMContentLoaded',()=>{
    const taskInput= document.getElementById('task-input');
    const addTaskBtn =  document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image'); /* *** */
    const todosContainer = document.querySelector('.todos-container');
    const progessbar = document.getElementById('progress');
    const  progressNumbers= document.getElementById('numbers');
    const statusHeading = document.querySelector('.details h3');
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block':'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%':'50%';
    };

    const updateProgress = (checkCompletion = true)=>{
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        progessbar.style.width = totalTasks ? `${(completedTasks / totalTasks)*100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (totalTasks === 0) {
            statusHeading.textContent = "Let's get started!";
        } else if (completedTasks === 0) {
            statusHeading.textContent = "You can do it!";
        } else if (completedTasks < totalTasks) {
            statusHeading.textContent = "Keep it up!";
        } else {
            statusHeading.textContent = "Great Job!";
        }

        //confetti manage
        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks)
        {
            triggerConfetti();
        }
    };

    //want to save to browser local storage
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }))
        localStorage.setItem('tasks',JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text , completed}) => addTask(text,completed,false));
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text,completed = false,checkCompletion=true)=>{
        /*event.preventDefault();        /* ** */
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li = document.createElement('li');
        /*li.textContent = taskText;*/ /* now we will design list items in task list.We dynamically set the html structure of a list item element 
        we use the innerHTML property to set the HTML  content inside the li element we use back ticks to enable template literals for multi-line  String 
        and  to embed js variables this helps to define the content of the li element dynamically we create an html input element with checkbox.This checkbox
        is used to Mark the task as completed or not completed or not completed .We also create an html span element to display the text of the text
        the dollar sign inserts the value of the task text variable showing the task description entered by the user*/
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class ="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change',()=>{
            const isChecked = checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5':'1';
            editBtn.style.pointerEvents = isChecked ? 'none':'auto';
            updateProgress();
            saveTaskToLocalStorage();

        });

        editBtn.addEventListener('click',()=>{
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click',()=>{
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value='';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };
    /*using the arrow function syntax this function handles the process of adding a new task to the to-do list.
    It fetches the current value entered in the task input field.
    trim() method removes any extra white space from the beginning and end of the string ensuring the task text is clean
    and doesn't accidentally include unnecessary spaces.
    next line-- if(!taskText) -the function checks if the task text is empty or invalid if the input is empty ,the function stops here and doesn't proceed further.
     
    then li dynamically creates a new List element in javascript.Each task in todo list is represented as a li element in iinside the task list
    next line -- it sets the text Content of the newly created li element to the value of task text ensuring that 
    the li is displays the task text entered by the user
    next line -- it then appends the newly created li element to the task list adding the new task to the visible task list on the page
    
    Finally it clear the text box task input after the task is added preparing the input field for the user to type their next task*/
    

    /*addTaskBtn.addEventListener('click',() => addTask());*/
    document.querySelector('.input-area').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });
    addTaskBtn.addEventListener('click',()=>addTask());
    taskInput.addEventListener('keypress',(e)=>{
        if(e.key === 'Enter')
        {
            e.preventDefault();
            addTask();
        }

        

    });
   /*1st we add an event-listener to the addTaskBtn button.
    This method attaches a click event to the button when clicked the addTask function* runs 
    
    next we add task function runs next we add an event-listener to the input field.This listener waits for key presses while typing in input box and 
    checks for the enter key.The key press event listens for any kre press 
    when a key is pressed a function runs with the event object e as its parameter.
    The function checks if the enter key is pressed by looking at the e.key property 
    if it is the addTask function runs the event object e is passed to the addTask function to prevent the default behavior 
    
    Now if we want to add task that is not added  because we need to prevent the default action 
    to fix  this we add event prevent defaukt to stop the default action finally when we add a tskk to do the list**
    
    But empty image is still shown.we need to remove the image when task is added .So finding the class name of empty image variable 
    this element shows or hides an empty state image when task list is empty ***

    next line -- we create a function named toggle empty state using the arrow function syntax . This function checks the current state of the task list
    and adjust the visibility of the empty image .The empty image style display refers to the display CSS property of the empty image  element the 
    task list property refers to all the child elements inside the task list the length property returns the number of child elements in the task list
    if there are no tasks in task list children length will be zero. The function checks if the task length is zero  if true then it shows the empty
    image by settting display to  block if false it hides the empty image by setting display to none. Remember this code won't work unless we call the
    toggle empty state function
    
    */
   loadTasksFromLocalStorage();

});

//triggerconfetti
const triggerConfetti = ()=>{
    const count = 200,
  defaults = {origin: { y: 0.7 },};

function fire(particleRatio, opts) {
  confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    }));
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
};