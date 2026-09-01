import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         onAuthStateChanged
        } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js"


const firebaseConfig = {
  apiKey: "AIzaSyAOVDZrRMKQB3EFM5I-KvC-orOe8eWypgM",
  authDomain: "leads-tracker-app-c11e5.firebaseapp.com",
  databaseURL: "https://leads-tracker-app-c11e5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leads-tracker-app-c11e5",
  storageBucket: "leads-tracker-app-c11e5.firebasestorage.app",
  messagingSenderId: "39220964627",
  appId: "1:39220964627:web:9075e9c6e9e22dd76a3ee6"
};

const emailEl=document.getElementById("email-el")
const passwordEl=document.getElementById("password-el")
const signUpEl=document.getElementById("signup-btn")
const loginEl = document.getElementById("login-btn")

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth=getAuth(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")


onAuthStateChanged(auth,function (user) {
   console.log(user)
})

signUpEl.addEventListener("click",function() {
    const email=emailEl.value
    const password= passwordEl.value

      createUserWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
          console.log(userCredential)
        })

})

loginEl.addEventListener("click" ,function(){
    console.log("button clicked")
      const email=emailEl.value
      const password= passwordEl.value
      console.log(email)
      signInWithEmailAndPassword(auth,email,password)
      .then(function(userCredential){
        console.log(userCredential.user.email)
      })
      .catch(function(userCredential){
        console.log(Error)
      })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists()
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val()
        const leads = Object.values(snapshotValues)
        render(leads)
    }
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value)
    inputEl.value = "" 
})