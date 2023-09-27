import React, { useState } from 'react';
import './App.css';
import GameBoard from './Gameboard';
import Keyboard from './Keyboard';

function App() {
  const [targetWord, setTargetWord] = useState('WORDLE'); // Replace with your target word logic
  const [guesses, setGuesses] = useState([]);

  const handleLetterClick = (letter) => {
    if (letter === 'DELETE') {
      // Handle delete button click by removing the last guess
      if (guesses.length > 0) {
        const updatedGuesses = [...guesses];
        updatedGuesses.pop(); // Remove the last guess
        setGuesses(updatedGuesses);
      }
    } else {
      // Handle regular letter click by adding the letter to guesses
      setGuesses([...guesses, letter]);
    }
  };

  return (
    <div className="App">
      <h1>Interactive Wordle</h1>
      <GameBoard targetWord={targetWord} guesses={guesses} />
      <Keyboard onClick={handleLetterClick} />
    </div>
  );
}

export default App;