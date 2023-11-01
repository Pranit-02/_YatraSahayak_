import React from 'react';


const Flight = ({ item }) => (
    <div className="card">
        <div className="card-content">
            <div className="all-tags">
                <div className="box">
                    {item?.type}
                </div>
                <div className="box">
                    {item?.card_state}
                </div>
            </div>

            <h2 className="card-title">{item?.airline}</h2>

            <div className="item?s-info">
                <p><b>Duration:</b> {item?.duration}</p>
                <p><b>Departure-time:</b> {item?.departure_time}</p>
                <p><b>Destination-time:</b> {item?.destination_time}</p>
                <p><b>Departure-date:</b> {item?.departure_date}</p>
                <p><b>Destination-date:</b> {item?.destination_date}</p>
            </div>
            <div className="dest">
                <p><b>Destination:</b> {item?.destination}</p>
                <p><b>Departure:</b> {item?.departure}</p>
            </div>
            <p className="price">Price: ₹ {item?.price}</p>
        </div>
    </div>
);

export default Flight
