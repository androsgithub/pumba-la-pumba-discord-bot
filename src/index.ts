import { ExtendedClient } from "./structs/extended-client";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Player, useVolume } from "discord-player";
import { onEvent } from "./events";
import { symbol } from "../config.json";
import { embedTitleWithDescription, songEmbed } from "./components/embed";
import { transformMillisecondsInTimeText } from "./utils/transform-time";

const client = new ExtendedClient();

client.start();

const player = new Player(client);
player.extractors.register(YoutubeiExtractor, {});
player.extractors.loadDefault();

client.on("ready", () => {
  console.log(`Bot ON`);
});

client.on("messageCreate", async (message) => {
  let messageAuthorId = message.author.id;
  let botId = client.user?.id || "";

  if (messageAuthorId == botId) return;

  if (message.content.startsWith(symbol)) {
    message.content = message.content.replace(symbol, "");
    onEvent(message);
  }
  player.on("error", (error) => {
    message.channel.send({
      embeds: [
        embedTitleWithDescription(`Deu esse erro: ${JSON.stringify(error)}`),
      ],
    });
  });
});

player.events.on("playerStart", async (queue, track) => {
  const embed = songEmbed(
    track.title,
    track.description,
    { name: track.author },
    [
      {
        name: "Duração da musica",
        value: transformMillisecondsInTimeText(track.durationMS),
        inline: true,
      },
      {
        name: "Duração da playlist",
        value: transformMillisecondsInTimeText(
          queue?.currentTrack?.durationMS
            ? track.durationMS + queue.estimatedDuration
            : track.durationMS
        ),
      },
    ],
    { url: track.thumbnail },
    track.url,
    queue.metadata.author
  );

  await queue.metadata.channel!.send({ embeds: [embed] });
});

player.events.on("audioTrackAdd", async (queue, track) => {
  if (queue.isPlaying()) {
    const embed = embedTitleWithDescription(
      `Adicionado: ${track.title}`,
      "",
      { url: track.thumbnail },
      track.url
    );

    await queue.metadata.channel!.send({ embeds: [embed] });
  }
});

player.events.on("playerSkip", async (queue, track) => {
  const embed = embedTitleWithDescription(
    `Música **${track.title}** pulada!`,
    "",
    { url: track.thumbnail },
    track.url
  );

  await queue.metadata.channel!.send({ embeds: [embed] });
});

export { client, symbol, player };
