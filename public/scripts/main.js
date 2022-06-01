const socket = io()
const chat = document.querySelector('.chatroom form')
const chatInput = document.querySelector('.chatroom form input')
const chats = document.querySelector('.chats')

chat.addEventListener('submit', sendMessage)

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
