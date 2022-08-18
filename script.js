'use strict'

const field = document.querySelector('.snake-game__body');

document.querySelector('.snake-game').addEventListener('mousedown', (event) => {
	let targetClass = event.target.classList;
	if (targetClass.contains('snake-game__btn--up')) snake.turnUp();
	if (targetClass.contains('snake-game__btn--right')) snake.turnRight();
	if (targetClass.contains('snake-game__btn--down')) snake.turnDown();
	if (targetClass.contains('snake-game__btn--left')) snake.turnLeft();
});
document.addEventListener('keydown', (event) => {
	if (event.repeat) return;
	if (event.code === 'ArrowUp') snake.turnUp();
	if (event.code === 'ArrowRight') snake.turnRight();
	if (event.code === 'ArrowDown') snake.turnDown();
	if (event.code === 'ArrowLeft') snake.turnLeft();
})

const maxCoord = 500 - 10;
let speed = 100;
let turnOnce = 1;
let scoreCounter = 0;
let userName;
let userScore;

const snake = {
	body: [],
	direction: 'right',
	meal: { coordX: 0, coordY: 0 },

	turnUp() { if (this.direction !== 'down' && turnOnce) { this.direction = 'up'; turnOnce = 0; } },
	turnRight() { if (this.direction !== 'left' && turnOnce) { this.direction = 'right'; turnOnce = 0; } },
	turnDown() { if (this.direction !== 'up' && turnOnce) { this.direction = 'down'; turnOnce = 0; } },
	turnLeft() { if (this.direction !== 'right' && turnOnce) { this.direction = 'left'; turnOnce = 0; } },

	NewBlock(x, y) { return { coordX: x, coordY: y } },

	checkBody(x, y) {
		for (let block of this.body) {
			if (block.coordX === x && block.coordY === y) return true;
		}
	},

	go() { this.stopId = setInterval(() => { this.render(); }, speed); },
	stopId: null,
	stop() { clearInterval(this.stopId) },

	addMeal() {
		this.meal.coordX = Math.round(Math.floor(Math.random() * (maxCoord + 1)) / 10) * 10;
		this.meal.coordY = Math.round(Math.floor(Math.random() * (maxCoord + 1)) / 10) * 10;
		if (this.checkBody(this.meal.coordX, this.meal.coordY)) this.addMeal;
	},
};

snake.render = function () {
	turnOnce = 1;
	let direction = this.direction;
	let coordXHead = this.body.at(-1).coordX;
	let coordYHead = this.body.at(-1).coordY;

	//Coords new block
	if (direction === 'up') coordYHead += 10;
	if (direction === 'right') coordXHead += 10;
	if (direction === 'down') coordYHead -= 10;
	if (direction === 'left') coordXHead -= 10;

	//checking walls
	if (coordXHead < 0) coordXHead = maxCoord;
	if (coordXHead > maxCoord) coordXHead = 0;
	if (coordYHead < 0) coordYHead = maxCoord;
	if (coordYHead > maxCoord) coordYHead = 0;

	// checking smash
	if (this.checkBody(coordXHead, coordYHead)) {
		this.stop();
		field.classList.add('snake-game__body_fail');
		setTimeout(() => { this.reset(); }, 3000)

	}

	snake.body.push(this.NewBlock(coordXHead, coordYHead));

	// checking meal
	if (this.meal.coordX === coordXHead && this.meal.coordY === coordYHead) {
		this.addMeal();
		scoreCounter += 10;
	} else {
		snake.body.shift();
	}

	field.innerHTML = '';
	this.body.forEach(item => displayBlock(item));
	displayBlock(this.meal);

	function displayBlock(block) {
		field.insertAdjacentHTML('beforeend', `<div class="snake-game__item" style="left: ${block.coordX}px; bottom: ${block.coordY}px;"></div>`)
	}
}

snake.reset = function () {
	field.classList.remove('snake-game__body_fail');

	if (localStorage.getItem('userName') === null) {
		userName = prompt('Введите ваше имя игрока');
		if (+userName === 0) userName = `user${Math.round(Math.random() * 1000)}`;
		localStorage.setItem('userName', userName);
	}
	if (localStorage.getItem('userName') === null) {
		localStorage.setItem('userScore', scoreCounter);
	} else {
		userScore = localStorage.getItem('userScore');
		if (scoreCounter > userScore) localStorage.setItem('userScore', scoreCounter);
	}

	// adding body snake
	this.body.length = 0;
	let center = (maxCoord + 10) / 2;
	for (let i = 0; i <= 40; i += 10) {
		this.body.push(this.NewBlock(center + i, center));
	}

	this.direction = 'right';
	this.addMeal();
	this.go();

	console.log(localStorage.getItem('userName'));
	console.log(localStorage.getItem('userScore'));
}

window.onload = () => {
	snake.reset();
}
