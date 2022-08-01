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
client.on("error", console.error)
client.on("warn", console.warn)

// Slash Commands:
export async function clientMessages(message){
    if (message.author.bot.id || !message.guild) return
    if (!client.application?.owner) await client.application?.fetch()

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
}

export default client
