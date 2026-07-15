import threading
import time
import serial
import serial.tools.list_ports

from sensor import sensor


serial_connection = None
reader_running = False


def list_ports():
    """
    Returns all available COM ports.
    """
    ports = serial.tools.list_ports.comports()

    return [
        {
            "device": p.device,
            "description": p.description
        }
        for p in ports
    ]


def connect(port_name, baudrate=115200):
    """
    Connect to selected COM port.
    """

    global serial_connection
    global reader_running

    disconnect()

    try:
        serial_connection = serial.Serial(
            port_name,
            baudrate=baudrate,
            timeout=1
        )

        reader_running = True

        threading.Thread(
            target=read_loop,
            daemon=True
        ).start()

        sensor.port = port_name

        return True

    except Exception as e:

        print(e)

        serial_connection = None

        return False


def disconnect():

    global serial_connection
    global reader_running

    reader_running = False

    sensor.disconnect()

    if serial_connection:

        try:
            serial_connection.close()
        except:
            pass

    serial_connection = None


def read_loop():

    global serial_connection
    global reader_running

    print("Started Serial Reader")

    while reader_running:

        try:

            line = serial_connection.readline().decode(
                "utf-8",
                errors="ignore"
            ).strip()

            if not line:
                continue

            # Expected:
            # raw,filtered,baseline,state

            parts = line.split(",")

            if len(parts) != 4:
                continue

            raw = int(parts[0])
            filtered = int(parts[1])
            baseline = int(parts[2])
            state = parts[3]

            sensor.update(
                raw,
                filtered,
                baseline,
                state
            )

        except Exception as e:

            print(e)

            sensor.disconnect()

            time.sleep(1)