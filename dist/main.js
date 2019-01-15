/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/pinball.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ball.js":
/*!*********************!*\
  !*** ./src/ball.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nconst Thruster = __webpack_require__(/*! ./obj/thruster */ \"./src/obj/thruster.js\");\n\nlet ballPosX = 445;\nlet ballPosY = 384;\nlet gravity = 0.18;\nlet elasticity = 0.7;\nlet friction = 0.1;\n\n\n\nclass Ball {\n    constructor(ctx) {\n        this.radius = Ball.RADIUS;\n        this.color = Ball.COLOR;\n        this.ballPosX = ballPosX;\n        this.ballPosY = ballPosY;\n        this.ballVelX = 0;\n        this.ballVelY = 0;\n        this.elasticity = elasticity;\n        this.bounced = false;\n        this.bouncedTwo = false;\n    }\n\n    draw(ctx) {\n        let img = new Image();\n        img.src = `../assets/cool-color-circle.gif`;\n        // debugger\n        let pat = ctx.createPattern(img, 'repeat');\n        ctx.beginPath();\n        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);\n        ctx.fillStyle = pat;\n        // ctx.fillStyle = \"red\";\n        ctx.fill();\n        ctx.closePath();\n        if (this.ballVelY !== 0 && this.ballVelX !== 0) {\n            this.ballVelY += gravity;\n        }\n        this.speed =\n            Math.sqrt(this.ballVelX * this.ballVelX + this.ballVelY * this.ballVelY);\n        this.dnorm = { x: this.ballVelX / this.speed, y: this.ballVelY / this.speed };\n        this.ballPosY += this.ballVelY;\n        this.ballPosX += this.ballVelX;\n    }\n    \n\n    thrust(delta) {\n        this.ballVelY = -12;\n    }\n\n    firstReflect(delta) {\n        this.ballVelX = Math.random() * (-2.53 + 2.6) - 2.6;\n        this.ballVelY = Math.random() * (3.4 - 3.1) + 3.1;\n    }\n\n\n    isCollidedWithLine(obj) {\n        // X and Y distance between the ball and the bump\n        let distX = Math.abs(this.ballPosX - (obj.mid.x));\n        let distY = Math.abs(this.ballPosY - (obj.mid.y));\n\n        // Distance too far\n        if (distX > (obj.halfwidth + this.radius)) { return false; }\n        if (distY > (obj.halfheight + this.radius)) { return false; }\n\n        // Distance definitely colliding\n        if ((distX <= obj.halfwidth) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        }\n\n        if ((distX <= obj.halfheight) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        }\n\n        // Checks corners using Pythagorean Theorem\n        let dx = distX - obj.halfwidth;\n        let dy = distY - obj.halfheight;\n        if ((dx * dx) + (dy * dy) <= (this.radius * this.radius) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        } else {\n            return false;\n        }\n    }\n\n    hitbackFlipper(obj) {\n        let dd = (this.dnorm.x * obj.vnorm.x + this.dnorm.y * obj.vnorm.y) * 2;\n        this.refl = {\n            x: (obj.vnorm.x * dd - this.dnorm.x),\n            y: (obj.vnorm.y * dd - this.dnorm.y)\n        };\n        let length = Math.sqrt(this.refl.x * this.refl.x + this.refl.y * this.refl.y);\n        this.ballPosY -= 4;\n        this.ballVelX = (this.refl.x / length) * this.speed;\n        this.ballVelY = ((this.refl.y / length) * this.speed * 1.07);\n        // this.playThud();\n    }\n\n    playThud() {\n        let x = document.getElementById('thud');\n        x.currentTime = 0;\n        x.play();\n    }\n\n\n    collidewithTopWall() {\n        this.ballPosY = this.radius;\n        this.ballVelY = -this.ballVelY;\n        this.ballVelY *= this.elasticity;\n    }\n\n    collidewithRightWall() {\n        this.ballPosX = 470 - this.radius;\n        this.ballVelX = - this.ballVelX;\n        this.ballVelX *= this.elasticity;\n    }\n\n    collidewithLeftWall() {\n        this.ballPosX = this.radius;\n        this.ballVelX = - this.ballVelX;\n        this.ballVelX *= this.elasticity;\n    }\n\n    isCollidedWithBumpers(obj) {\n\n        let distance = Math.sqrt(\n            Math.pow(this.ballPosX - obj.ballPosX, 2) +\n            Math.pow(this.ballPosY - obj.ballPosY, 2));\n        if ((distance < (this.radius + obj.radius)) && (this.bounced === false)) {\n            this.bounced = true;\n            obj.radius += 1;\n            setTimeout(() => {\n                this.bounced = false;\n                obj.radius -= 1;\n            }, 200);\n            return true;\n        } else {\n            return false;\n        }\n    }\n\n\n    hitbackBumper(obj) {\n        let slope = ((this.ballPosY - obj.ballPosY) / (this.ballPosX - this.ballPosY));\n        let inverseSlope = -1 / (slope);\n        let iPos = { x: inverseSlope, y: 1 };\n        let iPosMag = Math.sqrt(iPos.x * iPos.x + iPos.y * iPos.y);\n        let iPosUnit = { x: iPos.x / iPosMag, y: iPos.y / iPosMag };\n        let dd = (this.dnorm.x * iPosUnit.x + this.dnorm.y * iPosUnit.y) * 2;\n        this.refl = {\n            x: (iPosUnit.x * dd - this.dnorm.x),\n            y: (iPosUnit.y * dd - this.dnorm.y)\n        };\n        let length = Math.sqrt(this.refl.x * this.refl.x + this.refl.y * this.refl.y);\n\n        // Collision Point between ball and bumper\n        let cllsnpt = {\n            x: ((this.ballPosX * obj.radius + obj.ballPosX * this.radius) / 50),\n            y: ((this.ballPosY * obj.radius + obj.ballPosY * this.radius) / 50)\n        };\n\n        //   // Collision Angle between ball and bumper\n        let angle = Math.atan((cllsnpt.y - this.ballPosY)/(cllsnpt.x - this.ballPosX));\n        if (angle < 0) {\n          angle = 2*Math.PI + angle;\n        }\n        \n        // New Position of ball\n        if (this.ballPosX < obj.ballPosX) {\n            this.ballPosX = this.ballPosX - Math.abs( (this.radius + obj.radius)*Math.cos(angle));\n            if (this.ballPosY < obj.ballPosY) {\n            this.ballPosY = this.ballPosY - Math.abs( (this.radius + obj.radius)*Math.sin(angle));\n          } else {\n            this.ballPosY = this.ballPosY + Math.abs( (this.radius + obj.radius)*Math.sin(angle));\n          }\n        } else {\n          this.ballPosX = this.ballPosX + Math.abs( (this.radius + obj.radius)*Math.cos(angle));\n          if (this.ballPosY < obj.ballPosY) {\n          this.ballPosY = this.ballPosY - Math.abs( (this.radius + obj.radius)*Math.sin(angle));\n        } else {\n          this.ballPosY = this.ballPosY + Math.abs( (this.radius + obj.radius)*Math.sin(angle));\n        }\n        }\n\n        this.ballVelX = (this.refl.x / length) * this.speed * 1.01;\n        this.ballVelY = (this.refl.y / length) * this.speed * 1.02;\n        // this.playBumperSound();\n    }\n\n    playBumperSound() {\n        let x = document.getElementById('bell');\n        x.currentTime = 0;\n        x.volume = 0.3;\n        x.play();\n    }\n\n    hitbackBottomBumper(obj) {\n        let dd = (this.dnorm.x * obj.vnorm.x + this.dnorm.y * obj.vnorm.y) * 2;\n        this.refl = {\n            x: (obj.vnorm.x * dd - this.dnorm.x),\n            y: (obj.vnorm.y * dd - this.dnorm.y)\n        };\n        let length = Math.sqrt(this.refl.x * this.refl.x + this.refl.y * this.refl.y);\n        this.ballPosY -= 2;\n        this.ballVelX = (this.refl.x / length) * this.speed;\n        this.ballVelY = ((this.refl.y / length) * this.speed);\n        // this.playBumpSound();\n    }\n\n    isCollidedwithSideBumper(obj) {\n        // X and Y distance between the ball and the bump\n        let distX = Math.abs(this.ballPosX - (obj.mid2.x));\n        let distY = Math.abs(this.ballPosY - (obj.mid2.y));\n\n        // Distance too far\n        if (distX > (obj.halfwidthTwo + this.radius)) { return false; }\n        if (distY > (obj.halfheightTwo + this.radius)) { return false; }\n\n        // Distance definitely colliding\n        if ((distX <= obj.halfwidthTwo) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        }\n        if ((distY <= obj.halfheightTwo) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        }\n\n        // Checks corners using Pythagorean Theorem\n        let dx = distX - obj.halfwidthTwo;\n        let dy = distY - obj.halfheightTwo;\n        if ((dx * dx) + (dy * dy) <= (this.radius * this.radius) && (this.bouncedTwo === false)) {\n            this.changeBounce();\n            return true;\n        } else {\n            return false;\n        }\n    }\n\n    changeBounce() {\n        this.bouncedTwo = true;\n        setTimeout(() => {\n            this.bouncedTwo = false;\n        }, 200);\n    }\n\n    collidewithSideBumper() {\n        this.ballVelX = - this.ballVelX;\n        this.ballVelX *= this.elasticity;\n    }\n\n}\n\n\nBall.RADIUS = 15;\nBall.COLOR = 'blue';\nconst NORMAL_FRAME_TIME_DELTA = 1000 / 60;\n\nmodule.exports = Ball;\n\n//# sourceURL=webpack:///./src/ball.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Thruster = __webpack_require__(/*! ./obj/thruster */ \"./src/obj/thruster.js\");\nconst Ball = __webpack_require__(/*! ./ball */ \"./src/ball.js\");\nconst RightFlipper = __webpack_require__(/*! ./right_flipper */ \"./src/right_flipper.js\");\nconst LeftFlipper = __webpack_require__(/*! ./left_flipper */ \"./src/left_flipper.js\");\nconst BumperOne = __webpack_require__(/*! ./obj/bumper_one */ \"./src/obj/bumper_one.js\");\nconst BumperTwo = __webpack_require__(/*! ./obj/bumper_two */ \"./src/obj/bumper_two.js\");\nconst BumperThree = __webpack_require__(/*! ./obj/bumper_three */ \"./src/obj/bumper_three.js\");\nconst LeftBumper = __webpack_require__(/*! ./obj/left_bumper */ \"./src/obj/left_bumper.js\");\nconst RightBumper = __webpack_require__(/*! ./obj/right_bumper */ \"./src/obj/right_bumper.js\");\n\nlet sPressed = false;\n\ndocument.addEventListener(\"keydown\", SpaceHandler, false);\ndocument.addEventListener(\"keyup\", SpaceHandlerUp, false);\n\nfunction SpaceHandler(e) {\n    if (e.keyCode === 32) {\n        sPressed = true;\n    }\n}\nfunction SpaceHandlerUp(e) {\n    if (e.keyCode === 32) {\n        sPressed = false;\n    }\n}\n\nclass Game {\n    constructor() {\n        this.thruster = new Thruster();\n        this.ball = new Ball();\n        this.rightFlipper = new RightFlipper();\n        this.leftFlipper = new LeftFlipper();\n        this.bumperOne = new BumperOne();\n        this.bumperTwo = new BumperTwo();\n        this.bumperThree = new BumperThree();\n        this.leftBumper = new LeftBumper();\n        this.rightBumper = new RightBumper();\n        this.score = 0;\n        this.highscore = 0;\n    }\n\n    draw(ctx) {\n        ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n        this.thruster.draw(ctx);\n        this.ball.draw(ctx);\n        this.rightFlipper.draw(ctx);\n        this.leftFlipper.draw(ctx);\n        this.bumperOne.draw(ctx);\n        this.bumperTwo.draw(ctx);\n        this.bumperThree.draw(ctx);\n        this.leftBumper.draw(ctx);\n        this.rightBumper.draw(ctx);\n\n        if (this.score > this.highscore) {\n            this.highscore = this.score;\n        }\n\n        document.getElementById(\"test\").innerHTML = this.score;\n        document.getElementById(\"high\").innerHTML = this.highscore;\n\n        if (sPressed === true) {\n            this.ball.ballPosX = 445;\n            this.ball.ballPosY = 384;\n            this.ball.ballVelX = 0;\n            this.ball.ballVelY = 0;\n            this.score = 0;\n            document.getElementById(\"test\").innerHTML = this.score;\n        }\n    }\n\n    step(delta) {\n        // Thruster Ball Starting Movement\n        if (this.ball.ballPosX === 445 &&\n            this.ball.ballPosY + 15 > this.thruster.tposY) {\n            this.ball.thrust(delta);\n        } else if (this.ball.ballPosX === 445 && this.ball.ballPosY < 80) {\n            this.ball.firstReflect(delta);\n        }\n\n        this.checkCollisions();\n    }\n\n    checkCollisions() {\n        // Flipper Collision\n        const flippers = this.flippers();\n        for (let i = 0; i < flippers.length; i++) {\n            if (this.ball.isCollidedWithLine(flippers[i])) {\n                this.ball.hitbackFlipper(flippers[i]);\n            }\n        }\n\n        // Wall Collision\n        if (this.ball.ballPosY <= (0 + this.ball.radius)) {\n            this.ball.collidewithTopWall();\n        } else if (this.ball.ballPosX >= (Game.DIM_X - this.ball.radius)) {\n            this.ball.collidewithRightWall();\n        } else if (this.ball.ballPosX <= this.ball.radius) {\n            this.ball.collidewithLeftWall();\n        }\n\n        // BumperCollision\n        const bumpers = this.bumpers();\n        for (let j = 0; j < bumpers.length; j++) {\n            if (this.ball.isCollidedWithBumpers(bumpers[j])) {\n                this.ball.hitbackBumper(bumpers[j]);\n                if (j === 2) {\n                    this.score += 7;\n                } else {\n                    this.score += 5;\n                }\n            }\n        }\n\n        const bottom_bumpers = this.bottom_bumpers();\n        for (let k = 0; k < bottom_bumpers.length; k++) {\n            if (this.ball.isCollidedWithLine(bottom_bumpers[k])) {\n                this.ball.hitbackBottomBumper(bottom_bumpers[k]);\n                this.score += 3;\n            } else if (this.ball.isCollidedwithSideBumper(bottom_bumpers[k])) {\n                this.ball.collidewithSideBumper();\n                this.score += 3;\n            }\n        }\n\n\n    }\n\n    flippers() {\n        return [].concat(this.rightFlipper, this.leftFlipper);\n    }\n\n    bumpers() {\n        return [].concat(this.bumperOne, this.bumperTwo, this.bumperThree);\n    }\n\n    bottom_bumpers() {\n        return [].concat(this.leftBumper, this.rightBumper);\n    }\n\n}\n\nmodule.exports = Game;\n\nGame.DIM_X = 470;\nGame.DIM_Y = 570;\nGame.BG_COLOR = 'white';\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class GameView {\n    constructor(game, ctx) {\n        this.game = game;\n        this.ctx = ctx;\n    }\n\n    start() {\n        this.lastTime = 0;\n        // this.frameTime = 0;\n        // this.count = 1;\n        requestAnimationFrame(this.animate.bind(this));\n        // setInterval(this.animate(60), 60);\n    }\n\n    animate(time) {\n        const timeDiff = time - this.lastTime;\n        // if (time - this.frameTime > 60) {\n        //     this.count++;\n        //     this.frameTime = time;\n        // }\n        this.game.step(timeDiff);\n        this.game.draw(this.ctx);\n        this.lastTime = time;\n\n        requestAnimationFrame(this.animate.bind(this));\n    }\n\n\n\n}\n\n// document.addEventListener(\"keydown\", muteHandler, false);\n\n// function muteHandler(e) {\n//     if (e.keyCode === 77) {\n//         muteAudio();\n//     }\n// }\n\n// function muteAudio() {\n//     let audio = document.getElementById('audio');\n//     let bell = document.getElementById('bell');\n//     let thud = document.getElementById('thud');\n//     let flip = document.getElementById('flip');\n\n//     if (audio.muted === false) {\n//         document.getElementById('audio').muted = true;\n//         document.getElementById('bell').muted = true;\n//         document.getElementById('thud').muted = true;\n//         document.getElementById('flip').muted = true;\n//     }\n//     else {\n//         document.getElementById('audio').muted = false;\n//         document.getElementById('bell').muted = false;\n//         document.getElementById('thud').muted = false;\n//         document.getElementById('flip').muted = false;\n//     }\n// }\n\n\n\nmodule.exports = GameView;\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/left_flipper.js":
