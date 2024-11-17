import { GuildQueue, Player, Track, useQueue } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js";
import { validateURL, getInfo, videoInfo } from "ytdl-core";
import { transformMillisecondsInTimeText } from "../../utils/transform-time";
import { volume } from "../../../config.json";
import { player } from "../..";
import { songEmbed } from "../../components/embed";

export async function play(
  url: string,
  queue: GuildQueue | null,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  const voiceChannelId = message.member!.voice.channelId ?? "";
  let video: Track = new Track(player, {});
  try {
    await player.extractors.register(YoutubeiExtractor, {});
    await player.extractors.loadDefault();

    if (validateURL(url)) {
      let _data = await getInfo(url.toString());

      video.url = url.toString();
      video.title = _data.videoDetails.title ?? "Titulo não encontrado.";
      video.description =
        _data.videoDetails.description ?? "Descrição não encontrada";
      video.author = _data.videoDetails.author.name ?? "Autor não encontrado.";
      video.duration = _data.videoDetails.lengthSeconds ?? 0;
      video.thumbnail =
        _data.videoDetails.thumbnails[0].url ??
        "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg";
    } else {
      video = (await player.search(url)).tracks[0];
    }

    await player.play(voiceChannelId, video, {
      nodeOptions: { volume },
    });

    const embed = songEmbed(
      video.title,
      video.description,
      { name: video.author },
      [
        {
          name: "Duração da musica",
          value: transformMillisecondsInTimeText(video.durationMS),
          inline: true,
        },
        {
          name: "Duração da playlist",
          value: transformMillisecondsInTimeText(
            queue?.currentTrack?.durationMS
              ? video.durationMS + queue.estimatedDuration
              : video.durationMS
          ),
        },
      ],
      { url: video.thumbnail },
      video.url,
      message.author
    );

    await message.channel.send({ embeds: [embed] });
  } catch (e: any) {
    console.error("erro ao tocar musica");
    console.error(e);
    return;
  }
}
