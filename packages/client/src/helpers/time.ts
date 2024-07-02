export const isoDateNow = () => {
    return new Date().toISOString();
};

export const oneHourFromNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString();
};
export const sixHoursFromNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + 6);
    return date.toISOString();
};

export const secondsFromNow = (isoDate: string) => {
    const now = new Date().getTime();
    const expires = new Date(isoDate).getTime();
    return Math.ceil((expires - now) / 1000);
};

export function fakeExpirationTime(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
}

export function getSecondsToDate(isoDate: string) {
    if (!isoDate) return 0;
    const now = new Date().getTime();
    const expires = new Date(isoDate).getTime();
    return Math.ceil((expires - now) / 1000);
}
