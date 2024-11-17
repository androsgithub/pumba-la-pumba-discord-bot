import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { play } from "./music/onPlay";
import { ExtendedClient } from "../structs/extended-client";
import { Player, Track, useQueue } from "discord-player";
import { getVoiceConnection } from "@discordjs/voice";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { skip } from "./music/onSkip";
import { seek } from "./music/onSeek";
import { transformMillisecondsInTimeText } from "../utils/transform-time";
import { search } from "./music/onSearch";

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
        await message.channel.send(
          "Você precisa estar conectado a um canal de voz."
        );
      }
      break;
    case args[0] == "search":
      if (message.member?.voice.channelId) {
        const q = args
          .slice(1, args.length)
          .toString()
          .replaceAll(",", " ")
          .trim();
        search(userVoiceChannelId, q, message, player);
      } else {
        await message.channel.send(
          "Você precisa estar conectado a um canal de voz."
        );
      }

      break;
    case args[0] == "time":
      if (message.member?.voice.channelId) {
        await message.channel.send(
          `${transformMillisecondsInTimeText(
            queue?.node.estimatedPlaybackTime || 0
          )} de ${transformMillisecondsInTimeText(
            queue?.currentTrack?.durationMS || 0
          )}`
        );
      } else {
        await message.channel.send("Nenhum som está tocando!");
      }
      break;
    case args[0] == "seek":
      if (message.member?.voice.channelId) {
        seek(queue, message, args[1]);
      } else {
        await message.channel.send(
          "Você precisa estar conectado a um canal de voz."
        );
      }
      break;
    case args[0] == "skip":
      skip(queue, message);
      break;
    case args[0] == "stop":
      if (client.voice.adapters.size > 0) {
        await message.channel.send("O som foi parado!");
        player.destroy();
      } else {
        await message.channel.send("Nenhum som está tocando!");
      }
      break;
  }
}
