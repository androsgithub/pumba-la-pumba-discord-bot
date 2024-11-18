import {
  APIEmbedAuthor,
  APIEmbedField,
  EmbedAssetData,
  EmbedBuilder,
  User,
} from "discord.js";

export function songEmbed(
  title: string,
  description: string,
  author: APIEmbedAuthor,
  fields: APIEmbedField[],
  thumbnail: EmbedAssetData,
  url: string,
  user: User
) {
  return new EmbedBuilder({
    title,
    description,
    author,
    thumbnail,
    fields,
    url,
    footer: {
      text: `Pedido por ${user.username}`,
      icon_url: user.avatarURL({ size: 64 }) ?? "",
    },
    timestamp: Date.now(),
  });
}
export function embedTitleWithDescription(
  title: string,
  description?: string,
  image?: EmbedAssetData,
  url?: string
) {
  return new EmbedBuilder({
    description,
    title,
    thumbnail: image,
    url,
    timestamp: Date.now(),
  });
}
