var lastMouseDown;
var nextLevelButtonHidden = false;
var secondClick = false;
var pointRadius = 5;
var canvas = document.getElementById("mainContent");
var ctx = canvas.getContext("2d");
var toolbarState = document.getElementById("toolbar").getAttribute("state");
var nextLevelButton = document.getElementById("nextLevelButton");
var point3, point4;
updateButton();
fillLevelData();
updateCanvas();
console.log("source is " + document.getElementById("level").src);

function fillLevelData(){
	levelNumber = 0;
}

function checkForCompletion(){}