//////////////////////////
// Common Level Base File
//////////////////////////

// data structures, filled uniquely for each level file
var points = new Array();
var lines = new Array();
var circles = new Array();
var canvas = document.getElementById("mainContent");
var nextLevelButton = document.getElementById("nextLevelButton");
var pointRadius = 5;
var pointTolerance = pointRadius * 2;
var selectedPointIndex = -1;
var nextLevelButtonHidden = true;

nextLevelButton.onclick = function(event){
	$ ("#level").src = "level" + (levelNumber++) + ".js";
}

canvas.onmousemove = function(event){
	var toolbarState = document.getElementById("toolbar").getAttribute("state");
	if(selectedPointIndex > -1){
		if(toolbarState == "segment"){
			drawLine(canvas.getContext("2d"), new Segment(points[selectedPointIndex].x, points[selectedPointIndex].y, event.offsetX, event.offsetY));
		}else if(toolbarState == "circle"){
			drawCircle(canvas.getContext("2d"), new Circle(points[selectedPointIndex].x, points[selectedPointIndex].y, event.offsetX, event.offsetY));
		}
	}
}

function drawCircle(context, circle){
	//gets rid of the last thing drawn because of the drag
	context.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas
	updateCanvas(); //brings back all of the original points and values

	context.beginPath();
	context.arc(circle.xCenter, circle.yCenter, circle.radius, 0, Math.PI* 2);
	context.stroke();
}

function drawLine(context, segment){
	//gets rid of the last thing drawn because of the drag
	context.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas
	updateCanvas(); //brings back all of the original points and values

	context.beginPath();
	context.moveTo(segment.x1, segment.y1);
	context.lineTo(segment.x2, segment.y2);
	context.stroke();
}

canvas.onmousedown = function(event)
{
	var x = event.offsetX;
	var y = event.offsetY;
	var toolbarState = document.getElementById("toolbar").getAttribute("state");

	var previouseSelectedPointIndex = selectedPointIndex;
	selectedPointIndex = closeToAnotherPoint(x, y);
	
	if(selectedPointIndex == -1)
	{
		var point = new Point(x, y);
		points.push(point);
		selectedPointIndex = points.length-1;
		console.log("new point x:" + x + " y: " + y + "selectedPointIndex: " + selectedPointIndex );
	}
	if(toolbarState == "point")
	{
		lastMouseDown = null;
		selectedPointIndex = -1;
	}
	if(toolbarState == "segment" || toolbarState == "circle")
	{
		if(previouseSelectedPointIndex != -1)
		{
			var point1 = points[previouseSelectedPointIndex];
			var point2 = points[selectedPointIndex];
	
			if(toolbarState == "segment")
			{
				lines.push(new Segment(point1.x, point1.y, point2.x,point2.y));
			}
			if(toolbarState == "circle")
			{
				circles.push(new Circle(point1.x, point1.y, point2.x,point2.y));
			}
			selectedPointIndex = -1;
		}
	}

	updateCanvas();
	checkForCompletion();
	updateButton();
};


canvas.onmouseup = function(event)
{
	canvas.onmousedown(event);
};

/*creates a point construct, contains the x and y variables*/
function Point(x, y){
	this.x = x;
	this.y = y;
	this.equals = function(other){
		if(calculateDistance(this.x, this.y, other.x, other.y) > pointTolerance){
			return false;
		}
		return true;
	}
}

/*creates a segment out of two points, stores an x1, y1, x2, and a y2*/
function Segment(x1, y1, x2, y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.length = calculateDistance(x1, y1, x2, y2);
	this.contains = function(point){
		if(Math.abs(this.x1 - point.x) < pointRadius*2 && Math.abs(this.y1 - point.y) < pointRadius*2){
			return true;
		}else if(Math.abs(this.x2 - point.x) < pointRadius*2 && Math.abs(this.y2 - point.y) < pointRadius*2){
			return true;
		}else{
			return false;
		}
	}
	this.equals = function(other){
		if(Math.abs(this.x1 - other.x1) < pointRadius*2){
			if(Math.abs(this.x2 - other.x2) < pointRadius*2){
				if(Math.abs(this.y1 - other.y1) < pointRadius*2){
					if(Math.abs(this.y2 - other.y2) < pointRadius*2){
						return true;
					}
				}
			}
		}else if(Math.abs(this.x1 - other.x2) < pointRadius*2){
			if(Math.abs(this.x2 - other.x1) < pointRadius*2){
				if(Math.abs(this.y1 - other.y2) < pointRadius*2){
					if(Math.abs(this.y2 - other.y1) < pointRadius*2){
						return true;
					}
				}
			}
		}
		return false;
	}
	this.getOtherPoint = function(point){
		if(calculateDistance(this.x1, this.y1, point.x, point.y) < pointTolerance){
			return new Point(this.x2, this.y2);
		}else if(calculateDistance(this.x2, this.y2, point.x, point.y) < pointTolerance){
			return new Point(this.x1, this.y1);
		}
		return null;
	}
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

/*At some point, some error needs to be introduced, probably a 5px because that's the radius of the point*/
function closeToAnotherPoint(x, y){
	for (var i = points.length - 1; i >= 0; i--) {
		var distance = Math.sqrt(Math.pow((x - points[i].x), 2) + Math.pow((y - points[i].y), 2));
		console.log("evalute point x:" +points[i].x + " y: " +points[i].y + " distance:" + distance + "index: " + i );
		if(distance <= pointTolerance) {
		   console.log("found close point x:" +points[i].x + " y: " +points[i].y + "index: " + i );
		   return i;
		}
	}
	return -1;
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
function drawCircles(context){
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



function updateCanvas(){
	var canvas = document.getElementById("mainContent");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawLines(context);
	drawCircles(context);
	drawPoints(context);
}

function updateButton(){
	if(!nextLevelButtonHidden){
		$ ("#nextLevelButton").show();
	}else{
		$ ("#nextLevelButton").hide();
	}
}

function calculateDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}