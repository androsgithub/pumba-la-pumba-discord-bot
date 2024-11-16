import { QueryType } from "discord-player";
import { ExtendedClient } from "./structs/extended-client";
import { YoutubeiExtractor } from "discord-player-youtubei";
const { Player } = require("discord-player");

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

  if (message.content.startsWith("pumbala")) {
    const messages = message.content.split(" ");
    await player.play(message.member?.voice.channelId, messages[1], {
      searchEngine: QueryType.YOUTUBE,
    });
  }
});

export { client };
