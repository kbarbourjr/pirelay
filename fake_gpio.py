
OUT = 'OUTPUT'
BCM = 'BCM'
debug = False

def setup(pin, mode):
    if debug:
        print("Setting pin %d to %s mode" % (pin, mode))
    return mode

def output(pin, value):
    if debug:
        print("Setting pin %d to %s" % (pin, "HIGH" if value else "LOW"))
    return bool(value)

def setmode(mode):
    return mode

def setwarnings(val):
    return val