/*!*****************************!*\
  !*** ./src/left_flipper.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let lPressed = false;\nlet posY = 520;\n\ndocument.addEventListener(\"keydown\", leftFlipperHandler, false);\ndocument.addEventListener(\"keyup\", leftFlipperHandlerUp, false);\n\nfunction leftFlipperHandler(e) {\n    if (e.keyCode === 37) {\n        lPressed = true;\n    }\n}\nfunction leftFlipperHandlerUp(e) {\n    if (e.keyCode === 37) {\n        lPressed = false;\n    }\n}\n\n\nclass LeftFlipper {\n    constructor() {\n        this.pos1 = { x: 125, y: 480 };\n        this.halfwidth = 45;\n        this.halfheight = 10;\n        this.posY = posY;\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n        // this.stopAColor = [\n        //     { 'r': '9', 'g': '117', 'b': '190' }, //blue\n        //     { 'r': '59', 'g': '160', 'b': '89' }, //green\n        //     { 'r': '230', 'g': '192', 'b': '39' }, //yellow\n        //     { 'r': '238', 'g': '30', 'b': '77' } //red\n        // ];\n        // this.stopBColor = [\n        //     { 'r': '205', 'g': '24', 'b': '75' }, //pink\n        //     { 'r': '33', 'g': '98', 'b': '155' }, //blue\n        //     { 'r': '64', 'g': '149', 'b': '69' }, //green\n        //     { 'r': '228', 'g': '171', 'b': '33' } //yellow\n        // ];\n    }\n\n    draw(ctx) {\n        ctx.beginPath();\n        ctx.moveTo(120, 480);\n        ctx.lineTo(210, this.posY);\n        ctx.lineWidth = 10;\n        let grd = ctx.createLinearGradient(125, 480, 215, this.posY);\n        grd.addColorStop(0, \"#D6A4A4\");\n        grd.addColorStop(1, \"#DAE2F8\");\n        ctx.strokeStyle = grd;\n        ctx.stroke();\n        ctx.closePath();\n        this.posY = this.posY;\n        this.pos2 = { x: 215, y: this.posY };\n        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };\n        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);\n        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };\n        if (lPressed && this.posY > 440) {\n            this.flipLeftUp(ctx);\n        }\n        if (lPressed === false && this.posY < 520) {\n            this.flipLeftDown(ctx);\n        }\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n    }\n\n    flipLeftUp(ctx) {\n        this.posY -= 15;\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n        // this.playFlip();\n    }\n\n    playFlip() {\n        let x = document.getElementById('flip');\n        x.currentTime = 0;\n        x.play();\n    }\n\n    flipLeftDown(ctx) {\n        this.posY += 15;\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n    }\n}\n\nmodule.exports = LeftFlipper;\n\n//# sourceURL=webpack:///./src/left_flipper.js?");

/***/ }),

