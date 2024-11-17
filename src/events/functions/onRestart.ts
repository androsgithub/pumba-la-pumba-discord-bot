import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { embedTitleWithDescription } from "../../components/embed";

export async function restart(
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  await message.channel.send({
    embeds: [
      embedTitleWithDescription(
        "Reiniciando...",
        "Processo de reinicialização iniciado"
      ),
    ],
  });
  console.log("Restarting the server...");
  process.exit(0);
}
