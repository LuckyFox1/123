let todo = [];
let API = {};
API.root = 'http://127.0.0.1:3000';

$(document).ready(function () {
    render();

    $('#title').keypress(function (e) {
        if (e.which == 13) {
            insertNewItem($('#title').val());
            $('#title').val('');
        }
    });
});

$('#todo-body').sortable({
    update: function () {
        let elements = $('#todo-body').find('tr');
        for (let i = 0; i < elements.length; i++) {
            todo[i].checked = elements[i + ''].childNodes['0'].childNodes['0'].checked;
            todo[i].title = elements[i + ''].childNodes['1'].childNodes['0'].firstChild.textContent;
        }
    },
    cursor: 'default',
    start: function () {
        $('.ui-sortable-helper td:last-child').addClass('right-align');
    }
});
$('#todo-body').disableSelection();


function getFromServer(cb) {
    API.get(function (todos, err) {
        if (!err) {
            todo = todos;
            cb();
        } else {
            console.log(err);
            alert('An error occured.');
        }
    });
}

function prepareItem(id, title, checked) {
    let checkClass = '';
    let titleStyled = '';

    if (checked) {
        checkClass = 'checked="checked"';
        titleStyled = '<s>' + title + '</s>'
    } else {
        titleStyled = title;
    }

    let html = '';
    html += '<tr>';
    html += '<td class="left-align" style="width: 50px;">';
    html += '<input type="checkbox" name="completed" onClick="modifyItem(\'' + id + '\', 0)"'
        + checkClass + '><label for="completed" onClick="modifyItem(\''
        + id + '\', 0)"></label>';
    html += '</td>';
    html += '<td><p>' + titleStyled + '</p></td>';
    html += '<td class="right-align"><a class="btn-floating btn-small waves-effect waves-light edit" onClick="modifyItem(\''
        + id + '\', 1)"><i class="material-icons"> edit </i></a> <a class="btn-floating btn-small waves-effect waves-light delete"onClick="modifyItem(\''
        + id + '\', 2)"><i class="material-icons"> delete </i></a></td>';
    html += '</tr>';

    return html;
}

function render() {
    $('#todo-body').html('');
    getFromServer(function () {
        for (let i = 0; i < todo.length; i++) {
            $('#todo-body').append(prepareItem(todo[i]._id, todo[i].task, todo[i].completedTask));
        }
    });
}

//Modification types: 0 — check, 1 — edit text, 2 — delete
function modifyItem(id, action) {
    if (action == 1 || action == 0) {
        var oldItem;
        todo.forEach(function (item) {
            if (item._id == id) {
                oldItem = item;
                return;
            }
        });

        var newText = oldItem.task;
        var checkedState = oldItem.completedTask;

        if (action == 1) {
            newText = window.prompt('Edit: ', oldItem.task);
            if (newText == null || newText == '') {
                newText = oldItem.task;
            }
        } else if (action == 0) {
            checkedState = (!checkedState);
        }

        API.edit(id, newText, checkedState, function (resp, err) {
            if (err) {
                console.log(err);
                alert('An error occured.');
            } else {
                render();
            }
        });
    } else {
        API.delete(id, function (result, err) {
            if (err) {
                console.log(err);
                alert('An error occured.');
            } else {
                render();
            }
        });
    }
}

function insertNewItem(title) {
    API.insert(title, function (newTask, err) {
        if (!err) {
            todo.push({title: newTask.title, checked: newTask.completedTask});
            $('#title').val('');
        } else {
            console.log(err);
            alert('An error occured.');
        }
    });
    render();
}

API.get = function (callback) {
    fetch(API.root + '/todo')
        .then((response) => response.json())
        .then(function (body) {
            callback(body.todos, undefined);
        })
        .catch(function (err) {
            callback(null, {type: 'http', error: err});
        });
};

API.insert = function (task, callback) {
    let payload = {task: task, completedTask: false};

    fetch(API.root + '/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response.json())
        .then(function (body) {
            callback(body.todo, undefined);
        })
        .catch(function (err) {
            callback(null, {type: 'http', error: err});
        });
};

API.delete = function (id, callback) {
    fetch(API.root + '/' + id, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then(function (body) {
            callback(true, undefined);
        })
        .catch(function (err) {
            callback(null, {type: 'http', error: err});
        });
};


API.edit = function (id, task, checked, callback) {
    let payload = {task: task, completedTask: checked};
    console.log(JSON.stringify({todo: payload}));

    fetch(API.root + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({todo: payload})
    })
        .then((response) => response.json())
        .then(function (body) {
            callback(true, undefined);
        })
        .catch(function (err) {
            callback(null, {type: 'http', error: err});
        });
};