/***/ "./src/obj/bumper_one.js":
/*!*******************************!*\
  !*** ./src/obj/bumper_one.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class BumperOne {\n    constructor() {\n        this.radius = BumperOne.RADIUS;\n        this.color = BumperOne.COLOR;\n        this.ballPosX = 145;\n        this.ballPosY = 220;\n    }\n\n    draw(ctx) {\n        let img = document.getElementById('meditative');\n        let meditative = ctx.createPattern(img, 'repeat');\n        ctx.beginPath();\n        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);\n        ctx.fillStyle = meditative;\n        // ctx.fillStyle = \"purple\"\n        ctx.fill();\n        ctx.closePath();\n    }\n}\n\nBumperOne.RADIUS = 35;\nBumperOne.COLOR = 'lightgreen';\n\nmodule.exports = BumperOne;\n\n//# sourceURL=webpack:///./src/obj/bumper_one.js?");

/***/ }),

/***/ "./src/obj/bumper_three.js":
/*!*********************************!*\
  !*** ./src/obj/bumper_three.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nclass BumperThree {\n    constructor() {\n        this.radius = BumperThree.RADIUS;\n        this.color = BumperThree.COLOR;\n        this.ballPosX = 230;\n        this.ballPosY = 120;\n    }\n\n    draw(ctx) {\n        let img = document.getElementById('veil-art');\n        let veil = ctx.createPattern(img, 'repeat');\n        ctx.beginPath();\n        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);\n        ctx.fillStyle = veil;\n        // ctx.fillStyle = \"purple\";\n        ctx.fill();\n        ctx.closePath();\n    }\n}\n\nBumperThree.RADIUS = 35;\nBumperThree.COLOR = 'lightgreen';\n\nmodule.exports = BumperThree;\n\n//# sourceURL=webpack:///./src/obj/bumper_three.js?");

/***/ }),

