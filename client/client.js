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

document.addEventListener('DOMContentLoaded', () => {
    const guessButton = document.getElementById('guessButton');
    const inputField = document.getElementById('inputField');
    const resultElement = document.getElementById('result');
    const resultsTable = document.getElementById('resultsTable'); // Get the results table   
    var wordCount = 0;
    guessButton.addEventListener('click', async () => {
        const guessedWord = inputField.value;
        if (guessedWord) {
            const response = await fetch('/check-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: guessedWord })
            });
            const data = await response.json();//.data[0]

            const user = firebase.auth().currentUser;
            console.log('user:', user);
            // Check the condition based on API response data
            if (Math.abs(data - 100) < 0.0000001 || Math.abs(data - 99.99999999999999) < 0.0000001) {
                if (user) {

                    const overlay = document.getElementById('overlay');
                    overlay.style.display = 'block';

                    // Hide the overlay after a certain delay (e.g., 5 seconds)
                    setTimeout(() => {
                        overlay.style.display = 'none';
                    }, 1000000); // 5000 milliseconds = 5 seconds

                    // If there is a user, retrieve their UID
                    const uid = user.uid;

                    // Reference to the user's points
                    const userPointsRef = firebase.database().ref(`users/${uid}/points`);

                    // Use transaction to update user points
                    userPointsRef.transaction((currentPoints) => {
                        // Check if currentPoints is null (user points not found)
                        if (currentPoints === null) {
                            return 3; // Initialize user points to 3 if it's null
                        }
                        // Add 3 points to the current points
                        return currentPoints + 3;
                    })
                        .then((transactionResult) => {
                            if (transactionResult.committed) {
                                // Transaction was successful
                                const updatedPoints = transactionResult.snapshot.val();
                                const timeSpent = Math.floor((Date.now() - startTime) / 1000); // זמן שחלף בשניות
                                document.getElementById('userPoints').textContent = updatedPoints;
                                console.log('User points updated successfully.');
                                console.log(`Time taken to solve: ${timeSpent} seconds`);
                                window.location.href = `end_game_win.html?time=${timeSpent}`;
                            } else {
                                console.error('Transaction could not be committed.');
                            }
                        })
                        .catch((error) => {
                            console.error('Transaction failed:', error);
                        });
                } else {
                    console.error('User not authenticated.');
                    document.getElementById('userPoints').textContent = 'Error';
                }
            }

            resultElement.textContent = data.result;
            // Update the results table with the received answer          
            var newRow = resultsTable.insertRow(1);
            var numberCell = newRow.insertCell(0);
            var inputCell = newRow.insertCell(1);
            var outcomeCell = newRow.insertCell(2);
            wordCount++;
            numberCell.innerHTML = wordCount;
            inputCell.innerHTML = guessedWord;
            outcomeCell.innerHTML = data;
            // Clear the input field after displaying the answer           
            inputField.value = "";
            // Add the placeholder back after clearing the input         
            inputField.setAttribute("placeholder", "guess");
        }
    });
});
// Total time in milliseconds for the timer (20 minutes)
const totalTime = 20 * 60 * 1000;//start time of the timer
const startTime = Date.now();
// A function that updates every second and displays the remaining time
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const remainingTime = Math.max(totalTime - elapsedTime, 0);  // Make sure the remaining time is not negative
    const minutes = Math.floor(remainingTime / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
    document.getElementById("timer").innerText = ` ${minutes}:${seconds}`;
    // If the timer runs out, activates the appropriate function 
    if (remainingTime <= 0) {
        timerExpired();
    }
}
// A function that will be run when the timer ends
function timerExpired() {
    window.location.href = 'end_game_los.html';
}
// A function that performs the initial update and starts the timer
function startTimer() {
    updateTimer();
    setInterval(updateTimer, 1000); // updates every second
}
// Starting the timer when the page loads
window.onload = startTimer;
function removePlaceholder() {
    var inputField = document.getElementById("inputField");
    if (inputField.value !== "") {
        inputField.removeAttribute("placeholder");
    }
}
function showInstructions() {
    var modal = document.getElementById("instructionsModal");
    modal.style.display = "block";
}
function closeInstructions() {
    var modal = document.getElementById("instructionsModal");
    modal.style.display = "none";
}

// When the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Set the HTML element where you want to display the dots
    const userPointsElement = document.getElementById('userPoints');

    // When the user logs in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the user is logged in, get the points from Firebase
            const uid = user.uid;
            const userPointsRef = firebase.database().ref(`users/${uid}/points`);

            userPointsRef.on('value', (snapshot) => {
                const userPoints = snapshot.val();
                if (userPoints !== null) {
                    // Update the HTML element with the points value
                    userPointsElement.textContent = `your points: ${userPoints}`;
                } else {
                    console.error('User points not found.');
                }
            });
        } else {
            // If the user is not logged in, set the HTML element to 0
            userPointsElement.textContent = 'your points: 0';
        }
    });
});