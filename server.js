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
		order_book: orderBook,
		ship_sales: shipSale,
		missions: missions,
	}
})

const output = economy.markets.map((market) => {
	// console.dir(market)
	return market.name
})

const server = http.createServer()
server.on("request", (request, response) => {

	console.dir(url.parse(request.url))
	// console.dir(url.parse(request.url).searchParams)

	// the same kind of magic happens here!
	// request.method
	// request.url
	// request.headers
	// const userAgent = request.headers["user-agent"]

	response.statusCode = 200

	let content
	switch (request.url) {
		case "/":
			content = "Hello! Check out /routes"
			break
		case "/routes":
			content = {
				"/routes": "a list of all the routes",
				"/markets": "a list of all the markets",
				"/item": "a list of all the items",
				"/all": "",
			}
			break
		case "/order_book":
			content = economy.order_book
			break
		case "/ship_sales":
			content = economy.ship_sales
			break
		case "/missions":
			content = economy.missions
			break
		case "/market_names":
			content = economy.markets.map(market => market.name)
			break
		case "/market_data":
			content = economy.markets
			break
		case "/client_names":
			content = economy.clients.map(client => client.name)
			break
		case "/client_data":
			content = economy.clients
			break
		case "/item_data":
			content = economy
			break
		case "/item_names":
			content = economy
			break
		case "/item_types":
			content = economy
			break
		case "/all":
			content = economy
			break
		default:
			response.statusCode = 404
			break
	}

	response.setHeader("Content-Type", "application/json")
	response.setHeader("Access-Control-Allow-Origin", "*")

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
