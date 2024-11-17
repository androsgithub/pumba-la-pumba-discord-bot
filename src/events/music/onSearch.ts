import { Player } from "discord-player";
import {
  ActionRowBuilder,
  ComponentType,
  InteractionResponseType,
  Message,
  OmitPartialGroupDMChannel,
  SelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { play } from "./onPlay";
export async function search(
  voiceChannelId: string,
  query: string,
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  player: Player
) {
  const results = await player.search(query);

  const select = new StringSelectMenuBuilder()
    .setCustomId("searchedVideos")
    .setPlaceholder("Make a selection!")
    .addOptions(
      ...results.tracks
        .map((track) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(track.title)
            .setDescription(track.author)
            .setValue(track.url)
        )
        .slice(0, 25)
    );

  const r = await message.reply({
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select),
    ],
  });

  try {
    const interaction = await message.channel.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      time: 30_000,
    });

    await interaction.deferReply();

    const [selectedVideo] = interaction.values;
    await play(voiceChannelId, selectedVideo, player, message);

    //delete useless messages
    r.delete();
    await interaction.deleteReply();
  } catch (e) {
    console.error("Erro ao processar a interação:", e);
  }
}
