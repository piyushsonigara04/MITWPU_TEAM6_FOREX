import sqlite3
import pandas as pd
import streamlit as st
conn = sqlite3.connect('ntx.db')

currency_data = pd.read_sql_query("SELECT * FROM currency", conn)

currency_descriptions = {
    "DZD": "The Algerian Dinar (DZD) is the currency of Algeria. It is subdivided into 100 centimes and is issued by the Bank of Algeria.",
    "AUD": "The Australian Dollar (AUD) is the official currency of Australia, including its external territories. It is subdivided into 100 cents and is often denoted with the dollar sign ($).",
    "BHD": "The Bahraini Dinar (BHD) is the currency of Bahrain, subdivided into 1,000 fils. It is one of the highest-valued currencies in the world.",
    "VEF": "The Venezuelan Bolívar (VEF) is the currency of Venezuela. It has undergone several redenominations, with the most recent occurring in 2018.",
    "BWP": "The Botswana Pula (BWP) is the currency of Botswana, divided into 100 thebe. The name 'pula' means 'rain' in Setswana, symbolizing the importance of rain for agriculture.",
    "BRL": "The Brazilian Real (BRL) is the official currency of Brazil. It is subdivided into 100 centavos and is symbolized by R$.",
    "BND": "The Brunei Dollar (BND) is the official currency of Brunei, interchangeable with the Singapore Dollar. It is subdivided into 100 cents.",
    "CAD": "The Canadian Dollar (CAD) is the official currency of Canada. It is subdivided into 100 cents and is often denoted with the dollar sign ($) or C$ to distinguish it from other dollar-denominated currencies.",
    "CLP": "The Chilean Peso (CLP) is the currency of Chile, subdivided into 100 centavos. It is symbolized by '$' or 'CLP'.",
    "CNY": "The Chinese Yuan (CNY) is the official currency of the People's Republic of China. It is subdivided into 10 jiao or 100 fen, and is often referred to as the renminbi.",
    "COP": "The Colombian Peso (COP) is the official currency of Colombia. It is symbolized as $ or sometimes as COL$ to differentiate it from other currencies that also use the dollar sign. The currency code for the Colombian Peso is COP.",
    "CZK": "The Czech Koruna (CZK) is the currency of the Czech Republic. It is subdivided into 100 hellers and is symbolized by Kč.",
    "DKK": "The Danish Krone (DKK) is the currency of Denmark and Greenland, subdivided into 100 øre. It is symbolized by kr.",
    "EUR": "The Euro (EUR) is the official currency of 19 of the 27 member states of the European Union, collectively known as the Eurozone. The Euro is subdivided into 100 cents and facilitates trade among Eurozone countries.",
    "HUF": "The Hungarian Forint (HUF) is the currency of Hungary, subdivided into 100 fillér. It is symbolized by Ft.",
    "ISK": "The Icelandic Krona (ISK) is the currency of Iceland. It is subdivided into 100 aurar and is managed by the Central Bank of Iceland.",
    "INR": "The Indian Rupee (INR) is the official currency of India. It is subdivided into 100 paise and is symbolized by ₹. The Reserve Bank of India manages the issuance and circulation of the currency.",
    "IDR": "The Indonesian Rupiah (IDR) is the currency of Indonesia. It is subdivided into 100 sen and is symbolized by Rp.",
    "IRR": "The Iranian Rial (IRR) is the currency of Iran, subdivided into 1,000 dinars. It has been subject to significant inflation in recent years.",
    "ILS": "The Israeli New Shekel (ILS) is the currency of Israel. It is subdivided into 100 agorot and is symbolized by ₪.",
    "JPY": "The Japanese Yen (JPY) is the official currency of Japan. It is subdivided into 100 sen and is one of the most traded currencies in the world.",
    "KZT": "The Kazakhstani Tenge (KZT) is the currency of Kazakhstan. It is subdivided into 100 tiyn and is managed by the National Bank of Kazakhstan.",
    "KRW": "The South Korean Won (KRW) is the currency of South Korea, subdivided into 100 jeon. It is symbolized by ₩.",
    "KWD": "The Kuwaiti Dinar (KWD) is the currency of Kuwait. It is subdivided into 1,000 fils and is one of the highest-valued currencies in the world.",
    "LYD": "The Libyan Dinar (LYD) is the currency of Libya, subdivided into 1,000 dirhams. It is issued by the Central Bank of Libya.",
    "MYR": "The Malaysian Ringgit (MYR) is the currency of Malaysia. It is subdivided into 100 sen and is symbolized by RM.",
    "MUR": "The Mauritian Rupee (MUR) is the currency of Mauritius. It is subdivided into 100 cents and is symbolized by Rs.",
    "MXN": "The Mexican Peso (MXN) is the currency of Mexico, subdivided into 100 centavos. It is often denoted with the dollar sign ($) or 'MX$'.",
    "NZD": "The New Zealand Dollar (NZD) is the official currency of New Zealand, including its territories. It is subdivided into 100 cents and is symbolized by NZ$.",
    "NOK": "The Norwegian Krone (NOK) is the currency of Norway, subdivided into 100 øre. It is symbolized by kr.",
    "OMR": "The Omani Rial (OMR) is the currency of Oman, subdivided into 1,000 baisa. It is known for being one of the highest-valued currencies in the world.",
    "PKR": "The Pakistani Rupee (PKR) is the official currency of Pakistan. It is subdivided into 100 paisa and is symbolized by Rs.",
    "PEN": "The Peruvian Sol (PEN) is the currency of Peru, subdivided into 100 céntimos. It was reintroduced in 1991 after a period of hyperinflation.",
    "PHP": "The Philippine Peso (PHP) is the currency of the Philippines. It is subdivided into 100 centavos and is symbolized by ₱.",
    "PLN": "The Polish Zloty (PLN) is the currency of Poland, subdivided into 100 groszy. It is symbolized by zł.",
    "QAR": "The Qatari Rial (QAR) is the currency of Qatar, subdivided into 100 dirhams. It is managed by the Qatar Central Bank.",
    "RUB": "The Russian Ruble (RUB) is the official currency of Russia. It is subdivided into 100 kopecks and is symbolized by ₽.",
    "SAR": "The Saudi Riyal (SAR) is the currency of Saudi Arabia, subdivided into 100 halalas. It is issued by the Saudi Arabian Monetary Authority.",
    "SGD": "The Singapore Dollar (SGD) is the official currency of Singapore, subdivided into 100 cents. It is often denoted with the dollar sign ($) or S$.",
    "ZAR": "The South African Rand (ZAR) is the currency of South Africa, subdivided into 100 cents. It is symbolized by R.",
    "SEK": "The Swedish Krona (SEK) is the currency of Sweden, subdivided into 100 öre. It is symbolized by kr.",
    "CHF": "The Swiss Franc (CHF) is the official currency of Switzerland and Liechtenstein. It is subdivided into 100 rappen and is symbolized by Fr or SFr.",
    "THB": "The Thai Baht (THB) is the currency of Thailand, subdivided into 100 satang. It is symbolized by ฿.",
    "TTD": "The Trinidad and Tobago Dollar (TTD) is the currency of Trinidad and Tobago, subdivided into 100 cents. It is often denoted with the dollar sign ($) or TT$.",
    "AED": "The United Arab Emirates Dirham (AED) is the currency of the United Arab Emirates, subdivided into 100 fils. It is managed by the Central Bank of the UAE.",
    "GBP": "The British Pound (GBP) is the official currency of the United Kingdom. It is subdivided into 100 pence and is one of the oldest currencies still in use.",
    "USD": "The United States Dollar (USD) is the official currency of the United States of America and is also used as a reserve currency globally. It is subdivided into 100 cents and is symbolized by $.",
    "UYU": "The Uruguayan Peso (UYU) is the currency of Uruguay, subdivided into 100 centésimos. It is symbolized by $U.",
    "VES": "The Venezuelan Bolívar Soberano (VES) is the current currency of Venezuela, reintroduced in 2018 as part of an effort to stabilize the economy."
}

results = []


for currency in currency_data.columns:
    if currency != 'Date':  
        current_rate = currency_data[currency].iloc[-1] 
        description = currency_descriptions.get(currency, "Unknown Currency")
        results.append({"Currency Code": currency, "Description": description, "Current Rate (USD)": current_rate})

results_df = pd.DataFrame(results)
st.subheader("Currency Descriptions")
st.write("Select a currency to learn more about it:")
currency_choice = st.selectbox("Choose a currency", results_df['Currency Code'])
st.write(f"Learn more at https://www.oanda.com/currency-converter/en/currencies/majors/{currency_choice.lower()}/")
if currency_choice:
    st.write(currency_descriptions.get(currency_choice, "Description not available."))
st.table(results_df)

conn.close()
