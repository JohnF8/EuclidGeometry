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
testLinesFormEquilateralTriangle();
testGetMatchingPoint();
testGetTriangle();

canvas.onmousedown = function(event){
	var x = event.clientX - event.offsetX;
	var y = event.clientY - event.offsetY;
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
	if(lines >= 3){
		var triangleSides = getTriangle();
		if(triangleSides != null){
			return linesFormEquilateralTriangle(triangleSides);
		}
	}
	return false;
}

function linesFormEquilateralTriangle(sides){
	lines01Difference = sides[0].length - sides[1].length;
	lines12Difference = sides[1].length - sides[2].length;
	return (Math.abs(lines01Difference) < pointRadius*2) && (Math.abs(lines12Difference) < pointRadius*2);
}

function testLinesFormEquilateralTriangle(){
	console.log("\n test linesFormEquilateralTriangle");
	var sides = [new Segment(10, 10, 20, 10), new Segment(20, 10, 20, 20), new Segment(20, 20, 10, 20)];
	var result = linesFormEquilateralTriangle(sides);
	console.log("With lines that would hypothetically intersect of the same length: (expected true) " + result);
	sides = [new Segment(100, 100, 200, 100), new Segment(200, 100, 200, 200), new Segment(200, 200, 100, 500)];
	result = linesFormEquilateralTriangle(sides);
	console.log("With lines that don't form an equilateral triangle: (expected false) " + result);
}

function getTriangle(){
	var firstPoint = new Point(lines[0].x1, lines[0].y1);
	var secondPoint = new Point(lines[0].x2, lines[0].y2);
	var firstLine = lines[0];
	var secondLine, thirdLine;
	var pointFound = 0;
	for (var i = lines.length - 1; i >= 0; i--) {
		thirdPoint = getMatchingPoint(lines[i], firstPoint);
		if(thirdPoint == null){
			thirdPoint = getMatchingPoint(lines[i], secondPoint);
			if(thirdPoint == null){
				continue;
			}else{
				pointFound = 2;
			}
		}else{
			pointFound = 1;
		}
		secondLine = lines[i];
		if(pointFound == 1){
			thirdLine = lines.filter(l => l.equals(new Segment(secondPoint.x, secondPoint.y, thirdPoint.x, thirdPoint.y)));
		}else{
			thirdLine = lines.filter(l => l.equals(new Segment(firstPoint.x, firstPoint.y, thirdPoint.x, thirdPoint.y)));
		}
		if(thirdLine.length > 0){
			return [firstLine, secondLine, thirdLine[0]];
		}
	}
	return null;
}

function getMatchingPoint(line, point){
	if(point.x == line.x1 && point.x == line.y1){
		return new Point(line.x2, line.y2);
	}else if(point.x == line.x2 && point.y == line.y2){
		return new Point(line.x1, line.y1);
	}else{
		return null;
	}
}

function testGetMatchingPoint(){
	console.log("\n test getMatchingPoint");
	var line = new Segment(1, 1, 2, 1);
	var point = new Point(1, 1);
	var result = getMatchingPoint(line, point);
	console.log("with the point being the first point in the segment: (expected Point(2, 1)) => (" + result.x + ", " + result.y + ")");
	point = new Point(2, 1);
	result = getMatchingPoint(line, point);
	console.log("with the point being the second point in the segment: (expected (1, 1)) => (" + result.x + ", " + result.y + ")");
	point = new Point(3, 3);
	result = getMatchingPoint(line, point);
	try{
		console.log("with the point being not in the segment at all: (expected null: (" + result.x + ", " + result.y + ")");
	}catch(error){
		console.log("the point wasn't in the segment in the point not included in the segment test");
	}
}

function testGetTriangle(){
	console.log("\n test getTriangle");
	lines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 2, 2), new Segment(1, 1, 2, 2)];
	var expected = lines;
	var result = getTriangle();
	var print = (result != null);
	console.log("test with three segments that do form a triangle: (expected true) => " + print);
	lines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 2, 2), new Segment(2, 2, 2, 3)];
	result = getTriangle();
	print = (result == null);
	console.log("test with three segments that do not form a triangle: (expected true) => " + print);
	lines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 2, 2), new Segment(1, 1, 2, 2), new Segment (4, 4, 5, 4)];
	result = getTriangle();
	print = (result.length == 3);
	console.log("test with four segments, three of which form a triangle: (expected true): " + print);
	lines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 2, 2), new Segment(3, 3, 4, 3), new Segment(3, 3, 5, 3)];
	result = getTriangle();
	print = (result == null)
	console.log("test with four segments, with two pairs that have a common point: (expected true): " + print);
	lines = new Array();
}

