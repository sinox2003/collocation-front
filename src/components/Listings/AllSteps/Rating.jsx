import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ rating, updateFormData, element, totalStars = 5 }) => {
    const [hover, setHover] = useState(0);


    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {Array.from({ length: totalStars }, (v, i) => i + 1).map((star) => (
                <FaStar
                    key={star}
                    size={30}
                    style={{ marginRight: 10, cursor: 'pointer' }}
                    color={star <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                    onClick={() => updateFormData(element, star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                />
            ))}
        </div>
    );
};

export default Rating;
