var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var pointRadius = 5;
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
	namedPoints = [new NamedPoint("A", 300, 100), new NamedPoint("B", 700, 100), new NamedPoint("C", 500, 346)];
}

function checkForCompletion(){
	var currentPoints = getPoints();
	if(currentPoints.length > 3){
		for (var i = currentPoints.length - 1; i >= 0; i--) {
			var distance1 = calculateDistance(namedPoints[0].getPoint.x, namedPoints[0].getPoint.y, currentPoints[i].x, currentPoints[i].y);
			var distance2 = calculateDistance(namedPoints[1].getPoint.x, namedPoints[1].getPoint.y, currentPoints[i].x, currentPoints[i].y);
			var distance3 = calculateDistance(namedPoints[2].getPoint.x, namedPoints[2].getPoint.y, currentPoints[i].x, currentPoints[i].y);
			if(Math.abs(distance1 - distance2) < pointTolerance && Math.abs(distance2 - distance3) < pointTolerance && Math.abs(distance3 - distance1) < pointTolerance){
				nextLevelButtonHidden = false;
			}
		}
	}
}