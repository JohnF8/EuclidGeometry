var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var initialSegments;
var halfway = 600;
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
	namedPoints = [new NamedPoint("A", 500, 300), new NamedPoint("B", 700, 300)];
	lines = [new Segment(500, 300, 700, 300)];
	initialSegments = [new Segment(500, 300, 700, 300)];
	levelNumber = 6;
}

function checkForCompletion(){
	var currentSegments = getSegments();
	if(currentSegments.length > 1){
		for (var i = currentSegments.length - 1; i >= 0; i--) {
			if(!currentSegments[i].equals(initialSegments[0])){
				if(Math.abs(currentSegments[i].x1 - halfway) < pointRadius && Math.abs(currentSegments[i].x2 - halfway) < pointRadius){
					nextLevelButtonHidden = false;
				}
			}
		}
	}
}
