// Some simple functions to manipulate the info fields

var raptureEnv = "";
var localFile = "";
var remoteFile = "";
var localFileMod = false;
var remoteFileMod = false;

String.prototype.trunc =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(this.length - n) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? '&hellip;' + s_ : s_;
      };

module.exports.updateDisplay = function() {
  document.getElementById("infoRapture").innerHTML = raptureEnv;
  if (localFileMod) {
    document.getElementById("infoLocal").innerHTML = localFile.trunc(50) + "(*)";
  } else {
    document.getElementById("infoLocal").innerHTML = localFile.trunc(50);
  }
  if (remoteFileMod) {
    document.getElementById("infoRemote").innerHTML = remoteFile + "(*)";
  } else {
    document.getElementById("infoRemote").innerHTML = remoteFile;
  }
}

module.exports.isRemoteChanged = function() {
  return remoteFileMod;
}

module.exports.setLocalChanged = function(on) {
  localFileMod = on;
  module.exports.updateDisplay();
}

module.exports.setRemoteChanged = function(on) {
  remoteFileMod = on;
  module.exports.updateDisplay();
}

module.exports.setLocalFile = function(name) {
  localFile = name;
  localFileMod = false;
  module.exports.updateDisplay();
}

module.exports.setRemoteFile = function(name) {
  remoteFile = name;
  remoteFileMod = false;
  module.exports.updateDisplay();
}

module.exports.setRaptureEnv = function(name, connected) {
  raptureEnv = name;
  module.exports.updateDisplay();
}

module.exports.getRemote = function() {
  return remoteFile;
}
