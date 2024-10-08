import React, { useState } from 'react';
import axios from 'axios';

const SimActivation = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [simDetails, setSimDetails] = useState(null);
    const [error, setError] = useState(''); 
    
  
    const API_URL = process.env.REACT_APP_API_URL;

    const handleActivate = async () => {
     
        setMessage('');
        setError('');

      
        if (!phoneNumber) {
            setError('Phone number is required.'); 
            return; 
        }

        try {
           
            const response = await axios.get(`${API_URL}/phone/${phoneNumber}`);
            if (response.data) {
             
                const simResponse = await axios.post(`${API_URL}/activate`, { simNumber: response.data.simNumber });
                setMessage(`SIM activated successfully: ${simResponse.data.simNumber}`);
                fetchSimDetails(phoneNumber);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
              
                const newSim = {
                    simNumber: generateSimNumber(),
                    phoneNumber: phoneNumber,
                    status: 'active',
                    activationDate: new Date(),
                };
                try {
                    const createResponse = await axios.post(`${API_URL}`, newSim);
                    setMessage(`New SIM created and activated: ${createResponse.data.simNumber}`);
                    fetchSimDetails(phoneNumber);
                } catch (createError) {
                    setMessage(`Error creating SIM: ${createError.response.data.error}`);
                }
            } else {
                setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
            }
        }
    };

    const fetchSimDetails = async (phoneNumber) => {
        try {
            const response = await axios.get(`${API_URL}/phone/${phoneNumber}`);
            setSimDetails(response.data);
        } catch (error) {
            setSimDetails(null);
            setMessage(`Error fetching SIM details: ${error.response ? error.response.data.error : error.message}`);
        }
    };

    const generateSimNumber = () => {
        return 'SIM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    return (
        <div>
            <h2>Activate SIM</h2>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
                required 
            />
            <button onClick={handleActivate}>Activate SIM</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {message && <p>{message}</p>}
            {simDetails && (
                <div>
                    <h3>SIM Details</h3>
                    <p>SIM Number: {simDetails.simNumber}</p>
                    <p>Phone Number: {simDetails.phoneNumber}</p>
                    <p>Status: {simDetails.status}</p>
                    <p>Activation Date: {simDetails.activationDate ? new Date(simDetails.activationDate).toLocaleString() : 'N/A'}</p>
                </div>
            )}
        </div>
    );
};

export default SimActivation;
