"WIP";

import ytdl from "@distube/ytdl-core";
import { DownloadType } from "../structs/types/download-type";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../components/embed";

export async function download(
  type: DownloadType,
  url: string,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  return new Promise<{
    videoDetails: ytdl.MoreVideoDetails;
    buffer: Buffer<ArrayBuffer>;
  } | null>(async (resolve, reject) => {
    if (ytdl.validateURL(url)) {
      let { videoDetails } = await ytdl.getInfo(url);
      let percent = { complete: 0, total: 0 };
      const chunks: Uint8Array[] = [];

      ytdl(url, {
        quality:
          type == DownloadType.MP3
            ? "highestaudio"
            : type == DownloadType.MP4
            ? "highestvideo"
            : "highest",
      })
        .on("response", function (res) {
          percent.total = parseInt(res.headers["content-length"], 10);
        })
        .on("data", async function (chunk) {
          chunks.push(chunk);
          percent.complete += chunk.length;
          let p = Math.round((percent.complete / percent.total) * 100);

          if ([1, 50, 100].includes(p)) {
            await message.edit({
              embeds: [embedTitleWithDescription(`${p}%`)],
            });
          }
        })
        .on("finish", () => {
          const buffer = Buffer.concat(chunks);
          resolve({ videoDetails, buffer });
        });
    }
  });
}
