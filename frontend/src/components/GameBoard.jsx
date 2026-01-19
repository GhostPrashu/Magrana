import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Tile from './Tile';
import Timer from './Timer';

const GameBoard = ({ userId }) => {
    const [word, setWord] = useState('');
    const [items, setItems] = useState([]); // Array of objects {id, letter}
    const [roundId, setRoundId] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameActive, setGameActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Draggable sensors
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor)
    );

    const startNewRound = async () => {
        setLoading(true);
        setStatusMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/game/new?user_id=${userId}`);
            const data = await response.json();
            if (data.error) {
                setStatusMessage('Error starting game');
                return;
            }

            setWord(data.word);
            setRoundId(data.round_id);
            // Create items with unique IDs
            const scrambledChars = data.scrambled.split('');
            setItems(scrambledChars.map((char, index) => ({ id: `${char}-${index}`, letter: char })));

            setTimeLeft(60); // Configurable X seconds
            setGameActive(true);
        } catch (e) {
            setStatusMessage('Failed to fetch new round');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Check win condition
    useEffect(() => {
        if (!gameActive) return;

        const currentString = items.map(i => i.letter).join('');
        if (currentString === word) {
            handleRoundEnd(true);
        }
    }, [items, gameActive, word]);

    const handleRoundEnd = async (success) => {
        setGameActive(false);
        if (success) {
            // Calculate score
            // +1 for word, +0.1 per second saved
            const timeBonus = (timeLeft * 0.1);
            const roundScore = 1 + timeBonus;

            // Submit score
            try {
                await fetch('http://localhost:5000/api/game/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        round_id: roundId,
                        score: roundScore,
                        time_taken: 60 - timeLeft
                    })
                });
                setScore(s => s + roundScore);
                setStatusMessage(`Correct! You earned ${roundScore.toFixed(1)} points.`);
            } catch (e) {
                setStatusMessage(`Correct! But failed to save score.`);
            }
        } else {
            setStatusMessage(`Time's up! The word was ${word}.`);
        }
    };

    return (
        <div className="game-board" style={{ padding: '0 var(--gutter)' }}>
            <h2 style={{ color: 'var(--color-primary-main)' }}>Current Score: {score.toFixed(1)}</h2>
            <div className="controls" style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center' }}>
                {!gameActive && <button onClick={startNewRound} disabled={loading} className="btn-primary btn-lg">
                    {loading ? 'Loading...' : 'Start New Round'}
                </button>}
            </div>

            {gameActive && (
                <>
                    <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={() => handleRoundEnd(false)} active={gameActive} />
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
                            <div className="tiles-container">
                                {items.map((item) => (
                                    <Tile key={item.id} id={item.id} letter={item.letter} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </>
            )}

            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </div>
    );
};

export default GameBoard;
