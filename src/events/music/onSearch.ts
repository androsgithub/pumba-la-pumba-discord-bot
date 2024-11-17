import {
  ComponentType,
  Message,
  OmitPartialGroupDMChannel,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { play } from "./onPlay";
import { player } from "../..";
import { GuildQueue } from "discord-player";
import { embedTitleWithDescription } from "../../components/embed";
import {
  selectMenu,
  selectMenuOption,
  select,
} from "../../components/select-menu";
export async function search(
  args: string[],
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (message.member?.voice.channelId) {
    const query = args
      .slice(1, args.length)
      .toString()
      .replaceAll(",", " ")
      .trim();
    const results = await player.search(query);

    const r = await message.reply({
      components: [
        select(
          selectMenu(
            "searchedVideos",
            "Selecione um video!",
            results.tracks.map((track) =>
              selectMenuOption(track.title, track.author, track.url)
            )
          )
        ),
      ],
    });

    try {
      const interaction = await message.channel.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        time: 30_000,
      });

      await interaction.deferReply();

      const [selectedVideo] = interaction.values;
      await play(selectedVideo, queue, message);

      //delete useless messages
      r.delete();
      await interaction.deleteReply();
    } catch (e) {
      console.error("Erro ao processar a interação:", e);
    }
  } else {
    await message.channel.send({
      embeds: [
        embedTitleWithDescription(
          "Você precisa estar conectado a um canal de voz."
        ),
      ],
    });
  }
}
