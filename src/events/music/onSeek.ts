import { GuildQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import {
  transformMillisecondsInTimeText,
  transformTimeTextInMilliseconds,
} from "../../utils/transform-time";

export async function seek(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  newTime: string
) {
  if (!queue || !queue.currentTrack) {
    await message.reply({
      content: "Nenhuma música está tocando no momento!",
      options: { ephemeral: true },
    });
    return;
  }

  const skippedTrack = queue.currentTrack;
  const oldTime = queue.node.estimatedPlaybackTime;
  queue.node.seek(transformTimeTextInMilliseconds(newTime));
  await message.reply(
    `Foi de ${transformMillisecondsInTimeText(oldTime)} para **${newTime}**`
  );
}
