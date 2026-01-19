import React from 'react';

const Share = ({ score }) => {
    const handleShare = () => {
        // Mock share functionality
        const text = `I just scored ${score} points in Magrana!`;
        if (navigator.share) {
            navigator.share({
                title: 'Magrana Game',
                text: text,
            }).catch(console.error);
        } else {
            alert(`Shared: "${text}" (Clipboard copy simulator)`);
        }
    };

    return (
        <button className="share-btn" onClick={handleShare}>
            Share Result
        </button>
    );
};

export default Share;
