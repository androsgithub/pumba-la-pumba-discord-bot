import { GuildQueue } from "discord-player";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../../components/embed";

export function jumpTo(
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!queue || !queue.currentTrack || !message.member?.voice.channel) {
    return message.reply({
      embeds: [
        embedTitleWithDescription(
          "Você não está tocando nenhuma música ou não está em um canal de voz!"
        ),
      ],
    });
  }
}
