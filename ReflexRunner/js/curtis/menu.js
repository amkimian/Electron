// Function to update the menu of a standard Curtis page
// By navigating and processing the data in the curtis.menu repository

$(function() {
	// The menu will be placed / update an area called "curtis-menu"
	var vals = {
		app : curtisApp
	};
	$.ajax({
		url : "/curtisscript/menu",
		dataType : 'json',
		type : 'GET',
		data : vals,

		success : function(data) {
			updateMenu(data, document.getElementById('curtis-menu'));
			
			$('#logoutLink').click(function() {
				var vals = {};
				vals['redirect'] = "/index.html";
				$.ajax({
					url : "/login/logout",
					dataType : 'json',
					type : 'GET',
					data : vals,

					success : function(data) {

						if (data.redirect) {
							window.location.replace(data.redirect);
						} else {
							// data.message
							$('#error').text(data.message);
						}
						// $('#loginForm').modal('hide');
					},
					error : function(data) {
						alert(data);
					}
				});
			});
		},
		error : function(data) {
			alert(data);
		}
	});
});

function addMenus(ulPart, menuStructure) {
	for ( var topName in menuStructure) {
		if (menuStructure.hasOwnProperty(topName)) {
			var entryStructure = menuStructure[topName];
			var sectionLi = document.createElement('li');
			sectionLi.className = "dropdown";
			var sectionLink = document.createElement('a');
			sectionLink.href = '#';
			sectionLink.className = "dropdown-toggle";
			sectionLink.innerHTML = topName + ' <b class="caret"></b>';
			sectionLink.setAttribute('data-toggle', 'dropdown');
			sectionLi.appendChild(sectionLink);
			createSubMenus(entryStructure, sectionLi);
			ulPart.appendChild(sectionLi);
		}
	}
}

function updateMenu(menuStructure, divElement) {
	var navElement = document.createElement('nav');
	divElement.appendChild(navElement);
	navElement.className = "navbar navbar-inverse navbar-embossed";
	navElement.setAttribute("role", "navigation");

	var brand = document.createElement('div');
	brand.className = "navbar-header";
	var brandA = document.createElement('a');
	brandA.className = "navbar-brand";
	brandA.href = "/app/index.html";
	brandA.innerHTML = menuStructure.env;
	brand.appendChild(brandA);
	navElement.appendChild(brand);
	
	var menuContent = document.createElement('div');
	menuContent.className = "collapse navbar-collapse";

	var ulPart = document.createElement('ul');
	ulPart.className = 'nav navbar-nav navbar-left';
	navElement.appendChild(menuContent);
	menuContent.appendChild(ulPart);
	addMenus(ulPart, menuStructure.left);

	var logoutUL = document.createElement('ul');
	logoutUL.className = "nav navbar-nav navbar-right";
	addMenus(logoutUL, menuStructure.right);

	var logoutLI = document.createElement('li');
	var logoutLink = document.createElement('a');
	logoutLink.href = '#';
	logoutLink.id = "logoutLink";
	logoutLink.innerHTML = "Logout";
	logoutLI.appendChild(logoutLink);
	logoutUL.appendChild(logoutLI);
	logoutUL.appendChild(getWhoAmi(menuStructure.who));
	menuContent.appendChild(logoutUL);
}

function getWhoAmi(who) {
    var email = who.emailAddress;
    if (email == undefined || email == "") {
    	email = "alan.moore@incapturetechnologies.com";
    }
    var gravHash = MD5( email );
    var img = document.createElement('img');
    img.src = "http:////www.gravatar.com/avatar/" + gravHash + "?s=38";
    var w = document.createElement('li');
    w.appendChild(img);
    return w;
}


function createSubMenus(data, sectionLi) {
	var ulPart = document.createElement('ul');
	ulPart.className = "dropdown-menu";
	sectionLi.appendChild(ulPart);
	for ( var name in data) {
		if (data.hasOwnProperty(name)) {
			var menuItemData = data[name];
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.href = menuItemData.page;
			a.innerHTML = menuItemData.title;
			if (menuItemData.target != undefined) {
				a.target = menuItemData.target;
			}
			li.appendChild(a);
			ulPart.appendChild(li);
		}
	}
}
