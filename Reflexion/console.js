// This is a Reflexion console module - used to coordinate activity between the console
// the editor and Rapture

var rapture = require('./rapture.js');
var info = require('./info.js');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require("fs");
var editor = {};
var theFileEntry = null;
var connectedToRapture = false;
var scriptUri = null;

module.exports.terminal = function(command, term) {
    // Given a command, do something with it
    if (command.charAt(0) == ':') {
      parseSpecialCommand(command, term);
    } else {
       term.echo("I saw " + command);
    }
    //editor.setValue(command);
};

module.exports.setEditor = function(ed) {
  editor = ed;
  editor.on("change", function(w) {
      info.setLocalChanged(true);
      info.setRemoteChanged(true);
  });
}

/**
* If the command began with ':' we come here. Based on the remaining part of the
* command we will run to different functions
*/

var dispatcher = {
    ":connect" : connectRapture,
    ":load" : loadScript,
    ":run" : runScript,
    ":open" : openFile,
    ":setRemote" : setRemote,
    ":new" : newWindow,
    ":saveLocal" : saveLocal,
    ":save" : saveRemote
}

function parseSpecialCommand(command, term) {
    var commands = Object.keys(dispatcher);
    for (i = 0; i< commands.length; i++) {
      var c = commands[i];
      if (startsWith(command,c )) {
          dispatcher[c](command.substr(c.length).trim(), term);
      }
    }
}

function saveLocal(command, term) {
  var str = editor.getValue();
  fs.writeFile(theFileEntry, editor.getValue(), function (err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

    greenText("File saved", term);
    info.setLocalChanged(false);
  });
}

function saveRemoteWithFollowup(command, term, follow) {
  var str = editor.getValue();
  rapture.Script.doesScriptExist(scriptUri, function(err, data) {
      if (data) {
        rapture.Script.getScript(scriptUri, function(err, data) {
            console.log(JSON.stringify(data));
            data.script = str;
            rapture.Script.putScript(scriptUri, data, function(err, d) {
                greenText("Script updated remotely", term);
                info.setRemoteChanged(false);
                if (follow != null) {
                  follow(command, term);
                }
            });
        });
      } else {
        rapture.Script.createScript(scriptUri, "REFLEX", "PROGRAM", str, function(err, d) {
            if (err) {
              term.error(err);
            } else {
              greenText("Script created remotely", term);
              info.setRemoteChanged(false);
              if (follow != null) {
                follow(command, term);
              }
          }
        });
      }
  });
}

function saveRemote(command, term) {
  saveRemoteWithFollowup(command, term, null);
}

function newWindow(command, term) {
  window.open('file://' + __dirname + '/index.html');
}

function setRemote(command, term) {
    scriptUri = command;
    info.setRemoteFile(command);
    info.setRemoteChanged(true);
}

function yellowText(str, term) {
  term.echo("[[b;yellow;]" + str + "]");
}

function greenText(str, term) {
  term.echo("[[b;green;]" + str + "]");
}

function startsWith(str, what) {
  return str.indexOf(what) == 0;
}

function connectRapture(command, term) {
    greenText("Connecting to Rapture", term);
    rapture.login('rapture','rapture', function(err, data) {
      if (err) {
        term.error(err);
      } else {
       yellowText("Connected", term);
       connectedToRapture = true;
       document.title = "CONNECTED";
       info.setRaptureEnv("localhost");
     }
    });
}

function loadScript(command, term) {
    if (!connectedToRapture) {
      term.error("Not connected. Please :connect first!");
    } else {
      scriptUri = command.trim();
      rapture.Script.getScript(scriptUri, function(err, data) {
        if (err) {
          term.error(err);
        } else {
        editor.setValue(data.script);
        yellowText("Loaded script " + scriptUri, term);
        info.setRemoteFile(scriptUri);
      }
      });
    }
}

function reallyRun(command, term) {
  // Maybe save script auto first
  var params = {};
  rapture.Script.runScriptExtended(scriptUri, params, function(err, data) {
      // output is the output
      if (err) {
        term.error(err);
      } else {
      for(var i=0; i< data.output.length; i++) {
        yellowText(data.output[i], term);
      }
      greenText("Return value is " + data.returnValue, term);
    }
  });
}

function runScript(command, term) {
  if (!connectedToRapture) {
    term.error("Not connected. Please :connect first!");
  } else {
    if (info.isRemoteChanged()) {
        saveRemoteWithFollowup(command, term, reallyRun);
    } else {
      reallyRun(command, term);
    }
  }
}

function openFile(command, term) {
  dialog.showOpenDialog({properties: ['openFile']}, function(filename) {
      onChosenFileToOpen(filename.toString()); });
}

var onChosenFileToOpen = function(theFileEntry) {
  console.log(theFileEntry);
  info.setLocalFile(theFileEntry.toString());
  readFileIntoEditor(theFileEntry);
};

function readFileIntoEditor(theFileE) {
  fs.readFile(theFileE.toString(), function (err, data) {
    if (err) {
      console.log("Read failed: " + err);
    }
    theFileEntry = theFileE;
    editor.setValue(String(data));
    info.setLocalChanged(false);
    info.setRemoteChanged(false);
    info.setRemoteFile("");
  });
}
