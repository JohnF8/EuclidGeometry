var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var initialPoints;
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
	namedPoints = [new NamedPoint("A", 300, 200), new NamedPoint("B", 500, 200)];
	initialPoints = [new Point(300, 200), new Point(500, 200)];
	lines = [new Segment(300, 200, 500, 200)];
	levelNumber = 5;
}

function checkForCompletion(){
	var currentPoints = getPoints();
	if(currentPoints.length > 2){
		for (var i = currentPoints.length - 1; i >= 0; i--) {
			if(notInInitial(currentPoints[i])){
				if(currentPoints[i].equals(new Point(400, 200))){
					nextLevelButtonHidden = false;
				}
			}
		}
	}
}

function notInInitial(point){
	for (var i = initialPoints.length - 1; i >= 0; i--) {
		if(point.equals(initialPoints[i])){
			return false;
		}
	}
	return true;
}
