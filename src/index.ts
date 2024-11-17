import { ExtendedClient } from "./structs/extended-client";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Player, useVolume } from "discord-player";
import { onEvent } from "./events";
import { symbol } from "../config.json";
import { embedTitleWithDescription } from "./components/embed";

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

export { client, symbol, player };
