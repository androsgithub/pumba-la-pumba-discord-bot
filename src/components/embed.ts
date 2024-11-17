import {
  APIEmbedAuthor,
  APIEmbedField,
  APIEmbedThumbnail,
  EmbedAssetData,
  EmbedBuilder,
  EmbedData,
  User,
} from "discord.js";
import { transformMillisecondsInTimeText } from "../utils/transform-time";

export function songEmbed(
  title: string,
  description: string,
  author: APIEmbedAuthor,
  fields: APIEmbedField[],
  thumbnail: EmbedAssetData,
  user: User
) {
  return new EmbedBuilder({
    title,
    description,
    author,
    thumbnail,
    fields,
    footer: {
      text: `Pedido por ${user.username}`,
      icon_url: user.avatarURL({ size: 64 }) ?? "",
    },
    timestamp: Date.now(),
  });
}
export function embedTitleWithDescription(title: string, description?: string) {
  return new EmbedBuilder({
    description,
    title,
    timestamp: Date.now(),
  });
}
