/**
  * Enumeration of motors.
  */
enum RBMotor
{
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

/**
  * Enumeration of directions.
  */
enum RBRobotDirection
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Enumeration of line sensors.
  */
enum RBLineSensor
{
    //% block="left"
    Left,
    //% block="right"
    Right
}


/**
  * Enumeration of Robobit Models and Options
  */
enum RBModel
{
    //% block="Mk1"
    Mk1,
    //% block="Mk2"
    Mk2, 
    //% block="Mk2/LedBar"
    Mk2A, 
    //% block="Mk3"
    Mk3
}

/**
 * Ping unit for sensor
 */
enum RBPingUnit
{
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches,
    //% block="μs"
    MicroSeconds
}

/**
 * Pre-Defined pixel colours
 */
enum RBColors
{
    //% block=red
    Red = 0xff0000,
    //% block=orange
    Orange = 0xffa500,
    //% block=yellow
    Yellow = 0xffff00,
    //% block=green
    Green = 0x00ff00,
    //% block=blue
    Blue = 0x0000ff,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xff00ff,
    //% block=white
    White = 0xffffff,
    //% block=black
    Black = 0x000000
}

/**
 * Custom blocks
 */
/** //% weight=10 color=#0fbc11 icon="\uf1ba" */
//% weight=10 color=#e7660b icon="\uf1ba"
namespace robobit
{
    let ledBar: neopixel.Strip;
    let _model: RBModel;
    let larsson: number;
    let scandir: number;
    let ledCount = 8;
    let leftSpeed = 0;
    let rightSpeed = 0;
    let _scanning = false;
    let scanColor1 = 0xff0000;
    let scanColor2 = 0x0f0000;
    let scanColor3 = 0x030000;

    /**
      * Select Model of Robobit (Determines Pins used)
      *
      * @param model Model of Robobit buggy. Mk1, Mk2, or Mk3
      */
    //% blockId="robobit_model" block="select Robobit model %model"
    //% weight=110
    export function select_model(model: RBModel): void
    {
        _model = model;
    }

    /**
      * Drive robot forward (or backward) at speed.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      */
    //% subcategory=Motors
    //% group=Motors
    //% blockId="robobit_motor_forward" block="drive at speed %speed"
    //% speed.min=-1023 speed.max=1023
    //% weight=110
    export function drive(speed: number): void
    {
        motor(RBMotor.Both, speed);
    }

    /**
      * Drive robot forward (or backward) at speed for milliseconds.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 1000
      */
    //% subcategory=Motors
    //% group=Motors
    //% blockId="robobit_motor_forward_milliseconds" block="drive at speed %speed| for %milliseconds|(ms)"
    //% speed.min=-1023 speed.max=1023
    //% weight=131
    export function driveMilliseconds(speed: number, milliseconds: number): void
    {
        drive(speed);
        basic.pause(milliseconds);
        drive(0);
    }

    /**
      * Spin robot in direction at speed.
      * @param direction direction to spin.
      * @param speed speed of motor between 0 and 1023. eg: 600
      */
    //% subcategory=Motors
    //% group=Motors
    //% blockId="robobit_turn" block="spin %direction|at speed %speed"
    //% speed.min=0 speed.max=1023
    //% weight=109
    export function driveTurn(direction: RBRobotDirection, speed: number): void
    {
        if (speed < 0)
            speed = 0;
        if (direction == RBRobotDirection.Left)
        {
            motor(RBMotor.Left, -speed);
            motor(RBMotor.Right, speed);
        }
        else if (direction == RBRobotDirection.Right)
        {
            motor(RBMotor.Left, speed);
            motor(RBMotor.Right, -speed);
        }
    }

    /**
      * Turn robot in direction at speed for milliseconds.
      * @param direction direction to turn.
      * @param speed speed of motor between 0 and 1023. eg: 600
      * @param milliseconds duration in milliseconds to turn for, then stop. eg: 1000
      */
    //% subcategory=Motors
    //% group=Motors
    //% blockId="robobit_turn_milliseconds" block="spin %direction|at speed %speed| for %milliseconds|(ms)"
    //% speed.min=0 speed.max=1023
    //% weight=130
    export function driveTurnMilliseconds(direction: RBRobotDirection, speed: number, milliseconds: number): void
    {
        driveTurn(direction, speed)
        basic.pause(milliseconds)
        motor(RBMotor.Both, 0)
    }

