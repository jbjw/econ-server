// express server

"use strict"

var url = require('url')
var path = require('path')
var fs = require('fs')
var http = require('http')
var express = require('express')

const xml2js = require("xml2js")
// const debug = require('debug')('jjd')

const args = process.argv
const defaultPort = 8080
const port = args[args.indexOf("-p") + 1 || args.indexOf("--port") + 1 || -1] || defaultPort

function log( req, res, next ) {
	req.time = Date.now(); // new Date();
	console.log( `${req.time} ${req.method} ${req.headers.host} ${req.url} ${req.secure ? 'https' : 'http' }` );
	next(); return;
}

const listedMarkets = ["GMH", "MyTZ"]
// market positions

const xml = fs.readFileSync("EconomyData.xml")
let economy
xml2js.parseString(xml, function (err, result) {
	// console.dir(result)
	const root = result["EconData"]
	const globalBalance = parseFloat(root["CreditBalance"][0])
	const clients = root["Clients"][0]["ClientAccount"]
	const markets = root["Markets"][0]["Market"]
	const orderBook = root["OrderBook"][0]
	const shipSale = root["ShipSale"][0]
	const missions = root["Missions"][0]

	economy = {
		globalBalance: globalBalance,
		markets: markets.map((market) => {
			const items = market["MarketItems"][0]["MarketItem"]
			const marketZone = market["MarketZoneSphere"][0]
			return {
				// console.dir(markets[1])
				name: market["DisplayName"][0],
				marketId: market["MarketId"][0], // 1234 for npc
				entityId: market["EntityId"][0],
				// marketZone["Center"][0]["$"]["x"] then parse
				radius: parseFloat(marketZone["Radius"][0]),
				// market["MarketZoneType"][0] // "FixedSphere" or "EntitySphere"
				open: market["Open"][0] === "true",
				items: items.map((item) => {
					return {
						type: item["TypeId"][0],
						name: item["SubtypeName"][0],
						quantity: parseFloat(item["Quantity"][0]),
						sell: parseFloat(item["SellPrice"][0]),
						buy: parseFloat(item["BuyPrice"][0]),
						blacklisted: (item["IsBlacklisted"][0] === "false"),
					}
				}),
			}
		}),
		clients: clients.map((client) => {
			return {
				id: "summin",
				name: client["NickName"][0],
				balance: parseInt(client["BankBalance"][0]),
			}
		}),
	}
})

const output = economy.markets.map((market) => {
	// console.dir(market)
	return market.name
})

const server = http.createServer()
server.on("request", (request, response) => {
	console.dir(request.url)

	// the same kind of magic happens here!
	// request.method
	// request.url
	// request.headers
	// const userAgent = request.headers["user-agent"]

	response.statusCode = 200

	let content
	switch (request.url) {
		case "/":
			content = "/markets, /all"
			break
		case "/markets":
			content = output
			break
		case "/all":
			content = economy
			break
		default:
			response.statusCode = 404
			break
	}

	response.setHeader("Content-Type", "application/json")

	// response.writeHead(200, {"Content-Type": "application/json"})
	// response.write()
	response.end(JSON.stringify(content, null, 2), "utf-8")

	// response.statusCode = 404
	// response.setHeader("Content-Type", "application/json")
	// // response.setHeader("X-Powered-By", "bacon")
	// response.write("stuff")
	// response.end()
})

const options = {
	// host: 'localhost',
	port: port,
}

server.listen(options, () => {
	console.log(`server listening on port ${options.port}`)
})
