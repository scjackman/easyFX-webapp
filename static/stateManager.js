// Currency conversion state management script

// Initialize default currency conversion direction
let fromCurrency = "CAD";
let toCurrency = "GBP";

// Cache DOM elements for better performance
const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount-input");
const resultText = document.getElementById("result");
const taxToggle = document.getElementById('tax-toggle');
const spinner = convertBtn.querySelector('.spinner-border');
const buttonText = convertBtn.querySelector('.button-text');

// Event listener for currency swap button
// Swaps the source and target currencies and updates the UI accordingly
swapBtn.addEventListener("click", () => {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
    swapBtn.textContent = fromCurrency == "CAD" ? "->" : "<-";
    resultText.textContent = "";  // clear result on swap
});


// Updates the UI to show loading state during conversion
function setLoading(isLoading) {
    convertBtn.disabled = isLoading;
    spinner.classList.toggle('d-none', !isLoading);
    buttonText.textContent = isLoading ? 'Converting...' : 'Convert';
}


// Performs the currency conversion by sending a request to the Flask route /convert
async function performConversion() {
    const amount = parseFloat(amountInput.value);
    const addTax = taxToggle.checked;
    
    // Validate input amount
    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Please enter a valid amount.";
        resultText.classList.remove("text-success");
        resultText.classList.add("text-danger");
        return;
    }

    setLoading(true);

    // Send POST request to Flask route /convert
    try {
        const response = await fetch("/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: amount,
                from: fromCurrency,
                to: toCurrency,
                add_tax: addTax
            })
        });

        // Throw an error if the conversion fails
        if (!response.ok) {
            throw new Error("Conversion failed.");
        }

        // Process and display the conversion result
        const data = await response.json();
        const convertedAmount = data.converted_amount;

        resultText.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        resultText.classList.remove("text-danger");
        resultText.classList.add("text-success");

    } catch (error) {
        // Handle and display any errors that occur during conversion
        resultText.textContent = "Error converting currency.";
        resultText.classList.remove("text-success");
        resultText.classList.add("text-danger");
    } finally {
        setLoading(false);
    }
}

// Event listener for conversion button click
convertBtn.addEventListener("click", performConversion);

// Event listener for Enter key in amount input field
amountInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        performConversion();
    }
});

// Event listener for mobile keyboard submission
amountInput.addEventListener("input", (event) => {
    if (event.inputType === "insertLineBreak") {
        event.preventDefault();
        performConversion();
    }
});