import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         onAuthStateChanged,
         signOut
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

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

const leadsEl=document.getElementById("leads-tracker")
const authEl=document.getElementById("auth-container")
const ExitEl=document.getElementById("exit-el")
const errorEl= document.getElementById("error-el")

let currentUser=null

ExitEl.addEventListener("click" ,function() {
    signOut(auth)
})


onAuthStateChanged(auth,function (user) {
    currentUser=user
   if(user) {
    authEl.style.display="none"
    leadsEl.style.display="block"
    const referenceDB=ref(database,`users/${user.uid}/leads`)
    console.log(user.uid)

    onValue(referenceDB, function(snapshot) {

         if(snapshot.exists()) {
            const snapshotValues = snapshot.val()
            const leads=Object.values(snapshotValues)
            render(leads)
          }
      })
   }

     else {
       authEl.style.display="block"
        leadsEl.style.display="none"
     }
})


signUpEl.addEventListener("click",function() {
    const email=emailEl.value
    const password= passwordEl.value

      createUserWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
          console.log(userCredential)
          errorEl.textContent=""
        })

        .catch(function(error){
            console.log(error)
            if(error.code==="auth/invalid-email"){
                errorEl.textContent="Please enter a valid email"
            }
            else if(error.code=== "auth/email-already-in-use"){
               errorEl.textContent="An account with this email already exists."
              }
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
        errorEl.textContent=""
      })
      .catch(function(error){
        console.log(error.code)
        if(error.code==="auth/invalid-credential")
        errorEl.textContent="Incorrect email or password"
        
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



deleteBtn.addEventListener("dblclick", function() {
    if(currentUser) {
    const referenceDl=ref(database,`users/${currentUser.uid}/leads`)
    remove(referenceDl)
    ulEl.innerHTML = ""
    }
   
})

inputBtn.addEventListener("click", function() {
    if (currentUser){
        console.log("user is logged in")
        if(inputEl.value!=""){
           const referenceDB1=ref(database,`users/${currentUser.uid}/leads`)
          push(referenceDB1, inputEl.value)
           inputEl.value = "" 
        }
       
        
    }
    else if(currentUser===null){
        errorEl.textContent="user is not logged in"
    }
    
   
})