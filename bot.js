import "dotenv/config"

// Importing our config.json file settings:
import config from './src/config/config.js'

// Importing our Client:
import client from "./src/client.js"

// Importing our methods:
import { clientMessages } from './src/client.js'
import { playerInteractions } from "./src/player.js"

// Logging our Client with the bot token:
client.login(config.token)

client.once("ready", () => console.log("RTXsON ready to go!"))

// Messages/Slash Commands:
client.on("messageCreate", (message) => clientMessages(message))

// Bot Interactions/Player:
client.on("interactionCreate", (interaction) => playerInteractions(interaction))
