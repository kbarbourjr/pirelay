import importlib
from flask import Flask, request, abort, jsonify, redirect
app = Flask(__name__)

# If running on raspi, import gpiozero
is_raspi = importlib.util.find_spec("RPi") is not None
if is_raspi:
    import RPi.GPIO as GPIO
else:
    print("Faking GPIO because RPi spec not detected")
    import fake_gpio as GPIO
    GPIO.debug = True


# Configure a list of Relays
relay_cfg = [
   #(PIN, NAME)
    (14, "Main Power"),
    (15, "Main Lights"),
    (18, "LEDs"),
    #(23, "Relay3"),
    #(24, "Relay4"),
    #(25, "Relay5"),
    #(8,  "Relay6"),
    #(7,  "Relay7")
]
relays = [{'id': i, 'active': False, 'pin':pin, 'name':name} for i, (pin, name) in zip(range(len(relay_cfg)), relay_cfg)]


# GPIO settings
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(True)


# HTTP Routes
@app.route('/')
def root():
    return redirect('/static/app.html', code=301)

@app.route('/relays/', methods=['GET']) # Get a list of all relays
def relay_index():
    return jsonify(relays)

@app.route('/relays/<int:relay_id>', methods=['GET', 'PUT']) # Get a single relay
def relay(relay_id):

    # Bounds checking to make sure this relay exists
    if relay_id > len(relays):
        abort(404)

    relay = relays[relay_id]

    if request.method == 'PUT':
        if 'active' in request.form:
            new_state = False if request.form['active'] in ['off','false','0'] else True
            relays[relay_id]['active'] = new_state
            GPIO.output(relay['pin'], new_state)

    return jsonify(relay)


# Main Application
if __name__ == '__main__':
    app.run(debug=True)
