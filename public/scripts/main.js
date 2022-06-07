const socket = io();
const chat = document.querySelector('.chatroom form');
const chatInput = document.querySelector('.chatroom form input');
const chats = document.querySelector('.chats');
const addTaskBtn = document.querySelector('.add-new-task span');
const addTaskCloseBtn = document.querySelector('.create-task-card-header p');
const addTaskPopup = document.querySelector('.create-task');
const addTaskCard = document.querySelector('.create-task-card');

const rows = document.querySelectorAll('.row')
const cards = document.querySelectorAll('.row ul li')

chat.addEventListener('submit', sendMessage);
addTaskBtn.addEventListener('click', showAddTaskPopup);
addTaskCloseBtn.addEventListener('click', hideAddTaskPopup);

/* ------------------------ */
/* Regular functions        */
/* ------------------------ */

/**
 * Shows the add task form
 */
function showAddTaskPopup() {
	addTaskPopup.classList.toggle('visible');
	addTaskCard.classList.toggle('visible');
}

/**
 * Hides the add task form
 */
function hideAddTaskPopup() {
	addTaskPopup.classList.remove('visible');
	addTaskCard.classList.remove('visible');
}

/* ------------------------ */
/* Dragging                 */
/* ------------------------ */

let dragEl = null

rows.forEach(row => {
	row.addEventListener('dragover', onDragOver)
	row.addEventListener('dragleave', onDragLeave)
	row.addEventListener('drop', onDrop)
})

/* ------------------------ */
/* Socket.io                */
/* ------------------------ */

// Chat messages
socket.on('message', appendMessage)
socket.on('drop', dropInfo => {
	rows[dropInfo.target].children[1].appendChild(
		document.getElementById(dropInfo.id)
	)
	updateRows()
})

socket.on('set-cards', cards => {
	clearRows()
	Object.values(cards).forEach(card => {
		rows[card.row].children[1].insertAdjacentHTML(
			'beforeend',
			`
			<li draggable="true" id="card${card.id}">
				<p>[Chippr.dev] Create Prototype mobile for Get notificatino in principe</p>
				<div class="meta">
					<span>11 Juni</span>
				</div>
			</li>
		`
		)
		document
			.getElementById(`card${card.id}`)
			.addEventListener('dragstart', onDragStart)
	})
	updateRows()
})

/**
 * Appends the message markup to the chat
 * @param {string} msg
 */
function appendMessage(msg) {
	const direction = msg.id === socket.id ? 'outgoing' : 'incoming'
	chats.insertAdjacentHTML(
		'beforeend',
		`
    <li class="${direction}">
      <div class="user">
        <img src="/assets/images/joost-chippr.jpg" alt="Joost">
      </div>
      <p>${msg.msg}</p>
    </li>
  `
	)
	chats.scrollTo(0, chats.scrollHeight)
}

/**
 * Sends message to server and clears the chat input
 * @param {object} event
 */
function sendMessage(event) {
	event.preventDefault()
	const msg = chatInput.value
	if (!msg) return
	socket.emit('message', msg)
	chatInput.value = ''
}

function onDrop(event) {
	this.classList.remove('dr')
	const id = dragEl.id
	const target = Array.from(rows).indexOf(this)
	socket.emit('drop', { target, id })
	event.preventDefault()
}

function onDragOver(event) {
	this.classList.add('dr')
	event.preventDefault()
}

function onDragLeave(event) {
	this.classList.remove('dr')
	event.preventDefault()
}

function onDragStart(event) {
	dragEl = event.target
}

function updateRows() {
	rows.forEach(row => {
		const count = row.children[1].children.length
		row.querySelector('header span').innerText = count
		if (!count) {
			row.classList.add('empty')
		} else {
			if (row.classList.contains('empty')) {
				row.classList.remove('empty')
			}
		}
	})
}

function clearRows() {
	rows.forEach(row => {
		row.children[1].innerHTML = ''
	})
}
