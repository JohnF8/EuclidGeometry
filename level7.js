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
testLineEquals();

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
	if(lines.length >= 3){
		var lineLengths = new Array();
		for (var i = lines.length - 1; i >= 0; i--) {
			lineLengths[i] = calculateDistance(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
		}
		var commonLength = threeLinesSameLength(lineLengths);
		if(commonLength != -1){
			var triangleSides = findLinesOfCommonLength(commonLength);
			if(linesFormEquilateralTriangle(triangleSides)){
				nextLevelButtonHidden = false;
			}
		}
	}
}

function threeSidesSameLength(lengths){

}

function findLinesOfCommonLength(commonLength){
	var result = new Array();
	for (var i = lines.length - 1; i >= 0; i--) {
		if(lines[i].length - commonLength < 10){
			result.push(lines[i]);
		}
	}
	if(result.length < 3){
		return null;
	}else{
		return result;
	}
}

function linesFormEquilateralTriangle(triangleSides){
	//compare the points, only surefire way to know if they concide
}

function testFindLinesOfCommonLength(){
	console.log("test findLinesOfCommonLength");
	var lengths = [1, 1, 3, 5];
	lines = [new Segment(1, 1, 2, 1), new Segment(2, 2, 2, 3), new Segment(4, 4, 7, 4), new Segment(5, 5, 10, 5)];
	var expected = [new Segment(1, 1, 2, 1), new Segment(2, 2, 2, 3)];
	var result = findLinesOfCommonLength();
	console.log("first two lines common case: " + expcectedFound(expected, result));
	

	lines = new Array();
}

function testExpectedFound(){
	console.log("\n test expectedFound and Segment.equals")
	var expected = [new Segment(1, 1, 2, 1), new Segment(2, 2, 3, 2)];
	var result = [new Segment(1, 1, 2, 1), new Segment(2, 2, 3, 2)];
	console.log("with two of the same array (expected true): " + expectedFound(expected, result));
	result = [new Segment(3, 3, 4, 3), new Segment(4, 4, 5, 4)];
	console.log("with array of length two and completely non-matching results (expected false): " + expectedFound(expected, result));
	result = [new Segment(1, 1, 2, 1), new Segment(3, 3, 4, 3)];
	console.log("with arrays of same lengths and second element mismatch (expected false): " + expectedFound(expected, result));
	result = [new Segment(3, 3, 4, 3), new Segment(2, 2, 3, 2)];
	console.log("with arrays of same lengths and first element mismatch (expected false): " + expectedFound(expected, result));
}

function expectedFound(expected, result){
	for (var i = result.length - 1; i >= 0; i--) {
		try{
			if(!result[i].equals(expected[i])){
				return false;
			}
		}catch (error){			//will probably happen because expected is shorter than result
			return false;
		}
	}
	return true;
}

function testThreeSidesSameLength(){

}

function testLinesFormEquilateralTriangle(){

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
	this.length = calculateDistance(x1, y1, x2, y2);
	this.equals = function(other){
		if(this.x1 === other.x1){
			if(this.x2 === other.x2){
				if(this.y1 === other.y1){
					if(this.y2 === other.y2){
						return true;
					}
				}
			}
		}else if(this.x1 === other.x2){
			if(this.x2 === other.x1){
				if(this.y1 === other.y2){
					if(this.y2 === other.y1){
						return true;
					}
				}
			}
		}
		return false;
	}
}

function testLineEquals(){
	console.log("\n test line.equals")
	var line = new Segment(1, 1, 2, 1);
	var other = new Segment(1, 1, 2, 1);
	var result = line.equals(other);
	console.log("test with lines that all points agree: (expected true) " + result);
	other = new Segment(2, 1, 1, 1);
	result = line.equals(other);
	console.log("test with an inverted line: (expected true) " + result);
	other = new Segment(3, 3, 2, 1);
	result = line.equals(other);
	console.log("test with a line that has the second point matching: (expected false) " + result);
	other = new Segment(2, 1, 3, 3);
	result = line.equals(other);
	console.log("test with a line that has one point matching inverted: (expected false) " + result);
	other = new Segment(5, 5, 6, 5);
	result = line.equals(other);
	console.log("test with a line that completely doesn't match (expected false) " + result);
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