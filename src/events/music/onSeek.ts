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
    message.reply("Nenhuma música está tocando no momento!");
    return;
  }

  const skippedTrack = queue.currentTrack;
  const oldTime = queue.node.estimatedPlaybackTime;
  queue.node.seek(transformTimeTextInMilliseconds(newTime));
  message.reply(
    `Foi de ${transformMillisecondsInTimeText(oldTime)} para **${newTime}**`
  );
}
