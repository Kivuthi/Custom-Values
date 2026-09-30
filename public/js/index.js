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

const directImportDepreciation = [
    { maxMonths: 6, depreciation: 0.05 },
    { maxMonths: 12, depreciation: 0.10 },
    { maxMonths: 24, depreciation: 0.15 },
    { maxMonths: 36, depreciation: 0.20 },
    { maxMonths: 48, depreciation: 0.30 },
    { maxMonths: 60, depreciation: 0.40 },
    { maxMonths: 72, depreciation: 0.50 },
    { maxMonths: 84, depreciation: 0.60 },
    { maxMonths: 96, depreciation: 0.70 }
];

function calculateCRSP(custom, depreciation, exciseRate, extraDepreciation = 0) {

    return custom / (
        ((1 - depreciation) / (1.25 * 1.16 * exciseRate))
        * (1 - extraDepreciation)
        * 1.25
    );

}

function method1(custom, depreciation, extraDepreciation = 0) {
    return calculateCRSP(
        custom,
        depreciation,
        1.20,
        extraDepreciation
    );
}


function method2(custom, depreciation, extraDepreciation = 0) {
    return calculateCRSP(
        custom,
        depreciation,
        1.25,
        extraDepreciation
    );
}


function method3(custom, depreciation, extraDepreciation = 0) {
    return calculateCRSP(
        custom,
        depreciation,
        1.30,
        extraDepreciation
    );
}

const vehicleMethods = {

    smallEngine: {
        excise: 1.20,
        calculate: method1
    },

    largeEngine: {
        excise: 1.25,
        calculate: method2
    },

    highCapacity: {
        excise: 1.30,
        calculate: method3
    }

};

let method;

if (cc <= 1500) {
    method = vehicleMethods.smallEngine;
} else if (cc > 1500 && cc <= 3000 && fuelType === "petrol" || cc > 1500 && cc <= 2500 && fuelType === "diesel") {
    method = vehicleMethods.largeEngine;
} else {
    method = vehicleMethods.highCapacity;
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