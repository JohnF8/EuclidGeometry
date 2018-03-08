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

function fillLevelData()
{
	namedPoints = [new NamedPoint("A", 300, 100), new NamedPoint("B", 700, 100), new NamedPoint("C", 300, 200)];
	lines = [new Segment(300, 100, 700, 100)];
	//console.log("slope of line: " + calculateSlope(lines[0]));
}

function checkForCompletion()
{
	var currentSegments = getSegments();
	if(currentSegments.length > 1)
	{
		for (var i = 1; i < currentSegments.length; i++)
		{
			if(calculateSlope(currentSegments[i]) == 0)
			{
				nextLevelButtonHidden = false;
			}
		}
	}
}
