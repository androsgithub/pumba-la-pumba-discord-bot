import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

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
    let token: string = process.env.BOT_TOKEN;
    if (!token) {
      console.error("No token provided");
      return;
    }
    this.login(process.env.BOT_TOKEN);
  }
}