/***/ "./src/obj/bumper_two.js":
/*!*******************************!*\
  !*** ./src/obj/bumper_two.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class BumperTwo {\n    constructor() {\n        this.radius = BumperTwo.RADIUS;\n        this.color = BumperTwo.COLOR;\n        this.ballPosX = 315;\n        this.ballPosY = 220;\n    }\n\n    draw(ctx) {\n        let img = document.getElementById('balzano');\n        let balzano = ctx.createPattern(img, 'repeat');\n        ctx.beginPath();\n        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);\n        ctx.fillStyle = balzano;\n        // ctx.fillStyle = \"purple\";\n        ctx.fill();\n        ctx.closePath();\n    }\n}\n\nBumperTwo.RADIUS = 35;\nBumperTwo.COLOR = 'lightgreen';\n\nmodule.exports = BumperTwo;\n\n//# sourceURL=webpack:///./src/obj/bumper_two.js?");

/***/ }),

/***/ "./src/obj/left_bumper.js":
/*!********************************!*\
  !*** ./src/obj/left_bumper.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nclass LeftBump {\n    constructor() {\n        this.height = 80;\n        this.pos1 = { x: 50, y: 370 };\n        this.pos2 = { x: 120, y: 450 };\n        this.mid = { x: 85, y: 410 };\n        this.mid2 = { x: 50, y: 410 };\n        this.halfwidth = 35;\n        this.halfheight = 0.5;\n        this.halfwidthTwo = 0.5;\n        this.halfheightTwo = 40;\n        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };\n        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);\n        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };\n    }\n\n    draw(ctx) {\n        let img = document.getElementById(\"geom\");\n        let geom = ctx.createPattern(img, \"repeat\");\n        ctx.beginPath();\n        ctx.fillStyle = geom;\n        ctx.moveTo(90, 450);\n        ctx.lineTo(110, 450);\n        ctx.lineTo(40, 380);\n        ctx.lineTo(40, 400)\n        ctx.fill();\n    }\n}\n\n\n\nmodule.exports = LeftBump;\n\n//# sourceURL=webpack:///./src/obj/left_bumper.js?");

/***/ }),

