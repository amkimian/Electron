$(document).ready(function() {
	$("body").on("click", "button[purpose='log']", function() {
		var docURI = $(this).attr('id');
		showDoc(docURI);
	});
	$("body").on("click", "button[purpose='workOrder']", function() {
		var docURI = $(this).attr('id');
		window.open(docURI)
	});

});

function createWorkOrderButton(tr, uri) {
	addSimpleButton(tr, "View WorkOrder",
			"/rapture/Rapture/workOrderViewer.jsp?workOrderURI=" + uri,
			"workOrder");
}

function stopWorkOrderButton(tr, uri) {
        var td = document.createElement('td');
        var button = createButton("Cancel WorkOrder", uri, "Terminate");
	button.onclick = function() {
		var vals = {};
                vals['workorder'] = uri;
                vals['force'] = false;
		$.ajax({
			// url : "../web/cancelWorkflow.rrfx?workOrder="+uri, 
			url : "../web/cancelWorkflow.rrfx",
                        dataType : 'json',
                        type : 'POST',
                        data : vals,
			complete : function(result) { alert(result['responseText']); }
		});
	};
        td.appendChild(button);
        tr.appendChild(td);
}

function addResumeButton(tr, uri, step) {
    var td = document.createElement('td');
    var button = createButton("Resume at this step", uri, "Terminate");
    button.style.whiteSpace = 'normal';
	button.onclick = function() {
		var vals = {};
                vals['workorder'] = uri;
                vals['workflowstep'] = step;
		$.ajax({
			url : "../web/resumeWorkflow.rrfx",
                        dataType : 'json',
                        type : 'POST',
                        data : vals,
			complete : function(result) { alert(result['responseText']); }
		});
	};
    td.appendChild(button);
    td.style.backgroundColor = 'white';
    tr.appendChild(td);
}

function addWorkOrderButton(tr, uri) {
	var td = document.createElement('td');
	var button = createWorkOrderButton(uri);
	td.appendChild(button);
	tr.appendChild(td);
}

function addSimpleButton(tr, text, fullUri, purpose) {
	var td = document.createElement('td');
	addButton(td, text, fullUri, purpose);
	tr.appendChild(td);
}

function addButton(d, text, fullUri, purpose) {
	var button = createButton(text, fullUri, purpose);
	d.appendChild(button);
}

function createWorkOrderButton(workOrderURI) {
	return createButton(
			"View WorkOrder",
			"/rapture/Rapture/workOrderViewer.jsp?workOrderURI=" + workOrderURI,
			"workOrder");
}

function createButton(text, fullUri, purpose) {
	var button = document.createElement('button');
	button.className = "btn btn-primary btn-xs";
	button.setAttribute('type', 'button');
	button.setAttribute('purpose', purpose);
	button.id = fullUri;
	var smallerText = text;
	// if (smallerText.length > 50) {
	// smallerText = "..." + smallerText.substring(smallerText.length - 50);
	//	
	// }
	button.appendChild(document.createTextNode(text));
	return button;
}
