import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Tile = ({ id, letter }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: '60px',
        height: '60px',
        backgroundColor: 'var(--color-neutral-light-4)',
        border: '2px solid var(--color-primary-main)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'var(--color-primary-dark)',
        cursor: 'grab',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        userSelect: 'none',
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="tile"
        >
            {letter}
        </div>
    );
};

export default Tile;
