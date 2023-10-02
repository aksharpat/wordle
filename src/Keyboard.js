import React from 'react';

const Keyboard = ({ updateGuess }) => {
    const rows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM',
        'DELETE',
    ];

    return (
        <div className="keyboard">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row === 'DELETE' ? (
                        <>
                            <button
                                key="Enter"
                                className="keyboard-button enter-button"

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