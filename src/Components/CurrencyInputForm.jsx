// src/components/CurrencyInputForm.js

import React, { useState } from 'react';

const CurrencyInputForm = () => {
    const [formData, setFormData] = useState({
        currency: '',
        startDate: '',
        endDate: '',
        frequency: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    const currencies = [
        { name: "Algerian dinar (DZD)", symbol: "DZD" },
        { name: "Australian dollar (AUD)", symbol: "AUD" },
        { name: "Bahrain dinar (BHD)", symbol: "BHD" },
        { name: "Bolivar Fuerte (VEF)", symbol: "VEF" },
        { name: "Botswana pula (BWP)", symbol: "BWP" },
        { name: "Brazilian real (BRL)", symbol: "BRL" },
        { name: "Brunei dollar (BND)", symbol: "BND" },
        { name: "Canadian dollar (CAD)", symbol: "CAD" },
        { name: "Chilean peso (CLP)", symbol: "CLP" },
        { name: "Chinese yuan (CNY)", symbol: "CNY" },
        { name: "Colombian peso (COP)", symbol: "COP" },
        { name: "Czech koruna (CZK)", symbol: "CZK" },
        { name: "Danish krone (DKK)", symbol: "DKK" },
        { name: "Euro (EUR)", symbol: "EUR" },
        { name: "Hungarian forint (HUF)", symbol: "HUF" },
        { name: "Icelandic krona (ISK)", symbol: "ISK" },
        { name: "Indian rupee (INR)", symbol: "INR" },
        { name: "Indonesian rupiah (IDR)", symbol: "IDR" },
        { name: "Iranian rial (IRR)", symbol: "IRR" },
        { name: "Israeli New Shekel (ILS)", symbol: "ILS" },
        { name: "Japanese yen (JPY)", symbol: "JPY" },
        { name: "Kazakhstani tenge (KZT)", symbol: "KZT" },
        { name: "Korean won (KRW)", symbol: "KRW" },
        { name: "Kuwaiti dinar (KWD)", symbol: "KWD" },
        { name: "Libyan dinar (LYD)", symbol: "LYD" },
        { name: "Malaysian ringgit (MYR)", symbol: "MYR" },
        { name: "Mauritian rupee (MUR)", symbol: "MUR" },
        { name: "Mexican peso (MXN)", symbol: "MXN" },
        { name: "Nepalese rupee (NPR)", symbol: "NPR" },
        { name: "New Zealand dollar (NZD)", symbol: "NZD" },
        { name: "Norwegian krone (NOK)", symbol: "NOK" },
        { name: "Omani rial (OMR)", symbol: "OMR" },
        { name: "Pakistani rupee (PKR)", symbol: "PKR" },
        { name: "Peruvian sol (PEN)", symbol: "PEN" },
        { name: "Philippine peso (PHP)", symbol: "PHP" },
        { name: "Polish zloty (PLN)", symbol: "PLN" },
        { name: "Qatari riyal (QAR)", symbol: "QAR" },
        { name: "Russian ruble (RUB)", symbol: "RUB" },
        { name: "Saudi Arabian riyal (SAR)", symbol: "SAR" },
        { name: "Singapore dollar (SGD)", symbol: "SGD" },
        { name: "South African rand (ZAR)", symbol: "ZAR" },
        { name: "Sri Lankan rupee (LKR)", symbol: "LKR" },
        { name: "Swedish krona (SEK)", symbol: "SEK" },
        { name: "Swiss franc (CHF)", symbol: "CHF" },
        { name: "Thai baht (THB)", symbol: "THB" },
        { name: "Trinidadian dollar (TTD)", symbol: "TTD" },
        { name: "Tunisian dinar (TND)", symbol: "TND" },
        { name: "U.A.E. dirham (AED)", symbol: "AED" },
        { name: "U.K. pound (GBP)", symbol: "GBP" },
        { name: "U.S. dollar (USD)", symbol: "USD" },
        { name: "Uruguayan peso (UYU)", symbol: "UYU" },
    ];

    return (
        <div className="flex justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-6 rounded shadow-md w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-center">Currency Data Input</h2>

                <div className='flex w-full justify-evenly'>
                    <div className="mb-4 w-1/3">
                        <label className="block text-gray-700 mb-1" htmlFor="currency">Currency:</label>
                        <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select currency</option>
                            {currencies.map((curr) => (
                                <option key={curr.symbol} value={curr.symbol}>
                                    {curr.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4 w-1/3">
                        <label className="block text-gray-700 mb-1" htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                
                <div className='flex w-full justify-evenly'>
                    <div className="mb-4 w-1/3">
                        <label className="block text-gray-700 mb-1" htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4 w-1/3">
                        <label className="block text-gray-700 mb-1" htmlFor="frequency">Frequency:</label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select frequency</option>
                            <option value="W">Weekly</option>
                            <option value="M">Monthly</option>
                            <option value="Q">Quarterly</option>
                            <option value="Y">Yearly</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-1/3 bg-[#6359E9] text-white p-2 rounded hover:bg-white hover:text-black hover:border hover:border-purple-600">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CurrencyInputForm;
