import React, { useState } from 'react';

const Index = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [exchangeRates, setExchangeRates] = useState([]);
    const [error, setError] = useState(null);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const fetchExchangeRates = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/current_rates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selected_date: selectedDate }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setExchangeRates(data.exchange_rates);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchExchangeRates();
    };

    return (
        <div className="w-[86%] overflow-y-scroll p-4">
            <h1 className="text-xl font-bold mb-4">Currency Exchange Rates</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <label htmlFor="date" className="mr-2">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border border-gray-300 p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Get Rates
                </button>
            </form>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Country</th>
                        <th className="border border-gray-300 px-4 py-2">Currency</th>
                        <th className="border border-gray-300 px-4 py-2">Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {exchangeRates.length > 0 ? (
                        exchangeRates.map(({ Country, Currency, Rate }) => (
                            <tr key={Currency} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{Country}</td>
                                <td className="border border-gray-300 px-4 py-2">{Currency}</td>
                                <td className="border border-gray-300 px-4 py-2">{Rate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center border border-gray-300 px-4 py-2">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Index;
