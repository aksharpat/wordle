import React, { useState } from 'react';
//import { Amplify, API } from 'aws-amplify';
import AWS from 'aws-sdk';
import GameBoard from './Gameboard';

/*
Amplify.configure({
    API: {
        endpoints: [
            {
                name: "hello",
                endpoint: "https://4tp6cb49fb.execute-api.us-east-1.amazonaws.com/staging"
            }
        ]
    }
});
*/

AWS.config.update({
    accessKeyId: 'AKIAYGSTB4SW43TNURP5',  // Your AWS Access Key ID
    secretAccessKey: 'NVKQEaXkKuTcVHYhceq+D83eKypPRUO8sy4CjHIw',  // Your AWS Secret Access Key
    region: 'us-east-1',  // Replace with your AWS region
});

let guessWord;
let userGuess;
let guessNumber;
const invokeLambda = async () => {
    const lambda = new AWS.Lambda();

    const inputData = {
        correct: guessWord,
        guessed: userGuess,
        intValue: guessNumber,
    };

    const payload = JSON.stringify(inputData);

    const invokeParams = {
        FunctionName: 'sendToESP32', // Replace with your Lambda function's name
        InvocationType: 'RequestResponse', // Change to 'Event' if you don't need a response
        Payload: payload,
    };

    try {
        const response = await lambda.invoke(invokeParams).promise();
        console.log('Lambda function response:', response.Payload);
    } catch (error) {
        console.error('Error invoking Lambda function:', error);
    }
};




async function getRandomWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const json_data = await response.json();
    //guessWord = JSON.stringify(json_data[0]);
    return json_data[0];
}

async function checkWordValidity(tempWord) {
    // Preprocessing word
    const websterApiKey = 'a8264111-b530-47b3-b2fd-dde224abc6d7';
    const lowercasedWord = tempWord.toLowerCase();

    try {
        const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${lowercasedWord}?key=${websterApiKey}`);
        const json_data = await response.json();

        if (Array.isArray(json_data) && json_data.length > 0 && 'meta' in json_data[0]) {
            //console.log(true);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking word validity:', error);
        return false;
    }
}

const getWord = async () => {
    let randomWord;
    guessNumber = 0;
    do {
        randomWord = await getRandomWord();
    } while (!(await checkWordValidity(randomWord)));
    console.log(randomWord);
    guessWord = randomWord;
    return randomWord;
}


const Keyboard = ({ updateGuess, getGuess }) => {
    const rows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM',
        'DELETE',
    ];


    const [message, setMessage] = useState(null);
    const [message_2, setMessage_2] = useState(null);

    const showMessage = (msg) => {
        setMessage(msg);
        // Clear the message after 3 seconds
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };
    const showMessage2 = (msg) => {
        setMessage_2(msg);
        // Clear the message after a certain time (e.g., 3 seconds)
        setTimeout(() => {
            setMessage_2(null);
        }, 3000);
    };

    const Send = async (getGuess) => {
        try {
            const result = await getGuess();
            console.log(result);

            const len = result.length;
            console.log(len);

            if (len !== 5) {
                console.log("Word is not 5 letters");
                showMessage("Word is not 5 letters!");

                // Clear the message after 3 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            } else {
                const valid = await checkWordValidity(result);
                console.log('The word 5 letters and real:', valid);
                console.log('The real word is:', guessWord);
                if (!valid) {
                    console.log("word is not valid");
                    showMessage("Word is not valid!");

                    // Clear the message after 3 seconds
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                } else {
                    guessNumber++;
                    userGuess = result;
                    if (guessNumber < 7) {
                        showMessage2("Word Submitted!");

                        // Clear the message after 3 seconds
                        setTimeout(() => {
                            setMessage_2(null);
                        }, 3000);
                        invokeLambda();
                    }
                }
                console.log('The guess number is:', guessNumber);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="keyboard">
            {message && <div className="message">{message}</div>}
            {message_2 && <div className="message-sent">{message_2}</div>}
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row === 'DELETE' ? (
                        <>
                            <button
                                key="Reset"
                                className="keyboard-button reset-button"
                                //onClick={() => Test(getGuess)}
                                onClick={() => getWord()}
                            >
                                Reset
                            </button>
                            <button
                                key="Enter"
                                className="keyboard-button enter-button"
                                //onClick={() => invokeLambda()}
                                onClick={() => Send(getGuess)}
                            >
                                Enter
                            </button>
                            <button
                                key={row}
                                className="keyboard-button delete-button"
                                onClick={() => updateGuess(0, 'DELETE')}
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        row.split('').map((letter, index) => (
                            <button
                                key={index}
                                className="keyboard-button"
                                onClick={() => updateGuess(index, letter)}
                            >
                                {letter}
                            </button>
                        ))
                    )}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;