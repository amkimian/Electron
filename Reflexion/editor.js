var newButton, openButton, saveButton;
var editor;
var menu;
var fileEntry;
var hasWriteAccess;

var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
var fs = require("fs");
var clipboard = require('clipboard');
var csole = require('./console.js');

function handleDocumentChange(title) {
  var mode = "reflex";
  var modeName = "Reflex";
  if (title) {
    title = title.match(/[^/]+$/)[0];
    //document.getElementById("title").innerHTML = title;
    document.title = title;
    if (title.match(/.json$/)) {
      mode = {name: "javascript", json: true};
      modeName = "JavaScript (JSON)";
    } else if (title.match(/.html$/)) {
      mode = "htmlmixed";
      modeName = "HTML";
    } else if (title.match(/.css$/)) {
      mode = "css";
      modeName = "CSS";
    }
  } else {
    //document.getElementById("title").innerHTML = "[no document loaded]";
  }
  editor.setOption("mode", mode);
  //document.getElementById("mode").innerHTML = modeName;
}

function newFile() {
  fileEntry = null;
  hasWriteAccess = false;
  handleDocumentChange(null);
}

function setFile(theFileEntry, isWritable) {
  fileEntry = theFileEntry;
  hasWriteAccess = isWritable;
}

function readFileIntoEditor(theFileEntry) {
  fs.readFile(theFileEntry.toString(), function (err, data) {
    if (err) {
      console.log("Read failed: " + err);
    }

    handleDocumentChange(theFileEntry);
    editor.setValue(String(data));
  });
}

function writeEditorToFile(theFileEntry) {
  var str = editor.getValue();
  fs.writeFile(theFileEntry, editor.getValue(), function (err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

    handleDocumentChange(theFileEntry);
    console.log("Write completed.");
  });
}

var onChosenFileToOpen = function(theFileEntry) {
  console.log(theFileEntry);
  setFile(theFileEntry, false);
  readFileIntoEditor(theFileEntry);
};

var onChosenFileToSave = function(theFileEntry) {
  setFile(theFileEntry, true);
  writeEditorToFile(theFileEntry);
};

function handleNewButton() {
  if (false) {
    newFile();
    editor.setValue("");
  } else {
    window.open('file://' + __dirname + '/index.html');
  }
}

function handleOpenButton() {
  dialog.showOpenDialog({properties: ['openFile']}, function(filename) {
      onChosenFileToOpen(filename.toString()); });
}

function handleSaveButton() {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry);
  } else {
    dialog.showSaveDialog(function(filename) {
       onChosenFileToSave(filename.toString(), true);
    });
  }
}

function initContextMenu() {
  menu = new Menu();
  menu.append(new MenuItem({
    label: 'Copy',
    click: function() {
      clipboard.writeText(editor.getSelection(), 'copy');
    }
  }));
  menu.append(new MenuItem({
    label: 'Cut',
    click: function() {
      clipboard.writeText(editor.getSelection(), 'copy');
      editor.replaceSelection('');
    }
  }));
  menu.append(new MenuItem({
    label: 'Paste',
    click: function() {
      editor.replaceSelection(clipboard.readText('copy'));
    }
  }));

  window.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    menu.popup(remote.getCurrentWindow(), ev.x, ev.y);
  }, false);
}


onload = function() {
  initContextMenu();

  //newButton = document.getElementById("new");
  //openButton = document.getElementById("open");
  //saveButton = document.getElementById("save");

  //newButton.addEventListener("click", handleNewButton);
  //openButton.addEventListener("click", handleOpenButton);
  //saveButton.addEventListener("click", handleSaveButton);

  editor = CodeMirror(
      document.getElementById("editor"),
      {
        mode: {name: "reflex", json: true },
        lineNumbers: true,
        theme: "lesser-dark",
        extraKeys: {
          "Cmd-S": function(instance) { handleSaveButton() },
          "Ctrl-S": function(instance) { handleSaveButton() },
        }
      });

  //editor.on("change", function(what) {
  //   console.log(what);
  //});

  csole.setEditor(editor);
  newFile();
  onresize();

  var settings = {
    prompt : 'reflex> ',
    name : 'reflex',
  //  height : 400,
    outputLimit: 1000,
    enabled : false,
    greetings : 'Reflexion console',
    onInit : function(term) {
      theTerm = term;
    }

  };

  $('#repl').terminal(csole.terminal, settings);

}


onresize = function() {
  var container = document.getElementById('editor');
  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;

  var scrollerElement = editor.getScrollerElement();
  scrollerElement.style.width = containerWidth + 'px';
  scrollerElement.style.height = containerHeight + 'px';

  editor.refresh();
}
