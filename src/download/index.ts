import ytdl from "@distube/ytdl-core";
import { DownloadType } from "../structs/types/download-type";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../components/embed";
import cp from "child_process";
import ffmpeg from "ffmpeg-static";
import { Readable } from "stream";

export async function download(
  type: DownloadType,
  url: string,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  return new Promise<{
    videoDetails: ytdl.MoreVideoDetails;
    buffer: Buffer<ArrayBuffer> | null;
  } | null>(async (resolve, reject) => {
    try {
      if (ytdl.validateURL(url)) {
        let videoInfo = await ytdl.getInfo(url);
        let { videoDetails } = videoInfo;
        let percent = { complete: 0, total: 0 };

        const chunks: Uint8Array[] = [];

        switch (type) {
          case DownloadType.MP3:
            (await downloadAudioBuffer(videoInfo.videoDetails.video_url))
              .on("response", function (res) {
                percent.total = parseInt(res.headers["content-length"], 10);
              })
              .on("data", async function (chunk) {
                chunks.push(chunk);
                percent.complete += chunk.length;
                let p = Math.round((percent.complete / percent.total) * 100);
                if (
                  (p > 0 && p < 2) ||
                  (p > 24 && p < 26) ||
                  (p > 49 && p < 51) ||
                  (p > 74 && p < 76) ||
                  (p > 95 && p < 101)
                ) {
                  await message.edit({
                    embeds: [embedTitleWithDescription(`Progresso: ${p}%`)],
                  });
                }
                if (p > 100) {
                  await message.edit({
                    embeds: [embedTitleWithDescription(`Enviando...`)],
                  });
                }
              })
              .on("finish", () => {
                resolve({ videoDetails, buffer: Buffer.concat(chunks) });
              });

            break;
          case DownloadType.MP4:
            if (!ffmpeg) return;
            const video = await downloadVideoBuffer(
              videoInfo.videoDetails.video_url
            );
            const audio = await downloadAudioBuffer(
              videoInfo.videoDetails.video_url
            );
            if (!video || !audio) throw new Error("video or audio not found");

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
              .on("data", (chunk) => {
                chunks.push(chunk);
              })
              .on("close", async () => {
                resolve({ videoDetails, buffer: Buffer.concat(chunks) });
              })
              .on("error", function (err) {
                reject(err);
              });

            break;
        }
      } else {
        throw new Error("not link");
      }
    } catch (err) {
      reject(err);
    }
  });
}

function downloadVideoBuffer(url: string) {
  return new Promise<Readable>((resolve, reject) => {
    resolve(ytdl(url));
  });
}
function downloadAudioBuffer(url: string) {
  return new Promise<Readable>(async (resolve, reject) => {
    resolve(
      ytdl(url, {
        quality: "highestaudio",
        filter: "audioonly",
      })
    );
  });
}
