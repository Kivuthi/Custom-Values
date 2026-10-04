function calculateCustomValue(custom) {

    const FOB = 0.8 * custom;
    const FRT = 0.185 * custom;
    const INS = 0.015 * custom;

    return { FOB, FRT, INS };
}

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

const calculateCvButton =
    document.getElementById("calculateCv");

if (calculateCvButton) {

    calculateCvButton.addEventListener(
        "click",
        async function () {

            const custom = Number(
                document.getElementById("customValue").value
            );

            if (!custom || custom <= 0) {
                alert("Please enter a valid customs value.");
                return;
            }

            try {

                const result =
                    calculateCustomValue(custom);

                const exchangeRate =
                    await getExchangeRate();

                const FOBUSD =
                    result.FOB / exchangeRate;

                const FRTUSD =
                    result.FRT / exchangeRate;

                const INSUSD =
                    result.INS / exchangeRate;

                const FOBValue =
                    document.getElementById("FOBValue");

                if (FOBValue) {
                    FOBValue.textContent =
                        `KSH ${result.FOB.toLocaleString()}`;
                }

                const FRTValue =
                    document.getElementById("FRTValue");

                if (FRTValue) {
                    FRTValue.textContent =
                        `KSH ${result.FRT.toLocaleString()}`;
                }

                const INSValue =
                    document.getElementById("INSValue");

                if (INSValue) {
                    INSValue.textContent =
                        `KSH ${result.INS.toLocaleString()}`;
                }

                const FOBUSDElement =
                    document.getElementById("FOBUSD");

                if (FOBUSDElement) {
                    FOBUSDElement.textContent =
                        `USD ${FOBUSD.toFixed(2)}`;
                }

                const FRTUSDElement =
                    document.getElementById("FRTUSD");

                if (FRTUSDElement) {
                    FRTUSDElement.textContent =
                        `USD ${FRTUSD.toFixed(2)}`;
                }

                const INSUSDElement =
                    document.getElementById("INSUSD");

                if (INSUSDElement) {
                    INSUSDElement.textContent =
                        `USD ${INSUSD.toFixed(2)}`;
                }

                const exchangeRateElement =
                    document.getElementById("exchangeRate");

                if (exchangeRateElement) {
                    exchangeRateElement.textContent =
                        `1 USD = KSH ${exchangeRate.toFixed(3)}`;
                }

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to get the current exchange rate. Please try again."
                );

            }

        }
    );

}


// ============================================================
// MODULE 2: REVERSE CRSP
// ============================================================

// CRSP calculation

const currentYear =
    new Date().getFullYear();

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

function getDirectImportDepreciation(ageInMonths) {

    for (
        const rule
        of directImportDepreciation
    ) {

        if (ageInMonths <= rule.maxMonths) {
            return rule.depreciation;
        }

    }

    return null;
}

// CRSP calculation

function calculateCRSP(
    customsValue,
    depreciation,
    exciseRate,
    extraDepreciation = 0
) {
    return (
        customsValue /
        (
            ((1 - depreciation) / (1.25 * exciseRate * 1.16)) *
            (1 - extraDepreciation)
        )
    ) * 1.25;
}

// CRSP calculation

function method1(
    customsValue,
    depreciation,
    extraDepreciation = 0
) {

    return calculateCRSP(
        customsValue,
        depreciation,
        1.20,
        extraDepreciation
    );

}

// CRSP calculation

function method2(
    customsValue,
    depreciation,
    extraDepreciation = 0
) {

    return calculateCRSP(
        customsValue,
        depreciation,
        1.20,
        extraDepreciation
    );

}

// CRSP calculation

function method3(
    customsValue,
    depreciation,
    extraDepreciation = 0
) {

    return calculateCRSP(
        customsValue,
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
        excise: 1.20,
        calculate: method2
    },

    highCapacity: {
        excise: 1.30,
        calculate: method3
    }

};

function getVehicleMethod(cc, fuelType) {

    if (cc <= 1500) {

        return vehicleMethods.smallEngine;

    }

    if (
        (
            cc > 1500 &&
            cc <= 3000 &&
            fuelType === "petrol"
        )
        ||
        (
            cc > 1500 &&
            cc <= 2500 &&
            fuelType === "diesel"
        )
    ) {

        return vehicleMethods.largeEngine;

    }

    return vehicleMethods.highCapacity;

}

const reverseCRSPButton =
    document.getElementById("reverseCRSP");

