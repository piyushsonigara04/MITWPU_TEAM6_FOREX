

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Plot from 'react-plotly.js';

// const MainChart = () => {
//     const [data, setData] = useState([]);
//     const [currency, setCurrency] = useState('USD');
//     const [period, setPeriod] = useState('Yearly');
//     const [plotType, setPlotType] = useState('Line Plot');

//     const fetchData = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/exchange-rates');
//             let fetchedData = response.data;

//             if (typeof fetchedData === 'string') {
//                 try {
//                     const sanitizedData = fetchedData.replace(/NaN/g, "null");
//                     fetchedData = JSON.parse(sanitizedData);
//                 } catch (parseError) {
//                     console.error("Error parsing response data as JSON:", parseError);
//                     return;
//                 }
//             }

//             if (Array.isArray(fetchedData)) {
//                 setData(fetchedData);
//             } else {
//                 console.error("Expected an array but got:", typeof fetchedData);
//             }
//         } catch (error) {
//             console.error("Error fetching exchange rate data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // Function to group data by period
//     const groupDataByPeriod = (data, period) => {
//         const groupedData = {};
//         data.forEach(entry => {
//             const date = new Date(entry.Date);
//             console.log(entry);
//             let periodKey;

//             switch (period) {
//                 case 'Yearly':
//                     periodKey = date.getFullYear();
//                     break;
//                 case 'Monthly':
//                     periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
//                     break;
//                 case 'Weekly':
//                     const weekNumber = Math.floor(date.getDate() / 7);
//                     periodKey = `${date.getFullYear()}-W${weekNumber + 1}`; // YYYY-WN
//                     break;
//                 case 'Quarterly':
//                     periodKey = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`; // YYYY-QN
//                     break;
//                 default:
//                     break;
//             }

//             if (!groupedData[periodKey]) {
//                 groupedData[periodKey] = { total: 0, count: 0 };
//             }
//             groupedData[periodKey].total += entry[currency];
//             groupedData[periodKey].count += 1;
//         });

//         return Object.entries(groupedData).map(([key, value]) => ({
//             Date: key,
//             [currency]: value.total / value.count // Average exchange rate
//         }));
//     };

//     const plotExchangeRate = () => {
//         if (data.length === 0) return null;

//         const validData = data.filter(entry => !isNaN(entry[currency]) && entry.Date);
//         const groupedData = groupDataByPeriod(validData, period);

//         const xValues = groupedData.map(entry => entry.Date);
//         const yValues = groupedData.map(entry => entry[currency]);

//         return (
//             <Plot
//                 data={[
//                     {
//                         x: xValues,
//                         y: yValues,
//                         type: plotType === 'Bar Plot' ? 'bar' : plotType === 'Scatter Plot' ? 'scatter' : 'line',
//                         mode: plotType === 'Scatter Plot' ? 'markers' : 'lines',
//                         marker: { color: 'blue' },
//                     },
//                 ]}
//                 layout={{
//                     title: `Exchange Rate of ${currency} Over Time (${period})`,
//                     xaxis: { title: 'Date' },
//                     yaxis: { title: 'Exchange Rate' },
//                 }}
//             />
//         );
//     };

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-6 text-center">Currency Exchange Rate Chart</h1>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Select Currency:
//                         <input
//                             type="text"
//                             value={currency}
//                             onChange={(e) => setCurrency(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                     </label>
//                 </div>
//                 <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Select Period:
//                         <select
//                             value={period}
//                             onChange={(e) => setPeriod(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         >
//                             <option value="Yearly">Yearly</option>
//                             <option value="Monthly">Monthly</option>
//                             <option value="Weekly">Weekly</option>
//                             <option value="Quarterly">Quarterly</option>
//                         </select>
//                     </label>
//                 </div>
//                 <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Select Plot Type:
//                         <select
//                             value={plotType}
//                             onChange={(e) => setPlotType(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         >
//                             <option value="Line Plot">Line Plot</option>
//                             <option value="Bar Plot">Bar Plot</option>
//                             <option value="Scatter Plot">Scatter Plot</option>
//                         </select>
//                     </label>
//                 </div>
//             </div>
//             <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
//                 {plotExchangeRate()}
//             </div>
//         </div>
//     );
// };

