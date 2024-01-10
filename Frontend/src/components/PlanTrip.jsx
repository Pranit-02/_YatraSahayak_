import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

function formatDateToDDMMYYYY(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

function PlanTrip() {
    const [itineraryData, setItineraryData] = useState(null);
    const [transportationType, setTransportationType] = useState('bus');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const requestData = Object.fromEntries(formData.entries());
        console.log(requestData);

        requestData.budget = parseInt(requestData.budget, 10);
        requestData.num_travelers = parseInt(requestData.num_travelers, 10);
        requestData.duration_of_stay = parseInt(requestData.duration_of_stay, 10);
        requestData.date_of_departure = formatDateToDDMMYYYY(requestData.date_of_departure);
        requestData.date_of_return = formatDateToDDMMYYYY(requestData.date_of_return);

        try {
            const response = await axios.post('http://localhost:4000/generate-itinerary', requestData);

            // if (response.data.total_cost.total > requestData.budget) {
            //     setError('Total cost exceeds the budget. Please increase your budget.');
            //     setItineraryData(null);
            // } else {
            setItineraryData(response.data);
            setSuccess('Itinerary is generated, click on view itinerary');
            console.log(itineraryData);
            setError(null);

            navigate('/Itinerary', { state: { itineraryData: response.data } });
            // }
        } catch (err) {
            setError('Unable to generate itinerary. Please check your input.');
            setItineraryData(null);
        } finally {
            setIsLoading(false); // Set loading to false after the request is complete
        }
    };
    const [start_location, setStart_location] = useState('');
    const handleStart_location = (event) => {
        setStart_location(event.target.value);
    };

    const [destination, setDestination] = useState('');
    const handleDestination = (event) => {
        setDestination(event.target.value);
    };

    //Date
    const [date_of_departure, setDate_of_departure] = useState('');
    const [date_of_return, setDate_of_return] = useState('');

    //Count Days
    const [duration_of_stay, setDuration_of_stay] = useState(1);

    const handleIncrement = () => {
        setDuration_of_stay(prevDuration_of_stay => prevDuration_of_stay + 1);
    };

    const handleDecrement = () => {
        if (duration_of_stay > 1) {
            setDuration_of_stay(prevDuration_of_stay => prevDuration_of_stay - 1);
        }
    };

    //Price
    const [budget, setBudget] = useState('');

    const handleChange = (event) => {
        const inputValue = event.target.value;
        if (/^\d*$/.test(inputValue)) {
            setBudget(Number(inputValue));
        }
    };


    //No of people
    const [num_travelers, setNum_travelers] = useState(1);

    const handleNum_travelers = (event) => {
        const num_travelers = event.target.value;

        // Validate the input value.
        if (num_travelers < 0) {
            // Set the value of the input field to 0.
            event.target.value = 0;
        } else if (num_travelers > 15) {
            // Set the value of the input field to 15.
            event.target.value = 15;
        }
    };

    const handleTransportationChange = (event) => {
        setTransportationType(event.target.value);
    };

    // Create a new state variable to store the minimum date (tomorrow)
    const [minDate, setMinDate] = useState('');

    // Update the minimum date when the component mounts
    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
        const day = tomorrow.getDate().toString().padStart(2, '0');
        const formattedTomorrow = `${year}-${month}-${day}`;
        setMinDate(formattedTomorrow);
    }, []);

    // Create a new state variable to store the calculated duration of stay
    const [calculatedDuration, setCalculatedDuration] = useState('');

    // Update the calculated duration when departure and return dates change
    useEffect(() => {
        if (date_of_departure && date_of_return) {
            const departureDate = new Date(date_of_departure);
            const returnDate = new Date(date_of_return);
            const timeDifference = returnDate.getTime() - departureDate.getTime();
            const duration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days
            setCalculatedDuration(duration);
        }
    }, [date_of_departure, date_of_return]);

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <section className='trip-content'>
                    
                    <h1>Tell us your travel preferences</h1>

                    <p className='mid-text'>What is the starting location ?</p>
                    <div>
                        <select className='drop-down' name="start_location" required>
                            <option value="">Select City</option>
                            {/* <option value="Ahamdabad" name="start_location">Ahamdabad</option> */}
                            <option value="Bengaluru" name="start_location">Bengaluru</option>
                            <option value="Delhi" name="start_location">Delhi</option>
                            <option value="Indore" name="start_location">Indore</option>
                            <option value="Kolhapur" name="start_location">Kolhapur</option>
                            <option value="Nagpur" name="start_location">Nagpur</option>
                            <option value="Nashik" name="start_location">Nashik</option>
                            <option value="Panaji" name="start_location">Panaji</option>
                            <option value="Pune" name="start_location">Pune</option>

                        </select>
                    </div>
                    <p className='mid-text'>What is the transportation preference ?</p>
                    <div>
                        <select
                            className='drop-down'
                            name="transportationType"
                            value={transportationType}
                            onChange={handleTransportationChange}
                            required
                        >
                            <option value="bus">Bus</option>
                            <option value="train">Train</option>
                            <option value="flight">Flight</option>
                        </select>
                    </div>
                    <hr />

                    <p className='mid-text'>What is destination of choice ?</p>
                    <div>
                        <select className='drop-down' name="destination" required>
                            <option value="">Select City</option>
                            <option value="Mumbai" name="destination">Mumbai</option>

                        </select>
                    </div>
                    <hr />

                    <p className='mid-text'>When are you planning to travel ?</p>


                    <div className="datePickerDiv">
                        <input
                            type='date'
                            name="date_of_departure"
                            className='Date'
                            value={date_of_departure}
                            onChange={(event) => setDate_of_departure(event.target.value)}
                            required
                            // min={minDate} // Set the min attribute using ISO date format
                        />
                        <input
                            type='date'
                            name="date_of_return"
                            className='Date'
                            value={date_of_return}
                            onChange={(event) => setDate_of_return(event.target.value)}
                            min={date_of_departure}
                            required
                        />
                    </div>


                    <hr />

                    <p className='mid-text'>How many days are you planning to travel ?</p>
                    <div className='day-count'>
                        <p>Days:</p>
                        <input type="text" name="duration_of_stay" value={calculatedDuration} readOnly />
                    </div>
                    <hr />

                    <p className='mid-text'>What's your budget ?</p>
                    <p>The budget is exclusively allocated for travelling and dining purposes.</p>

                    <input
                        id="budget"
                        name="budget"
                        type="text"
                        onChange={handleChange}
                        required
                    />


                    <hr />

                    <p className='mid-text'>What is the number of people travelling ?</p>
                    <div className='people-count'>
                        <input
                            id="num_travelers"
                            name="num_travelers"
                            type="number"
                            onChange={handleNum_travelers}
                            required
                            min="0"
                            max="15"
                        />
                    </div>

                </section>

                <div className='submit'>
                    <button type="submit" className='btn-submit'>Submit</button>
                </div>

            </form>
            {isLoading && <Loading />}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}

        </div>
    );
}

export default PlanTrip