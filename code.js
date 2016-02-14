var controlPoints = [];
function factorial(num) {
	if(num == 0 || num == 1) {
		return 1;
	}
	return num * factorial(num-1);
}
function getBinomialCoefficient(power, term) {
	if(term > Math.floor(power/2)) {
		term = power - term;
	}
	return factorial(power) / (factorial(power-term) * factorial(term));
}
function plotControlPoints() {
	var ctx = document.getElementById("canvas").getContext("2d");
	for(var i = 0; i < controlPoints.length; i++) {
		ctx.beginPath();
		ctx.arc(controlPoints[i].x, controlPoints[i].y, 4, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
function plotBezierCurve() {
	var ctx = document.getElementById("canvas").getContext("2d");
	var power = controlPoints.length - 1;
	for(var par = 0; par <= 1; par += 0.01) {
		var curX = 0;
		var curY = 0;
		for(var i = 0; i <= power; i++) {
			curX += controlPoints[i].x * getBinomialCoefficient(power, i) * Math.pow(par, i) * Math.pow((1 - par), power-i);
			curY += controlPoints[i].y * getBinomialCoefficient(power, i) * Math.pow(par, i) * Math.pow((1 - par), power-i);
		}
		if(par == 0) {
			ctx.moveTo(curX, curY);
		} else {
			ctx.lineTo(curX, curY);
		}
	}
	ctx.stroke();
}
function canvasRefresh() {
	var ctx = document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0,0,500,500);
	plotControlPoints();
	plotBezierCurve();
}
function canvasMouseDown(event) {
	controlPoints.push({x: event.clientX, y: event.clientY});
	canvasRefresh();
}
function drawObjectTraversing(par) {
	var ctx = document.getElementById("canvas").getContext("2d");
	var power = controlPoints.length - 1;
	var curX = 0;
	var curY = 0;
	for(var i = 0; i <= power; i++) {
		curX += controlPoints[i].x * getBinomialCoefficient(power, i) * Math.pow(par, i) * Math.pow((1 - par), power-i);
		curY += controlPoints[i].y * getBinomialCoefficient(power, i) * Math.pow(par, i) * Math.pow((1 - par), power-i);
	}
	ctx.beginPath()
	ctx.arc(curX, curY, 7, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
}
function buttonConstSpeed() {
	dummy(0, true);
}
function buttonConst_dPar() {
	dummy(0, false);
}
function dummy(par, flag) {
	canvasRefresh();
	if(par <= 1) {
		drawObjectTraversing(par);
		var val = parseFloat(document.getElementById("in").value);
		if(flag) {
			setTimeout(function() {
				dummy(par += (val/getDeltaArcLength(par)), flag);
			}, 50);
		} else {
			setTimeout(function() {
				dummy(par += val, flag);
			}, 50);
		}
	}
}
function getDeltaArcLength(par) {
	var power = controlPoints.length - 1;
	var cur_dx = 0;
	var cur_dy = 0;
	for(var i = 0; i <= power; i++) {
		if(par == 0 && i == 0) {
			cur_dx += controlPoints[i].x * getBinomialCoefficient(power, i) * (-power);
			cur_dy += controlPoints[i].y * getBinomialCoefficient(power, i) * (-power);
		} else if(par == 1 && i == power) {
			cur_dx += controlPoints[i].x * getBinomialCoefficient(power, i) * power;
			cur_dy += controlPoints[i].y * getBinomialCoefficient(power, i) * power;
		} else {
			cur_dx += controlPoints[i].x * getBinomialCoefficient(power, i) * Math.pow(par, i-1) * Math.pow((1 - par), power-i-1) * ((i * (1 - par)) - (par * (power - i)));
			cur_dy += controlPoints[i].y * getBinomialCoefficient(power, i) * Math.pow(par, i-1) * Math.pow((1 - par), power-i-1) * ((i * (1 - par)) - (par * (power - i)));
		}
	}
	return Math.sqrt((cur_dx * cur_dx) + (cur_dy * cur_dy));
}