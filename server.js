// express server

'use strict';

var url = require('url')
var path = require('path')
var fs = require('fs')
var http = require('http')
var express = require('express')

// const debug = require('debug')('jjd')

const args = process.argv;
const httpPort = args[args.indexOf("-p") + 1 || args.indexOf("--port") + 1 || -1] || 80;

function log( req, res, next ) {
	req.time = Date.now(); // new Date();
	console.log( `${req.time} ${req.method} ${req.headers.host} ${req.url} ${req.secure ? 'https' : 'http' }` );
	next(); return;
}

const httpServer = http.createServer()
server.on("request", (request, response) => {
  // the same kind of magic happens here!
})

const options = {
	// host: 'localhost',
	port: 8080,
}

server.listen(options, () => {
	console.log(`server listening on port ${options.port}`)
})
