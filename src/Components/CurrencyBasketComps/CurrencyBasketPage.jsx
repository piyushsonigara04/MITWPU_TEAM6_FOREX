import React, { useState } from 'react';
import axios from 'axios';

const CurrencyBasketPage = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [numCurrencies, setNumCurrencies] = useState(2);
  const [currenciesList, setCurrenciesList] = useState([
    { country: 'INR', weight: 40 },
    { country: 'EUR', weight: 60 },
  ]);
  const [convertedValue, setConvertedValue] = useState(null);
  const [error, setError] = useState(null);

  // Handle number of currencies change
  const handleNumCurrenciesChange = (e) => {
    const newNumCurrencies = parseInt(e.target.value);
    setNumCurrencies(newNumCurrencies);

    const updatedList = [...currenciesList];

    if (newNumCurrencies > currenciesList.length) {
      for (let i = currenciesList.length; i < newNumCurrencies; i++) {
        updatedList.push({ country: 'USD', weight: 0 });
      }
    } else if (newNumCurrencies < currenciesList.length) {
      updatedList.length = newNumCurrencies;
    }
    setCurrenciesList(updatedList);
  };

  // Handle changes to selected country
  const handleCountryChange = (index, value) => {
    const updatedList = [...currenciesList];
    updatedList[index].country = value;
    setCurrenciesList(updatedList);
  };

  // Handle changes to the weight of each currency
  const handleWeightChange = (index, value) => {
    const updatedList = [...currenciesList];
    updatedList[index].weight = parseFloat(value);
    setCurrenciesList(updatedList);
  };

  // Handle form submission to calculate the currency basket
  const handleSubmit = async () => {
    try {
      // Prepare data for API request
      const selectedCurrencies = currenciesList.map(item => item.country);
      const weights = currenciesList.map(item => item.weight);

      // Make POST request to the backend API
      const response = await axios.post('http://localhost:5000/api/currency-basket', {
        baseCurrency,
        selectedCurrencies,
        weights
      });

      // Handle successful response
      setConvertedValue(response.data.totalValue);
      setError(null);
    } catch (error) {
      // Handle error response
      setError(error.response?.data?.error || 'An error occurred');
      setConvertedValue(null);
    }
  };

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Currency Basket</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter Base Currency:
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter Number of Currency Denominations:
            <input
              type="number"
              value={numCurrencies}
              onChange={handleNumCurrenciesChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </label>
        </div>
      </div>

      {currenciesList.map((currencyItem, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Country {index + 1}:
              <select
                value={currencyItem.country}
                onChange={(e) => handleCountryChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency.symbol} value={currency.symbol}>
                    {currency.symbol} - {currency.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Weightage (%):
              <input
                type="number"
                value={currencyItem.weight}
                onChange={(e) => handleWeightChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm"
      >
        Convert
      </button>

      <div className="mt-6">
        {error && <p className="text-red-600">{error}</p>}
        {convertedValue !== null ? (
          <p className="text-lg font-semibold">
            Converted Value: {convertedValue.toFixed(2)} {baseCurrency}
          </p>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default CurrencyBasketPage;




