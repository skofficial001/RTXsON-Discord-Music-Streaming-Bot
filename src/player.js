import { GuildMember } from "discord.js"
import { Player, QueryType } from "discord-player"

// Importing our Client:
import client from "./client.js"

// Creating our Player:
const player = new Player(client)

// Handling error messages:
player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error in the queue feature: ${error.message}`)
})
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error in the connection feature: ${error.message}`)
})

// Player event listeners:
player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎧 | Now Playing: **${track.title}** | **${queue.connection.channel.name}**`)
})
player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🏄🌊 | Just added **${track.title}** to queue!`)
})
player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | Queue cleared by manually disconnection from the voice channel.")
})
player.on("channelEmpty", (queue) => {
    queue.metadata.send("🥲 | Don't leave me alone. Disconnecting...")
})
player.on("queueEnd", (queue) => {
    queue.metadata.send("😎 | Queue finished!")
})

// Player Interactions:
// `yarn add ffmpeg-static`, adding FFmpeg dependency to stream music.
export async function playerInteractions(interaction) {
    if (!interaction.isCommand() || !interaction.guildId) return

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({ content: "🐦 | You are not in a voice channel.", ephemeral: true })
    }

    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
        return void interaction.reply({ content: "🐦 | You are not in my voice channel.", ephemeral: true })
    }

    // "Playing songs" functionality:
    if (interaction.commandName === "play") {
        await interaction.deferReply()
    
        const query = interaction.options.get("query").value
        const searchResult = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {})
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "🐿️💨 | No results..." })

        const queue = player.createQueue(interaction.guild, {
            metadata: interaction.channel
        })
    
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        } catch {
            void player.deleteQueue(interaction.guildId)
            return void interaction.followUp({ content: "😞 | Not able to join voice channel." })
        }
    
        await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` })
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
        if (!queue.playing) await queue.play()
    }

    // "Skipping songs" functionality:
    if (interaction.commandName === "skip") {
        await interaction.deferReply()
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" })
        const currentTrack = queue.current
        const success = queue.skip()
        return void interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong."
        })
    }

    // "Stopping songs" functionality:
    else if (interaction.commandName === "stop") {
        await interaction.deferReply()
        const queue = player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" })
        queue.destroy()
        return void interaction.followUp({ content: "🚫 | Stopped the player." })
    }
}
