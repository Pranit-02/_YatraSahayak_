import React from 'react';


const TrainsReturn = ({ item }) => (
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
            <h2 className="card-title">{item?.name}</h2>
            <div className="train-info">
                <p><b>Train no:</b> {item?.number}</p>
                <p><b>Duration:</b> {item?.duration}</p>
                <p><b>Departure-time:</b> {item?.departure_time}</p>
                <p><b>Destination-time:</b> {item?.destination_time}</p>
                <p><b>Departure-station</b> {item?.departure_station}</p>
                <p><b>Destination-station:</b> {item?.destination_station}</p>
                <p><b>Departure-date:</b> {item?.departure_date}</p>
                <p><b>Destination-date:</b> {item?.destination_date}</p>
                <p><b>Duration-minutes:</b> {item?.duration_minutes}</p>
            </div>
            <p className="price">Price: ₹ {item?.price}</p>
        </div>
    </div>
);

export default TrainsReturn