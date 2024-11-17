import { GuildQueue, useQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { transformMillisecondsInTimeText } from "../../utils/transform-time";
import { embedTitleWithDescription } from "../../components/embed";

export async function time(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue) return;
  if (message.member?.voice.channelId) {
    await message.channel.send({
      embeds: [
        embedTitleWithDescription(
          `${transformMillisecondsInTimeText(
            queue?.node.estimatedPlaybackTime || 0
          )} de ${transformMillisecondsInTimeText(
            queue?.currentTrack?.durationMS || 0
          )}`,
          queue.node.createProgressBar({
            indicator: ":yellow_circle:",
            leftChar: ":yellow_square:",
            rightChar: ":white_small_square:",
            length: 20,
            separator: "|",
          }) ?? ""
        ),
      ],
    });
  } else {
    await message.channel.send({
      embeds: [embedTitleWithDescription("Nenhum som está tocando!")],
    });
  }
}
