/*

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

*/
var awsIot = require('aws-iot-device-sdk'); //require for aws iot 
var mraa = require('mraa'); //require mraa for analog/digital read/write
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console


/*
 * CONFIGURATION VARIABLES 
 * To set your AWS credentials, export them to your environment variables.
 * Run the following from the Edison command line:
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// AWS IoT Variables
var mqttPort = 8883;
var rootPath = '/home/root/awscerts/';
var awsRootCACert = "root-CA.pem.crt";
var awsClientCert = "certificate.pem.crt";
var awsClientPrivateKey = "private.pem.key";
var topicName = "Edison";
var awsClientId = "Edison";
var awsIoTHostAddr = "https://*******.amazonaws.com";


/*
 * Instance AWS variables for use in the application for
 * AWS IoT Certificates for secure connection.
 */
var privateKeyPath = rootPath + awsClientPrivateKey;
var clientCertPath = rootPath + awsClientCert;
var rootCAPath = rootPath + awsRootCACert;

//aws.config.region = REGION;
//var privateKey = fs.readFileSync(awsClientPrivateKey);
//var clientCert = fs.readFileSync(awsClientCert);
//var rootCA = [fs.readFileSync(awsRootCACert)];
//var kinesis = new aws.Kinesis();



/*
*Initializing Device Communication for AWS IoT
*/

var myThingName = 'Edison';

var thingShadows = awsIot.thingShadow({
     keyPath: privateKeyPath,
    certPath: clientCertPath,
    caPath: rootCAPath,
  clientId: awsClientId,
    region: 'us-west-2'
});
console.log("AWS IoT Device object initialized");


mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );
mythingstate["state"]["reported"]["ip"] = networkInterfaces['wlan0'][0]['address'];

var temperaturePin = new mraa.Aio(1); //setup access analog input Analog pin #1 (A1)
var temperatureValue = temperaturePin.read(); //read the value of the analog pin
console.log(temperatureValue); //write the value of the analog pin to the console


