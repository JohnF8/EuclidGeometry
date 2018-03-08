finalPoints = new Array();
finalCircles = [new Circle(600,200,400,400), new Circle(600,600,400,400)];
finalLines = [new Segment(400,400, 800, 400)];
var levelNumber = 9;
/////////////////////////////////////////////////////////
// To Common
updateButton();
fillLevelData();
addInNamedPoints();
updateCanvas();

console.log("source is " + document.getElementById("level").src);


function fillLevelData()
{
	levelNumber = 9;
	lines = [new Segment(400,400,600,200), new Segment(400,400,600,600)];
	points = [new Point(400,400)];
	namedPoints = [new NamedPoint("A", 600, 200), new NamedPoint("B", 400, 400), new NamedPoint("C", 600, 600)]
	finalPoints = new Array();
	finalCircles = [new Circle(600,200,400,400), new Circle(600,600,400,400)];
	finalLines = [new Segment(400,400, 800, 400)];
}

function testLineFoundWithinError(){
	lines = [new Segment(100, 100, 50, 200)];
	var lineFound = lineFoundWithinError(finalLines[0]);
	console.log("lineFoundWithinError test with known included line result: " + lineFound);
	lines = [new Segment(95, 100, 45, 200)];
	lineFound = lineFoundWithinError(finalLines[0]);
	console.log("lineFoundWithinError test with line with 5px error on the x axis result: " + lineFound);
	lines = [new Segment(100, 95, 50, 195)];
	lineFound = lineFoundWithinError(finalLines[0]);
	console.log("lineFoundWithinError test with line with 5px error on the y axis result: " + lineFound);
	lines = [new Segment(1, 1, 50, 200)];
	lineFound = lineFoundWithinError(finalLines[0]);
	console.log("lineFoundWithinError test with line known to not be included result: " + lineFound);
	lines = new Array();
}

function testLineFoundInverted(){
	lines = [new Segment(50, 200, 100, 100)];
	var lineFound = lineFoundInverted(finalLines[0]);
	console.log("lineFoundInverted test with known inverted line result: " + lineFound);
	lines = [new Segment(50, 200, 1, 1)];
	lineFound = lineFoundInverted(finalLines[0]);
	console.log("lineFoundInverted test with known non-member line result: " + lineFound);
	lines = new Array();
}

function testCalculateDistance(){
	var distance = calculateDistance(1, 1, 2, 1);
	console.log("distance from (1,1) to (2, 1): " + distance);
	distance = calculateDistance(1, 1, 1, 2);
	console.log("distance from (1, 1) to (1, 2): " + distance);
	distance = calculateDistance(0, 0, 3, 4);
	console.log("distance from (0, 0) to (3, 4): " + distance);
}

function checkForCompletion(){
	var circlesFound = allCirclesFound();
	var pointsFound = allPointsFound();
	var linesFound = allLinesFound();
	console.log(circlesFound);
	console.log(pointsFound);
	console.log(linesFound);

	if(circlesFound && pointsFound && linesFound){
		nextLevelButtonHidden = false;
	}
}

function allCirclesFound(){
	var booleans = new Array(finalCircles.length);
	for (var i = booleans.length - 1; i >= 0; i--) {
		booleans[i] = false;
	}
	for (var i = finalCircles.length - 1; i >= 0; i--) {
		if(mainContainsCircle(finalCircles[i])){
			booleans[i] = true;
		}
	}
	for (var i = booleans.length - 1; i >= 0; i--) {
		if(!booleans[i]){
			return false;
		}
	}
	return true;
}

function allPointsFound(){
	var booleans = new Array(finalPoints.length);
	for (var i = booleans.length - 1; i >= 0; i--) {
		booleans[i] = false;
	}
	for (var i = finalPoints.length - 1; i >= 0; i--) {
		if(mainContainsPoint(finalPoints[i])){
			booleans[i] = true;
		}
	}
	for (var i = booleans.length - 1; i >= 0; i--) {
		if(!booleans[i]){
			return false;
		}
	}
	return true;
}

function mainContainsPoint(keyPoint){
	for (var i = points.length - 1; i >= 0; i--) {
		if(calculateDistance(keyPoint.x, keyPoint.y, points[i].x, points[i].y) < pointRadius){
			return true;
		}
	}
	return false;
}

function mainContainsCircle(keyCircle){
	for (var i = circles.length - 1; i >= 0; i--) {
		if(calculateDistance(keyCircle.xCenter, keyCircle.yCenter, circles[i].xCenter, circles[i].yCenter) < pointRadius){
			if(Math.abs(keyCircle.radius - circles[i].radius) < pointRadius*2){
				return true;
			}
		}
	}
	return false;
}

function allLinesFound(){
	if(lines.length >= finalLines.length){
		var linesFoundBoolean = new Array(finalLines.length);
		for (var i = finalLines.length - 1; i >= 0; i--) {
			var lineFoundNormally = lineFoundWithinError(finalLines[i]);
			var lineFoundOther = lineFoundInverted(finalLines[i]);
			if(!lineFoundNormally && !lineFoundOther){
				return false;
			}
		}
		return true;
	}
	return false;
}

function lineFoundWithinError(objectiveLine){
	var objectiveX1 = objectiveLine.x1;
	var objectiveX2 = objectiveLine.x2;
	var objectiveY1 = objectiveLine.y1;
	var objectiveY2 = objectiveLine.y2;
	for (var i = lines.length - 1; i >= 0; i--) {
		var x1, x2, y1, y2;
		x1 = lines[i].x1;
		x2 = lines[i].x2;
		y1 = lines[i].y1;
		y2 = lines[i].y2;
		point1DistanceOff = calculateDistance(objectiveX1, objectiveY1, x1, y1);
		point2DistanceOff = calculateDistance(objectiveX2, objectiveY2, x2, y2);
		if(point1DistanceOff <= pointRadius && point2DistanceOff <= pointRadius){
			console.log("Compatible line found for (" + objectiveX1 + ", " + objectiveX2 + ") to (" + objectiveX2 + ", " + objectiveY2 + ")");
			return true;
		}
	}
	return false;
}

function lineFoundInverted(objectiveLine){
	var newObjective = new Segment(objectiveLine.x2, objectiveLine.y2, objectiveLine.x1, objectiveLine.y1);
	return lineFoundWithinError(newObjective);
}

function calculateDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function updateButton(){
	if(!nextLevelButtonHidden){
		$ ("#nextLevelButton").show();
	}else{
		$ ("#nextLevelButton").hide();
	}
}
