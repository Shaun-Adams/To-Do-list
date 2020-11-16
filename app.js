const taskRef = db.collection('Task');

const taskList = document.querySelector('#task-list');
const form = document.querySelector('#add-task-form');


function renderTask(doc){
    let li = document.createElement('li');
    let task = document.createElement('span');
    let x = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;
    x.textContent = 'x';

    li.appendChild(task);
    li.appendChild(x);

    taskList.appendChild(li);

    // deleting data
    x.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        taskRef.doc(id).delete();
    });
}

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    taskRef.add({
        task: form.task.value
    });
    form.task.value = '';
});

// real-time listener
taskRef.orderBy('task').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type === 'added'){
            renderTask(change.doc);
        } else if (change.type === 'removed'){
            let li = taskList.querySelector('[data-id=' + change.doc.id + ']');
            taskList.removeChild(li);
        }
    });
});