    /**
      * Drive motor(s) forward or reverse.
      * @param motor motor to drive.
      * @param speed speed of motor eg: 600
      */
    //% subcategory=Motors
    //% group=Motors
    //% blockId="robobit_motor" block="drive %motor| motor at speed %speed"
    //% weight=100
    export function motor(motor: RBMotor, speed: number): void
    {
        let forward = (speed >= 0);
        let absSpeed = Math.abs(speed);
        if ((motor == RBMotor.Left) || (motor == RBMotor.Both))
            leftSpeed = absSpeed;
        if ((motor == RBMotor.Right) || (motor == RBMotor.Both))
            rightSpeed = absSpeed;
        setPWM();
        if (speed > 1023)
        {
            speed = 1023;
        }
        else if (speed < -1023)
        {
            speed = -1023;
        }
        let realSpeed = speed;
        if (!forward)
        {
            if (realSpeed >= -200)
                realSpeed = (realSpeed * 19) / 6;
            else if (realSpeed >= -400)
                realSpeed = realSpeed * 2;
            else if (realSpeed >= -600)
                realSpeed = (realSpeed * 3) / 2;
            else if (realSpeed >= -800)
                realSpeed = (realSpeed * 5) / 4;
            realSpeed = 1023 + realSpeed; // realSpeed is negative
        }
        if ((motor == RBMotor.Left) || (motor == RBMotor.Both))
        {
            pins.analogWritePin(AnalogPin.P0, realSpeed);
            pins.digitalWritePin(DigitalPin.P8, forward ? 0 : 1);
        }
        if ((motor == RBMotor.Right) || (motor == RBMotor.Both))
        {
            pins.analogWritePin(AnalogPin.P1, realSpeed);
            pins.digitalWritePin(DigitalPin.P12, forward ? 0 : 1);
        }
    }

    /**
      * Read line sensor.
      *
      * @param sensor Line sensor to read.
      */
    //% subcategory=Sensors
    //% group=Sensors
    //% blockId="robobit_read_line" block="read line sensor %sensor"
    //% weight=80
    export function readLine(sensor: RBLineSensor): number
    {
        if (sensor == RBLineSensor.Left)
	{
	    if (_model == RBModel.Mk3)
            	return pins.digitalReadPin(DigitalPin.P16);
	    else
            	return pins.digitalReadPin(DigitalPin.P11);
        }
        else
	{
	    if (_model == RBModel.Mk3)
            	return pins.digitalReadPin(DigitalPin.P14);
	    else
            	return pins.digitalReadPin(DigitalPin.P5);
        }
    }


