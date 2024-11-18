import { GuildQueue, useQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { player } from "../..";
import { embedTitleWithDescription } from "../../components/embed";

export async function skip(
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

  queue.node.skip();
}
