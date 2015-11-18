# Hannibal
Checks JSON against a set of rules (schema or plan). Useful for defining APIs and interfaces.

![circleci](https://circleci.com/gh/oliverbrooks/hannibal.png?style=shield)
![Dependency Status](https://david-dm.org/oliverbrooks/hannibal.svg)
![Dev Dependency Status](https://david-dm.org/oliverbrooks/hannibal/dev-status.svg)

![love it when a plan comes together](https://images.rapgenius.com/530583e79e4fc7f75855995d511e185c.400x294x1.jpg)


## Install
To install

    npm i hannibal --save


## Try it
You can try it now over [here](http://pearlshare.github.io/hannibal#try_it) or read on


## Objectives
The objectives are

 * Validate an object, array or primitive and provide clear error reporting.
 * Easily extensible functionality using simple JavaScript.
 * Provide a handy set of common validations such as min/max values, regex and enums to get going quickly but without going overboard.
 * Be fast and lightweight.


## Basic usage
Create a validator to check a user object is valid.

```js
// Load Hannibal
var Hannibal = require("hannibal");

// Create a Hannibal instance
var hannibal = new Hannibal();

// Create a validator by adding a schema
var validator = hannibal.create({
    type: "object",
    schema: {
        name: {
            type: "string"
        },
        age: {
            type: "number"
        },
        address: {
            type: "object",
            schema: {
                street: {
                    type: "string"
                },
                city: {
                    type: "string"
                }
            }
        }
    }
});

// Check a valid user
validator({
    name: "John Smith",
    age: 53,
    address: {
        street: "The underground",
        city: "Los Angeles"
    }
}) // {isValid: true, data: {name: "John Smith", ...}}

// Check an invalid user
validator({
    name: "Templeton Peck",
    age: "38",
    address: {
        city: "Los Angeles"
    }
}) // {isValid: false, error: {age: {type: "is not a string", address: {street: {required: "is not provided"}}}}, data: {name: "Templeton Peck"}}
```


## Schema building
The schema defines the validation rules.


### Types
Types represent the primitive types allowed. These are provided as either a string or array of strings.

Available types:

 * string
 * date
 * boolean
 * time
 * number
 * array
 * object
 * null


### Required
When set to `true` the required statement will error if the given key is not provided in the input object. Note this does not check the value, purely the presence of the key.


### Validators
Validators check the value against a set of criteria. Available validators are:

String:

 * regex - perform a regex match
 * min - check the minimum length
 * max - check the maximum length
 * enum - check the value is contained in a given array

Number:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array
 * minPrecision - minimum number of decimal places
 * maxPrecision - maximum number of decimal places

Date/Time:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array

Array:

 * min - check the minimum length
 * max - check the maximum length

Custom validators can be given via the `custom` key or registered with `hannibal`. Custom validators are provided with the value to validate and the argument provided in the schema.

Custom validators should throw an instance of `Error` with a message.


### Transforms
Transforms run before validation and can be used to convert or cast a value. These are provided as a single or array of strings or functions.

Packaged transforms include:

 * toString - convert numbers into strings
 * toInteger - convert strings into integers
 * toFloat  - convert strings into floats
 * toDate  - convert strings into dates
 * toArray  - wrap non arrays into an array

See `lib/transforms.js` for the full list.

Custom transforms can be registed when creating a Hannibal instance or added in-line via functions in the schema. 


## Advanced usage
Hannibal provides basic validation functionality out of the box and also enables easy customisation.

To customise create a new instance passing a customisation object. The customisation object will will add to and override the default set or `transforms` and `validators`.


### Customise Hannibal
```js
// Load Hannibal
var Hannibal = require("hannibal");

// Create a Hannibal instance with custom filters and validators registered
var hannibal = new Hannibal({
    transforms: {
        addThe: function (value) {
            if (typeof value === "string") {
                return "The " + value;
            } else {
                return value;
            }
        }
    },
    validators: {
        string: {
            bannedHouses: function (value, attr) {
                if (value === attr) {
                    throw new Error("The A-Team can't stay in a: " + value);
                }
            }
        }
    }
});
```


### Define schema
```js
// Create a validator from the customised Hannibal instance
var validator = hannibal.create({
    type: "object",
    schema: {
        name: {
            type: "string", // value must be a string if present
            required: true, // If the key is missing will raise error
            validators: {
                min: 2, // Minimum value string length
                max: 50 // Maximum value string length
            }
        },
        age: {
            type: ["number", "null"], // value must be an number or null
            transforms: "toInt", // before validation perform a built in function
            validators: {
                min: 0, // min value
                max: 120 // max value
            }
        },
        phone: {
            type: "string",
            validators: {
                regex: "\+\d{2,3}\s\d{10,12}$" // Check regex match
            }
        },
        gender: {
            type: "string",
            validators: {
                enum: ["male", "female"] // value must be one of male/female
            }
        },
        address: {
            type: ["object", "null"], // allow an object or null
            schema: {
                house: {
                    type: "string",
                    required: true // If the address object is present then it must have a 'house' key
                    validators: {
                        bannedHouses: "Garage full of tools"
                    }
                },
                street: {
                    type: ["string", "null"],
                    transforms: "addThe"
                },
                city: {
                    type: "string",
                    required: true
                },
                country: {
                    type: "string",
                    transforms: "toUppercase",
                    required: true,
                    validators: {
                        enum: ["GB", "US", "AU"]
                    }
                }
            }
        },
        dateOfBirth: {
            type: "date", // value must be a date object
            required: true,
            transforms: "toDate" // cast date string into date
        }
        
    }
});
```


### Validate objects
```js
var plan1 = validator({
    name: "Hannibal Smith",
    age: 53,
    phone: "+01 2233445566",
    gender: "male",
    address: {
        street: "Underground",
        city: "Los Angeles",
        country: "US"
    },
    dateOfBirth: "Fri Oct 16 1955 12:15:35 GMT+0100 (BST)"
});

// Boolean if the object is valid
plan1.isValid // true

// Show all errors from validation
plan1.error // null

// Output valid data
plan1.data // {name: "Hannibal Smith", ...}

var plan2 = validator({
    name: "B A Baracus",
    age: "38",
    phone: "+01 6665554443",
    gender: "male",
    address: {
        city: "Los Angeles",
        country: "US"
    }
});

// Boolean if the object is valid
plan2.isValid // false

// Show all errors from validation
plan2.error // {address: {street: {required: "key was not provided"}},dateOfBirth: {required: "key was not provided"}}

// Output valid data
plan2.data // {name: "B A Baracus", age: 38, ...}
```


## Pro tips
Schemas are objects which can be easily composed together.

One off custom validators and transforms can be added directly to a schema definition.

```js
{
    type: "string",
    transforms: function (value) {
        return "I'm transforming " + value + " with my additions";
    },
    validators: {
        myCustomValidator: function (value) {
            if (value.match(/plane/)) {
                throw new Error("Ain't getting on no damn plane fool")
            }
        }
    }
}
```

Transforms can accept an additional argument of an object. This is provided as a second argument to the validator. This is useful if your transform depends on other objects such as a user.

```js
var Hannibal = require("hannibal");
var hannibal = new Hannibal();
var validator = hannibal.create({
    type: "number",
    // Transform which takes the value and arguments
    transforms: function (value, args) {
        return value * args.multiplier
    }
});
// Define validator with second argument to pass to all transforms
validator(2, {multiplier: 5}) // {isValid: true, data: 10, ...}
```


## Test
Run tests using `npm test`.
