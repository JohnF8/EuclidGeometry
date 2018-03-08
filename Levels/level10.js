var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var pointRadius = 5;
var goalPoint;
var canvas = document.getElementById("mainContent");
var ctx = canvas.getContext("2d");
var toolbarState = document.getElementById("toolbar").getAttribute("state");
var nextLevelButton = document.getElementById("nextLevelButton");
updateButton();
fillLevelData();
addInNamedPoints();
updateCanvas();

console.log("source is " + document.getElementById("level").src);

function fillLevelData(){
	namedPoints = [new NamedPoint("A", 400, 200), new NamedPoint("B", 600, 200), new NamedPoint("C", 500, 372)];
	goalPoint = new Point((400 + 600 + 500)/3, (200 + 200 + 372)/3);
}

function checkForCompletion(){
	var currentPoints = getPoints();
	if(currentPoints.length > 3){
		for (var i = currentPoints.length - 1; i >= 0; i--) {
			if(currentPoints[i].equals(goalPoint)){
				nextLevelButtonHidden = false;
			}
		}
	}
}