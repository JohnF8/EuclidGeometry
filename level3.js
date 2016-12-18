//The purpose of the level is to create two circles to create a Venn Diagram of students that go to Hampton vs go to school in Pennsylvania
// var points = [new Point (300, 300), new Point(350, 350)]; //A - B. A is smalller and B is the larger circle
// var finalPoints = new Array();
// var circles = new Array();
// var finalLines = new Array();

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
	points = [new Point(300, 300), new Point(350, 350)];
	levelNumber = 3;
}

function checkForCompletion(){
	var circles = getCircles();
	var a, b;
	if(circles.length >= 2){
		for (var i = circles.length - 1; i >= 0; i--) {
			if(circles[i].getCenter().equals(new Point(300, 300))){	//to be replaced with the named equivalent, when implemented
				a = circles[i];
			}
			if(circles[i].getCenter().equals(new Point(350, 350))){	//to be replaced with the named equivalent
				b = circles[i];
			}
		}
		if(a != null && b != null){
			if(b.radius <= calculateDistance(a.xCenter, a.yCenter, b.xCenter, b.yCenter)){
				nextLevelButtonHidden = false;
			}
		}
	}
}
