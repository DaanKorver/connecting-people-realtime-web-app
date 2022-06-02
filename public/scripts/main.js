const socket = io()
const chat = document.querySelector('.chatroom form')
const chatInput = document.querySelector('.chatroom form input')
const chats = document.querySelector('.chats')

const rows = document.querySelectorAll('.row')
const cards = document.querySelectorAll('.row ul li')

chat.addEventListener('submit', sendMessage)

/* ------------------------ */
/* Dragging                 */
/* ------------------------ */

let dragEl = null

cards.forEach(card => {
	card.addEventListener('dragstart', onDragStart)
})

rows.forEach(row => {
	row.addEventListener('dragover', onDragOver)
	row.addEventListener('dragleave', onDragLeave)
	row.addEventListener('drop', onDrop)
})

updateRows()

/* ------------------------ */
/* Socket.io                */
/* ------------------------ */

// Chat messages
socket.on('message', appendMessage)

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
	this.children[1].appendChild(dragEl)
	updateRows()
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
