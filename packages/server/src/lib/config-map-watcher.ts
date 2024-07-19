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

const getFullPath = (mountPath: string, filename: string) =>
    `${process.cwd()}${isLocalhost() ? "/config" : mountPath}/${filename}`;

export class ConfigMapWatcher<FileContent extends Record<string, unknown>> {
    private readonly fullPath: string;
    private readonly watcher: FSWatcher;

    private fileContent: FileContent | null = null;

    constructor({
        mountPath,
        filename,
        onUpdate,
    }: ConstructorProps<FileContent>) {
        this.fullPath = getFullPath(mountPath, filename);

        this.updateFileContent();

        this.watcher = watch(this.fullPath, (event, filename) => {
            console.log(`ConfigMap file ${filename} was updated (${event})`);

            this.updateFileContent().then((updatedContent) => {
                if (onUpdate && updatedContent) {
                    onUpdate(updatedContent);
                }
            });
        });

        console.log(`Watching for updates on configmap file ${this.fullPath}`);

        process.on("SIGINT", () => {
            console.log(`Closing watcher for configmap file ${this.fullPath}`);
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
                this.fullPath,
            ).json()) as FileContent;
            return this.fileContent;
        } catch (e) {
            console.error(
                `Error reading configmap file ${this.fullPath} - ${e}`,
            );
            return null;
        }
    };
}
