# your_streamlit_app.py
import sqlite3
import pandas as pd
import plotly.express as px
import streamlit as st

conn = sqlite3.connect('ntx.db')
combined_data = pd.read_sql_query("SELECT * FROM currency", conn)

if 'Date' in combined_data.columns:
    combined_data['Date'] = pd.to_datetime(combined_data['Date'])
    combined_data.set_index('Date', inplace=True)

st.title("Currency Exchange Rate Visualization")
currency_options = list(combined_data.columns)
if 'Date' in currency_options:
    currency_options.remove('Date')

currency = st.selectbox("Select Currency", currency_options, index=0)
period = st.selectbox("Select Period", ['Yearly', 'Monthly', 'Weekly', 'Quarterly'])
plot_type = st.selectbox("Select Plot Type", ['Line Plot', 'Bar Plot', 'Scatter Plot'])

if period == 'Yearly':
    currency_data = combined_data[[currency]].resample('Y').mean().reset_index()
elif period == 'Monthly':
    currency_data = combined_data[[currency]].resample('M').mean().reset_index()
elif period == 'Weekly':
    currency_data = combined_data[[currency]].resample('W').mean().reset_index()
elif period == 'Quarterly':
    currency_data = combined_data[[currency]].resample('Q').mean().reset_index()

if plot_type == 'Line Plot':
    fig = px.line(currency_data, x='Date', y=currency, title=f'Exchange Rate of {currency} Over Time ({period})')
elif plot_type == 'Bar Plot':
    fig = px.bar(currency_data, x='Date', y=currency, title=f'Exchange Rate of {currency} Over Time ({period})')
else:
    fig = px.scatter(currency_data, x='Date', y=currency, title=f'Exchange Rate of {currency} Over Time ({period})')

st.plotly_chart(fig)
conn.close()
