import React from 'react';


// const Locations = ({ locationData, index }) => (
//     <div className="locations-item">
//         <div className="locations-item-content">

//             <p className="card-number">{index + 1}</p>

//             <p className='card-location'>{locationData.location}</p>
//             <h3 className='card-place'>{locationData.place}</h3>

//             <div className="card-ratings">
//                 <span className='bold'>Rating: {locationData.rating}</span>
//                 <p className='total_ratings'>| {locationData.ratingCount}</p>
//             </div>

//             <p className="card-status">Status: {locationData.status}</p>
//             <span className="circle" />
//         </div>
//     </div>

// );

const Locations = ({ item, index }) => (
    <div className="locations-item">
        <div className="locations-item-content">

            <p className="card-number">{index + 1}</p>

            <p className='card-location'>{item?.place_name}</p>
            <h3 className='card-place'>{item?.location}</h3>

            <div className="card-ratings">
                <span className='bold'>Rating: {item?.rating}</span>
                <p className='total_ratings'>| {item?.rating_count}</p>
            </div>

            <p className="card-status">Status: {item?.status}</p>
            <span className="circle" />
        </div>
    </div>

);

export default Locations