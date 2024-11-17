import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { config, reconfigure } from "../../utils/configs";
import { embedTitleWithDescription } from "../../components/embed";
import { GuildQueue } from "discord-player";

export function setVolume(
  newVolume: string,
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  admin: boolean
) {
  if (!admin) newVolume = Math.min(parseInt(newVolume), 200).toString();
  try {
    const oldVolume = config.volume;
    reconfigure({ volume: parseInt(newVolume) });
    queue?.node.setVolume(parseInt(newVolume));

    message.reply({
      embeds: [
        embedTitleWithDescription(
          "Mudança de volume realizada com sucesso!",
          `Foi de ${oldVolume}% para ${newVolume}%`
        ),
      ],
    });
  } catch (e: any) {
    message.channel.send({
      embeds: [
        embedTitleWithDescription("Erro ao modificar volume.", e.message),
      ],
    });
  }
}
