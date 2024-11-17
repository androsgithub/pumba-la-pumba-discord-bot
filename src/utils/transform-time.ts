export function transformTimeTextInMilliseconds(txt: string) {
  const mills = txt.split(":").reduce((acc, current, i) => {
    return txt.split(":").length == i + 1
      ? acc + parseInt(current) * 1000
      : acc + parseInt(current) * 60000;
  }, 0);
  return mills;
}
export function transformMillisecondsInTimeText(mills: number) {
  let seconds = Math.floor(mills / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds -= minutes * 60;
  minutes -= hours * 60;

  return `${hours ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
