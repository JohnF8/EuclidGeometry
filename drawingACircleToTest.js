var canvas = document.getElementById("mainContent");
var ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.arc(50, 50, 5, 0, 2*Math.PI);
ctx.stroke();