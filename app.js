/** @type {HTMLButtonElement} */
const startButton = document.getElementById("startButton");
/** @type {HTMLParagraphElement} */
const statusText = document.getElementById("status");
/** @type {HTMLDivElement} */
const bubble = document.getElementById("bubble");
/** @type {HTMLSpanElement} */
const levelStatus = document.getElementById("levelStatus");
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

    if (beta === null || gamma === null) {
        setStatus("cannot acquire sensor data");
        return;
    }

    document.getElementById("alpha").textContent = norm_degree(alpha);
    document.getElementById("beta").textContent  = norm_degree(beta);
    document.getElementById("gamma").textContent = norm_degree(gamma);

    let x = gamma * 2;
    let y = beta * 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    if (distance > maxDistance) {
        x = x * maxDistance / distance;
        y = y * maxDistance / distance;
    }

    bubble.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    const isLevel = Math.abs(beta) <= 3 && Math.abs(gamma) <= 3;

    if (isLevel) {
        bubble.classList.add("level-ok");
        levelStatus.textContent = "水平です";
    } else {
        bubble.classList.remove("level-ok");
        levelStatus.textContent = "傾いています";
    }

    setStatus("aquired sensor data");
}
