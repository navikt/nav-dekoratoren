import * as fs from "node:fs";
import * as path from "node:path";
import { isLocalhost } from "../urls";
import { logger } from "./logger";

type OnUpdateCallback<FileContent> = (
    fileContent: FileContent | null,
) => unknown;

type ConstructorProps<FileContent> = {
    mountPath: string;
    filename: string;
    onUpdate?: OnUpdateCallback<FileContent>;
    shouldPoll?: boolean;
};

export class ConfigMapWatcher<FileContent extends Record<string, unknown>> {
    private readonly filePath: string;
    private fileContent: FileContent | null = null;
    private lastMtime: number = 0;
    private pollTimeout: NodeJS.Timeout | null = null;
    private isShuttingDown: boolean = false;

    constructor({
        mountPath,
        filename,
        onUpdate,
        shouldPoll = false,
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
            logger.error(
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
                    logger.info(
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
                if (fileOrDir && path.basename(fileOrDir) !== filename) {
                    return;
                }

                logger.info(
                    `Configmap file ${this.filePath} change detected (${event})`,
                );
                this.checkForUpdate(onUpdate);
            },
        );

        // Implement polling as a fallback mechanism for reliability.
        // For some reason, fs.watch can miss events on Kubernetes volumes.
        const startPolling = () => {
            if (this.isShuttingDown) return;

            this.pollTimeout = setTimeout(async () => {
                try {
                    await this.checkForUpdate(onUpdate);
                } catch (e) {
                    logger.error(
                        `Error during polling config map changes: ${e}`,
                    );
                } finally {
                    // Schedule next poll regardless of success or failure
                    startPolling();
                }
            }, 60000);
        };

        if (shouldPoll) {
            startPolling();
        }

        logger.info(
            `Watching for updates on ${mountPathFull} for ${filename} and ${parentDir}.`,
        );

        process.on("SIGINT", () => {
            logger.info(`Closing watchers for configmap file ${this.filePath}`);
            this.isShuttingDown = true;
            watcher.close();
            directWatcher.close();
            if (this.pollTimeout) {
                clearTimeout(this.pollTimeout);
                this.pollTimeout = null;
            }
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
                logger.info(
                    `File ${this.filePath} has been modified (mtime: ${new Date(currentMtime).toISOString()})`,
                );

                const updatedContent = await this.updateFileContent();
                if (onUpdate && updatedContent) {
                    onUpdate(updatedContent);
                }
            }
        } catch (e) {
            logger.error(`Error checking file update: ${e}`);
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

            logger.info(`Successfully read configmap file ${this.filePath}`);
            return this.fileContent;
        } catch (e) {
            logger.error(
                `Error reading configmap file ${this.filePath} - ${e}`,
            );
            return null;
        }
    };
}
