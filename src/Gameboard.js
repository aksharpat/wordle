import React, { useState } from 'react';
import Keyboard from './Keyboard';

const GameBoard = ({ targetWord }) => {
    const [guesses, setGuesses] = useState(['', '', '', '', '']);
    const [lastNonEmptyIndex, setLastNonEmptyIndex] = useState(-1);

    var guess = [...guesses];
    const updateGuess = (index, letter) => {
        if (index >= 0) {
            const updatedGuesses = [...guesses];
            if (letter === 'DELETE') {
                if (lastNonEmptyIndex >= 0) {
                    updatedGuesses[lastNonEmptyIndex] = '';
                    setLastNonEmptyIndex(findLastNonEmptyIndex(updatedGuesses));
                }
            }
            else {
                if (lastNonEmptyIndex < guesses.length - 1) {
                    updatedGuesses[lastNonEmptyIndex + 1] = letter;
                    setLastNonEmptyIndex(findLastNonEmptyIndex(updatedGuesses));
                }
            }
            setGuesses(updatedGuesses);
            guess = updatedGuesses;
        } else {
            setLastNonEmptyIndex(-1);
            setGuesses(['', '', '', '', ''])
        }
    };

    const getGuess = async () => {
        return guess.join("");
    }
    const clearGuess = async () => {
        setGuesses(['', '', '', '', '']);
        return 0;
    }

    const findLastNonEmptyIndex = (guessArray) => {
        for (let i = guessArray.length - 1; i >= 0; i--) {
            if (guessArray[i] !== '') {
                return i;
            }
        }
        return -1; // Return -1 if no non-empty index is found
    };

    return (
        <div className="game-board">
            <div className="target-word">
                {guesses.map((letter, index) => (
                    <div key={index} className="letter-box">
                        {letter}
                    </div>
                ))}
            </div>
            <Keyboard updateGuess={updateGuess} getGuess={getGuess} clearGuess={clearGuess} />
        </div>
    );
};

export default GameBoard;