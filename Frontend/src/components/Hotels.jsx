import React from 'react';

const Hotels = ({ item, isSelected, onSelect}) => (
    <div className={`card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
        <div className="card-content">
            <h2 className="card-title">{item?.hotel_name}</h2>
            <p className="card-location">{item?.location}</p>
            <div className="card-details">
                <p><b>Check-In:</b> {item?.checkin}</p>
                <p><b>Check-Out:</b> {item?.checkout}</p>
                <p><b>Score:</b> {item?.score}</p>
                <p><b>Price for:</b> {item?.price_for}</p>
            </div>
        </div>

        <div className="review">
            <p><b>Reviews Count:</b> {item?.reviews_count}</p>
            <p className="avg-review">{item?.avg_review}</p>
            <p className="price">Price: ₹ {item?.price}</p>
        </div>

        <div className="availability">
            <p className="availability-text">Availability: Check on Booking.com</p>
        </div>

        <div className="link-button">
            <a
                href={item?.map_link} target='_blank'>Check</a>
        </div>
    </div>
);

export default Hotels