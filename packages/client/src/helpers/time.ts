export const nowISOString = () => {
    return new Date().toISOString();
};

export function addSecondsFromNow(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
}

export const addOneHourFromNow = () => {
    const secondsInAnHour = 60 * 60;
    return addSecondsFromNow(secondsInAnHour);
};

export const addSixHoursFromNow = () => {
    const secondsInSixHours = 6 * 60 * 60;
    return addSecondsFromNow(secondsInSixHours);
};

export const getSecondsRemaining = (futureDate: string) => {
    if (!futureDate) {
        return 0;
    }

    const nowEpoch = new Date().getTime();
    const futureEpoch = new Date(futureDate).getTime();
    return Math.ceil((futureEpoch - nowEpoch) / 1000);
};
