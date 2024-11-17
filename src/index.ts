import { ExtendedClient } from "./structs/extended-client";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Player, useVolume } from "discord-player";
import { onEvent } from "./events";

const client = new ExtendedClient();
const symbol = "--";

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
    onEvent(message, client, player);
  }
});

export { client, symbol };
