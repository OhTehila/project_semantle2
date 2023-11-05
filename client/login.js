(function () {
    // web app's Firebase configuration 
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
    //Get Elements 
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    //Add Login Event
    btnLogin.addEventListener('click', async e => {
        e.preventDefault();// Preventing the default behavior of the button 
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
                // New user details     
                const user = userCredential.user;
                const uid = user.uid;
                // Save the user in local storage       
                localStorage.setItem('user', JSON.stringify(user));
                // Additional information we would like to save in the Realtime Database      
                const additionalUserData = {
                    email: email,
                    username: username, // Add the user's username here         
                    points: userPoints, // Initialize user points to zero        
                };
                // The route to save additional information in the Realtime Database      
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
                // If there is an error in the user registration     
                alert(`Registration error: ${err.code} - ${err.message}`);
            });
    });
}());
