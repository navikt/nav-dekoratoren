export function addSecondsFromNow(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
}

export const getSecondsRemaining = (futureDate: string) => {
    if (!futureDate) {
        return 0;
    }

    const nowEpoch = new Date().getTime();
    const futureEpoch = new Date(futureDate).getTime();
    return Math.ceil((futureEpoch - nowEpoch) / 1000);
};
