//The purpose of the level is to create two circles to create a Venn Diagram of students that go to Hampton vs go to school in Pennsylvania
var points = [new Point (300, 300), new Point(350, 350)]; //A - B. A is smalller and B is the larger circle
var finalPoints = new Array();
var circles = new Array();
var finalLines = new Array();

var levelNumber = 3;
var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var pointRadius = 5;
var canvas = document.getElementById("mainContent");
var ctx = canvas.getContext("2d");
var toolbarState = document.getElementById("toolbar").getAttribute("state");
var nextLevelButton = document.getElementById("nextLevelButton");
var PI = 3.14159
updateButton();
updateCanvas();
console.log("source is " + document.getElementById("level").src);

nextLevelButton.onclick = function(event){
	$ ("#level").src = "level" + (levelNumber++) + ".js";
}

canvas.onmousedown = function(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var toolbarState = document.getElementById("toolbar").getAttribute("state");
	if(!closeToAnotherPoint(x, y)){
		points.push(new Point(x, y));
	}
	if(toolbarState == "point"){
		lastMouseDown = null;
	}
	if(toolbarState == "segment" || toolbarState == "circle"){
		if(lastMouseDown != event && lastMouseDown != null){
			if(toolbarState == "segment"){
				lines.push(new Segment(lastMouseDown.clientX - canvas.offsetLeft, lastMouseDown.clientY - canvas.offsetTop, x, y));
			}
			if(toolbarState == "circle"){
				circles.push(new Circle(lastMouseDown.clientX - canvas.offsetLeft, lastMouseDown.clientY - canvas.offsetTop, x, y));
			}
			lastMouseDown = null;
		}else{
			lastMouseDown = event;
		}
	}
	updateCanvas();
	checkForCompletion();
};

canvas.onmouseup = function(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var toolbarState = document.getElementById("toolbar").getAttribute("state");
	if(!closeToAnotherPoint(x, y)){
		points.push(new Point(x, y));
	}
	if(toolbarState == "segment" || toolbarState == "circle"){
		if(lastMouseDown != null && lastMouseDown.clientX != event.clientX && lastMouseDown.clientY != event.clientY){
			if(toolbarState == "segment"){
				lines.push(new Segment(lastMouseDown.clientX - canvas.offsetLeft, lastMouseDown.clientY - canvas.offsetTop, x, y));
			}
			if(toolbarState == "circle"){
				circles.push(new Circle(lastMouseDown.clientX - canvas.offsetLeft, lastMouseDown.clientY - canvas.offsetTop, x, y));
			}
			lastMouseDown = null;
		}
	}
	updateCanvas();
	checkForCompletion();
	updateButton();
};


function checkForCompletion(){
	var circlesFound = allCirclesFound();
	var pointsFound = allPointsFound();
	var linesFound = allLinesFound();
	if(circlesFound && pointsFound && linesFound){
		nextLevelButtonHidden = false;
	}
}


function allCirclesFound(){
	//Test to see if circle[0] is the smaller one A
	var Tester = false;
	var circleZero = getAreaCircle(0);
	var circleOne = getAreaCircle(1);
	console.log(circleZero);
	console.log(circleOne);

	if (circles[1].xCenter < 315){
		tester = true; //If true, then A is the smaller of the circles
	}

	if (Tester == true){
		if (circleOne < circleZero){
			return true;
		}
		else{
			return false;
		}
	}
		else{
			if(circleOne > circleZero){
				return true;
			}
			else{
				return false;
			}
	}
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

function allLinesFound(){
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

/*creates a point construct, contains the x and y variables*/
function Point(x, y){
	this.x = x;
	this.y = y;
}

/*creates a segment out of two points, stores an x1, y1, x2, and a y2*/
function Segment(x1, y1, x2, y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}

/*represents a circle defined by a center point and a radius defined with another point. Both points are in the constructor for simplicity*/
function Circle(xCenter, yCenter, xOther, yOther){
	this.radius = Math.sqrt(Math.pow((xCenter - xOther), 2) + Math.pow((yCenter - yOther),2));
	this.xCenter = xCenter;
	this.yCenter = yCenter;
}


/*calculates the slope of a line segment*/
function calculateSlope(segment){
	var slope = (segment.b.y - segment.a.y)/(segment.b.x - segment.a.x);
	return slope;
}

/*draws the points designated in the array points*/
function drawPoints(context){
	console.log("drwaing points");
	for (i = 0; i < points.length; i++){
		context.beginPath();
		var x = points[i].x;
		var y = points[i].y;
		console.log("drawing point at x: " + x + " y: " + y);
		context.fillStyle = "#0000ff";
		context.arc(x, y, pointRadius, 0, 2*Math.PI);
		context.fill();
		context.stroke();
	}
}

/*draws the lines stored in the lines array*/
function drawLines(context){
	console.log("drawing lines");
	for(i = 0; i < lines.length; i++){
		context.beginPath();
		context.moveTo(lines[i].x1, lines[i].y1);
		context.lineTo(lines[i].x2, lines[i].y2);
		context.stroke();
	}
}

/* draws all the circles stored in the circles array*/
function drawCircle(context){
	console.log("drawing circles");
	for(i = 0; i < circles.length; i++){
		context.beginPath();
		var x = circles[i].xCenter;
		var y = circles[i].yCenter;
		var radius = circles[i].radius;
		console.log("drawing a circle at (" + x + ", " + y + ") with radius" + radius);
		context.arc(x, y, radius, 0, 2*Math.PI);
		context.stroke();
	}
}

/*At some point, some error needs to be introduced, probably a 5px because that's the radius of the point*/
function closeToAnotherPoint(x, y){
	var close = false;
	for (var i = points.length - 1; i >= 0; i--) {
		if(Math.sqrt(Math.pow((x - points[i].x), 2) - Math.pow((y - points[i].y), 2)) < pointRadius) {
			close = true;
		}
	}
	return close;
}

function updateCanvas(){
	var canvas = document.getElementById("mainContent");
	var context = canvas.getContext("2d");
	drawPoints(context);
	drawLines(context);
	drawCircle(context);
}

function getAreaCircle(x){
	var radiusCircle = circles[x].radius;

	var area = 2 * PI * radiusCircle;

	return area;

}