// calculate temperature
var tmpVoltage = ((temperatureValue*5.0)/1023.0); // convert analog value to voltage
var temperature = (5.26*Math.pow(tmpVoltage,3))-(27.34*Math.pow(tmpVoltage,2))+(68.87*tmpVoltage)-17.81;
console.log(temperature);


  thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName );

  // An update right away causes a timeout error, so we wait about 2 seconds
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 2500 );


  // Code below just logs messages for info/debugging
  thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

  thingShadows.on('update',
      function(thingName, stateObject) {
         console.log('received update '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('delta',
      function(thingName, stateObject) {
         console.log('received delta '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('timeout',
      function(thingName, clientToken) {
         console.log('received timeout for '+ clientToken)
      });

  thingShadows
    .on('close', function() {
      console.log('close');
    });
  thingShadows
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });
	
  
  //Watch for temperature & humidity
if(temperature > 25 && humidity < 60){//SNS terget: arn:aws:sns:us-west-2:316723939866:TemperaturAlarm
   thingShadows.publish('arn:aws:sns:us-west-2:316723939866:TemperaturAlarm', 
                        'Your room temperature is greater than 35deg C');
   }

});


var twilio = require('twilio');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var TWILIO_ACCOUNT_SID = '***********' ;
var TWILIO_AUTH_TOKEN = '**********';
var OUTGOING_NUMBER = '+91 *********'; 
var TWILIO_NUMBER = '**********';

var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

var mraa = require('mraa');
var jsUpmI2cLcd = require ('jsupm_i2clcd');

var lcd = new jsUpmI2cLcd.Jhd1313m1(6, 0x3E, 0x62);


var today = setInterval(function () 
    {
    var d = new Date();
    var b= d.toTimeString();
    lcd.setColor(0, 255, 0);

// Go to the 2nd row, 6th character (0-indexed)

    lcd.setCursor(0,0);
    lcd.write(b);
     var celsius = temp.value();
        var fahrenheit = celsius * 9.0/5.0 + 32.0;
        var t = Math.round(fahrenheit);
        lcd.setCursor(1, 1);
        lcd.write(t+" *F");
       v.saveValue(t);
}, 1000);



function timer() {
var d = new Date();
return (d.toTimeString());
} 


// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the Grove LED object using GPIO pin 2
var led = new groveSensor.GroveLed(3);
// Print the name
console.log(led.name());

// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the button object using GPIO pin 0
var button = new groveSensor.GroveButton(2);

// Read the input and print, waiting one second between readings
function readButtonValue() {
    console.log(button.name() + " value is " + button.value());
    var v=button.value();
    if(v==1){ led.on();}
    if(v==0){ led.off();}
}
setInterval(readButtonValue, 1000);

var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
console.log(temp.name());


// Load TTP223 touch sensor module
var sensorModule = require('jsupm_ttp223');

// Create the TTP223 touch sensor object using GPIO pin 0
var touch = new sensorModule.TTP223(4);

// Check whether or not a finger is near the touch sensor and
// print accordingly, waiting one second between readings
function readSensorValue()
{
    if ( touch.isPressed() )
    {
        
        client.sms.messages.create({
    to:OUTGOING_NUMBER,
    from:TWILIO_NUMBER,
    body:'Hi, sending from my Edison SmartWatch'
}, function(error, message) {
   
    if (!error) {
       
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('error: ' + error.message);
    }
});
       
        console.log(touch.name() + " is pressed");
        
        
    } 
    else 
    {
        console.log(touch.name() + " is not pressed");
      
    }
}
setInterval(readSensorValue, 1000);



// Load Grove module

// Read the temperature ten times, printing both the Celsius and
// equivalent Fahrenheit temperature, waiting one second between readings
var i = 0;
var waiting = setInterval(function() {
        var celsius = temp.value();
        var fahrenheit = celsius * 9.0/5.0 + 32.0;
        console.log(celsius + " degrees Celsius, or " +
            Math.round(fahrenheit) + " degrees Fahrenheit");
        i++;
        if (i == 10) clearInterval(waiting);
        }, 1000);







    
/* var accelrCompassSensor = require('jsupm_lsm303');

// Instantiate LSM303 compass on I2C
var myAccelrCompass = new accelrCompassSensor.LSM303(0);

setInterval(function()
{
	// Load coordinates into LSM303 object
	var successFail = myAccelrCompass.getCoordinates();
	// in XYZ order. The sensor returns XZY,
	// but the driver compensates and makes it XYZ
	var coords = myAccelrCompass.getRawCoorData();

    // Print out the X, Y, and Z coordinate data using two different methods
	var outputStr = "coor: rX " + coords.getitem(0)
					+ " - rY " + coords.getitem(1)
					+ " - rZ " + coords.getitem(2);
	console.log(outputStr);
	outputStr = "coor: gX " + myAccelrCompass.getCoorX()
				+ " - gY " + myAccelrCompass.getCoorY()
				+ " - gZ " + myAccelrCompass.getCoorZ();
	console.log(outputStr);

    // Get and print out the heading
	console.log("heading: " + myAccelrCompass.getHeading());

    // Get the acceleration
	myAccelrCompass.getAcceleration();
	var accel = myAccelrCompass.getRawAccelData();
    // Print out the X, Y, and Z acceleration data using two different methods
	outputStr = "acc: rX " + accel.getitem(0)
				+ " - rY " + accel.getitem(1)
				+ " - Z " + accel.getitem(2);
	console.log(outputStr);
	outputStr = "acc: gX " + myAccelrCompass.getAccelX()
				+ " - gY " + myAccelrCompass.getAccelY()
				+ " - gZ " + myAccelrCompass.getAccelZ();
	console.log(outputStr);
	console.log(" ");
}, 1000);

*/



function showLCD()
{
// Initialize the LCD.


// Make the backlight red
lcd.setColor(255, 0, 0);

// Go to the 2nd row, 6th character (0-indexed)

lcd.setCursor(0,0);
lcd.write('Alert');
lcd.setCursor(1, 1);
lcd.write('');

} 
    
 v.getDetails(function (err, details) {
    console.log(details);
  });

  v.saveValue(22);

  v.getValues(function (err, data) {
    console.log(data.results);
  });
});
