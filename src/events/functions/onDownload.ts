"WIP";

import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { download } from "../../download";
import { DownloadType } from "../../structs/types/download-type";
import { embedTitleWithDescription } from "../../components/embed";

export async function onDownload(
  url: string,
  type: string,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  const msg = await message.reply({
    embeds: [embedTitleWithDescription("Iniciando Download...")],
  });
  try {
    await download(type as DownloadType, url, msg).then(async (video) => {
      if (!video)
        return await msg.edit({
          content: "Não consegui baixar o vídeo.",
          embeds: [],
        });

      await msg.edit({
        embeds: [embedTitleWithDescription("Video baixado com sucesso!")],
        files: [
          {
            attachment: video.buffer ?? "",
            name: video.videoDetails.title + "." + type,
          },
        ],
      });
    });
  } catch (err) {
    console.log(err);
    await msg.edit("Falha ao baixar o vídeo.");
  }
}