/***/ "./src/obj/right_bumper.js":
/*!*********************************!*\
  !*** ./src/obj/right_bumper.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class RightBumper {\n    constructor() {\n        this.height = 80;\n        this.pos1 = { x: 420, y: 370 };\n        this.pos2 = { x: 350, y: 450 };\n        this.mid = { x: 385, y: 410 };\n        this.mid2 = { x: 420, y: 410 };\n        this.halfwidth = 35;\n        this.halfheight = 0.5;\n        this.halfwidthTwo = 0.5;\n        this.halfheightTwo = 40;\n        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };\n        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);\n        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };\n    }\n\n    draw(ctx) {\n        let img = document.getElementById(\"geom\");\n        let geom = ctx.createPattern(img, \"repeat\");\n        ctx.beginPath();\n        ctx.fillStyle = geom;\n        ctx.moveTo(350, 450);\n        ctx.lineTo(370, 450)\n        ctx.lineTo(420, 400);\n        ctx.lineTo(420, 380);\n        ctx.fill();\n    }\n}\n\nmodule.exports = RightBumper;\n\n//# sourceURL=webpack:///./src/obj/right_bumper.js?");

/***/ }),

/***/ "./src/obj/thruster.js":
/*!*****************************!*\
  !*** ./src/obj/thruster.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nlet upPressed = false;\nlet downPressed = false;\nlet tposX = 440;\nlet tposY = 400;\nlet velY = 0;\nlet tposYMax = 0;\n\ndocument.addEventListener(\"keydown\", keyDownHandler, false);\ndocument.addEventListener(\"keyup\", keyUpHandler, false);\n\nfunction keyDownHandler(e) {\n    if (e.keyCode === 38) {\n        upPressed = true;\n    }\n    else if (e.keyCode === 40) {\n        downPressed = true;\n    }\n}\nfunction keyUpHandler(e) {\n    if (e.keyCode === 38) {\n        upPressed = false;\n    }\n    else if (e.keyCode === 40) {\n        downPressed = false;\n    }\n}\n\nclass Thruster {\n    constructor() {\n        this.height = Thruster.HEIGHT;\n        this.width = Thruster.WIDTH;\n        this.color = Thruster.COLOR;\n        this.tposY = tposY;\n        this.tposX = tposX;\n        this.tposYMax = 0;\n    }\n\n    draw(ctx) {\n        if (downPressed && this.tposY < 480) {\n            this.tposY += 1;\n        } else if (downPressed === false && this.tposY > 400) {\n            if (this.tposY > this.tposYMax) {\n                this.tposYMax = this.tposY;\n            }\n            if (this.tposYMax % 16 === 0) {\n                this.tposY -= 17;\n            } else {\n                this.tposY -= 16;\n            }\n        }\n        if (this.tposY === 400) {\n            this.tposYMax = 0;\n        }\n    }\n}\n\n\nThruster.HEIGHT = 60;\nThruster.WIDTH = 30;\nThruster.COLOR = 'blue';\n\nmodule.exports = Thruster;\n\n//# sourceURL=webpack:///./src/obj/thruster.js?");

/***/ }),

