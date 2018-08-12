// express server

"use strict"

var url = require('url')
var path = require('path')
var fs = require('fs')

const xml2js = require("xml2js")
// const debug = require('debug')('jjd')

const args = process.argv

// C:\Users\jbjw\se\torch-server\Instance\Saves\OEN3\Sandbox.sbc
path
console.log(args[0], args[1], args[2])

// xml2js.parseString(fs.readFileSync(Sandbox.sbc), function (err, result) {
// 	console.log(result)
// }
