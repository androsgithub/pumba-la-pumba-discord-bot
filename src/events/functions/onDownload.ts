import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { download } from "../../download";
import { DownloadType } from "../../structs/types/download-type";
import { embedTitleWithDescription } from "../../components/embed";
import ytdl from "@distube/ytdl-core";
import { SnowflakeUtil } from "discord.js";

export async function onDownload(
  url: string,
  type: string,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  const msg = await message.reply({
    embeds: [embedTitleWithDescription("Iniciando Download...")],
  });

  let video: {
    videoDetails: ytdl.MoreVideoDetails;
    buffer: Buffer<ArrayBuffer> | null;
  } | null = null;

  try {
    video = await download((type = DownloadType.MP3 as DownloadType), url, msg);

    if (!video || !video.buffer) throw new Error("Video nao encontrado");

    if (video) {
      const nonce = SnowflakeUtil.generate().toString();
      await msg.channel.send({
        embeds: [
          embedTitleWithDescription(
            video.videoDetails.title,
            video.videoDetails.author.name,
            video.videoDetails.thumbnails[0],
            video.videoDetails.video_url
          ),
        ],
        enforceNonce: true,
        nonce,
        files: [
          {
            attachment: video.buffer,
            name: `${video.videoDetails.title}.${type}`,
          },
        ],
      });
    }
    await msg.delete();
    await message.delete();
  } catch (err: any) {
    await msg.edit({
      embeds: [
        embedTitleWithDescription(
          err.message == "not link"
            ? "Você precisa enviar um link..."
            : "Falha ao baixar..."
        ),
      ],
    });
  }
}
