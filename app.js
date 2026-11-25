/** @type {HTMLButtonElement} */
const startButton = document.getElementById("startButton");
/** @type {HTMLParagraphElement} */
const statusText = document.getElementById("status");
/** @param {string} text */
const setStatus = (text) => {
    statusText.textContent = text;
}

if (!startButton) {
    throw new Error();
}
if (!statusText) {
    throw new Error();
}

startButton.addEventListener("click", startSensor);

async function startSensor() {
    try {
        if (typeof DeviceOrientationEvent === "undefined") {
            setStatus("cannot use sensor api");
            return;
        }
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            const permission = await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {
                setStatus("sensor not allowed");
                return;
            }
        }

        window.addEventListener("deviceorientation", showOrientation);

        setStatus("acquiring sensor data");
        startButton.disabled = true;

    } catch (error) {
        setStatus("failed to start sensor");
        console.error(error);
    }
}


/** @param {number} n */
function norm_degree(n) {
    return n.toFixed(1) + "°";
}
/** @param {DeviceOrientationEvent} event */
function showOrientation(event) {
    const alpha = event.alpha;
    const beta  = event.beta;
    const gamma = event.gamma;

    if (alpha === null || beta === null || gamma === null) {
        setStatus("cannot acquire sensor data");
        return;
    }

    document.getElementById("alpha").textContent = norm_degree(alpha);
    document.getElementById("beta").textContent  = norm_degree(beta);
    document.getElementById("gamma").textContent = norm_degree(gamma);

    setStatus("aquired sensor data");
}
