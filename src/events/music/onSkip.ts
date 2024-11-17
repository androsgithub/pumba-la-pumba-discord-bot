import { GuildQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

export async function skip(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue || !queue.currentTrack) {
    message.reply("Nenhuma música está tocando no momento!");
    return;
  }

  const skippedTrack = queue.currentTrack;
  queue.node.skip(); // Pula para a próxima música na fila
  message.reply(` Música **${skippedTrack.title}** pulada!`);
}
