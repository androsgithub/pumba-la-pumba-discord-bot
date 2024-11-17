import { Player, Track } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { validateURL, getInfo } from "ytdl-core";

export async function play(
  voiceChannelId: string,
  songQuery: string,
  player: Player,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  let video: Track | string | null = null;
  try {
    player.extractors.register(YoutubeiExtractor, {});
    player.extractors.loadDefault();
    if (validateURL(songQuery)) {
      video = songQuery.toString();
    } else {
      video = (await player.search(songQuery)).tracks[0];
    }

    await player.play(voiceChannelId, video, {
      nodeOptions: { volume: 100 },
    });

    message.channel.send(`Tocando: **${video}**`);
  } catch (e: any) {
    console.error("erro ao tocar musica");
    console.error(e.message);
    return;
  }
}
