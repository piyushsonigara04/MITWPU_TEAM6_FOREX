import React, { useState } from "react";
import axios from "axios";
import Plot from 'react-plotly.js';  // Import Plot component from react-plotly.js

const Volatility = () => {
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("EUR");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [volatilityData, setVolatilityData] = useState(null);
  const [error, setError] = useState("");

  const currencies = [
    { symbol: 'DZD', name: 'Algerian dinar' },
    { symbol: 'AUD', name: 'Australian dollar' },
    { symbol: 'BRL', name: 'Brazilian real' },
    { symbol: 'CAD', name: 'Canadian dollar' },
    { symbol: 'CNY', name: 'Chinese yuan' },
    { symbol: 'CZK', name: 'Czech koruna' },
    { symbol: 'DKK', name: 'Danish krone' },
    { symbol: 'EUR', name: 'Euro' },
    { symbol: 'INR', name: 'Indian rupee' },
    { symbol: 'JPY', name: 'Japanese yen' },
    { symbol: 'MXN', name: 'Mexican peso' },
    { symbol: 'NZD', name: 'New Zealand dollar' },
    { symbol: 'NOK', name: 'Norwegian krone' },
    { symbol: 'RUB', name: 'Russian ruble' },
    { symbol: 'ZAR', name: 'South African rand' },
    { symbol: 'KRW', name: 'South Korean won' },
    { symbol: 'SEK', name: 'Swedish krona' },
    { symbol: 'CHF', name: 'Swiss franc' },
    { symbol: 'TWD', name: 'Taiwan dollar' },
    { symbol: 'THB', name: 'Thai baht' },
    { symbol: 'GBP', name: 'British pound' },
    { symbol: 'USD', name: 'U.S. dollar' },
    { symbol: 'HKD', name: 'Hong Kong dollar' },
    { symbol: 'SGD', name: 'Singapore dollar' }
  ];

  const fetchVolatility = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/volatility", {
        params: {
          currency_1: currency1,
          currency_2: currency2,
          start_date: startDate,
          end_date: endDate,
        },
      });
      setVolatilityData(response.data);
      setError(""); // Reset error
    } catch (err) {
      setError("Error fetching volatility data. Please check the inputs.");
      console.error("Error fetching volatility data:", err);
    }
  };

  return (
    <div className="w-[86%] mx-auto my-8 p-4 border rounded-lg shadow-lg bg-white overflow-y-scroll">
      <h1 className="text-3xl font-bold text-center">Volatility</h1>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Currency 1:</label>
        <select
          value={currency1}
          onChange={(e) => setCurrency1(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {currencies.map(({ symbol, name }) => (
            <option key={symbol} value={symbol}>
              {`${name} (${symbol})`}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mt-4">Currency 2:</label>
        <select
          value={currency2}
          onChange={(e) => setCurrency2(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {currencies.map(({ symbol, name }) => (
            <option key={symbol} value={symbol}>
              {`${name} (${symbol})`}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mt-4">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />

        <button
          onClick={fetchVolatility}
          className="bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white px-4 py-2 shadow-sm mt-4 transition duration-300"
        >
          Get Volatility
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {volatilityData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Volatility Data:</h2>
          {/* <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(volatilityData, null, 2)}</pre> */}

          {volatilityData.graph && (
            <div className="mt-4">
              <Plot
                data={JSON.parse(volatilityData.graph).data}
                layout={JSON.parse(volatilityData.graph).layout}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Volatility;
