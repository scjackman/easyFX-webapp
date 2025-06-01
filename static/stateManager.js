// Initial state
let fromCurrency = "CAD";
let toCurrency = "GBP";

const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount-input");
const resultEl = document.getElementById("result");

// Handle currency swap
swapBtn.addEventListener("click", () => {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
    swapBtn.textContent = fromCurrency == "CAD" ? "->" : "<-";
    resultEl.textContent = "";  // clear result on swap
});

// Handle conversion
convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultEl.textContent = "Please enter a valid amount.";
        resultEl.classList.remove("text-success");
        resultEl.classList.add("text-danger");
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
                to: toCurrency
            })
        });

        if (!response.ok) {
            throw new Error("Conversion failed.");
        }

        const data = await response.json();
        const convertedAmount = data.converted_amount;

        resultEl.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        resultEl.classList.remove("text-danger");
        resultEl.classList.add("text-success");
    } catch (error) {
        resultEl.textContent = "Error converting currency.";
        resultEl.classList.remove("text-success");
        resultEl.classList.add("text-danger");
    }
});