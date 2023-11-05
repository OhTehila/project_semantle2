const express = require('express')
const cors = require('cors')
const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const app = express()
app.use(cors())

app.use(express.static('client'));
app.use(express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const fs = require('fs');
const vectorsText = fs.readFileSync('glove.6B.100d.txt', 'utf-8');
const vectorsMap = new Map();
const vectorsLines = vectorsText.split('\n');
for (const line of vectorsLines) {
    const parts = line.trim().split(' ');
    if (parts.length >= 101) {
        const word = parts[0];
        const vector = parts.slice(1).map(parseFloat);
        vectorsMap.set(word, vector);
    }
}

function calculateCosineSimilarity(vectorA, vectorB) {
    // Implement cosine similarity calculation here
    if (vectorA.length !== vectorB.length) {
        throw new Error("Vector dimensions do not match.");
    }

    const dotProduct = vectorA.reduce((sum, valueA, index) => sum + valueA * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
        throw new Error("One or both vectors have zero magnitude.");
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

function preprocessWord(word) {
    // Convert to lowercase and remove punctuation
    return word.toLowerCase().replace(/[^\w\s]/g, '');
}

function calculateSemanticDistance(userWord, targetWord) {
    try {
        const preprocessedUserWord = preprocessWord(userWord);
        const preprocessedTargetWord = preprocessWord(targetWord);

        const userWordVector = vectorsMap.get(preprocessedUserWord);
        const targetWordVector = vectorsMap.get(preprocessedTargetWord);

        if (!userWordVector || !targetWordVector) {
            throw new Error("Word vectors not found for the provided words.");
        }

        // Calculate cosine similarity
        const similarity = calculateCosineSimilarity(userWordVector, targetWordVector);

        // Convert similarity to a score between 0 and 100
        const score = (similarity + 1) * 50;

        // Ensure the score is within the range [0, 100]
        return Math.max(0, Math.min(100, score));

    } catch (error) {
        console.error("Error calculating semantic distance:", error);
        return -1; // or any other suitable value to indicate an error
    }
}

let correctWord;

function getRandomWord() {
    const getRandomWordFromApi = () => {
        return fetch('https://random-word-api.herokuapp.com/word?number=1')
            .then(response => response.json())
            .then(data => {
                const randomWord = data[0];
                console.log('Random word from API:', randomWord);
                return randomWord;
            })
            .catch(error => {
                console.error('Error fetching random word:', error);
                throw error;
            });
    };

    const isValidWord = word => vectorsMap.has(word);

    const fetchRandomWord = async () => {
        let randomWord;
        do {
            randomWord = await getRandomWordFromApi();
        } while (!isValidWord(randomWord));

        return randomWord;
    };

    fetchRandomWord()
        .then(word => {
            correctWord = word;
            console.log('Valid random word:', correctWord);
        })
        .catch(error => {
            console.error('Error fetching valid random word:', error);
        });
}

function scheduleRandomWord() {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(0, 0, 0, 0); // Set target time to 0:0
    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1); // Move to the next day
    }

    const timeUntilTarget = targetTime - now;

    setTimeout(() => {
        getRandomWord();
        scheduleRandomWord(); // Schedule the next execution
    }, timeUntilTarget);
}

// Start scheduling the function
getRandomWord();////////זה
scheduleRandomWord();

app.post('/check-word', (req, res) => {
    const { word } = req.body;
    const score = calculateSemanticDistance(word, correctWord);
    res.json(score);
});

port = 3000
my_port = process.env.PORT || port
app.listen(my_port)
console.log("app is listening in port 3000")