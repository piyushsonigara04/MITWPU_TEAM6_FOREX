from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the CORS class
import os
import sqlite3
import pandas as pd
import plotly.graph_objs as go
import plotly.io as pio
from prophet import Prophet
from datetime import datetime

app = Flask(__name__)

# Allow specific origins, methods, and headers for CORS
CORS(app)

db_path = os.path.join(os.path.dirname(__file__), 'ntx.db')

@app.route('/api/exchange-rates', methods=['GET'])
def get_exchange_rates():
    try:
        conn = sqlite3.connect(db_path)
        print(f"Connection Succesfull")
        query = "SELECT Date, * FROM currency"
        df = pd.read_sql_query(query, conn)
        conn.close()

        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        print(f"Error : {str(e)}")
        return jsonify({"error": str(e)}), 500

def get_currency_data():
    try:
        conn = sqlite3.connect(db_path)
        currency_data = pd.read_sql_query("SELECT * FROM currency", conn)
        print(f"{currency_data}")
        conn.close() 
    except Exception as e:
         print(f"Error : {str(e)}")

    if 'Date' in currency_data.columns:
        currency_data['Date'] = pd.to_datetime(currency_data['Date'])
        currency_data.set_index('Date', inplace=True)

    return currency_data

def calculate_volatility(filtered_data, currency_1, currency_2):
    filtered_data['Currency_1_Change'] = filtered_data[currency_1].pct_change() * 100
    filtered_data['Currency_2_Change'] = filtered_data[currency_2].pct_change() * 100

    volatility_currency_1 = filtered_data['Currency_1_Change'].std()
    volatility_currency_2 = filtered_data['Currency_2_Change'].std()

    return volatility_currency_1, volatility_currency_2

def get_risk_level(volatility):
    if volatility < 1:
        return "Low"
    elif 1 <= volatility < 2:
        return "Medium"
    else:
        return "High"

