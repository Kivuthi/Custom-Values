function customValue(custom) {
    let FOB = 0.8 * custom;
    let FRT = 0.185 * custom;
    let INS = 0.015 * custom;

    return { FOB, FRT, INS };
}


// Get current USD/KES exchange rate
async function getExchangeRate() {

    const response = await fetch(
        "https://api.frankfurter.dev/v2/rate/usd/kes"
    );

    if (!response.ok) {
        throw new Error("Failed to get exchange rate");
    }

    const data = await response.json();

    return data.rate;
}

let depreciation = [];
let extraDepreciation = 0;

if()

function reverseCRSP(custom, year, cc, fuelType){
    let crsp = custom / ((100%-depreciation)/(1.25*1.16*excise)*(100%-extraDepreciation)*1.25);

    return crsp;
}

// Calculate Customs Value
document.getElementById("calculateCv").addEventListener("click", async function () {

    const custom = Number(
        document.getElementById("customValue").value
    );

    if (!custom || custom <= 0) {
        alert("Please enter a valid customs value.");
        return;
    }

    try {

        // Calculate KSH values
        const result = customValue(custom);

        // Get current exchange rate
        const exchangeRate = await getExchangeRate();

        // Convert KSH → USD
        const FOBUSD = result.FOB / exchangeRate;
        const FRTUSD = result.FRT / exchangeRate;
        const INSUSD = result.INS / exchangeRate;


        // Display KSH
        document.getElementById("FOBValue").textContent =
            `KSH ${result.FOB.toLocaleString()}`;

        document.getElementById("FRTValue").textContent =
            `KSH ${result.FRT.toLocaleString()}`;

        document.getElementById("INSValue").textContent =
            `KSH ${result.INS.toLocaleString()}`;


        // Display USD
        document.getElementById("FOBUSD").textContent =
            `USD ${FOBUSD.toFixed(2)}`;

        document.getElementById("FRTUSD").textContent =
            `USD ${FRTUSD.toFixed(2)}`;

        document.getElementById("INSUSD").textContent =
            `USD ${INSUSD.toFixed(2)}`;


        // Display exchange rate
        document.getElementById("exchangeRate").textContent =
            `1 USD = KSH ${exchangeRate.toFixed(3)}`;

    } catch (error) {

        console.error(error);

        alert("Unable to get the current exchange rate. Please try again.");

    }

});