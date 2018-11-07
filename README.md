# econ-server
u no i had to serv it to em  
🌌🌠💰⭐️💸🚀💵🌍💲🌟💳🌔✨

Serves up market prices from the Frontier Economy mod for Space Engineers  

Mod: https://steamcommunity.com/sharedfiles/filedetails/?id=504209260  
Guide: https://steamcommunity.com/sharedfiles/filedetails/?id=481264606  

## Getting Started
- clone da repo
- get node (https://nodejs.org/en/download/)
- while inside da repo run `npm install`
- while inside da repo run `npm start`
- go to `localhost:8080` in your browser

## Config
- node server.js -p [port]

## Deployment
I like to use pm2 to keep the server running. Instructions:
- run `npm install -g pm2`
- run `pm2 start server.js`

The server will now run in the background and restart automatically (on crash, reboot, etc).

## API Reference
- `/` root, instructions
- `/markets` a list of the markets
- `/all` dump of all econ info (temporary, for debugging)


## notes for me (ignore this)
C:\Users\jbjw\se\torch-server\Instance\Saves\OEN3\Storage\504209260.sbm_Economy.scripts