    /**
    * Read distance from sonar module connected to accessory connector.
    *
    * @param unit desired conversion unit
    */
    //% subcategory=Sensors
    //% group=Sensors
    //% blockId="robobit_sonar" block="read sonar as %unit"
    //% weight=90
    export function sonar(unit: RBPingUnit): number
    {
        // send pulse
        let trig = DigitalPin.P13;
	if (_model == RBModel.Mk3)
	    trig = DigitalPin.P15;
	if (_model == RBModel.Mk2A)
	    trig = DigitalPin.P15;
        let echo = trig;
        let maxCmDistance = 500;
        let d=10;
        pins.setPull(trig, PinPullMode.PullNone);
        for (let x=0; x<10; x++)
        {
            pins.digitalWritePin(trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            // read pulse
            d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
            if (d>0)
                break;
        }
        switch (unit)
        {
            case RBPingUnit.Centimeters: Math.round(return d / 58);
            case RBPingUnit.Inches: Math.round(return d / 148);
            default: return d;
        }
    }

    /**
      * Adjust opening of Claw attachment
      * @param degrees Degrees to open Claw. eg: 30
      */
    //% subcategory=Sensors
    //% group=Sensors
    //% blockId="robobit_set_claw" block="Set claw %degrees"
    //% weight=70
    export function setClaw(degrees: number): void
    {
        pins.servoWritePin(AnalogPin.P13, Math.clamp(0, 80, degrees))
    }

    function setPWM(): void
    {
        if ((leftSpeed < 400) || (rightSpeed < 400))
            pins.analogSetPeriod(AnalogPin.P0, 60000);
        else if ((leftSpeed < 600) || (rightSpeed < 600))
            pins.analogSetPeriod(AnalogPin.P0, 40000);
        else
            pins.analogSetPeriod(AnalogPin.P0, 30000);
    }

    function neo(): neopixel.Strip
    {
        if (!ledBar)
        {
            ledBar = neopixel.create(DigitalPin.P13, 8, NeoPixelMode.RGB);
            ledBar.setBrightness(40);
        }
        return ledBar;
    }

    /**
      * Sets all pixels to a given colour
      *
      * @param rgb RGB colour of the pixel
      */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="cubebit_set_color" block="set all pixels to %rgb=rb_colours"
    //% weight=90
    export function setColor(rgb: number): void
    {
        neo().showColor(rgb);
    }

    /**
     * Set a pixel to a given colour (using colour names).
     *
     * @param ID location of the pixel in the cube from 0
     * @param rgb RGB color of the LED
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_set_pixel_color" block="set pixel color at %ID|to %rgb=rb_colours"
    //% weight=85
    export function setPixel(ID: number, rgb: number): void
    {
        neo().setPixelColor(ID, rgb);
    }

    /**
     * Convert from RGB values to colour number
     *
     * @param red Red value of the LED 0:255
     * @param green Green value of the LED 0:255
     * @param blue Blue value of the LED 0:255
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_convertRGB" block="convert from red %red| green %green| blue %bblue"
    //% weight=55
    export function convertRGB(r: number, g: number, b: number): number
    {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

    /**
      * Show pixels
      */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_show" block="show Led Bar changes"
    //% weight=95
    export function neoShow(): void
    {
        neo().show();
    }

    /**
      * Clear leds.
      */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_clear" block="clear all pixels"
    //% weight=80
    export function neoClear(): void
    {
        neo().clear();
    }

    /**
      * Shows a rainbow pattern on all pixels
      */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_rainbow" block="set Led Bar rainbow"
    //% weight=75
    export function neoRainbow(): void
    {
        neo().showRainbow(1, 360);
    }

    /**
     * Shift LEDs forward and clear with zeros.
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_shift" block="shift pixels"
    //% weight=65
    export function neoShift(): void
    {
        neo().shift(1);
    }

    /**
     * Rotate LEDs forward.
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_rotate" block="rotate pixels"
    //% weight=70
    export function neoRotate(): void
    {
        neo().rotate(1);
    }

    /**
     * Set the brightness of the Led Bar. Note this only applies to future writes to the strip.
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_brightness" block="set Led Bar brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=92
    export function neoBrightness(brightness: number): void
    {
        neo().setBrightness(brightness);
    }

    /**
      * Gets numeric value of colour
      *
      * @param color Standard RGB Led Colours
      */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="rb_colours" block=%color
    //% weight=60
    export function RBColours(color: RBColors): number
    {
        return color;
    }

    /**
      * Start Scanner
      * @param color the colour to use for scanning
      * @param delay time in ms between scan steps, eg: 100,50,200,500
      */
    //% blockId="rb_startScanner" block="start scan %color=rb_colours| with %delay|(ms)"
    //% subcategory=LedBar
    //% group=LedBar
    //% delay.min=1 delay.max=10000
    //% weight=78
    export function startScanner(color: number, delay: number): void
    {
        scanColor1 = color;
        scanColor2 = reduce(scanColor1, 8);
        scanColor3 = reduce(scanColor2, 4);
        if(_scanning == false)
        {
            _scanning = true;
            control.inBackground(() =>
            {
                while (_scanning)
                {                                
                    ledScan();
                    neoShow();
                    basic.pause(delay);
                }
            })
        }
    }

    /**
      * Reduce colour RGB separately by divisor
      */
    function reduce(color: number, reducer: number): number
    {
        let red = ((color & 0xff0000) / reducer) & 0xff0000;
        let green = ((color & 0x00ff00) / reducer) & 0x00ff00;
        let blue = ((color & 0x0000ff) / reducer) & 0x0000ff;
        return red + green + blue;
    }

    /**
      * Stop Scanner
      */
    //% block
    //% subcategory=LedBar
    //% group=LedBar
    //% weight=76
    export function stopScanner(): void
    {
        _scanning = false;
    }

    /**
     * Use centre 6 LEDs as Larsson Scanner. Each call moves the scan by one pixel
     */
    //% subcategory=LedBar
    //% group=LedBar
    //% blockId="robobit_ledScan" block="scan centre pixels"
    //% weight=50
    //% deprecated=true
    export function ledScan(): void
    {
        if (!larsson)
        {
            larsson = 1;
            scandir = 1;
        }
        larsson += scandir;
        if (larsson >= (ledCount - 2))
            scandir = -1;
        else if (larsson <= 1)
            scandir = 1;
        for (let x = 1; x < (ledCount-1); x++)
        {
            if ((x == (larsson - 2)) || (x == (larsson + 2)))
                setPixel(x, scanColor3);
            else if ((x == (larsson - 1)) || (x == (larsson + 1)))
                setPixel(x, scanColor2);
            else if (x == larsson)
                setPixel(x, scanColor1);
            else
                setPixel(x, 0);
        }
    }
}
