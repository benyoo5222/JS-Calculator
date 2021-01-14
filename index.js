const waitForDocumentToLoad = new Promise(resolve => window.addEventListener("load", resolve));

const internalState = {
    total: 0,
    operation: null,
    ableToUseOperator: true,
};

const ENUMS = {
    MULTIPLY: "MULTIPLY",
    DIVIDE: "DIVIDE",
    ADD: "ADD",
    SUBTRACT: "SUBTRACT",
    "÷": "DIVIDE",
    "×": "MULTIPLY",
    "−": "SUBTRACT",
    "+": "ADD",
}

const clear = () => {
    internalState.total = 0;
    internalState.operation = null;
    document.querySelector(".number").innerText = 0;
};

const deleteLastCharacter = () => {
    const displayNumber = document.querySelector(".number");
    Number(displayNumber.innerText) > 0
        ? (
            displayNumber.innerText.length > 1 
                ? displayNumber.innerText = displayNumber.innerText.slice(0, displayNumber.innerText.length -1)
                : displayNumber.innerText = 0
        )
        : (
            displayNumber.innerText.length > 2
                ? displayNumber.innerText = displayNumber.innerText.slice(0, displayNumber.innerText.length -1)
                : displayNumber.innerText = 0
        );
};

const calculateState = (currentTypedNumber) => {
    switch(internalState.operation) {
        case ENUMS.ADD:
            internalState.total += Number(currentTypedNumber);
            return internalState.total;
        case ENUMS.SUBTRACT:
            internalState.total -= Number(currentTypedNumber);
            return internalState.total;
        case ENUMS.MULTIPLY:
            internalState.total *= Number(currentTypedNumber);
            return internalState.total;
        case ENUMS.DIVIDE:
            internalState.total /= Number(currentTypedNumber);
            return internalState.total;
        default:
            return currentTypedNumber;
    }
};

const calculate = (event) => {
    const { target } = event;
    const displayNumber = document.querySelector(".number");

    if ([...target.classList].includes("number-button")) {
        target.innerText !== "←" && target.innerText !== "C"
            ? (
                displayNumber.innerText !== "0"
                ?  displayNumber.innerText += target.innerText
                : displayNumber.innerText = target.innerText
            )
            : (
                target.innerText === "C"
                    ? clear()
                    : deleteLastCharacter() 
            )
        internalState.ableToUseOperator = true;
    } else {
        switch (target.innerText) {
            case "÷":
            case "×":
            case "−":
            case "+":
                if (internalState.ableToUseOperator) {
                    internalState.operation !== null
                        ? calculateState(Number(displayNumber.innerText)) // do the previous action
                        : internalState.total = Number(displayNumber.innerText);
                
                    internalState.operation = ENUMS[target.innerText];
                    internalState.ableToUseOperator = false;
                    displayNumber.innerText = 0;
                }
                break;
            case "=":
                const newtotal = calculateState(displayNumber.innerText);
                internalState.total = 0;
                internalState.ableToUseOperator = true;
                internalState.operation = null;
                displayNumber.innerText = newtotal;
        }
        
    }
};

waitForDocumentToLoad
    .then(() => {
        console.log("Page has been loaded along with it's assets");
        const allNumberPadContainers = document.querySelectorAll(".num-pad-container");
        allNumberPadContainers.forEach(container => container.addEventListener("click", calculate));
    });