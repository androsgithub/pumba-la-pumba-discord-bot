import {
  ActionRowBuilder,
  APISelectMenuOption,
  APIStringSelectComponent,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export function select(selectMenu: APIStringSelectComponent) {
  return new ActionRowBuilder<StringSelectMenuBuilder>({
    components: [selectMenu],
  });
}

export function selectMenu(
  custom_id: string,
  placeholder: string,
  options: APISelectMenuOption[]
) {
  return new StringSelectMenuBuilder({
    custom_id,
    placeholder,
    options: options.splice(0, 25),
  }).toJSON();
}
export function selectMenuOption(
  label: string,
  description: string,
  value: string
) {
  return new StringSelectMenuOptionBuilder({
    label: label.substring(0, 99),
    description: description.substring(0, 24),
    value: value,
  }).toJSON();
}
