declare module 'decorator-client/dist/manifest.json' {
    const value: Record<string, {
        file: string;
        css: string[];
        src: string;
        isEntry: boolean;
    }>;
    export default value;
}
