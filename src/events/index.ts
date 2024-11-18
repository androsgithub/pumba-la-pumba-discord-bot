import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { play } from "./music/onPlay";
import { GuildQueue } from "discord-player";
import { skip } from "./music/onSkip";
import { seek } from "./music/onSeek";
import { search } from "./music/onSearch";
import { time } from "./music/onTime";
import { stop } from "./music/onStop";
import { player } from "..";
import { restart } from "./functions/onRestart";
import { config } from "../utils/configs";
import { setVolume } from "./configs/onSetVolume";
import { shuffle } from "./music/onShuffle";
import { togglePause } from "./music/onPause";

export async function onEvent(
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  const isUserAdmin = message.member?.permissions.has("Administrator") || false;
  const args = message.content.trim().split(" ");
  const queue: GuildQueue | null = player.queues.get(message.guild!.id);

  switch (true) {
    //music
    case args[0] == "play" || args[0] == "p":
      const url = args[1];
      play(url, queue, message);
      break;

    case args[0] == "search":
      search(args, queue, message);
      break;

    case args[0] == "shuffle":
      shuffle(queue, message);
      break;

    case args[0] == "pause":
      togglePause(queue, message);
      break;

    case args[0] == "time":
      time(queue, message);
      break;

    case args[0] == "seek":
      seek(args[1], queue, message);
      break;

    case args[0] == "skip":
      skip(queue, message);
      break;

    case args[0] == "stop":
      stop(queue, message);
      break;

    //configs
    case args[0] == "volume" || args[0] == "vol":
      setVolume(args[1], queue, message, isUserAdmin);
      break;
    case args[0] == "restart" && isUserAdmin:
      restart(message);
      break;
  }
}