// function threeSidesSameLength(checkLines){
// 	var foundNumbers = new Array();
// 	for (var i = checkLines.length - 1; i >= 0; i--) {
// 		if(notYetIncluded(foundNumbers, checkLines[i].length)){
// 			foundNumbers.push(new frequencyLink(checkLines[i].length, 1));
// 		}else{
// 			for (var i = foundNumbers.length - 1; i >= 0; i--) {
// 				if(foundNumbers[i].number == checkLines[i].length){
// 					foundNumbers[i].frequencyIncrement();
// 				}
// 			}
// 		}
// 	}
// 	var mostFrequent = new frequencyLink(0, 0);
// 	for (var i = foundNumbers.length - 1; i >= 0; i--) {
// 		if(foundNumbers[i].frequency > mostFrequent.frequency){
// 			mostFrequent = foundNumbers[i];
// 		}
// 	}
// 	if(mostFrequent.frequency > 3){
// 		return mostFrequent.length;
// 	}else{
// 		return -1;
// 	}
// }

// function testNotYetIncluded(){
// 	console.log("\n test notYetIncluded");
// 	var numbers = [1, 2, 3, 4, 5];
// 	var checkNumber = 1;
// 	var result = notYetIncluded(numbers, checkNumber);
// 	console.log("known included case: (expect true) " + result);
// 	checkNumber = 2;
// 	result = notYetIncluded(numbers, checkNumber);
// 	console.log("known included case further down the array: (expect true) " + result);
// 	checkNumber = 7;
// 	result = notYetIncluded(numbers, checkNumber);
// 	console.log("known not included case: (expect false) " + result);
// }

// function notYetIncluded(numbers, checkNumber){
// 	for (var i = numbers.length - 1; i >= 0; i--) {
// 		if(numbers[i].number == checkNumber){
// 			return false;
// 		}
// 	}
// 	return true;
// }

// function frequencyLink(number, startingFrequency){
// 	this.number = number;
// 	this.frequency = startingFrequency;
// 	this.frequencyIncrement = function(){
// 		this.frequency += 1;
// 	}
// }

// function findLinesOfCommonLength(commonLength){
// 	var result = new Array();
// 	for (var i = lines.length - 1; i >= 0; i--) {
// 		if(lines[i].length - commonLength < 10){
// 			result.push(lines[i]);
// 		}
// 	}
// 	if(result.length < 3){
// 		return null;
// 	}else{
// 		return result;
// 	}
// }

// function linesFormEquilateralTriangle(triangleSides){
// 	//compare the points, only surefire way to know if they concide
// }

// function testFindLinesOfCommonLength(){
// 	console.log("test findLinesOfCommonLength");
// 	var lengths = [1, 1, 3, 5];
// 	lines = [new Segment(1, 1, 2, 1), new Segment(2, 2, 2, 3), new Segment(4, 4, 7, 4), new Segment(5, 5, 10, 5)];
// 	var expected = [new Segment(1, 1, 2, 1), new Segment(2, 2, 2, 3)];
// 	var result = findLinesOfCommonLength();
// 	console.log("first two lines common case: " + expcectedFound(expected, result));
	

// 	lines = new Array();
// }

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

// function testThreeSidesSameLength(){
// 	console.log("\n test threeSidesSameLength");
// 	var checkLines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 1, 1), new Segment(1, 2, 1, 1)];
// 	var result = threeSidesSameLength(checkLines);
// 	console.log("with three lines of same length: (expected 1) " + result);
// 	checkLines = [new Segment(1, 1, 2, 1), new Segment(1, 1, 3, 3), new Segment(2, 1, 1, 1)];
// 	result = threeSidesSameLength(checkLines);
// 	console.log("with three lines of different lengths: (expected -1) " + result);
// 	checkLines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 1, 1), new Segment(1, 2, 1, 1), new Segment(3, 3, 5, 4)];
// 	result = threeSidesSameLength(checkLines);
// 	console.log("with four lines and one line with different length: (expected 1) " + result);
// 	checkLines = [new Segment(1, 1, 2, 1), new Segment(2, 1, 1, 1), new Segment(1, 1, 3, 3), new Segment(3, 3, 1, 1)];
// 	result = threeSidesSameLength(checkLines);
// 	console.log("with four lines and two lengths: (expected -1) " + result);
// }

// function testLinesFormEquilateralTriangle(){

// }

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
		if(Math.sqrt(Math.pow((x - points[i].x), 2) - Math.pow((y - points[i].y), 2)) < pointRadius*2) {
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