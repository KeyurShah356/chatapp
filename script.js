const firebaseConfig = {
  apiKey: "AIzaSyDQU7KUyN3B6gkNOFDRdUq2RlDJlYwQH8Q",
  authDomain: "k-s-chatbox.firebaseapp.com",
  databaseURL: "https://k-s-chatbox-default-rtdb.firebaseio.com",
  projectId: "k-s-chatbox",
  storageBucket: "k-s-chatbox.appspot.com",
  messagingSenderId: "564855446595",
  appId: "1:564855446595:web:4263899a639685846008f6",
  measurementId: "G-GLMEXCVTZ3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const userList = document.getElementById("userList");
const currentUserInput = document.getElementById("currentUser");
const chatBox = document.getElementById("chat-box");
const chatHeader = document.getElementById("chatHeader");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let selectedUser = "";
let chatRef = null;

// Dummy user list
const users = [
  { name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" }
];

// Render user list
users.forEach(user => {
  const li = document.createElement("li");
  li.innerHTML = `<img src="${user.avatar}" alt="${user.name}"/> <span>${user.name}</span>`;
  li.addEventListener("click", () => {
    if (!currentUserInput.value.trim()) {
      alert("Please enter your name.");
      return;
    }
    currentUser = currentUserInput.value.trim();
    selectedUser = user.name;
    chatHeader.textContent = `Chat with ${selectedUser}`;
    loadMessages();
  });
  userList.appendChild(li);
});

sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (!currentUser || !selectedUser || !msg) return;

  const chatId = getChatId(currentUser, selectedUser);
  db.ref(`chats/${chatId}`).push({
    sender: currentUser,
    text: msg,
    timestamp: Date.now()
  });
  messageInput.value = "";
});

// Load messages between two users
function loadMessages() {
  if (chatRef) chatRef.off();
  chatBox.innerHTML = "";

  const chatId = getChatId(currentUser, selectedUser);
  chatRef = db.ref(`chats/${chatId}`);

  chatRef.on("child_added", (snapshot) => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(data.sender === currentUser ? "sent" : "received");
    div.innerHTML = `${data.text}<span class="timestamp">${formatTime(data.timestamp)}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Chat ID based on usernames
function getChatId(user1, user2) {
  return [user1, user2].sort().join("_");
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
