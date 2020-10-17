export interface FormatTimePayload {
  time: number;
}

export const formatBiggestUnitHoursSmallestUnitMilliseconds = ({ time }: FormatTimePayload): string => {
  const ms = parseInt(time.toString().slice(-3), 10);
  const msPart = `.${ms > 99 ? '' : '0'}${ms > 9 ? '' : '0'}${ms}`;

  const seconds = Math.trunc((time / 1000) % 60);
  const secondsPart = `${seconds > 9 ? '' : '0'}${seconds}`;

  const minutes = Math.trunc((time / (1000 * 60)) % 60);
  const minutesPart = `${minutes > 9 ? '' : '0'}${minutes}:`;

  const hours = Math.trunc((time / (1000 * 60 * 60)) % 24);
  const hoursPart = `${hours > 9 ? '' : '0'}${hours}:`;

  return `${hoursPart}${minutesPart}${secondsPart}${msPart}`;
};

// To show minute correctly when time is more than 60 minutes
export const formatBiggestUnitMinuteSmallestUnitSeconds = ({ time }: FormatTimePayload): string => {
  const seconds = Math.trunc((time / 1000) % 60);
  const secondsPart = `${seconds > 9 ? '' : '0'}${seconds}`;

  const minutes = Math.trunc((time / (1000 * 60)) % 1000);
  const minutesPart = `${minutes > 9 ? '' : '0'}${minutes}:`;
  return `${minutesPart}${secondsPart}`;
};
