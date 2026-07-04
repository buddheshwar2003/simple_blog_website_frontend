export const TimeFormeter = (time: string) => {
  const currentTime = time?.split("T");
  return currentTime[0] + " " + currentTime[1].slice(0, 5);
};
