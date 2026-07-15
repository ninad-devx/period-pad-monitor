from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from serial_reader import (
    list_ports,
    connect,
    disconnect
)

from sensor import sensor


app = FastAPI(title="Smart Period Pad Monitor")


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# -----------------------------
# Home
# -----------------------------

@app.get("/", response_class=HTMLResponse)
def home(request: Request):

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "ports": list_ports()
        }
    )


# -----------------------------
# Connect ESP32
# -----------------------------

@app.post("/connect")
def connect_port(port: str = Form(...)):

    success = connect(port)

    return RedirectResponse(
        "/",
        status_code=303
    )


# -----------------------------
# Disconnect
# -----------------------------

@app.post("/disconnect")
def disconnect_port():

    disconnect()

    return RedirectResponse(
        "/",
        status_code=303
    )


# -----------------------------
# Sensor API
# -----------------------------

@app.get("/sensor")
def sensor_data():

    return JSONResponse({

        "connected": sensor.connected,

        "port": sensor.port,

        "raw": sensor.raw,

        "filtered": sensor.filtered,

        "baseline": sensor.baseline,

        "state": sensor.state,

        "moisture": sensor.moisture,

        "recommendation": sensor.recommendation,

        "last_update": str(sensor.last_update)

    })


# -----------------------------
# Available COM Ports
# -----------------------------

@app.get("/ports")
def ports():

    return list_ports()