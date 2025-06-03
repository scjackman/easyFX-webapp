// Initial state
let fromCurrency = "CAD";
let toCurrency = "GBP";

const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount-input");
const resultText = document.getElementById("result");
const taxToggle = document.getElementById('tax-toggle');

// Handle currency swap
swapBtn.addEventListener("click", () => {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
    swapBtn.textContent = fromCurrency == "CAD" ? "->" : "<-";
    resultText.textContent = "";  // clear result on swap
});

// Handle conversion
convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value);
    const addTax = taxToggle.checked
    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Please enter a valid amount.";
        resultText.classList.remove("text-success");
        resultText.classList.add("text-danger");
        return;
    }

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
    }
});