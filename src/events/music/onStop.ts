import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { player } from "../..";
import { GuildQueue } from "discord-player";
import { embedTitleWithDescription } from "../../components/embed";

export async function stop(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (message.client.voice.adapters.size > 0) {
    await message.channel.send({
      embeds: [embedTitleWithDescription("O som foi parado!")],
    });
    queue?.delete();
    await player.destroy();
  } else {
    await message.channel.send({
      embeds: [embedTitleWithDescription("Nenhum som está tocando!")],
    });
  }
}
