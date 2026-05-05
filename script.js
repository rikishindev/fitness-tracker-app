let todos=JSON.parse(localStorage.getItem("todos")) || [];

const list = document.querySelector("#list");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#add-btn");

function createTodo(text){
return {
id:Date.now(),
text:text,
completed: false
};
} 

function createTodoItem(todo){
const li=document.createElement("li");
li.dataset.id=todo.id;

const span=document.createElement("span");
span.classList.add("text");
span.textContent=todo.text;

const editBtn=document.createElement("button");
editBtn.classList.add("edit-btn");

const deleteBtn = document.createElement("button");
 deleteBtn.classList.add("delete-btn");

if(todo.completed){
li.classList.add("completed");
}

li.appendChild(span);
li.appendChild(editBtn);
li.appendChild(deleteBtn);

return li;
}

function renderTodos(todos){
list.innerHTML="";

todos.forEach(todo=>{
const li=createTodoItem(todo);
list.appendChild(li);
});
}

function saveTodos(){
localStorage.setItem("todos", JSON.stringify(todos));
}

addBtn.addEventListener("click",(event)=>{
const value=input.value.trim();
if(value==="")
return;

const newTodo=createTodo(value);
todos.push(newTodo);

saveTodos();
renderTodos(todos);

input.value="";
});

list.addEventListener("click",(event)=>{
const li=event.target.closest("li");
if(!li) return;

const id=Number(li.dataset.id);

if(event.target.closest(".delete-btn")){
todos=todos.filter(todo=>todo.id!==id);
saveTodos();
renderTodos(todos);
return;
};

if(event.target.closest(".edit-btn")){
const span=li.querySelector(".text");

const editInput = document.createElement("input");
editInput.value = span.textContent;

span.replaceWith(editInput);
editInput.focus();

editInput.addEventListener("blur",(event)=>{
const value = editInput.value.trim();

if(value==="") {
renderTodos(todos);
return;
}

todos=todos.map(todo=>{
if(todo.id===id)
{
return{...todo,text:value};
}
return todo;
});

saveTodos();
renderTodos(todos);
});

editInput.addEventListener("keydown",(event)=>{
if(event.key==="Enter"){
editInput.blur();
}else if ( event.key === "Escape"){
renderTodos(todos);
}
});

return;
}

todos = todos.map(todo => {
  if (todo.id === id) {
    return { ...todo, completed: !todo.completed };
  }
  return todo;
});

saveTodos();
renderTodos(todos);

});

renderTodos(todos);

let time=0;
let  intervalId=null;
let records=JSON.parse(localStorage.getItem("records")) || [];

const display=document.querySelector("#display");
const startBtn=document.querySelector("#start-btn");
const pauseBtn=document.querySelector("#pause-btn");
const resetBtn=document.querySelector("#reset-btn");
const recordList=document.querySelector("#record-list");

function createRecord(time){
return {
id:Date.now(),
time: time
};
}

function createRecordItem(record){
const recordLi=document.createElement("li");
recordLi.dataset.id=record.id;
recordLi.textContent=formatTime(record.time);

return recordLi;
};

function formatTime(seconds){
const m=Math.floor(seconds/60);
const s=seconds%60;
return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function render(){
display.textContent=formatTime(time);

recordList.innerHTML="";
records.forEach((record)=>{
const recordLi=createRecordItem(record);
recordList.appendChild(recordLi);
});
}
function saveRecords(){
localStorage.setItem("records",JSON.stringify(records));
};

startBtn.addEventListener("click",()=>{
if(intervalId) return;
intervalId=setInterval(()=>{
time++;
render();
},1000)
});

pauseBtn.addEventListener("click",()=>{
if(!intervalId) return;

clearInterval(intervalId);
intervalId=null;
if(time===0) return;
records.push(createRecord(time));

saveRecords();
render();
});

resetBtn.addEventListener("click",()=>{
clearInterval(intervalId);
intervalId=null;
time=0;
render();
});

render();