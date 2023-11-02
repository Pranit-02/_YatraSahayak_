import React, { useRef } from 'react';
import Locations from './Locations';
import Hotels from './Hotels';
import Restaurants from './Restaurants';
import Bus from './Bus';
import { HiPaperAirplane } from 'react-icons/hi2'
import BusReturn from './BusReturn';
import { useLocation } from 'react-router-dom';
import Flight from './Flight';
import FlightReturn from './FlightReturn';
import Trains from './Trains';
import TrainsReturn from './TrainsReturn';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Itinerary = () => {
    const pdfRef = useRef();
    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 15;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('itinerary.pdf')

        });
    }
    const location = useLocation();
    const itineraryData = location.state?.itineraryData;

    if (!itineraryData) {
        return <div>No itinerary data available.</div>;
    }

    const transportationTypes = itineraryData?.itinerary.transportation?.map((item) => item?.type);
    const return_transportationTypes = itineraryData?.itinerary.return_transportation?.map((item) => item?.type);

    // Determine which mode has the lowest price for the initial and return journeys separately

    let lowestPriceModeInitial = '';
    let lowestPriceModeReturn = '';

    if (transportationTypes.includes('Bus')) {
        lowestPriceModeInitial = 'bus';
    } else if (transportationTypes.includes('Flight')) {
        lowestPriceModeInitial = 'flight';
    } else {
        lowestPriceModeInitial = 'train';
    }

    if (return_transportationTypes.includes('Bus')) {
        lowestPriceModeReturn = 'bus';
    } else if (return_transportationTypes.includes('Flight')) {
        lowestPriceModeReturn = 'flight';
    } else {
        lowestPriceModeReturn = 'train';
    }

    // Now you can render the appropriate component based on the lowest price mode


    return (
        <div className='container-new' ref={pdfRef}>
            <h1 className='head-1'>Travel in Mumbai</h1>
            <div className='sub-head'>
                <HiPaperAirplane className='sub-head-img' />
                <h3 className='head-2'>Itinerary</h3>
            </div>

            <div>
                {itineraryData?.itinerary.attractions?.length > 0 ? (
                    <div className="locations-container">
                        {itineraryData?.itinerary.attractions?.map((item, index) => (
                            <Locations key={index} item={item} index={index} />
                        ))}
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </div>
            <hr />

            <h2 className='all-sub-head'>Hotel:</h2>
            <div className='hotel-card'>
                {itineraryData?.itinerary.hotels?.map((item, index) => (
                    <Hotels key={index} item={item} />
                ))}
            </div>
            <hr />

            <h2 className='all-sub-head'>Restaurant:</h2>
            <div className='hotel-card'>
                {itineraryData?.itinerary.restaurants?.map((item, index) => (
                    <Restaurants key={index} item={item} />
                ))}
            </div>

            <hr />
            <h2 className="all-sub-head">Travel Details :</h2>
            <div className="travel-details">
                {/* <h2 className='all-sub-head'>Bus Details:</h2> */}
                <div className='bus-card'>

                    <div className="sub-card">
                        {/* <h2 className="head-4">📤Bus from initial location</h2> */}
                        {lowestPriceModeInitial === 'bus' &&
                            itineraryData?.itinerary.transportation?.map((item, index) => <Bus key={index} item={item} />)
                        }
                    </div>

                    <div className="sub-card">
                        {/* <h2 className="head-4">📥Bus while returning</h2> */}
                        {lowestPriceModeReturn === 'bus' &&
                            itineraryData?.itinerary.return_transportation?.map((item, index) => <BusReturn key={index} item={item} />)
                        }
                    </div>
                </div>

                {/* <hr /> */}

                {/* <h2 className='all-sub-head'>Flight Details:</h2> */}
                <div className='flight-card'>
                    <div className="sub-card">
                        {/* <h2 className="head-4">✈️ Flight from initial location</h2> */}
                        {lowestPriceModeInitial === 'flight' &&
                            itineraryData?.itinerary.transportation?.map((item, index) => <Flight key={index} item={item} />)
                        }
                    </div>

                    <div className="sub-card">
                        {/* <h2 className="head-4">✈️ Flight while returning</h2> */}
                        {lowestPriceModeReturn === 'flight' &&
                            itineraryData?.itinerary.return_transportation?.map((item, index) => <FlightReturn key={index} item={item} />)
                        }
                    </div>
                </div>

                {/* <hr /> */}

                {/* <h2 className='all-sub-head'>Trains:</h2> */}
                <div className="train-card">
                    <div className='sub-card'>
                        {/* <h2 className="head-4">🚊 Train from initial location</h2> */}
                        {lowestPriceModeInitial === 'train' &&
                            itineraryData?.itinerary.transportation?.map((item, index) => <Trains key={index} item={item} />)
                        }
                    </div>

                    <div className='sub-card'>
                        {/* <h2 className="head-4">🚊 Train while returning</h2> */}
                        {lowestPriceModeReturn === 'train' &&
                            itineraryData?.itinerary.return_transportation?.map((item, index) => <TrainsReturn key={index} item={item} />)
                        }
                    </div>
                </div>
            </div>
            <hr />
            <h1 className='all-sub-head'>Estimated Cost (INR)</h1>
            <p>Transportation: {itineraryData?.total_cost.transportation}</p>
            <p>Hotel: {itineraryData?.total_cost.hotel}</p>
            <p>Food: {itineraryData?.total_cost.food}</p>
            {/* <p>Attractions: {itineraryData?.total_cost.attractions}</p> */}
            <p>Total Cost: {itineraryData?.total_cost.total}</p>

            <hr />

            <div className="link-button1">
                <a href="/">Generate Again</a> <span />
                <button onClick={downloadPDF}>Download Itinerary (PDF)</button>
            </div>
        </div>
    );
}

export default Itinerary;
