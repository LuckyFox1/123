
var todo = [];
var storage = window.localStorage || null;

$(document).ready(function() {
	saveToLS();
	render();

	$('#title').keypress(function(e) {
		console.log(e.which);
		if(e.which == 13) {
			insertNewItem($('#title').val());
			$('#title').val('');
		}
	});
});


    $('#todo-body').sortable({
    	update: function() {
            var elements = $('#todo-body').find('tr');
			console.log(elements);
			for (var i = 0; i < elements.length; i++) {
    			todo[i].checked = elements[i + ""].childNodes["0"].childNodes["0"].checked;
    			todo[i].title = elements[i + ""].childNodes["1"].childNodes["0"].firstChild.textContent;
			}
			saveToLS();
			render();
		},
        cursor: "default",
		start: function ( ) {
			$('.ui-sortable-helper td:last-child').addClass("right-align");
        }
    });
    $('#todo-body').disableSelection();

function saveToLS() {
	storage.setItem('todo', JSON.stringify(todo));
}

function loadFromLS() {
    todo = JSON.parse(storage.getItem('todo'));
}

//просто готовим значения каждого из пунктов списка
function prepareItem(id, title, checked) {
	var checkClass = "";
	var titleStyled = "";

	if(checked) {
		checkClass = "checked='checked'";
		titleStyled = "<s>" + title + "</s>"
	} else {
		titleStyled = title;
	}

	var html = '';
	html += '<tr>';
		html += '<td class="left-align" style="width: 50px;">';
			html += '<input type="checkbox" name="completed" onClick="modifyItem(' + id + ', 0)"'
				+ checkClass + '><label for="completed" onClick="modifyItem('
				+ id + ', 0)"></label>';
		html += '</td>';
		html += '<td><p>' + titleStyled + '</p></td>';
		html += '<td class="right-align"><a class="btn-floating btn-small waves-effect waves-light edit" onClick="modifyItem('
			+ id + ', 1)"><i class="material-icons">edit</i></a> <a class="btn-floating btn-small waves-effect waves-light delete"onClick="modifyItem('
			+ id + ', 2)"><i class="material-icons">delete</i></a></td>';
	html += '</tr>';

	return html;
}

function render() {
	$('#todo-body').html('');
	loadFromLS();
	for(var i = 0; i < todo.length; i++) {
		$('#todo-body').append(prepareItem(i, todo[i].title, todo[i].checked));
	}
}

//Modification types: 0 — check, 1 — edit text, 2 — delete
function modifyItem(id, action) {
	if(action == 0) {
		if(todo[id].checked) {
			todo[id].checked = false
		}
		else {
			todo[id].checked = true;
		}
	} 
	else if(action == 1) {
		var newText = window.prompt("Edit: ", todo[id].title);
		todo[id].title = newText;
	} 
	else if(action == 2) {
		todo.splice(id, 1);
	}
	saveToLS();
	render(); 
}

function insertNewItem(title) {
	todo.push({ title: title, checked:false });
    saveToLS();
	render();
}


function removeAll() {
	todo = [];
	saveToLS();
	render();
}

if(JSON.parse(storage.getItem('todo')).length != 0) {
    loadFromLS();
}
