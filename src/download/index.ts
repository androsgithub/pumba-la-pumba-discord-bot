"WIP";

import ytdl from "@distube/ytdl-core";
import { DownloadType } from "../structs/types/download-type";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../components/embed";
import cp from "child_process";
import ffmpeg from "ffmpeg-static";

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
      if (type == DownloadType.MP3) {
        ytdl(url, {
          quality: "highestaudio",
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
      } else if (type == DownloadType.MP4) {
        if (!ffmpeg) return;
        const video = ytdl(url, {
          quality: "highestvideo",
        });
        const audio = ytdl(url, {
          quality: "highestaudio",
        });

        const ffmpegProcess = cp.spawn(
          ffmpeg,
          [
            "-i",
            `pipe:3`,
            "-i",
            `pipe:4`,
            "-map",
            "0:v",
            "-map",
            "1:a",
            "-c:v",
            "copy",
            "-c:a",
            "libmp3lame",
            "-crf",
            "27",
            "-preset",
            "veryfast",
            "-movflags",
            "frag_keyframe+empty_moov",
            "-f",
            "mp4",
            "-loglevel",
            "error",
            "-",
          ],
          {
            stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
          }
        );
        video.pipe(ffmpegProcess.stdio[3] as NodeJS.WritableStream);
        audio.pipe(ffmpegProcess.stdio[4] as NodeJS.WritableStream);
        ffmpegProcess.stdio[1]
          .on("data", (chunk) => chunks.push(chunk))
          .on("finish", () => {
            const buffer = Buffer.concat(chunks);
            resolve({ videoDetails, buffer });
          });
      }
    }
  });
}
