export function toTimeFromMilliseconds(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return (minutes == 0 ? `` :  `${minutes}`) + `${minutes}:${seconds}:${milliseconds.toString().padStart(3, '0')}`;
}