if (reverseCRSPButton) {

    reverseCRSPButton.addEventListener(
        "click",
        function () {

            const customsValue =
                Number(
                    document
                        .getElementById("reverseCustomValue")
                        .value
                );

            const year =
                Number(
                    document
                        .getElementById("year")
                        .value
                );

            const cc =
                Number(
                    document
                        .getElementById("cc")
                        .value
                );

            const fuelType =
                document
                    .getElementById("fuelType")
                    .value;

            if (
                !customsValue ||
                customsValue <= 0
            ) {

                alert(
                    "Please enter a valid customs value."
                );

                return;

            }

            if (
                !year ||
                year > currentYear
            ) {

                alert(
                    "Please enter a valid vehicle year."
                );

                return;

            }

            if (!cc || cc <= 0) {

                alert(
                    "Please enter a valid engine capacity."
                );

                return;

            }

            const ageInYears =
                currentYear - year;

            const ageInMonths =
                ageInYears * 12;

            const depreciation =
                getDirectImportDepreciation(
                    ageInMonths
                );

            if (depreciation === null) {

                alert(
                    "Vehicle is outside the supported direct import depreciation range."
                );

                return;

            }

            const method =
                getVehicleMethod(
                    cc,
                    fuelType
                );

            const calculatedCRSP =
                method.calculate(
                    customsValue,
                    depreciation
                );

            const newCRSP =
                document.getElementById("newCRSP");

            if (newCRSP) {

                newCRSP.textContent =
                    `KSH ${calculatedCRSP.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}`;

            }

        }
    );

}


// MODULE 3: NEW CUSTOM VALUE

const crspDirectImportDepreciation = [
    { maxMonths: 24, depreciation: 0.20 },
    { maxMonths: 36, depreciation: 0.30 },
    { maxMonths: 48, depreciation: 0.40 },
    { maxMonths: 60, depreciation: 0.50 },
    { maxMonths: 72, depreciation: 0.55 },
    { maxMonths: 84, depreciation: 0.60 },
    { maxMonths: 96, depreciation: 0.65 }
];

function calculateCustomsValue(
    crsp,
    depreciation,
    exciseRate,
    extraDepreciation = 0
) {
    return (
        (crsp / 1.25) *
        ((1 - depreciation) / (1.25 * exciseRate * 1.16)) *
        (1 - extraDepreciation)
    );
}

function getDirectImportDepreciation(ageInMonths) {
    const rate = crspDirectImportDepreciation.find(
        item => ageInMonths <= item.maxMonths
    );

    return rate
        ? rate.depreciation
        : crspDirectImportDepreciation[
            crspDirectImportDepreciation.length - 1
        ].depreciation;
}

function getVehicleValuation(cc, fuelType) {
    if (cc <= 1500) {
        return { exciseRate: 1.20 };
    }

    if (
        (fuelType === "petrol" && cc > 3000) ||
        (fuelType === "diesel" && cc > 2500)
    ) {
        return { exciseRate: 1.35 };
    }

    return { exciseRate: 1.25 };
}

const valuateButton = document.getElementById("valuate");

if (valuateButton) {
    valuateButton.addEventListener("click", function () {
        const crspInput = document.getElementById("reverseCRSP");
        const yearInput = document.getElementById("vehicleYear");
        const ccInput = document.getElementById("vehicleCC");
        const fuelInput = document.getElementById("vehicleFuelType");
        const result = document.getElementById("newCustomValueResult");

        if (
            !crspInput ||
            !yearInput ||
            !ccInput ||
            !fuelInput ||
            !result
        ) {
            console.error("Module 3 is missing an HTML element.");
            return;
        }

        const crsp = Number(crspInput.value);
        const year = Number(yearInput.value);
        const cc = Number(ccInput.value);
        const fuelType = fuelInput.value;
        const currentYear = new Date().getFullYear();

        if (!Number.isFinite(crsp) || crsp <= 0) {
            alert("Please enter a valid CRSP.");
            return;
        }

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > currentYear
        ) {
            alert("Please enter a valid vehicle year.");
            return;
        }

        if (!Number.isFinite(cc) || cc <= 0) {
            alert("Please enter a valid engine capacity.");
            return;
        }

        if (!fuelType) {
            alert("Please select a fuel type.");
            return;
        }

        const ageInMonths = (currentYear - year + 1) * 12;

        const depreciation = getDirectImportDepreciation(
            ageInMonths
        );

        const { exciseRate } = getVehicleValuation(
            cc,
            fuelType
        );

        const extraDepreciation = 0;

        const newCustomValue = calculateCustomsValue(
            crsp,
            depreciation,
            exciseRate,
            extraDepreciation
        );

        result.textContent = `KSH ${newCustomValue.toLocaleString(
            "en-KE",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    });
}