import os
from flask import Flask

app = Flask(__name__)
env_config = os.getenv('APP_SETTINGS', 'config.DevelopmentConfig')
app.config.from_object(env_config)

def retrieve_ticker_bid(ticker: str) -> float:
    
    # Retrieve live bid info from the Yahoo Finance ticker passed to the function
    # Required package
    import yfinance as yf
    
    # Retrieve ticker data using yfinance
    try:
        ticker_response = yf.Ticker(ticker)

    except:
        print('retrieve_ticker_bid: The function could not retrieve the ticker info from yfinance.')

    # Obtain ticker 'bid' info from data, and return

    ticker_bid = ticker_response.info['bid']

    return {
        'ticker_bid': ticker_bid
    }

@app.route('/')
def index():
    secret_key = app.config.get('SECRET_KEY')
    return f'''

        This webapp confirms that Olivia is a {secret_key} gal!
        Oh and btw, the current GBP -> CAD exchange rate is {retrieve_ticker_bid('GBPCAD=X')['ticker_bid']}.
    
    '''