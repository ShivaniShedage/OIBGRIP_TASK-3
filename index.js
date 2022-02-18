//select elements in DOM
const form =  document.querySelector("#itemForm");
const inputItem = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");


//create an empty array of lists
let todoItems =  [];


//update item
const updateItem = function(currentItemIndex,value){
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex, 1 , newItem);
    setLocalStorage(todoItems);
};

//delete item
const  removeitem = function(item){
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex,indexOf(item));
};

//filter items
const getItemsFilter = function(type){
    let filterItems = [];
    switch(type){
        case "todo":
            filterItems = todoItems.filter((item)=> !item.isDone);
            break;
        case "done":
            filterItems = todoItems.filter((item)=> item.isDone);
            break;
        default:
            filterItems = todoItems; 
    }
    getList(filterItems);
};

//handle events on action buttons
const handleItem = function(itemData){
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item)=>{
        if(
            item.querySelector(".title").getAttribute("data-time")==itemData.addedAt
        ){
            // done  // isDone true
            item.querySelector("[data-done]").addEventListener("click",function(e){
                e.preventDefault();
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                const currentClass = currentItem.isDone
                ? "bi-check-circle-fill"
                : "bi-check-circle";
                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1 ,currentItem);
                setLocalStorage(todoItems);
                const iconClass = currentItem.isDone
                ? "bi-check-circle-fill"
                : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass,iconClass);
                const filterType = document.querySelector("#tabValue").value;
                getItemsFilter(filtertype);
            });

            //edit
            item.querySelector("[data-edit]").addEventListener("click",function(e){
                e.preventDefault();
                inputItem.value = itemData.name;
                document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
            });

            //delete
            item.querySelector("[data-delete]").addEventListener("click",function(e){
                e.preventDefault();
                if (confirm("Are you sure you want to delete this task?")){
                    itemsList.removeChild(item);
                    removeitem(item);
                    setLocalStorage(todoItems);
                    return todoItems.filter((item)=> item!= itemData);
                }
                
            });
        }
    });
};

//get list Items
const getList = function(todoItems){
    itemsList.innerHTML= "";
    if (todoItems.length > 0) {
        todoItems.forEach((item)=> {
            const iconClass= item.isDone 
            ? "bi-check-circle-fill" 
            : "bi-check-circle";
            itemsList.insertAdjacentHTML("beforeend",
            `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete><i class="bi bi-trash red"></i></a>
            </span>
            </li>`
            );
            handleItem(item);
        });
    }else{
        itemsList.insertAdjacentHTML("beforeend",
            `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Nothing to do.</span>
            </li>`
            );
    }
};
//get local storage from the page
const getLocalStorage = function(){
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null){
        todoItems = [];
    }else{
        todoItems = JSON.parse(todoStorage);
    }
    //console.log('items',todoItems);
    getList(todoItems);
};

//set in local storage
const setLocalStorage = function(todoItems){
    localStorage.setItem("todoItems",JSON.stringify(todoItems));
};

document.addEventListener('DOMContentLoaded',()=>{
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if(!itemName){
            alert("Please add task.");
        }else{

            const currentItemIndex = document.querySelector("#objIndex").value;
            if (currentItemIndex){
                //update
                updateItem(currentItemIndex, itemName);
                document.querySelector("#objIndex").value = "";
            }else{

                const itemObj = {
                    name: itemName,
                    isdone:false,
                    addedAt:new Date().getTime(),
                };
                todoItems.push(itemObj);
                setLocalStorage(todoItems);
            }
            getList(todoItems);
        }
        inputItem.value = "";
    });
    //filter tabs
    filters.forEach((tab)=>{
        tab.addEventListener("click", function (e){
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach((nav)=>{
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getItemsFilter(tabType);
            document.querySelector("#tabValue").value = tabType;
        });
    });
    //load items
    getLocalStorage();
});
