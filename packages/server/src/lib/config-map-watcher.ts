import * as fs from "node:fs";
import * as path from "node:path";
import { isLocalhost } from "../urls";

type OnUpdateCallback<FileContent> = (
    fileContent: FileContent | null,
) => unknown;

type ConstructorProps<FileContent> = {
    mountPath: string;
    filename: string;
    onUpdate?: OnUpdateCallback<FileContent>;
};

export class ConfigMapWatcher<FileContent extends Record<string, unknown>> {
    private readonly filePath: string;
    private fileContent: FileContent | null = null;

    constructor({
        mountPath,
        filename,
        onUpdate,
    }: ConstructorProps<FileContent>) {
        const mountPathFull = path.join(
            process.cwd(),
            isLocalhost() ? "/config" : mountPath,
        );
        const parentPath = path.dirname(mountPathFull);

        this.filePath = path.join(mountPathFull, filename);

        this.updateFileContent();

        // Kubernetes deletes and recreates the mount directory for the configmap
        // when it is redeployed, so we need to watch the parent directory
        const watcher = fs.watch(
            parentPath,
            { recursive: true },
            (event, fileOrDir) => {
                if (
                    event !== "change" ||
                    path.basename(fileOrDir) !== filename
                ) {
                    return;
                }

                console.log(`Configmap file ${this.filePath} was updated`);

                this.updateFileContent().then((updatedContent) => {
                    if (onUpdate && updatedContent) {
                        onUpdate(updatedContent);
                    }
                });
            },
        );

        console.log(
            `Watching for updates on ${parentPath} for ${this.filePath}`,
        );

        process.on("SIGINT", () => {
            console.log(`Closing watcher for configmap file ${this.filePath}`);
            watcher.close();
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
