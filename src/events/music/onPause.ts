import { GuildQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../../components/embed";

export async function togglePause(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue || !queue.currentTrack) {
    await message.reply({
      embeds: [
        embedTitleWithDescription("Nenhuma música está tocando no momento!"),
      ],
    });
    return;
  }
  if (queue.node.isPlaying()) {
    queue.node.pause();
    await message.reply({
      embeds: [embedTitleWithDescription("Música pausada!")],
    });
  } else {
    queue.node.resume();
    await message.reply({
      embeds: [embedTitleWithDescription("Música despausada!")],
    });
  }
}
