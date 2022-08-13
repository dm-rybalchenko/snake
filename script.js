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

const snake = {
	body: [
		{ coordX: 130, coordY: 100 },
		{ coordX: 120, coordY: 100 },
		{ coordX: 110, coordY: 100 },
		{ coordX: 100, coordY: 100 },
	],
	direction: 'right',
	meal: {},
	turnUp() { this.direction = 'up' },
	turnRight() { this.direction = 'right' },
	turnDown() { this.direction = 'down' },
	turnLeft() { this.direction = 'left' },
};

snake.render = function () {
	let direction = this.direction;
	let coordXHead = this.body[0].coordX;
	let coordYHead = this.body[0].coordY;
	// checkSmash
	if (direction === 'up') coordYHead += 10;
	if (direction === 'right') coordXHead += 10;
	if (direction === 'down') coordYHead -= 10;
	if (direction === 'left') coordXHead -= 10;
	snake.body.unshift({ coordX: coordXHead, coordY: coordYHead });

	// checkMeal
	snake.body.pop()

	//checkWall
	field.innerHTML = '';
	snake.body.forEach(item => {
		field.insertAdjacentHTML('beforeend', `<div class="snake-game__item" style="left: ${item.coordX}px; bottom: ${item.coordY}px;"></div>`)
	});

}

