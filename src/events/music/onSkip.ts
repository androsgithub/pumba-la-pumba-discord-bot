import { GuildQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

export async function skip(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue || !queue.currentTrack) {
    await message.reply({
      content: "Nenhuma música está tocando no momento!",
      options: { ephemeral: true },
    });
    return;
  }

  const skippedTrack = queue.currentTrack;
  queue.node.skip(); // Pula para a próxima música na fila
  await message.reply(` Música **${skippedTrack.title}** pulada!`);
}
