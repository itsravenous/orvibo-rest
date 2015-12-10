# Orvfms REST
This is a (currently incredibly kludgy) node-based REST API wrapper around the inner workings of Fernando Silva's [orvfms](https://github.com/fernadosilva/orvfms). Please read the README in that repository for disclaimers and security concerns etc.

This project is purely a means to an end at the moment (more on that later and elsewhere) but I do intend to develop it properly, beginning by properly separating the "lib" of orvfms from the app itself. In short, definitely don't use this for anything remotely important yet - I cannot be held responsible for setting your house on fire etc.

## Setup
Depending on your use case, either
`cp config.nocors-example.json config.json`
or
`cp config.cors-example.jsson config.json`

## Running
`node app.js`

## Usage
```
# Get switch list
curl -X GET http://localhost:3000

# Turn a switch on
curl -X PUT http://localhost:3000/D1B2F35A3C2A -H 'Content-Type: application/json' -d '{"st":1}'

# Turn a switch off
curl -X PUT http://localhost:3000/D1B2F35A3C2A -H 'Content-Type: application/json' -d '{"st":0}'
```

Currently, when turning a switch on or off, the server will send a response as soon as the state change has been effected. It should really wait for the orvfms script to finish, which is usually a couple seconds later, as no further state changes can be made until then.
