# 🩸 Smart Menstrual Pad Leakage Detection System

A low-cost wearable IoT prototype that monitors menstrual pad saturation in real time using an **ESP32-C3 SuperMini** and a **conductive textile sensor**. The system estimates pad wetness, alerts users when replacement is recommended, and provides a simple, mobile-friendly dashboard for monitoring.

---

# 📌 Overview

Many people rely on guesswork to determine when to change a sanitary pad, which may lead to discomfort, leakage, skin irritation, and unnecessary pad replacement.

This project aims to provide an affordable smart solution by continuously monitoring moisture using conductive threads embedded in a sanitary pad. The collected sensor data is processed by an ESP32 and visualized through a clean web dashboard.

---

# ✨ Features

- 📡 Real-time moisture monitoring
- 🩸 Wetness percentage estimation
- 🟢 Dry / 🟡 Damp / 🔴 Wet state detection
- 🚨 Leakage risk prediction
- 🔔 Pad replacement recommendation
- 📈 Live dashboard updates
- 📱 Mobile-friendly interface
- ⚙️ Engineer mode for debugging
- 🔌 USB Serial communication
- 🌐 FastAPI backend
- 📊 Live sensor visualization

---

# 🏗 System Architecture

```
Conductive Threads
        │
        ▼
ESP32-C3 SuperMini
        │
USB Serial
        │
FastAPI Backend
        │
Sensor Processing
        │
REST API
        │
HTML/CSS/JavaScript Dashboard
```

---

# 🛠 Hardware Used

| Component | Purpose |
|------------|----------|
| ESP32-C3 SuperMini | Main microcontroller |
| Conductive Thread | Moisture sensing electrodes |
| 100kΩ Resistor | Voltage divider |
| Breadboard | Prototype testing |
| Jumper Wires | Connections |
| Cloth / Fabric | Sensor testing |
| USB Cable | Data & Power |

---

# 💻 Software Stack

## Backend

- Python
- FastAPI
- Uvicorn
- PySerial

## Frontend

- HTML5
- CSS3
- JavaScript

## Embedded

- Arduino Framework
- ESP32 Arduino Core

---

# ⚙️ Working Principle

The conductive thread behaves as a variable resistor.

When the cloth is dry:

- High resistance
- High ADC value

When moisture increases:

- Resistance decreases
- ADC value decreases

The ESP32 continuously reads the analog voltage and estimates the moisture level.

---

# Sensor Calibration

During startup:

1. Sensor remains dry
2. ESP32 samples ADC values
3. Average value becomes the dry baseline

Example

```
Dry Baseline = 3900
```

Later every reading is compared against this baseline.

---

# Moisture Estimation

Instead of using fixed values only, moisture is estimated from the measured resistance.

```
Moisture %

=
((Baseline ADC - Current ADC)

/
(Baseline ADC - Fully Wet ADC))

×100
```

The result is clamped between

```
0%
```

and

```
100%
```

This provides a smooth and continuous moisture percentage.

---

# State Detection

| State | Moisture |
|--------|----------|
| Dry | 0–25% |
| Damp | 25–60% |
| Replace Soon | 60–80% |
| Change Pad | 80–100% |

---

# Dashboard

The dashboard displays

- Moisture Percentage
- Current Pad Status
- Leakage Risk
- Remaining Capacity
- Recommendation
- Live Updates
- Connection Status

Engineer mode additionally shows

- Raw ADC
- Filtered ADC
- Baseline
- COM Port
- Sensor State

---

# Folder Structure

```
project/

│
├── app/
│   ├── main.py
│   ├── serial_reader.py
│   ├── routes.py
│   └── sensor.py
│
├── static/
│   ├── style.css
│   ├── script.js
│   └── alarm.mp3
│
├── templates/
│   └── index.html
│
├── requirements.txt
│
└── README.md
```

---

# Running the Project

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 2. Connect ESP32

Connect the ESP32 using USB.

Find the serial port.

Example

Windows

```
COM5
```

Linux

```
/dev/ttyUSB0
```

Mac

```
/dev/cu.usbserial
```

---

## 3. Start FastAPI

```bash
uvicorn app.main:app --reload
```

---

## 4. Open Browser

```
http://127.0.0.1:8000
```

---

# Sensor Connection

```
3.3V
 │
100kΩ
 │
GPIO4
 │
Conductive Thread
 │
Moist Cloth
 │
Ground Thread
 │
GND
```

---

# Data Flow

```
Conductive Thread

↓

ESP32 ADC

↓

Filtering

↓

Calibration

↓

State Detection

↓

Serial Output

↓

FastAPI

↓

Dashboard

↓

User
```

---

# Example Output

```
Raw ADC

1730

Filtered

1765

Baseline

3890

Moisture

58%

Status

DAMP

Recommendation

Monitor pad condition.
```

---

# Current Features

- Real-time sensor monitoring
- Automatic dry calibration
- Noise filtering
- Debouncing
- Moisture estimation
- Live dashboard
- Responsive UI
- USB Serial communication

---

# Future Improvements

- Bluetooth Low Energy (BLE)
- Wi-Fi communication
- Mobile application
- Cloud synchronization
- Multiple sensing zones
- Battery monitoring
- Push notifications
- Historical analytics
- Machine learning based saturation prediction
- Rechargeable wearable module

---

# Applications

- Smart menstrual health monitoring
- Women's healthcare
- Wearable IoT
- Assistive healthcare devices
- Remote monitoring
- Biomedical engineering education

---

# Educational Purpose

This project was developed as an educational prototype to demonstrate the integration of

- Embedded Systems
- IoT
- Wearable Electronics
- Biomedical Sensors
- Web Development
- Signal Processing

into a practical healthcare application.

It is **not intended to replace certified medical devices**.

---

# License

This project is released under the MIT License.

Feel free to use, modify, and improve it for educational and research purposes.

---

# Author

Developed as an IoT wearable healthcare prototype using:

- ESP32-C3 SuperMini
- FastAPI
- Python
- HTML
- CSS
- JavaScript
- Arduino Framework

---
# Demostration
https://youtube.com/shorts/NVeTMWgda5M?si=ROoE37gbmFttadlZ

## ⭐ If you found this project useful, consider giving it a star and contributing improvements.

