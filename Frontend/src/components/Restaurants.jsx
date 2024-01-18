import React from 'react';


const Restaurants = ({ item, isSelected, onSelect }) => (
    <div className={`card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
        <div className="card-content">
            <h2 className="card-title">{item?.restaurant}</h2>
            <p>Rating: {item?.ratings}</p>
            <p className="price">Price: ₹ {item?.price}</p>
            <div className="res-location">
                <p><b>Location :</b></p>
                <div className="locate">
                    <p>Landmark: {item?.location?.landmark}</p>
                    <p>City : {item?.location?.city}</p>
                    <p>Main-city : {item?.location?.main_city}</p>
                </div>
            </div>
            <div className="res-cuisine">
                <p><b>Cuisine :</b></p>
                <div className="cuisine">
                    <p>1 : {item?.cuisine["1"]}</p>
                    <p>2 : {item?.cuisine["2"]}</p>
                    <p>3 : {item?.cuisine["3"]}</p>
                    <p>4 : {item?.cuisine["4"]}</p>
                    <p>5 : {item?.cuisine["5"]}</p>
                </div>
            </div>
        </div>
    </div>
);

export default Restaurants
