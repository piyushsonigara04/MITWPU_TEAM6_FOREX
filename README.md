# MITWPU_TEAM6_FOREXNOW
This project is a full stack web app that provides currency exchange rate data, calculates volatility for selected currencies, and offers predictive analysis of future exchange rates using the Prophet model. The API also allows users to compute currency basket values and visualize exchange rate trends.

# Features
Description of Currencies : Short description of currencies with their currency codes .

Current Exchange Rates : Show the current exchange rates based on user selected currency and date.

Currency Exchange Rates Chart: Retrieve historical exchange rates stored in a SQLite database and shows dynamic chart .

Currency Basket Calculation: Calculate the value of a basket of currencies weighted by user-defined values.

Predictive Modeling: Use the Prophet forecasting model to predict future exchange rates.

Volatility Calculation: Compare volatility between two selected currencies over a specified date range.

# Technologies
Flask: Backend framework to serve APIs.

SQLite: Database to store currency data.

React : Frontend Framework.

Pandas: Data manipulation and analysis.

Plotly: Visualization for exchange rate trends.

Prophet: Time-series forecasting model.

# Python API Dependencies
To run the Flask API described, you'll need the following Python dependencies:

# Flask: Web framework for creating the API.
Flask-CORS: For handling Cross-Origin Resource Sharing (CORS) to allow requests from the frontend.

SQLite3: SQLite database for storing and querying currency data.

Pandas: For data manipulation and analysis, especially with SQL queries and date handling.

Plotly: For generating interactive plots and visualizations, which are returned as JSON.

Prophet: For time series forecasting, used to predict future currency rates.

Datetime: Standard library for handling date and time objects in Python.

Numpy: For numerical operations, especially when handling data types from pandas.

# React Frontend Dependencies
For the React frontend that interacts with the Flask API, you'll need the following dependencies:

React: Base library for building the user interface.

Axios: For making HTTP requests to the Flask API.

React Router Dom: For handling client-side routing.

React-Tailwind (or any other CSS framework): For UI components and styling.

Plotly.js: For rendering charts and visualizations (optional depending on how you handle the graph rendering).

# Setup
1] Clone the repository:

git clone https://github.com/piyushsonigara04/MITWPU_TEAM6_FOREX.git

2] Ensure the ntx.db SQLite database is in the project directory .

3] Run the server: python app.py

4] Access the API: The server will run on http://localhost:5000/.

5] Run the frontend using npm run dev 
