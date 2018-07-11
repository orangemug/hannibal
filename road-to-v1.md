# Road to v1
Aims

 - Make hannibal simular but not the same as JSON schema
 - Make a really simple transform method to produce a JSON schema, with a two way transform

Things we want to keep

 - `validator` objects are way nicer than blatting them on the main object
 - `transforms` because this does the heavy lifting in our API's
 
The transform to a JSON schema should be as simple as

 1. Move approved set of `validators` onto the main schema object
 2. Remove transforms

This way hannibal schemas can be used within other applications by publishing the JSONSchema instead of the hannibal schema.

```
hannibal.toJsonSchema(schemaObject);
```

## Todo

 1. Remove support for `date`, instead support. See <https://spacetelescope.github.io/understanding-json-schema/reference/string.html?highlight=string#built-in-formats>

```
{ "type": "string", "format": "date-time" }
```
 2. Add support for definitions, see <https://spacetelescope.github.io/understanding-json-schema/reference/combining.html>

