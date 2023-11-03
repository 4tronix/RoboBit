# MakeCode Package for 4tronix Robobit Buggy Robot

This library provides a Microsoft Makecode package for [4tronix Robobit Buggy all versions](https://4tronix.co.uk/robobit)

## Selecting the Robobit Version
The RoboBit Buggy has evolved through Mk1, Mk2 and now Mk3. These use slightly different pins for the options sensors.
Additionally using the LedBar with Mk2 forces the Ultrasonic to change pins
So it is important to set the model of  RoboBit at the start of the program:

Select Mk3 RoboBit:

```block
robobit.select_model(RBModel.Mk3);
```   

## Driving the robot    
The simplest way to drive the robot is by using the `go(...)` or `goms(...)` blocks.
With each of these blocks you specify Forward or Reverse, and a speed from 0 to 100.
Both motors will be driven at the selected speed and direction.

Move forward at speed 60 forever:

```block
robobit.go(RBDirection.Forward, 60)
```

Move backward at speed 100 for 2000 ms:

```block
robobit.goms(RBDirection.Reverse, 100, 2000)
```

You can also spin/rotate the robot with the `rotate(...)` or `rotatems(...)` blocks
Rotate left at speed 70:

```block
robobit.rotate(RBRobotDirection.Left, 70)
```

Rotate right at speed 50 for 400ms:

```block
robobit.rotatems(RBRobotDirection.Right, 50, 400)
```   

## Stopping
When the motor speed is set to zero then it stops. However, we can also use the motor itself to create a reverse generated current to brake much quicker.
This helps when aiming for more accurate manoeuvres. Use the `stop(...)` command to stop with braking, or coast to a halt:

Slowly coast to a stop:

```block
robobit.stop(RBStopMode.Coast)
```

Rapidly brake:

```block
robobit.stop(RBStopMode.Brake)
```

## Driving the motors individually

If you want more fine grain control of individal motors, use `robobit.move(...)` to drive each motor either forward or reverse.
You can specify the direction (Forward or Reverse) and speed between 0 and 100.
If the left motor turns slower than the right motor, the robot will turn to the left


Drive both motors forward at speed 60. Equivalent to robobit.go(RBDirection.Forward, 60)
```block
robobit.move(RBMotor.Both, RBDirection.Forward, 60)
```

Drive left motor in reverse at speed 30:

```block
robobit.move(RBMotor.Left, RBDirection.Reverse, 30)
```

Drive forward in a leftward curve:

```blocks
robobit.move(RBMotor.Left, RBDirection.Forward, 40)
robobit.move(RBMotor.Right, RBDirection.Forward, 70)
```

## Making the Robot Drive Straight

The small DC motors used in the Robobit and many other small robots are not guaranteed to go at the same speed as each other.
This can cause the robot to veer off the straight line, either to left or to right, even when both motors are programmed to go
at the same speed.
We can partially correct for this by adding a direction bias to the motor speed settings.
If your robot is veering to the right, then set the bias to the left.
Conversely, if your robot is turning to the left, then set the bias to the right.
It varies with speed and battery condition etc, but an approximation is that a 10% bias will result in about 15cm (6 inches)
change of course over about 2m (6 feet).
Set the bias value at the start of the program, then the motor blocks used later in the program will all use these bias values.
Note that the bias setting does not affect the old style motor blocks.

eg. robot leaves straight line to the right by about 10cm over 2m, so bias it to the left by 5%:

```block
robobit.RBBias(RBRobotDirection.Left, 5)
```

eg. robot leaves straight line to left by 25cm, so bias it to the right by 15%:

```block
robobit.RBBias(RBRobotDirection.Right, 15)
```

## Read line sensor

The Robobit has two line-sensors: left and right. To read the value of the
sensors, use `robobit.readLine(..)` function.

Read left and right line sensor:

```blocks
let left = robobit.readLine(RBLineSensor.Left);
let right = robobit.readLine(RBLineSensor.Right);
```

## Read sonar value

If you have mounted the optional sonar sensor for the Robobit you can
also use the `robobit.sonar(..)` function to read the distance to obstacles.

Read sonar values:

```blocks
robobit.sonar(RBPingUnit.MicroSeconds);
robobit.sonar(RBPingUnit.Centimeters);
robobit.sonar(RBPingUnit.Inches);
```

## FireLed Functions

The Robobit optionally has 8 FireLeds fitted (integrated into the Mk3)
By default, the FireLeds are automatically updated after every setting. This makes it easy to understand.
However, it can slow down some effects so there is a block provided to switch the update mode to
Manual or Automatic:

Set all FireLeds to Green (hard-coded RGB color):
Set all FireLeds to Green (built-in colour selection):

```blocks
robobit.setLedColor(0x00FF00)
robobit.setLedColor(RBColors.Green)
```

Clear all leds:

```block
robobit.ledClear()
```

Set the FireLed at position 0 to 7 to selected colour. eg. set Fireled 3 to Red:

```block
robobit.setPixelColor(3, 0xff0000)
```

Set all the FireLeds to Rainbow (uses the colour wheel from Red to Purple):

```block
robobit.ledRainbow()
```

Shift FireLeds up one place, blanking the first FireLed:

```block
robobit.ledShift()
```

Rotate FireLeds by shifting up one and replace the first with the last:

```block
robobit.ledRotate()
```

There are some more advanced blocks that allow you to select colours using separate RGB values
and select the brightness of the FireLeds.
The brightness is set to 40 by default, but can go as high as 255
You should be careful not to look directly at them when they are bright as they can damage eyes.

Switch FireLeds Update Mode to Manual or Automatic:

```blocks
robobit.setUpdateMode(RBMode.Manual)
robobit.setUpdateMode(RBMode.Auto)
```

Select colour from separate Red, Green and Blue values
Each of the Red, Green and Blue values can range from 0 to 255.
This example produces a pale blue colour:

```block
robobit.convertRGB(50, 100, 200)
```

Set brightness of FireLeds to 100:

```block
robobit.ledBrightness(100)
```

## Larsson Scanner
The Robobit can automatically drive a Larsson scanner on the middle 6 FireLeds.
This moves a group of LEDs in the selected colour backwards and forwards across the LedBar.

Start the scanner to run in the background at the speed and colour you choose. Here we select the Red and 100ms scanning rate:

```block
robobit.startScanner(0xff0000, 100)
```

And stop it with:

```block
robobit.stopScanner();
```

## Supported targets

* for PXT/microbit

## License

MIT
