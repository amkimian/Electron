function addHeader(thead, name) {
	var th = document.createElement('th');
	th.appendChild(document.createTextNode(name));
	thead.appendChild(th);
}

function addCenterHeader(thead, name) {
	var th = document.createElement('th');
	th.className = 'text-center';
	th.appendChild(document.createTextNode(name));
	thead.appendChild(th);
}

function addRightHeader(thead, name) {
	var th = document.createElement('th');
	th.className = 'text-right';
	th.appendChild(document.createTextNode(name));
	thead.appendChild(th);
}

function addDownloadButton(td, element) {
	// Replace : with <sp>: so it wraps
	// Put a glyph-icon in there too
	var viewButton = document.createElement("button");
	viewButton.id = element;
	viewButton.className = "btn btn-default btn-xs pull-left zoomer";
	var glyphSpan = document.createElement("span");
	glyphSpan.className = "glyphicon glyphicon-search";
	viewButton.setAttribute("type", "button");
	viewButton.appendChild(glyphSpan);
	
	var re = new RegExp(':', 'g');
	element = element.replace(re, ': ');
	
	var overspan = document.createElement('span');
	overspan.appendChild(viewButton);
	var code = document.createElement('code');
    code.appendChild(document.createTextNode(element));		
	overspan.appendChild(code);
	td.appendChild(overspan);
	$(viewButton).on("click", function() {
		showDoc(viewButton.id);
		return false;
	});	
}

function addBriefCell(tr, element) {
    var td = document.createElement('td');
    var viewButton = document.createElement("button");
	viewButton.id = element;
	viewButton.className = "btn btn-default btn-xs pull-left zoomer";
	var glyphSpan = document.createElement("span");
	glyphSpan.className = "glyphicon glyphicon-zoom-in";
	viewButton.setAttribute("type", "button");
	viewButton.appendChild(glyphSpan);
	$(viewButton).on("click", function() {
		showDoc(viewButton.id);
		return false;
	});	
	var overspan = document.createElement('span');
	overspan.appendChild(viewButton);
	td.appendChild(overspan);
    tr.appendChild(td);
}

function addCell(tr, element) {
	var td = document.createElement('td');
	if (element == undefined) {
		td.appendChild(document.createTextNode(''));
	} else {
		var tester = "" + element;
		if (tester.indexOf('/') == 0) {
			addDownloadButton(td, element);
		} else {		
		    td.appendChild(document.createTextNode(element));
		}
	}
	tr.appendChild(td);
}

function addCodeCell(tr, element) {
	var td = document.createElement('td');
	if (element[0] == '/' && element[1] == '/') {
	   addDownloadButton(td, element);
	} else {	
	    var code = document.createElement('code');
	    code.appendChild(document.createTextNode(element));
	    td.appendChild(code);
	}
	    
	tr.appendChild(td);
}


function addRow(tbody, col1, col2) {
    var tr = document.createElement('tr');
    addCell(tr, col1);
    addCodeCell(tr, col2);
    tbody.appendChild(tr);
}

function addBoldCell(tr, value) {
	var td = document.createElement('td');
	var b = document.createElement('b');
	var content = document.createTextNode(value);
	b.appendChild(content);
	td.appendChild(b);
	tr.appendChild(td);
}
	
function addKeyValTable(tableId, tbodyOrig, name, data) {
	var oldTable = document.getElementById(tableId), newTable = oldTable
	.cloneNode(false);
	var tbody = document.createElement('tbody');
	var thead = document.createElement('thead');
	for(var key in data) {
		addHeader(thead, key);
	}
	var tr = document.createElement('tr');
	for(var key in data) {
		addCodeCell(tr, data[key]);
	}
	tbody.appendChild(tr);
	newTable.appendChild(thead);
	newTable.appendChild(tbody);
	tr = document.createElement('tr');
	addCell(tr, name);
	var td = document.createElement('td');
	td.appendChild(newTable);
	tr.appendChild(td);
	tbodyOrig.appendChild(tr);
}

function addRightCell(tr, value) {
	var td = document.createElement('td');
	td.className = 'text-right';
	var content = document.createTextNode(value);
	td.appendChild(content);
	tr.appendChild(td);
}

function addRightColorCell(tr, value) {
	var td = document.createElement('td');
	td.className = 'text-right colorMe';
	var content = document.createTextNode(value);
	td.appendChild(content);
	tr.appendChild(td);
}

function addInputs(tr, inputArray) {
	var td = document.createElement('td');
	var div = document.createElement('div');
	div.className = "btn-group-vertical";

	for ( var i = 0; i < inputArray.length; i++) {
		var button = document.createElement('button');
		button.className = "btn btn-primary btn-xs";
		button.setAttribute('type', 'button');
		button.appendChild(document.createTextNode(inputArray[i]));
		div.appendChild(button);
	}
	td.appendChild(div);
	tr.appendChild(td);
}

function addSimpleButtons(tr, fullUri1, fullUri2) {
	var td = document.createElement('td');
	addButton(td, fullUri1);
	tr.appendChild(td);
	td = document.createElement('td');
	addButton(td, fullUri2);
	tr.appendChild(td);
}

function addButton(d, fullUri) {
	var button = document.createElement('button');
	button.className = "btn btn-primary btn-xs";
	button.setAttribute('type', 'button');
	button.id = fullUri;
	var smallerText = fullUri;
	// if (smallerText.length > 50) {
	// smallerText = "..." + smallerText.substring(smallerText.length - 50);
	//	
	// }
	button.appendChild(document.createTextNode(smallerText));
	d.appendChild(button);
}

function addIdButton(d, fullUri, id) {
	var button = document.createElement('button');
	button.className = "btn btn-primary btn-xs";
	button.setAttribute('type', 'button');
	button.id = id;
	var smallerText = fullUri;
	// if (smallerText.length > 50) {
	// smallerText = "..." + smallerText.substring(smallerText.length - 50);
	//	
	// }
	button.appendChild(document.createTextNode(smallerText));
	d.appendChild(button);
}

