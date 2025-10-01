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
    private lastMtime: number = 0;

    constructor({
        mountPath,
        filename,
        onUpdate,
    }: ConstructorProps<FileContent>) {
        const mountPathFull = path.join(
            process.cwd(),
            isLocalhost() ? "/config" : mountPath,
        );

        this.filePath = path.join(mountPathFull, filename);

        const mountPathStats = fs.statSync(mountPathFull, {
            throwIfNoEntry: false,
        });

        if (!mountPathStats) {
            console.error(
                `Mount path ${mountPathFull} for ${filename} does not exist - configmap file will not be watched`,
            );
            return;
        }

        this.updateFileContent();

        // Watch the parent directory for Kubernetes ConfigMap updates
        const parentDir = path.dirname(mountPathFull);
        const watcher = fs.watch(
            parentDir,
            { recursive: false },
            (event, fileOrDir) => {
                // Check if the change is related to our mount path
                if (
                    fileOrDir &&
                    fileOrDir.includes(path.basename(mountPathFull))
                ) {
                    console.log(
                        `Detected potential ConfigMap update for ${mountPathFull} (${event})`,
                    );
                    this.checkForUpdate(onUpdate);
                }
            },
        );

        // Also watch the mount path itself for direct file changes
        const directWatcher = fs.watch(
            mountPathFull,
            { recursive: true },
            (event, fileOrDir) => {
                if (path.basename(fileOrDir) !== filename) {
                    return;
                }

                console.log(
                    `Configmap file ${this.filePath} change detected (${event})`,
                );
                this.checkForUpdate(onUpdate);
            },
        );

        // Implement polling as a fallback mechanism for reliability
        const pollInterval = setInterval(() => {
            this.checkForUpdate(onUpdate);
        }, 60000); // Poll every 60 seconds

        console.log(`Watching for updates on ${mountPathFull} for ${filename}`);
        console.log(
            `Also watching parent directory ${parentDir} for ConfigMap symlink updates`,
        );

        process.on("SIGINT", () => {
            console.log(`Closing watchers for configmap file ${this.filePath}`);
            watcher.close();
            directWatcher.close();
            clearInterval(pollInterval);
        });
    }

    public async getFileContent() {
        if (!this.fileContent) {
            await this.updateFileContent();
        }

        return this.fileContent;
    }

    private async checkForUpdate(onUpdate?: OnUpdateCallback<FileContent>) {
        try {
            // Check if file has been modified by comparing mtime
            const stats = await fs.promises.stat(this.filePath);
            const currentMtime = stats.mtimeMs;

            if (currentMtime !== this.lastMtime) {
                this.lastMtime = currentMtime;
                console.log(
                    `File ${this.filePath} has been modified (mtime: ${new Date(currentMtime).toISOString()})`,
                );

                const updatedContent = await this.updateFileContent();
                if (onUpdate && updatedContent) {
                    onUpdate(updatedContent);
                }
            }
        } catch (e) {
            console.error(`Error checking file update: ${e}`);
        }
    }

    private updateFileContent = async () => {
        try {
            // Use fs.promises.readFile for better error handling and consistency
            const fileData = await fs.promises.readFile(this.filePath, "utf-8");
            this.fileContent = JSON.parse(fileData) as FileContent;

            // Update last modification time
            const stats = await fs.promises.stat(this.filePath);
            this.lastMtime = stats.mtimeMs;

            console.log(`Successfully read configmap file ${this.filePath}`);
            return this.fileContent;
        } catch (e) {
            console.error(
                `Error reading configmap file ${this.filePath} - ${e}`,
            );
            return null;
        }
    };
}