/***/ "./src/pinball.js":
/*!************************!*\
  !*** ./src/pinball.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Game = __webpack_require__(/*! ./game */ \"./src/game.js\");\nconst GameView = __webpack_require__(/*! ./game_view */ \"./src/game_view.js\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n    const canvasEl = document.getElementById('game-canvas');\n    canvasEl.width = Game.DIM_X;\n    canvasEl.height = Game.DIM_Y;\n    const ctx = canvasEl.getContext('2d');\n\n    // background = new Image();\n    // background.src = \"\";\n    // background.onload = () => {\n    //     ctx.drawImage(background, 0, 0);\n    // }\n\n    const game = new Game();\n    new GameView(game, ctx).start();\n});\n\n//# sourceURL=webpack:///./src/pinball.js?");

/***/ }),

/***/ "./src/right_flipper.js":
/*!******************************!*\
  !*** ./src/right_flipper.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let rPressed = false;\nlet posY = 520;\n\ndocument.addEventListener(\"keydown\", rightFlipperHandler, false);\ndocument.addEventListener(\"keyup\", rightFlipperHandlerUp, false);\n\nfunction rightFlipperHandler(e) {\n    if (e.keyCode === 39) {\n        rPressed = true;\n    }\n}\nfunction rightFlipperHandlerUp(e) {\n    if (e.keyCode === 39) {\n        rPressed = false;\n    }\n}\n\n\nclass RightFlipper {\n    constructor() {\n        this.halfwidth = 45;\n        this.halfheight = 10;\n        this.pos1 = { x: 350, y: 480 };\n        this.posY = posY;\n        this.mid = { x: 305, y: (this.posY + 480) / 2 };\n    }\n\n    draw(ctx) {\n        ctx.beginPath();\n        ctx.lineCap = \"round\";\n        ctx.moveTo(345, 480);\n        ctx.lineTo(255, this.posY);\n        ctx.lineWidth = 10;\n        let grd = ctx.createLinearGradient(350, 480, 260, this.posY);\n        grd.addColorStop(0, \"#D6A4A4\");\n        grd.addColorStop(1, \"#DAE2F8\");\n        ctx.strokeStyle = grd;\n        ctx.stroke();\n        ctx.closePath();\n        this.posY = this.posY;\n        this.pos2 = { x: 260, y: this.posY };\n        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };\n        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);\n        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };\n        if (rPressed && this.posY > 440) {\n            this.flipRightUp(ctx);\n        }\n        if (rPressed === false && this.posY < 520) {\n            this.flipRightDown(ctx);\n        }\n        this.mid = { x: 305, y: (this.posY + 480) / 2 };\n    }\n\n    flipRightUp(ctx) {\n        this.posY -= 15;\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n        // this.playFlip();\n    }\n\n    playFlip() {\n        let x = document.getElementById('flip');\n        x.currentTime = 0;\n        x.play();\n    }\n\n    flipRightDown(ctx) {\n        this.posY += 15;\n        this.mid = { x: 170, y: (this.posY + 480) / 2 };\n    }\n}\n\nmodule.exports = RightFlipper;\n\n//# sourceURL=webpack:///./src/right_flipper.js?");

/***/ })

/******/ });