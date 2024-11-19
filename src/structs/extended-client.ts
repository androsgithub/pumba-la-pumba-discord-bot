import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import { internal } from "../utils/configs";

export class ExtendedClient extends Client {
  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }
  public start() {
    let token: string = internal.BOT_TOKEN;
    if (!token) {
      console.error("No token provided");
      return;
    }
    this.login(internal.BOT_TOKEN);
  }
}
