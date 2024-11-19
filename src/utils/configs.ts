import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

var config: { volume: number; symbol: string } = {
  volume: 100,
  symbol: "--",
};
var internal: { BOT_TOKEN: string } = {
  BOT_TOKEN: process.env.BOT_TOKEN,
};

fs.readFile("config.json", function (err, data) {
  if (err) throw err;
  config = JSON.parse(data.toString());
});

export function reconfigure(changes: object) {
  let newConfig = { ...config, ...changes };
  fs.writeFile("config.json", JSON.stringify(newConfig), function (err) {
    if (err) throw err;
  });
}

export { config, internal };
