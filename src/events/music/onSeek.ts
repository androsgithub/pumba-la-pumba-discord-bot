import { GuildQueue, useQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import {
  transformMillisecondsInTimeText,
  transformTimeTextInMilliseconds,
} from "../../utils/transform-time";
import { embedTitleWithDescription } from "../../components/embed";

export async function seek(
  newTime: string,
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (message.member?.voice.channelId) {
    if (!queue || !queue.currentTrack) {
      await message.reply({
        embeds: [
          embedTitleWithDescription("Nenhuma música está tocando no momento!"),
        ],
      });
      return;
    }
    const oldTime = queue.node.estimatedPlaybackTime;
    queue.node.seek(transformTimeTextInMilliseconds(newTime));
    await message.reply({
      embeds: [
        embedTitleWithDescription(
          `Foi de ${transformMillisecondsInTimeText(
            oldTime
          )} para **${transformMillisecondsInTimeText(
            transformTimeTextInMilliseconds(newTime)
          )}**`
        ),
      ],
    });
  } else {
    await message.channel.send({
      embeds: [
        embedTitleWithDescription(
          "Você precisa estar conectado a um canal de voz."
        ),
      ],
    });
  }
}
