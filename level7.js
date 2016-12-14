var points = [new Point(500, 400), new Point(750, 400)];
var lines = [new Segment(500, 400, 750, 400)];
var circles = new Array();
var levelNumber = 0;
var lastMouseDown;
var nextLevelButtonHidden = true;
var secondClick = false;
var pointRadius = 5;
var canvas = document.getElementById("mainContent");
var ctx = canvas.getContext("2d");
var toolbarState = document.getElementById("toolbar").getAttribute("state");
var nextLevelButton = document.getElementById("nextLevelButton");
updateButton();
updateCanvas();
console.log("source is " + document.getElementById("level").src);
testLineOtherPoint();
testHas3Connecting();

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
	updateButton();
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
	if(lines.length >= 3 && circles.length > 0){
		var targetLength = calculateDistance(lines[0].x1, lines[0].y1, lines[0].x2, lines[0].y2);
		var linesOfProperLength = [lines[0]];
		for (var i = lines.length - 1; i >= 1; i--) {
			if(Math.abs(calculateDistance(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2) - targetLength) < Math.sqrt(50)){
				linesOfProperLength.push(lines[i]);
			}
		}
		if(has3Connecting(linesOfProperLength)){
			return true;
		}
	}
	return false;
}

function has3Connecting(linesOfSameLength){
	var line1 = linesOfSameLength[0];
	var line2;
	var line3;
	var point1 = new Point(linesOfSameLength[0].x1, linesOfSameLength[0].y1);
	var point2 = new Point(linesOfSameLength[0].x2, linesOfSameLength[0].y2);
	var point3;
	for (var i = linesOfSameLength.length - 1; i >= 1; i--) {
		var otherPoint = lineOtherPoint(linesOfSameLength[i], point1);
		if(otherPoint == null){
			otherPoint = lineOtherPoint(linesOfSameLength[i], point2);
			if(otherPoint == null){
				continue;
			}
		}
		point3 = otherPoint;
		var line2 = linesOfSameLength[i];
		break;
	}
	if((lineFoundWithinError(point1.x, point1.y, point3.x, point3.y) || lineFoundInverted(point1.x, point1.y, point3.x, point3.y))&& (lineFoundWithinError(point2.x, point2.y, point3.x, point3.y) || lineFoundInverted(point2.x, point2.y, point3.x, point3.y))){
		return true;		
	}
	return false;
}

function lineOtherPoint(line, point){
	if(line.x1 == point.x && line.y1 == point.y){
		return new Point(line.x2, line.y2);
	}else if(line.x2 == point.x && line.y2 == point.y){
		return new Point(line.x1, line.y1);
	}else{
		return null;
	}
}

function testLineOtherPoint(){
	console.log("\n test lineOtherPoint")
	var point = new Point(1, 1);
	var line = new Segment(1, 1, 2, 2);
	console.log("case where otherPoint is the second point: " + new Point(2, 2) == lineOtherPoint(line, point));
	line = new Segment(2, 2, 1, 1);
	console.log("case where otherPoint is the first point: " + new Point(2, 2) == lineOtherPoint(line, point));
	line = new Segment(2, 2, 2, 3);
	console.log("case where the point isn't even in the segment: " + linteOtherPoint(line, point) == null);
}

function testHas3Connecting(){
	console.log("\n test has3Connecting");
	lines = [new Segment(500, 400, 750, 400), new Segment(750, 400, 625, 683), new Segment(625, 683, 500, 400)];
	var linesOfSameLength = [new Segment(500, 400, 750, 400), new Segment(750, 400, 625, 683), new Segment(625, 683, 500, 400)];
	console.log("test has3Connecting with known connecting lines result: " + has3Connecting(linesOfSameLength));
	linesOfSameLength = [new Segment(500, 400, 750, 400), new Segment(200, 200, 350, 200), new Segment(800, 800, 900, 900)];
	console.log("test has3Connecting with lines that don't connect result: " + has3Connecting(linesOfSameLength));
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
	this.yCenter = yCenter
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

nextLevelButton.onclick = function(event){
	var nextLevelNumber = levelNumber + 1;
	console.log("Moving to level" + nextLevelNumber + ".js");
	document.getElementById("level").src = "level" + nextLevelNumber + ".js";
}


function calculateDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}