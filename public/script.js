// ✅ Firebase config
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

// ✅ Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Send
document.getElementById("sendBtn").addEventListener("click", () => {
  const name = document.getElementById("username").value.trim();
  const msg = document.getElementById("message").value.trim();

  if (name && msg) {
    db.ref("messages").push({ name, text: msg });
    document.getElementById("message").value = "";
  }
});

// ✅ Listen
db.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.textContent = `${data.name}: ${data.text}`;
  document.getElementById("chat-box").appendChild(div);
});
