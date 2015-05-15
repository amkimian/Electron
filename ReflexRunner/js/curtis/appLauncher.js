// Render some nice buttons to navigate the applications. Should use some of the same code of the menus (to get the app launch point)

$(function() {
	// The menu will be placed / update an area called "curtis-menu"
	var vals = {
		app : curtisApp
	};
	$.ajax({
		url : "/curtisscript/appLaunch",
		dataType : 'json',
		type : 'GET',
		data : vals,

		success : function(data) {
			updateLauncher(data, document.getElementById('curtis-launch'));
	    }
	});
});

function updateLauncher(data, div) {
	var indexPos = 0;
	var currentDiv;
	var mainDiv = document.getElementById("launcher")
	var tabPanel = document.createElement('div');
	tabPanel.setAttribute('role', 'tabpanel');
	mainDiv.appendChild(tabPanel);
	var tabList = document.createElement('ul');
	tabList.className = "nav nav-tabs";
	tabList.setAttribute("role", "tablist");
	tabPanel.appendChild(tabList);
	
	var tabContent = document.createElement("div");
	tabContent.className = "tab-content";
	tabPanel.appendChild(tabContent);
	
	var tabs = {};
	var tabIndex = {};
	var tabRows = {};
	var tabContents = {};
	
	// Here we setup a series of tabs, and add elements to the tabs as we see fit
	
	for(var i=0; i< data.length; i++) {
		var row = data[i];
		if (tabs[row.group] == undefined) {
		    var li = document.createElement('li');
		    var a = document.createElement('a');
		    a.href = "#" + row.group;
		    a.setAttribute('data-toggle', 'tab');
		    a.innerHTML = row.group;
		    li.appendChild(a);
		    tabList.appendChild(li);
		    tabs[row.group] = 1;
		    // Now create content
		    var tab = document.createElement('div');
		    tab.className = "tab-pane";
		    tab.id = row.group;
		    tabContents[row.group] = tab;
		    tabContent.appendChild(tab);
		    tabIndex[row.group] = 0;
		    var tabRow = document.createElement('div');
		    tabRow.className = "row";
		    tab.appendChild(tabRow);
		    tabRows[row.group] = tabRow;
		}

		var tabDiv = tabContents[row.group];
		var tabRow = tabRows[row.group];
		var tabIndexPoint = tabIndex[row.group];
		
		var outer = document.createElement('div');
		outer.className = "col-xs-3";
		tabRow.appendChild(outer);
		tabIndexPoint++;
		if (tabIndexPoint == 3) {
			tabIndexPoint = 0;
			var theRow = document.createElement('div');
			theRow.className = "row";
			tabDiv.appendChild(theRow);
			tabRow = theRow;
			tabRows[row.group] = theRow;
		}
		tabIndex[row.group] = tabIndexPoint;
		
		var tile = document.createElement("div");
		tile.className = "tile";
		var header = document.createElement("h3");
		header.className = "tile-title";
		header.appendChild(document.createTextNode(row.name));
		tile.appendChild(header);
		var para = document.createElement('p');
		para.appendChild(document.createTextNode(row.description));
		tile.appendChild(para);
		var a = document.createElement('a');
		a.href = row.defPage;
		a.className = "btn btn-" + row.appColor + " btn-large btn-block";
		a.appendChild(document.createTextNode("Launch"));
		tile.appendChild(a);
		outer.appendChild(tile);
	}
}
        	

			