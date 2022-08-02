import { Client, Intents } from "discord.js"

// Creating our Client:
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, // access to channels;
        Intents.FLAGS.GUILD_MESSAGES, // access to channel messages;
        Intents.FLAGS.GUILD_VOICE_STATES // access to channel voice state;
    ]
})

// Handling error messages:
client.on("error", () => {
    console.error
    process.exit()
})
client.on("warn", console.warn)

// Slash Commands:
export async function clientMessages(message){
    if (message.author.bot.id || !message.guild) return
    if (!client.application?.owner) await client.application?.fetch()
    
    // "!help" command message:
    if (message.content === "!help") {
        await message.reply(`
**Welcome to Powah's RTXsON and thank you for supporting it!**

**» Commands:**
    _!help ∷  Help Message - Commands and contact info._
    _!reset ∷  Reset Application._

Slash Commands Section:
    _/play query:music name ∷  Play an specific music._
    _/stop ∷  Stop current music._
    _/skip ∷  Skip current music._
    _/queue ∷  Shows up queue playlist._

**» Developed by Pablo FELPs#5501:**

© PabloFELPs
        `)
    }

    // "!deploy" command message:
    // This will make sure that the "commands deployment" is being done by the channel owner.
    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id){
        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        description: "The song you want to play",
                        required: true
                    }
                ]
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "queue",
                description: "See the queue"
            },
            {
                name: "stop",
                description: "Stop the player"
            }
        ])

        // Deployment confirmation message:
        await message.reply("Deployed!")
    }

    // "!reset" command message:
    if (message.content === "!reset") {
        if (message.author.id === client.application?.owner?.id) {
            await message.reply("Resetting application...")
            process.exit()
        }
        // Not channel owner:
        else await message.reply("You are not the channel owner!")
    }
}

export default client
