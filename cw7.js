'use strict';

var Game = {
    canvas: undefined,
    canvasContext: undefined,
    circles: [],
    speed: 2,
    maxCircles: 15,
    framesSinceLastCircle: 0,
};

Game.start = function () {
    Game.canvas = document.getElementById('myCanvas');
    Game.canvasContext = Game.canvas.getContext('2d');

    Game.addCircle();
    Game.addCircle();

    Game.mainLoop();
};

document.addEventListener('DOMContentLoaded', Game.start);

Game.clearCanvas = function () {
    Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.mainLoop = function () {
    Game.clearCanvas();
    Game.update();
    Game.draw();
    window.requestAnimationFrame(Game.mainLoop);
};

Game.addCircle = function (x, y) {
    var radius = 25;
    var newCircle = {
        x: x !== undefined ? x : Math.random() * (Game.canvas.width - 2 * radius) + radius,
        y: y !== undefined ? y : Math.random() * (Game.canvas.height - 2 * radius) + radius,
        dx: Math.random() * 10 - 5,
        dy: Math.random() * 10 - 5,
        radius: radius,
    };
    Game.circles.push(newCircle);
};

Game.update = function () {
    Game.framesSinceLastCircle++;

    for (var i = 0; i < Game.circles.length; i++) {
        var circle = Game.circles[i];

        if (circle.x - circle.radius <= 0 || circle.x + circle.radius >= Game.canvas.width) {
            circle.dx = -circle.dx;
        }
        if (circle.y - circle.radius <= 0 || circle.y + circle.radius >= Game.canvas.height) {
            circle.dy = -circle.dy;
        }

        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x - circle.radius < 0) {
            circle.x = circle.radius;
        } else if (circle.x + circle.radius > Game.canvas.width) {
            circle.x = Game.canvas.width - circle.radius;
        }
        if (circle.y - circle.radius < 0) {
            circle.y = circle.radius;
        } else if (circle.y + circle.radius > Game.canvas.height) {
            circle.y = Game.canvas.height - circle.radius;
        }

        for (var j = i + 1; j < Game.circles.length; j++) {
            var otherCircle = Game.circles[j];
            if (Game.isColliding(circle, otherCircle)) {
                Game.handleCollision(circle, otherCircle);
            }
        }
    }
};

Game.isColliding = function (circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.radius + circle2.radius;
};

Game.handleCollision = function (circle1, circle2) {

    var tempDx = circle1.dx;
    var tempDy = circle1.dy;

    circle1.dx = circle2.dx;
    circle1.dy = circle2.dy;

    circle2.dx = tempDx;
    circle2.dy = tempDy;

    while (Game.isColliding(circle1, circle2)) {
        circle1.x += circle1.dx;
        circle1.y += circle1.dy;
        circle2.x += circle2.dx;
        circle2.y += circle2.dy;
    }

    if (Game.circles.length < Game.maxCircles && Game.framesSinceLastCircle >= 10) {
        var collisionX = (circle1.x + circle2.x) / 2;
        var collisionY = (circle1.y + circle2.y) / 2;
        Game.addCircle(collisionX, collisionY);
        Game.framesSinceLastCircle = 0;
    }
};

Game.draw = function () {
    Game.canvasContext.fillStyle = 'black';

    for (var i = 0; i < Game.circles.length; i++) {
        var circle = Game.circles[i];

        Game.canvasContext.beginPath();
        Game.canvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        Game.canvasContext.fill();
    }
};
