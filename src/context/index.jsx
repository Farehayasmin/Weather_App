import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Jaipur');
    const [thisLocation, setLocation] = useState('');

    // Fetch weather data
    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log('Weather data:', response.data);
            
            // Verify response data structure
            if (response.data && response.data.locations) {
                const thisData = Object.values(response.data.locations)[0];
                setLocation(thisData.address || 'Unknown Location');
                setValues(thisData.values || []);
                setWeather(thisData.values ? thisData.values[0] : {});
            } else {
                console.warn('Unexpected data format:', response.data);
                alert('Invalid data received from the weather service.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('This place does not exist or there was an error fetching the weather data.');
        }
    };

    // Fetch weather data when `place` changes
    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log('Updated values:', values);
    }, [values]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
