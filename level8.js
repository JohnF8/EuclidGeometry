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
updateCanvas();
console.log("source is " + document.getElementById("level").src);

function fillLevelData(){
	points = [new Point(500, 400), new Point(750, 400)];
	lines = [new Segment(500, 400, 750, 400)];
	levelNumber = 8;
}

function checkForCompletion(){
	if(lines.length >= 3){
		var firstPoint = points[0];
		var secondPoint = points[1];
		var otherSegments = findSegmentsWithOneOf(firstPoint, secondPoint);
		var possibleThirdPoint = intersectingTrianglesOnPointsOtherThan(otherSegments, firstPoint, secondPoint);
		if(possibleThirdPoint != null && Math.abs(calculateDistance(possibleThirdPoint.x, possibleThirdPoint.y, firstPoint.x, firstPoint.y) - lines[0].length) > pointRadius && Math.abs(possibleThirdPoint.x - 625) > pointTolerance){
			nextLevelButtonHidden = false;
		}
	}
}

function intersectingTrianglesOnPointsOtherThan(segments, point1, point2){
	var point3;
	for (var i = segments.length - 1; i >= 0; i--) {
		if(segments[i].contains(point1) && !segments[i].contains(point2)){
			point3 = segments[i].getOtherPoint(point1);
		}else if(segments[i].contains(point2) && !segments[i].contains(point1)){
			point3 = segments[i].getOtherPoint(point2);
		}else{
			console.log("there's a problem with findSegmentsWithOneOf()");
		}
		//find the matching point with the other segment
		for (var j = segments.length - 1; j >= 0; j--) {
			if(j != i){ //ensures that the same segment is not found
				var compare;
				if(segments[j].contains(point1) && !segments[j].contains(point2)){
					compare = segments[j].getOtherPoint(point1);
				}else if(segments[j].contains(point2) && !segments[j].contains(point1)){
					compare = segments[j].getOtherPoint(point2);//make a .getOtherPoint in segment
				}else{
					console.log("there's a problem with findSegmentsWithOneOf()");
				}
				if(compare.equals(point3)){//make a .equals for point
					break;
				}
				if(j == 0){
					return null;
				}
			}
		}
	}
	return point3;
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

function findSegmentsWithOneOf(p1, p2){
	var result = new Array();
	for (var i = lines.length - 1; i >= 0; i--) {
		if(lines[i].contains(p1) && !lines[i].contains(p2)){
			result.push(lines[i]);
		}else if(lines[i].contains(p2) && !lines[i].contains(p1)){
			result.push(lines[i]);
		}
	}
	return result;
}