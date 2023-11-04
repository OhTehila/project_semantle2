
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
            const data = await response.json();

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


                    // setTimeout(() => {  }, 180000);

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
                              //  window.location.href = 'end_game_win.html';
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



/*

            if (Math.abs(data - 100) < 0.0000001 || Math.abs(data - 99.99999999999999) < 0.0000001) {
                if (user) {
                    const overlay = document.getElementById('overlay');
                    overlay.style.display = 'block';
            
                    // Hide the overlay after a certain delay (e.g., 5 seconds)
                    setTimeout(() => {
                        overlay.style.display = 'none';
                    }, 5000); // 5000 milliseconds = 5 seconds
            
                    const uid = user.uid;
                    const userPointsRef = firebase.database().ref(`users/${uid}/points`);
            


               
                    
                  

                    userPointsRef.transaction((currentPoints) => {
                        if (currentPoints === null) {
                            return 3;
                        }
                        return currentPoints + 3;
                    })
                    .then((transactionResult) => {
                        if (transactionResult.committed) {
                            const updatedPoints = transactionResult.snapshot.val();

                         
                          const currentTime = Date.now();
                            // Update the userPoints div with both points and time
                            const userPointsDiv = document.getElementById('userPoints');
                            userPointsDiv.innerHTML = `Your points: ${updatedPoints}<br>Your time: ${currentTime}`;

                           

                            console.log('User points updated successfully.');
                            window.location.href = 'end_game_win.html';
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
            }*/
            





            resultElement.textContent = data.result;
            // Update the results table with the received answer          
            var newRow = resultsTable.insertRow(1);
            var numberCell = newRow.insertCell(0);
            var inputCell = newRow.insertCell(1);
            var outcomeCell = newRow.insertCell(2);
            wordCount++;
            numberCell.innerHTML = wordCount;
            inputCell.innerHTML = guessedWord;
            //outcomeCell.innerHTML = data.result;         
            outcomeCell.innerHTML = data;
            // Clear the input field after displaying the answer           
            inputField.value = "";
            // Add the placeholder back after clearing the input         
            inputField.setAttribute("placeholder", "guess");
        }
    });
});
// זמן כולל במילישניות לטיימר (10 דקות)
const totalTime = 20 * 60 * 1000;// זמן התחלה של הטיימר
const startTime = Date.now();
// פונקציה שמתעדכנת בכל שנייה ומציגה את הזמן הנותר
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const remainingTime = Math.max(totalTime - elapsedTime, 0);  // וודא שהזמן הנותר אינו שלילי
    const minutes = Math.floor(remainingTime / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
    document.getElementById("timer").innerText = ` ${minutes}:${seconds}`;
    // במידה והטיימר נגמר, מפעיל את הפונקציה המתאימה  
    if (remainingTime <= 0) {
        timerExpired();
    }
}
// פונקציה שתופעל כאשר הטיימר מסתיים
function timerExpired() {
    // כאן אתה יכול לבצע פעולות כאשר הטיימר מסתיים   
    // alert("Time is up!");  
    window.location.href = 'end_game_los.html';
}
// פונקציה שמבצעת את העדכון הראשוני ופועלת את הטיימר
function startTimer() {
    updateTimer();
    setInterval(updateTimer, 1000); // מעדכן כל שנייה
}
// הפעלת הטיימר בעת טעינת הדף
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


// כאשר הדף נטען
document.addEventListener("DOMContentLoaded", function () {
    // קבוע את אלמנט ה-HTML שבו תרצה להציג את הנקודות
    const userPointsElement = document.getElementById('userPoints');

    // כאשר המשתמש מתחבר
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // אם המשתמש מחובר, קבל את הנקודות מ-Firebase
            const uid = user.uid;
            const userPointsRef = firebase.database().ref(`users/${uid}/points`);

            userPointsRef.on('value', (snapshot) => {
                const userPoints = snapshot.val();
                if (userPoints !== null) {
                    // עדכן את אלמנט ה-HTML בערך של הנקודות
                    userPointsElement.textContent = `your points: ${userPoints}`;
                } else {
                    console.error('User points not found.');
                }
            });
        } else {
            // אם המשתמש לא מחובר, ערך באלמנט ה-HTML לריק
            userPointsElement.textContent = 'your points: 0';
        }
    });
});