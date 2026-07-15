from datetime import datetime


class SensorData:
    def __init__(self):
        self.connected = False

        self.port = ""

        self.raw = 0
        self.filtered = 0
        self.baseline = 3900

        self.state = "DRY"

        self.moisture = 0

        self.recommendation = "Waiting for sensor..."

        self.last_update = None

    def update(self, raw, filtered, baseline, state):
        self.connected = True

        self.raw = int(raw)
        self.filtered = int(filtered)
        self.baseline = int(baseline)

        self.state = state

        # ---------- Moisture Percentage ----------
        # Dry = baseline
        # Fully wet ≈ baseline - 2200

        full_wet = self.baseline - 2200

        if full_wet < 0:
            full_wet = 0

        moisture = (
            (self.baseline - self.filtered)
            /
            (self.baseline - full_wet)
        ) * 100

        moisture = max(0, min(100, moisture))

        self.moisture = round(moisture)

        # ---------- Recommendation ----------

        if self.moisture < 20:
            self.recommendation = "Pad is dry."

        elif self.moisture < 40:
            self.recommendation = "Slight moisture detected."

        elif self.moisture < 60:
            self.recommendation = "Pad is moderately wet."

        elif self.moisture < 80:
            self.recommendation = "Consider changing your pad."

        else:
            self.recommendation = "Replace pad now."

        self.last_update = datetime.now()

    def disconnect(self):
        self.connected = False


sensor = SensorData()