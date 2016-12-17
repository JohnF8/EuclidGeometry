var lastMouseDown;
var nextLevelButtonHidden = true;
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
	points = [new Point(500, 400), new Point(750, 400)];
	lines = [new Segment(500, 400, 750, 400)];
	point3 = new Point(625, Math.sqrt(Math.pow(250, 2) - Math.pow(125, 2)) + 400);
	point4 = new Point(625, 400 - Math.sqrt(Math.pow(250, 2) - Math.pow(125, 2)));
	levelNumber = 7;
}

function checkForCompletion(){
	if(lines.length >= 3){
		var firstPoint = points[0];
		var secondPoint = points[1];
		if(lineFoundThatHas(firstPoint, point3) && lineFoundThatHas(secondPoint, point3)){
			nextLevelButtonHidden = false;
		}else if(lineFoundThatHas(firstPoint, point4) && lineFoundThatHas(secondPoint, point4)){
			nextLevelButtonHidden = false;
		}
	}
}

function lineFoundThatHas(p1, p2){
	var soughtSegment = new Segment(p1.x, p1.y, p2.x, p2.y);
	for (var i = lines.length - 1; i >= 0; i--) {
		if(lines[i].equals(soughtSegment)){
			return true;
		}
	}
	return false;
}