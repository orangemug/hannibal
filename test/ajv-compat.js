var assert = require("assert");
var expect = require("expect.js");
var Hannibal = require("../index");
var hannibal = new Hannibal({
  transforms: require("../transforms/string")
});
var Ajv = require('ajv');
var ajv = new Ajv(); 
var lodash = require("lodash");


const schema = {
  type: "object",
  properties: {
    address: {
      type: "object",
      // required: true,
      properties: {
        street: {
          type: "string"
        },
        country: {
          type: "string"
        },
        otherDetails: {
          type: "object",
        }
      }
    },
    contacts: {
      type: "array",
      // required: true,
      items: {
        type: "object",
        properties: {
          value: {
            type: "string"
          },
          type: {
            type: "string"
          },
          alternateContacts: {
            type: "array",
          }
        }
      }
    }
  }
}

var testSchema = hannibal.create(lodash.cloneDeep(schema));
var ajvValidate = ajv.compile(lodash.cloneDeep(schema));

describe("ajv-compat", function() {
  var invalidTestObj = {
    address: {
      street: "test",
      country: "test",
      otherDetails: {}
    },
    contacts: [
      {
        type: "test",
        value: {},
        alternateContacts: []
      }
    ]
  }
  var validTestObj = {
    address: {
      street: "test",
      country: "test",
      otherDetails: {}
    },
    contacts: [
      {
        type: "test",
        value: "test",
        alternateContacts: []
      }
    ]
  }

  it("ajv", function() {
    let rslt;
    rslt = ajvValidate(validTestObj);
    console.log("error: ", ajvValidate.errors);
    assert(rslt);

    rslt = ajvValidate(invalidTestObj);
    console.log("error: ", ajvValidate.errors);
    assert(!rslt);
  })

  it("hannibal", function() {
    let rslt;
    rslt = testSchema(validTestObj)
    console.log("error: ", rslt.error);
    assert(rslt.isValid);

    rslt = testSchema(invalidTestObj);
    console.log("error: ", rslt.error);
    assert(!rslt.isValid);
  })
});
