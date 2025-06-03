// Initial state
let fromCurrency = "CAD";
let toCurrency = "GBP";

const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount-input");
const resultText = document.getElementById("result");
const taxToggle = document.getElementById('tax-toggle');
const spinner = convertBtn.querySelector('.spinner-border');
const buttonText = convertBtn.querySelector('.button-text');

// Handle currency swap
swapBtn.addEventListener("click", () => {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
    swapBtn.textContent = fromCurrency == "CAD" ? "->" : "<-";
    resultText.textContent = "";  // clear result on swap
});

// Function to set loading state
function setLoading(isLoading) {
    convertBtn.disabled = isLoading;
    spinner.classList.toggle('d-none', !isLoading);
    buttonText.textContent = isLoading ? 'Converting...' : 'Convert';
}

// Function to perform conversion
async function performConversion() {
    const amount = parseFloat(amountInput.value);
    const addTax = taxToggle.checked;
    
    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Please enter a valid amount.";
        resultText.classList.remove("text-success");
        resultText.classList.add("text-danger");
        return;
    }

    setLoading(true);

    // Send POST request to Flask
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

        if (!response.ok) {
            throw new Error("Conversion failed.");
        }

        const data = await response.json();
        const convertedAmount = data.converted_amount;

        resultText.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        resultText.classList.remove("text-danger");
        resultText.classList.add("text-success");

    } catch (error) {
        resultText.textContent = "Error converting currency.";
        resultText.classList.remove("text-success");
        resultText.classList.add("text-danger");
    } finally {
        setLoading(false);
    }
}

// Handle conversion button click
convertBtn.addEventListener("click", performConversion);

// Handle return key in input field
amountInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        performConversion();
    }
});

// Handle virtual keyboard submission
amountInput.addEventListener("input", (event) => {
    if (event.inputType === "insertLineBreak") {
        event.preventDefault();
        performConversion();
    }
});