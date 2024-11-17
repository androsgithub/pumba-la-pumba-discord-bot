import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { play } from "./music/onPlay";
import { ExtendedClient } from "../structs/extended-client";
import { Player, Track, useQueue } from "discord-player";
import { getVoiceConnection } from "@discordjs/voice";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { skip } from "./music/onSkip";
import { seek } from "./music/onSeek";

export async function onEvent(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  client: ExtendedClient,
  player: Player
) {
  const userVoiceChannelId = message.member!.voice.channelId ?? "";
  const args = message.content.trim().split(" ");
  const queue = useQueue(message.guild!.id);

  switch (true) {
    case args[0] == "play" || args[0] == "p":
      if (message.member?.voice.channelId) {
        const q = args
          .slice(1, args.length)
          .toString()
          .replaceAll(",", " ")
          .trim();
        play(userVoiceChannelId, q, player, message);
      } else {
        message.channel.send("Você precisa estar conectado a um canal de voz.");
      }
      break;
    case args[0] == "seek":
      if (message.member?.voice.channelId) {
        seek(queue, message, args[1]);
      } else {
        message.channel.send("Você precisa estar conectado a um canal de voz.");
      }
      break;
    case args[0] == "skip":
      skip(queue, message);
      break;
    case args[0] == "stop":
      if (client.voice.adapters.size > 0) {
        message.channel.send("O som foi parado!");
        player.destroy();
      } else {
        message.channel.send("Nenhum som está tocando!");
      }
      break;
  }
}
