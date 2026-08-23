export const formatDurationShort = (totalSeconds: number) => {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
