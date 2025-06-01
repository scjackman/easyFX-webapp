import os
from flask import Flask, render_template, request, jsonify
import yfinance as yf

app = Flask(__name__)
env_config = os.getenv('APP_SETTINGS', 'config.DevelopmentConfig')
app.config.from_object(env_config)

def retrieve_ticker_bid(ticker: str) -> float:
    # Retrieve live bid info from the Yahoo Finance ticker passed to the function
    try:
        ticker_response = yf.Ticker(ticker)

    except:
        print('retrieve_ticker_bid: The function could not retrieve the ticker info from yfinance.')

    # Obtain ticker 'bid' info from data, and return
    return ticker_response.info['bid']


@app.route('/')
def index():
    secret_key = app.config.get('SECRET_KEY')
    return render_template('index.html')

@app.route('/convert',methods=['POST'],endpoint='convert_value')
def convert_value():
    data = request.get_json()
    amount = float(data['amount'])
    from_currency = data['from']
    to_currency = data['to']

    ticker = from_currency + to_currency + '=X'
    converted_amount  = amount * retrieve_ticker_bid(ticker)

    return jsonify({'converted_amount': converted_amount})