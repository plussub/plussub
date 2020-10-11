export interface FormatTimePayload {
  time: number;
  largestUnit: 'MINUTE' | 'HOUR';
  smallestUnit: 'SECOND' | 'MS';
}

export const formatTime = ({ time, largestUnit, smallestUnit }: FormatTimePayload): string => {
  const ms = parseInt(time.toString().slice(-3), 10);
  const msPart = smallestUnit === 'MS' ? `.${ms > 99 ? '' : '0'}${ms > 9 ? '' : '0'}${ms}` : '';

  const seconds = Math.trunc((time / 1000) % 60);
  const secondsPart = `${seconds > 9 ? '' : '0'}${seconds}`;

  const minutes = Math.trunc((time / (1000 * 60)) % 60);
  const minutesPart = `${minutes > 9 ? '' : '0'}${minutes}:`;

  const hours = Math.trunc((time / (1000 * 60 * 60)) % 24);
  const hoursPart = largestUnit === 'HOUR' ? `${hours > 9 ? '' : '0'}${hours}:` : '';

  return `${hoursPart}${minutesPart}${secondsPart}${msPart}`;
};
