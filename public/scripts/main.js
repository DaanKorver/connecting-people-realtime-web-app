const socket = io();
const chat = document.querySelector('.chatroom form');
const chatInput = document.querySelector('.chatroom form input');
const chats = document.querySelector('.chats');
const addTaskBtn = document.querySelector('.add-new-task span');
const addTaskCloseBtn = document.querySelector('.create-task-card-header p');
const addTaskPopup = document.querySelector('.create-task');
const addTaskCard = document.querySelector('.create-task-card');

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

function hideAddTaskPopup() {
	addTaskPopup.classList.toggle('visible');
}

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
