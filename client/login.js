
/*

const firebaseConfig = {
    apiKey: "AIzaSyBS6ftMzXuNYUVmBDytMQyV1nDfwiAIUG8",
    authDomain: "semantle-9c71d.firebaseapp.com",
    databaseURL: "https://semantle-9c71d-default-rtdb.firebaseio.com",
    projectId: "semantle-9c71d",
    storageBucket: "semantle-9c71d.appspot.com",
    messagingSenderId: "19586239469",
    appId: "1:19586239469:web:e75eabcb59eb03c9f8f5e4",
    measurementId: "G-Y0NBW3N14G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
});




const auth = firebase.auth();







sign_in_btn.addEventListener('click', async () => {
    const loginUsername = document.querySelector('.sign-in-form input[type="text"]').value;
    const loginPassword = document.querySelector('.sign-in-form input[type="password"]').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(loginUsername, loginPassword);
        alert('Logged in successfully!');
        window.location.href = 'instructions.html'; // Redirect to instructions.html
    } catch (error) {
        alert('Login failed. Please try again.');
        console.error(error);
    }
});

sign_up_btn.addEventListener('click', async () => {
    const registerUsername = document.querySelector('.sign-up-form input[type="text"]').value;
    const registerPassword = document.querySelector('.sign-up-form input[type="password"]').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(registerUsername, registerPassword);
        alert('Registered successfully! You can now log in.');
        switchToLoginForm();
    } catch (error) {
        console.error(error);
    }
});

function switchToLoginForm() {
    container.classList.remove("sign-up-mode");
}




*/




(function () {
  // Your web app's Firebase configuration 
  const firebaseConfig = {
      apiKey: "AIzaSyBS6ftMzXuNYUVmBDytMQyV1nDfwiAIUG8",
      authDomain: "semantle-9c71d.firebaseapp.com",
      databaseURL: "https://semantle-9c71d-default-rtdb.firebaseio.com",
      projectId: "semantle-9c71d",
      storageBucket: "semantle-9c71d.appspot.com",
      messagingSenderId: "19586239469",
      appId: "1:19586239469:web:e75eabcb59eb03c9f8f5e4",
      measurementId: "G-Y0NBW3N14G"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // const app = firebase.initializeApp(firebaseConfig);  
  // const database = firebase.database();  
  //Get Elements 
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const btnLogin = document.getElementById("btnLogin");
  const btnSignup = document.getElementById("btnSignup");
  //Add Login Event
  btnLogin.addEventListener('click', async e => {
      e.preventDefault();// מניעת התנהגות ברירת המחדל של הכפתור  
      const email = txtEmail.value;
      const password = txtPassword.value;
      try {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
          const user = userCredential.user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert("התחברת בהצלחה :)");
          window.location.href = 'instruction.html';
          // Redirect to instructions.html  
      } catch (err) {
          alert(err.message);
      }
  });
  //Add Signup Event 
  btnSignup.addEventListener('click', async e => {
      e.preventDefault();
      const email = txtEmail.value;
      const password = txtPassword.value;
      const username = email.split('@')[0];// Use the part of the email before '@'   
      const userPoints = 0;
      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // פרטי המשתמש החדש       
              const user = userCredential.user;
              const uid = user.uid;
              // שמור את המשתמש ב-local storage       
              localStorage.setItem('user', JSON.stringify(user));
              // מידע נוסף שתרצה לשמור ב-Realtime Database        
              const additionalUserData = {
                  email: email,
                  username: username, // Add the user's username here         
                  points: userPoints, // Initialize user points to zero        
              };
              // המסלול לשמירת מידע נוסף ב-Realtime Database       
              const userRef = firebase.database().ref(`users/${uid}`);
              userRef.set(additionalUserData)
                  .then(() => {
                      alert("ההרשמה בוצעה בהצלחה :)");
                      window.location.href = 'instruction.html'; // Redirect to instructions.html           
                  })
                  .catch((error) => {
                      console.error("Error saving additional user data:", error);
                  });
          })
          .catch((error) => {
              // אם יש שגיאה ברישום המשתמש      
              alert(`Registration error: ${err.code} - ${err.message}`);
          });
  });
}());