// export default MainChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const MainChart = () => {
    const [data, setData] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [period, setPeriod] = useState('Yearly');
    const [plotType, setPlotType] = useState('Line Plot');
    const [startDate, setStartDate] = useState('2020-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [movingAverage, setMovingAverage] = useState(false);
    const [highestRate, setHighestRate] = useState(null);
    const [lowestRate, setLowestRate] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/exchange-rates');
            let fetchedData = response.data;

            if (typeof fetchedData === 'string') {
                try {
                    const sanitizedData = fetchedData.replace(/NaN/g, "null");
                    fetchedData = JSON.parse(sanitizedData);
                } catch (parseError) {
                    console.error("Error parsing response data as JSON:", parseError);
                    return;
                }
            }

            if (Array.isArray(fetchedData)) {
                setData(fetchedData);
            } else {
                console.error("Expected an array but got:", typeof fetchedData);
            }
        } catch (error) {
            console.error("Error fetching exchange rate data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupDataByPeriod = (data, period) => {
        const groupedData = {};
        data.forEach(entry => {
            const date = new Date(entry.Date);
            let periodKey;

            switch (period) {
                case 'Yearly':
                    periodKey = date.getFullYear();
                    break;
                case 'Monthly':
                    periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
                    break;
                case 'Weekly':
                    const weekNumber = Math.floor(date.getDate() / 7);
                    periodKey = `${date.getFullYear()}-W${weekNumber + 1}`; // YYYY-WN
                    break;
                case 'Quarterly':
                    periodKey = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`; // YYYY-QN
                    break;
                default:
                    break;
            }

            if (!groupedData[periodKey]) {
                groupedData[periodKey] = { total: 0, count: 0 };
            }
            groupedData[periodKey].total += entry[currency];
            groupedData[periodKey].count += 1;
        });

        return Object.entries(groupedData).map(([key, value]) => ({
            Date: key,
            [currency]: value.total / value.count // Average exchange rate
        }));
    };

    const filterDataByDate = (data) => {
        return data.filter(entry => {
            const entryDate = new Date(entry.Date);
            return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });
    };

    const calculateMovingAverage = (data, windowSize) => {
        let movingAvg = [];
        for (let i = 0; i < data.length; i++) {
            if (i >= windowSize - 1) {
                let avg = data.slice(i - windowSize + 1, i + 1).reduce((sum, val) => sum + val, 0) / windowSize;
                movingAvg.push(avg);
            } else {
                movingAvg.push(null);
            }
        }
        return movingAvg;
    };

    const plotExchangeRate = () => {
        if (data.length === 0) return null;

        const validData = data.filter(entry => !isNaN(entry[currency]) && entry.Date);
        const filteredData = filterDataByDate(validData);
        const groupedData = groupDataByPeriod(filteredData, period);

        const xValues = groupedData.map(entry => entry.Date);
        const yValues = groupedData.map(entry => entry[currency]);

        // Calculate highest and lowest rates within the date range
        const highestRateValue = Math.max(...yValues);
        const lowestRateValue = Math.min(...yValues);
        
        // Update rates only if they change to prevent re-renders
        if (highestRate !== highestRateValue) {
            setHighestRate(highestRateValue);
        }
        if (lowestRate !== lowestRateValue) {
            setLowestRate(lowestRateValue);
        }

        let movingAvgValues = [];
        if (movingAverage) {
            movingAvgValues = calculateMovingAverage(yValues, 30);
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
                    },
                    movingAverage && {
                        x: xValues,
                        y: movingAvgValues,
                        type: 'line',
                        mode: 'lines',
                        name: '30-Day Moving Average',
                        line: { dash: 'dash', color: 'red' }
                    },
                ].filter(Boolean)}
                layout={{
                    title: `Exchange Rate of ${currency} Over Time (${period})`,
                    xaxis: { title: 'Date' },
                    yaxis: { title: 'Exchange Rate' },
                }}
            />
        );
    };

    return (
        <div className="container mx-auto p-6 overflow-y-scroll">
            <h1 className="text-2xl font-bold mb-6 text-center">Currency Exchange Rate Chart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 overflow-y-scroll">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Currency:
                        <input
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Period:
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Quarterly">Quarterly</option>
                        </select>
                    </label>
                </div>
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
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </label>
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
            <div className="mb-6">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={movingAverage}
                        onChange={() => setMovingAverage(!movingAverage)}
                        className="mr-2"
                    />
                    Show 30-Day Moving Average
                </label>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                {plotExchangeRate()}
                {highestRate !== null && <p className="mt-4">Highest Rate: {highestRate}</p>}
                {lowestRate !== null && <p className="mt-4">Lowest Rate: {lowestRate}</p>}
            </div>
        </div>
    );
};

export default MainChart;




