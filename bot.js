// Importing our config.json file settings:
import config from './src/config/config.js'

// Importing our Client:
import client from "./src/client.js"

// Importing our methods:
import { clientMessages } from './src/client.js'
import { playerInteractions } from "./src/player.js"

// Logging our Client with the bot token:
client.login(config.token)

client.once("ready", () => {console.log("RTXsON ready to go!")})

// Messages:
client.on("messageCreate", (message) => clientMessages(message))

// Interactions:
client.on("interactionCreate", (interaction) => playerInteractions(interaction))
