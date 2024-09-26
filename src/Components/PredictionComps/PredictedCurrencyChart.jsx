import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const PredictedCurrencyChart = () => {
    const [data, setData] = useState({});
    const [currency, setCurrency] = useState('USD');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [plotType, setPlotType] = useState('Line Plot');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/predict', {
                currency: currency,
                end_date: endDate,
            });

            console.log("API Response:", response.data);
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching predicted exchange rate data:", error);
            setError(error.response ? error.response.data.error : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currency, endDate]);

    const groupDataByPeriod = (data) => {
        const groupedData = {};
        
        if (!data.forecast || !Array.isArray(data.forecast.ds) || !Array.isArray(data.forecast.yhat)) {
            console.warn("Forecast data is not structured correctly.");
            return [];
        }

        for (let i = 0; i < data.forecast.ds.length; i++) {
            const date = new Date(data.forecast.ds[i]);
            const predictedValue = data.forecast.yhat[i];
            const lowerBound = data.forecast.yhat_lower[i];
            const upperBound = data.forecast.yhat_upper[i];

            const periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!groupedData[periodKey]) {
                groupedData[periodKey] = { total: 0, count: 0, lower: 0, upper: 0 };
            }
            groupedData[periodKey].total += predictedValue;
            groupedData[periodKey].lower += lowerBound;
            groupedData[periodKey].upper += upperBound;
            groupedData[periodKey].count += 1;
        }

        return Object.entries(groupedData).map(([key, value]) => ({
            Date: key,
            PredictedValue: value.count > 0 ? value.total / value.count : 0,
            LowerBound: value.count > 0 ? value.lower / value.count : 0,
            UpperBound: value.count > 0 ? value.upper / value.count : 0,
        }));
    };

    const plotPredictedValues = () => {
        if (!data.forecast || !Array.isArray(data.forecast.ds) || !Array.isArray(data.forecast.yhat)) {
            console.warn("No data available for plotting.");
            return null;
        }

        const groupedData = groupDataByPeriod(data);
        console.log("Grouped Data:", groupedData);
        const xValues = groupedData.map(entry => entry.Date);
        const yValues = groupedData.map(entry => entry.PredictedValue);
        const yLowerBounds = groupedData.map(entry => entry.LowerBound);
        const yUpperBounds = groupedData.map(entry => entry.UpperBound);

        if (xValues.length === 0 || yValues.length === 0) {
            console.warn("No values to plot.");
            return null;
        }

        return (
            <Plot
                data={[
                    {
                        x: xValues,
                        y: yValues,
                        type: plotType === 'Bar Plot' ? 'bar' : plotType === 'Scatter Plot' ? 'scatter' : 'line',
                        mode: plotType === 'Scatter Plot' ? 'markers' : 'lines',
                        marker: { color: 'blue' },
                        name: 'Predicted Value',
                    },
                    {
                        x: xValues,
                        y: yLowerBounds,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: 'green', dash: 'dash' },
                        name: 'Lower Bound',
                    },
                    {
                        x: xValues,
                        y: yUpperBounds,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: 'red', dash: 'dash' },
                        name: 'Upper Bound',
                    },
                ]}
                layout={{
                    title: `Predicted Currency Value Over Time (Monthly)`,
                    xaxis: { title: 'Date' },
                    yaxis: { title: `Predicted Value (${currency})` },
                    showlegend: true,
                }}
            />
        );
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Predicted Currency Value Chart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Currency:
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {currencies.map(({ symbol, name }) => (
                                <option key={symbol} value={symbol}>
                                    {`${name} (${symbol})`}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        End Date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Plot Type:
                        <select
                            value={plotType}
                            onChange={(e) => setPlotType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Line Plot">Line Plot</option>
                            <option value="Bar Plot">Bar Plot</option>
                            <option value="Scatter Plot">Scatter Plot</option>
                        </select>
                    </label>
                </div>
            </div>
            {loading && <div className="text-center text-blue-500">Loading data...</div>}
            {error && (
                <div className="text-red-500 text-center">
                    {error}
                    <button onClick={fetchData} className="mt-2 text-blue-600">Retry</button>
                </div>
            )}
            <div className="mt-6">
                {plotPredictedValues()}
            </div>
        </div>
    );
};

export default PredictedCurrencyChart;
