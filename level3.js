//The purpose of the level is to create two circles to create a Venn Diagram of students that go to Hampton vs go to school in Pennsylvania

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
addInNamedPoints();
updateCanvas();
console.log("source is " + document.getElementById("level").src);

function fillLevelData(){
	namedPoints = [new NamedPoint("A (Hampton)", 300, 300), new NamedPoint("B (Pennsylvania)", 350, 350)];
	levelNumber = 3;
}

function checkForCompletion(){
	var circles = getCircles();
	var a, b;
	if(circles.length >= 2){
		for (var i = circles.length - 1; i >= 0; i--) {
			if(circles[i].getCenter().equals(new Point(300, 300))){
				a = circles[i];
			}
			if(circles[i].getCenter().equals(new Point(350, 350))){
				b = circles[i];
			}
		}
		if(a != null && b != null){
			if(a.radius <= calculateDistance(b.xCenter, b.yCenter, a.xCenter, a.yCenter)){
				nextLevelButtonHidden = false;
			}
		}
	}
}
