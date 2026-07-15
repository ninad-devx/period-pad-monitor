// ======================================================
// SmartPad Dashboard
// Part 1
// ======================================================

// ---------- Elements ----------

const moistureEl = document.getElementById("moisture");
const statusBadge = document.getElementById("statusBadge");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");
const recommendation = document.getElementById("recommendation");

const leakRisk = document.getElementById("risk");
const remaining = document.getElementById("remaining");

const lastUpdate = document.getElementById("lastUpdate");

const rawADC = document.getElementById("rawADC");
const filteredADC = document.getElementById("filteredADC");
const baselineADC = document.getElementById("baselineADC");

const sensorState = document.getElementById("sensorState");

const deviceConnection = document.getElementById("deviceConnection");
const devicePort = document.getElementById("devicePort");

const progressCircle = document.getElementById("progressCircle");

// SVG Circle Length
const circumference = 2 * Math.PI * 80;

// Prepare Gauge
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

// ======================================================
// Update Gauge
// ======================================================

function updateGauge(percent){

    percent = Math.max(0, Math.min(100, percent));

    const offset =
        circumference - (percent / 100) * circumference;

    progressCircle.style.strokeDashoffset = offset;

}

// ======================================================
// Update Dashboard
// ======================================================

function updateDashboard(data){

    const moisture =
        Number(data.moisture);

    moistureEl.innerHTML =
        moisture + "%";

    updateGauge(moisture);

    remaining.innerHTML =
        (100 - moisture) + "%";

    rawADC.innerHTML =
        data.raw;

    filteredADC.innerHTML =
        data.filtered;

    baselineADC.innerHTML =
        data.baseline;

    sensorState.innerHTML =
        data.state;

    devicePort.innerHTML =
        data.port || "--";

    deviceConnection.innerHTML =
        data.connected ?
        "🟢 Connected" :
        "🔴 Disconnected";

    lastUpdate.innerHTML =
        new Date().toLocaleTimeString();

    // Remove old body classes

    document.body.classList.remove(
        "status-dry",
        "status-damp",
        "status-warning",
        "status-wet"
    );

    //----------------------------------------------------
    // DRY
    //----------------------------------------------------

    if(moisture < 25){

        document.body.classList.add("status-dry");

        statusBadge.innerHTML =
            "DRY";

        statusTitle.innerHTML =
            "Pad is Fresh";

        statusMessage.innerHTML =
            "Your pad is clean and safe.";

        recommendation.innerHTML =
            "No action needed. Continue using the pad comfortably.";

        leakRisk.innerHTML =
            "LOW";

    }

    //----------------------------------------------------
    // DAMP
    //----------------------------------------------------

    else if(moisture < 60){

        document.body.classList.add("status-damp");

        statusBadge.innerHTML =
            "DAMP";

        statusTitle.innerHTML =
            "Pad Getting Wet";

        statusMessage.innerHTML =
            "Fluid has been detected.";

        recommendation.innerHTML =
            "Monitor the pad over the next hour.";

        leakRisk.innerHTML =
            "MEDIUM";

    }

    //----------------------------------------------------
    // WARNING
    //----------------------------------------------------

    else if(moisture < 80){

        document.body.classList.add("status-warning");

        statusBadge.innerHTML =
            "CHANGE SOON";

        statusTitle.innerHTML =
            "Almost Full";

        statusMessage.innerHTML =
            "Pad is nearing saturation.";

        recommendation.innerHTML =
            "Plan to replace your pad within 30 minutes.";

        leakRisk.innerHTML =
            "HIGH";

    }

    //----------------------------------------------------
    // WET
    //----------------------------------------------------

    else{

        document.body.classList.add("status-wet");

        statusBadge.innerHTML =
            "CHANGE NOW";

        statusTitle.innerHTML =
            "Pad Full";

        statusMessage.innerHTML =
            "High leakage risk.";

        recommendation.innerHTML =
            "Please replace your pad immediately.";

        leakRisk.innerHTML =
            "VERY HIGH";

    }

}

// ======================================================
// Read Sensor API
// ======================================================

async function fetchSensor(){

    try{

        const response =
            await fetch("/sensor");

        const data =
            await response.json();

        updateDashboard(data);

    }

    catch(error){

        console.log(error);

    }

}
// ======================================================
// Part 2
// Alarm, Modal, Auto Refresh
// ======================================================

// ---------------- Alarm ----------------

const alarm = document.getElementById("alarm");

let monitoring = false;
let alarmPlaying = false;

// ---------------- Modal ----------------

const modal = document.getElementById("deviceModal");

function openDeviceModal(){

    modal.classList.add("show");

}

function closeDeviceModal(){

    modal.classList.remove("show");

}

window.onclick = function(e){

    if(e.target === modal){

        closeDeviceModal();

    }

}

// ---------------- Loading ----------------

const loading = document.getElementById("loading");

function showLoading(){

    loading.classList.add("show");

    loading.innerHTML = "Connecting...";

}

function hideLoading(){

    loading.classList.remove("show");

}

// ---------------- Alarm ----------------

function playAlarm(){

    if(alarmPlaying) return;

    alarm.loop = true;

    alarm.play().catch(()=>{});

    alarmPlaying = true;

}

function stopAlarm(){

    alarm.pause();

    alarm.currentTime = 0;

    alarmPlaying = false;

}

// ---------------- Vibration ----------------

function vibrate(){

    if(navigator.vibrate){

        navigator.vibrate([400,200,400,200,400]);

    }

}

// ---------------- Monitoring ----------------

function startMonitoring(){

    monitoring = true;

    showLoading();

    setTimeout(()=>{

        hideLoading();

    },1000);

}

// ---------------- Auto Refresh ----------------

async function refreshLoop(){

    if(!monitoring) return;

    try{

        const response = await fetch("/sensor");

        const data = await response.json();

        updateDashboard(data);

        //-------------------------------------------------
        // Alarm Logic
        //-------------------------------------------------

        if(data.moisture >= 80){

            playAlarm();

            vibrate();

        }

        else{

            stopAlarm();

        }

    }

    catch(e){

        console.log(e);

    }

}

setInterval(refreshLoop,1000);

// ---------------- Startup ----------------

window.onload = ()=>{

    updateGauge(0);

};

// ---------------- Keyboard ----------------

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeDeviceModal();

    }

});

// ---------------- Animation ----------------

document.querySelectorAll(".card,.status-card,.recommend-card,.info-card")
.forEach(card=>{

    card.classList.add("success-pop");

});

// ---------------- Online Status ----------------

window.addEventListener("offline",()=>{

    alert("Connection Lost");

});

window.addEventListener("online",()=>{

    console.log("Back Online");

});

// ---------------- Helpers ----------------

function setRecommendation(text){

    recommendation.innerHTML=text;

}

function setStatus(title,msg){

    statusTitle.innerHTML=title;

    statusMessage.innerHTML=msg;

}

// ---------------- Debug ----------------

console.log("SmartPad Dashboard Loaded");

// ======================================================
// END
// ======================================================