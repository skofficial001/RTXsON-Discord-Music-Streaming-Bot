// "Intents" does not exist anymore, this is why I switched to "GatewayIntentBits".
//import {Client, GuildMember, GatewayIntentBits} from "discord.js"
import {Client, GuildMember, Intents} from "discord.js"

// Creating our Client:
/*
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
})
*/

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

// Handling error messages:
client.on("error", console.error)
client.on("warn", console.warn)

// Slash Commands:
export async function clientMessages(message){
    if (message.author.bot.id || !message.guild) return
    if (!client.application?.owner) await client.application?.fetch()

    //console.log("Message", message)
    //console.log("MessageAuthorhID", message.author)
    //console.log("ClientApplicationOwnerID", client.application?.owner)
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

        await message.reply("Deployed!")
    }
}

export default client
