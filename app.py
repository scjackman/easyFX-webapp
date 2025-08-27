import os
from flask import Flask, render_template, request, jsonify
import yfinance as yf

# Initialize Flask app
app = Flask(__name__)
env_config = os.getenv('APP_SETTINGS', 'config.DevelopmentConfig')
app.config.from_object(env_config)

# Run the app in debug mode if running locally
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

### YFINANCE ###

# Function to retrieve the bid price of a ticker using yfinance
def retrieve_ticker_bid(ticker: str) -> float:
    # Retrieve live info for the ticker passed to the function 
    try:
        ticker_response = yf.Ticker(ticker)

        # Return ticker 'bid' info from response
        bid = ticker_response.info.get('bid')
        return bid
    
    except Exception as e:
        print(f"Error in retrieve_ticker_bid: {e}.")
        return None
    
### ROUTES ###

# Route to render the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for currency conversion POST request
@app.route('/convert',methods=['POST'],endpoint='convert_value')
def convert_value():
    try:
        # Get JSON from the request
        data = request.get_json()

        # Extract data from JSON
        amount = float(data['amount'])
        from_currency = data['from']
        to_currency = data['to']
        add_tax = data['add_tax']

        # Assign tax multiplier
        tax = 1.12 if add_tax else 1.0

        # Create the ticker string
        ticker = from_currency + to_currency + '=X'

        # Convert the amount and return the result as a JSON
        converted_amount  = amount * retrieve_ticker_bid(ticker) * tax
        return jsonify({'converted_amount': converted_amount})
    
    except Exception as e:
        return jsonify({'error': 'An error occurred during conversion.'}), 500