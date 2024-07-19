import { watch, FSWatcher } from "node:fs";
import { isLocalhost } from "../urls";

type OnUpdateCallback<FileContent> = (
    fileContent: FileContent | null,
) => unknown;

type ConstructorProps<FileContent> = {
    mountPath: string;
    filename: string;
    onUpdate?: OnUpdateCallback<FileContent>;
};

const getFullPath = (mountPath: string) =>
    `${process.cwd()}${isLocalhost() ? "/config" : mountPath}`;

export class ConfigMapWatcher<FileContent extends Record<string, unknown>> {
    private readonly mountPath: string;
    private readonly filePath: string;
    private readonly watcher: FSWatcher;

    private fileContent: FileContent | null = null;

    constructor({
        mountPath,
        filename,
        onUpdate,
    }: ConstructorProps<FileContent>) {
        this.mountPath = getFullPath(mountPath);
        this.filePath = `${this.mountPath}/${filename}`;

        this.updateFileContent();

        this.watcher = watch(this.mountPath, (event, filename) => {
            console.log(`ConfigMap file ${filename} was updated (${event})`);

            this.updateFileContent().then((updatedContent) => {
                if (onUpdate && updatedContent) {
                    onUpdate(updatedContent);
                }
            });
        });

        console.log(`Watching for updates on configmap file ${this.filePath}`);

        process.on("SIGINT", () => {
            console.log(`Closing watcher for configmap file ${this.filePath}`);
            this.watcher.close();
        });
    }

    public async getFileContent() {
        if (!this.fileContent) {
            await this.updateFileContent();
        }

        return this.fileContent;
    }

    private updateFileContent = async () => {
        try {
            this.fileContent = (await Bun.file(
                this.filePath,
            ).json()) as FileContent;
            return this.fileContent;
        } catch (e) {
            console.error(
                `Error reading configmap file ${this.filePath} - ${e}`,
            );
            return null;
        }
    };
}
