export default function dateTime(timeZone,mode="both") {
  let datetime_str = new Date().toLocaleString("en-US", { timeZone });
  let time = new Date(datetime_str).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  let date = new Date(datetime_str).toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  if(mode=="time") return time;
  if(mode=="date") return date;
  return { time, date };
}
