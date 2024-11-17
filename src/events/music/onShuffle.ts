import { GuildQueue } from "discord-player";
import { embedTitleWithDescription } from "../../components/embed";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

export async function shuffle(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue || queue.currentTrack === null) {
    return message.reply({
      content: "Nenhuma música está tocando no momento!",
      options: { ephemeral: true },
    });
  } else {
    queue.tracks.shuffle();
    await message.reply({
      embeds: [embedTitleWithDescription("Músicas em ordem aleatória!")],
    });
  }
}