@app.route('/api/volatility', methods=['GET'])
def get_volatility():
    currency_1 = request.args.get('currency_1')
    currency_2 = request.args.get('currency_2')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    print(f"{currency_1},{currency_2},{start_date},{end_date}")

    try:
        currency_data = get_currency_data()
        filtered_data = currency_data.loc[start_date:end_date, [currency_1, currency_2]]

        volatility_currency_1, volatility_currency_2 = calculate_volatility(filtered_data, currency_1, currency_2)

        risk_level_1 = get_risk_level(volatility_currency_1)
        risk_level_2 = get_risk_level(volatility_currency_2)

        color_currency_1 = 'green' if risk_level_1 == "Low" else 'yellow' if risk_level_1 == "Medium" else 'red'
        color_currency_2 = 'green' if risk_level_2 == "Low" else 'yellow' if risk_level_2 == "Medium" else 'red'

        # Create Plotly figure
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=filtered_data.index, y=filtered_data[currency_1], mode='lines', name=currency_1,
                                 line=dict(color=color_currency_1)))
        fig.add_trace(go.Scatter(x=filtered_data.index, y=filtered_data[currency_2], mode='lines', name=currency_2,
                                 line=dict(color=color_currency_2)))

        fig.update_layout(title=f'{currency_1} vs {currency_2} Exchange Rates (Risk Indicator)',
                          xaxis_title='Date', yaxis_title='Exchange Rate')

        # Convert the figure to JSON
        graph_json = pio.to_json(fig)

        response = {
            'currency_1': currency_1,
            'currency_2': currency_2,
            'volatility_currency_1': f"{volatility_currency_1:.2f}",
            'volatility_currency_2': f"{volatility_currency_2:.2f}",
            'risk_level_1': risk_level_1,
            'risk_level_2': risk_level_2,
            'graph': graph_json  # Include graph data in the response
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error : {str(e)}")
        return jsonify({"error": str(e)}), 400
    

current_exchange_rates = {
    'DZD': 0.0073, 'AUD': 1.27, 'BWP': 0.075, 'BRL': 0.19, 'BND': 0.73, 'CAD': 0.75, 
    'CLP': 0.0011, 'CNY': 0.14, 'CZK': 0.04, 'DKK': 0.15, 'EUR': 1.06, 'INR': 0.012, 
    'ILS': 0.27, 'JPY': 0.0067, 'KRW': 0.00075, 'KWD': 3.23, 'MYR': 0.21, 'MUR': 0.022, 
    'MXN': 0.057, 'NZD': 0.59, 'NOK': 0.09, 'OMR': 2.60, 'PHP': 0.018, 'PLN': 0.24, 
    'QAR': 0.27, 'RUB': 0.011, 'SAR': 0.27, 'SGD': 0.73, 'ZAR': 0.053, 'SEK': 0.089, 
    'CHF': 1.10, 'THB': 0.028, 'AED': 0.27, 'GBP': 1.23, 'USD': 1.0, 'UYU': 0.025
}

@app.route('/api/currency-basket', methods=['POST','OPTIONS'])
def calculate_currency_basket():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request success"}), 200
    
    data = request.get_json()
    selected_currencies = data.get('selectedCurrencies', [])
    weights = data.get('weights', [])
    base_currency = data.get('baseCurrency', '')

    if len(selected_currencies) != len(weights) or sum(weights) != 100.0:
        return jsonify({"error": "Weights must sum to 100 and match selected currencies."}), 400

    total_value_in_usd = 0.0

    for currency, weight in zip(selected_currencies, weights):
        if currency not in current_exchange_rates:
            return jsonify({"error": f"Currency {currency} is not valid."}), 400
        
        rate_in_usd = current_exchange_rates[currency]
        total_value_in_usd += (rate_in_usd * (weight / 100))

    if base_currency not in current_exchange_rates:
        return jsonify({"error": f"Base currency {base_currency} is not valid."}), 400
    
    base_currency_rate = current_exchange_rates[base_currency]
    total_value_in_base_currency = total_value_in_usd / base_currency_rate

    return jsonify({
        "totalValue": total_value_in_base_currency,
        "baseCurrency": base_currency
    })

@app.route('/predict', methods=['POST'])
def predict_currency():
 
    conn = sqlite3.connect(db_path)
    combined_data = pd.read_sql_query("SELECT * FROM currency", conn)
    conn.close()


    if 'Date' in combined_data.columns:
        combined_data['Date'] = pd.to_datetime(combined_data['Date'])
        combined_data.set_index('Date', inplace=True)


    currency = request.json['currency']
    end_date = pd.to_datetime(request.json['end_date'])


    data = combined_data[[currency]].reset_index()
    data.columns = ['ds', 'y']

  
    model = Prophet()
    model.fit(data)

 
    num_days = (end_date - data['ds'].max()).days
    if num_days > 0:
        future = model.make_future_dataframe(periods=num_days)
        forecast = model.predict(future)

 
        forecast_selected = forecast[forecast['ds'] <= end_date]


        response = {
            'historical': {
                'ds': data['ds'].dt.strftime('%Y-%m-%d').tolist(),
                'y': data['y'].tolist()
            },
            'forecast': {
                'ds': forecast_selected['ds'].dt.strftime('%Y-%m-%d').tolist(),
                'yhat': forecast_selected['yhat'].tolist(),
                'yhat_upper': forecast_selected['yhat_upper'].tolist(),
                'yhat_lower': forecast_selected['yhat_lower'].tolist()
            },
            'currency': currency,
            'end_date': end_date.strftime('%Y-%m-%d')
        }
        return jsonify(response)
    else:
        return jsonify({'error': 'End date must be after the latest date in the historical data.'}), 400


country_currency = {
    "Algeria": "DZD",
    "Australia": "AUD",
    "Botswana": "BWP",
    "Brazil": "BRL",
    "Brunei": "BND",
    "Canada": "CAD",
    "Chile": "CLP",
    "China": "CNY",
    "Czech Republic": "CZK",
    "Denmark": "DKK",
    "European Union": "EUR",
    "India": "INR",
    "Israel": "ILS",
    "Japan": "JPY",
    "South Korea": "KRW",
    "Kuwait": "KWD",
    "Malaysia": "MYR",
    "Mauritius": "MUR",
    "Mexico": "MXN",
    "New Zealand": "NZD",
    "Norway": "NOK",
    "Oman": "OMR",
    "Peru": "PEN",
    "Philippines": "PHP",
    "Poland": "PLN",
    "Qatar": "QAR",
    "Russia": "RUB",
    "Saudi Arabia": "SAR",
    "Singapore": "SGD",
    "South Africa": "ZAR",
    "Sweden": "SEK",
    "Switzerland": "CHF",
    "Thailand": "THB",
    "Trinidad and Tobago": "TTD",
    "United Arab Emirates": "AED",
    "United Kingdom": "GBP",
    "United States": "USD",
    "Uruguay": "UYU"
}

import numpy as np

@app.route('/api/current_rates', methods=['POST'])
def get_current_rates():
    try:
        conn = sqlite3.connect(db_path)
        currency_data = pd.read_sql_query("SELECT * FROM currency", conn)
        conn.close()

        selected_date_str = request.json.get('selected_date')
        print(f"Selected date string: {selected_date_str}")

        selected_date = pd.to_datetime(selected_date_str)

        results = []
        if selected_date_str in currency_data['Date'].values:
            for country, currency in country_currency.items():
                rate = currency_data.loc[currency_data['Date'] == selected_date_str, currency].values[0]

                if isinstance(rate, (int, np.integer)):
                    rate = float(rate) 
                elif isinstance(rate, (float, np.float64)):
                    rate = float(rate)  
                else:
                    rate = str(rate)  

                results.append({"Country": country, "Currency": currency, "Rate": rate})
        else:
            for country, currency in country_currency.items():
                results.append({"Country": country, "Currency": currency, "Rate": "No data"})

        return jsonify({
            'selected_date': selected_date_str,
            'exchange_rates': results
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)






