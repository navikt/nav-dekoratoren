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
    pollIntervalMs?: number; // New optional polling interval
};

export class ConfigMapWatcher<FileContent extends Record<string, unknown>> {
    private readonly filePath: string;
    private fileContent: FileContent | null = null;
    private watcher: fs.FSWatcher | null = null;
    private lastModified: number = 0;

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

        console.log(
            `ConfigMapWatcher: Initializing watcher for ${this.filePath}`,
        );
        console.log(`ConfigMapWatcher: Mount path: ${mountPathFull}`);

        const mountPathStats = fs.statSync(mountPathFull, {
            throwIfNoEntry: false,
        });

        if (!mountPathStats) {
            console.error(
                `ConfigMapWatcher: Mount path ${mountPathFull} for ${filename} does not exist - configmap file will not be watched`,
            );
            return;
        }

        this.updateFileContent().then(() => {
            this.setupWatcher(mountPathFull, filename, onUpdate);
        });

        process.on("SIGINT", () => {
            this.cleanup();
        });
    }

    private setupWatcher(
        mountPathFull: string,
        filename: string,
        onUpdate?: OnUpdateCallback<FileContent>,
    ) {
        try {
            // Watch the specific file instead of the directory
            const fileExists = fs.existsSync(this.filePath);

            if (fileExists) {
                // Watch the file directly
                this.watcher = fs.watch(this.filePath, (event, filename) => {
                    console.log(
                        `ConfigMapWatcher: File watcher triggered - event: ${event}, filename: ${filename}`,
                    );
                    this.handleFileChange(onUpdate);
                });
                console.log(
                    `ConfigMapWatcher: Direct file watcher established for ${this.filePath}`,
                );
            } else {
                // If file doesn't exist yet, watch the directory
                this.watcher = fs.watch(
                    mountPathFull,
                    { recursive: false },
                    (event, fileOrDir) => {
                        console.log(
                            `ConfigMapWatcher: Directory watcher triggered - event: ${event}, file: ${fileOrDir}`,
                        );
                        if (
                            fileOrDir &&
                            path.basename(fileOrDir as string) === filename
                        ) {
                            this.handleFileChange(onUpdate);
                        }
                    },
                );
            }

            // Handle watcher errors
            this.watcher.on("error", (error) => {
                console.error(
                    `ConfigMapWatcher: Watcher error for ${this.filePath}:`,
                    error,
                );
                this.restartWatcher(mountPathFull, filename, onUpdate);
            });

            this.watcher.on("close", () => {
                console.log(
                    `ConfigMapWatcher: Watcher closed for ${this.filePath}`,
                );
            });
        } catch (error) {
            console.error(
                `ConfigMapWatcher: Failed to setup watcher for ${this.filePath}:`,
                error,
            );
        }
    }

    private handleFileChange(onUpdate?: OnUpdateCallback<FileContent>) {
        console.log(
            `ConfigMapWatcher: Handling file change for ${this.filePath}`,
        );

        // Add small delay to handle atomic operations
        setTimeout(async () => {
            try {
                const stats = fs.statSync(this.filePath, {
                    throwIfNoEntry: false,
                });
                if (!stats) {
                    console.log(
                        `ConfigMapWatcher: File ${this.filePath} no longer exists after change event`,
                    );
                    return;
                }

                const currentModified = stats.mtimeMs;
                console.log(
                    `ConfigMapWatcher: File modification time - current: ${currentModified}, last: ${this.lastModified}`,
                );

                if (currentModified !== this.lastModified) {
                    console.log(
                        `ConfigMapWatcher: File ${this.filePath} was modified, updating content`,
                    );

                    const updatedContent = await this.updateFileContent();
                    if (onUpdate && updatedContent) {
                        onUpdate(updatedContent);
                    }
                } else {
                    console.log(
                        `ConfigMapWatcher: File ${this.filePath} change event but no modification time change`,
                    );
                }
            } catch (error) {
                console.error(
                    `ConfigMapWatcher: Error handling file change for ${this.filePath}:`,
                    error,
                );
            }
        }, 100); // 100ms delay to handle Kubernetes atomic operations
    }

    private restartWatcher(
        mountPathFull: string,
        filename: string,
        onUpdate?: OnUpdateCallback<FileContent>,
    ) {
        console.log(
            `ConfigMapWatcher: Restarting watcher for ${this.filePath}`,
        );

        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }

        // Restart after a delay
        setTimeout(() => {
            this.setupWatcher(mountPathFull, filename, onUpdate);
        }, 1000);
    }

    private cleanup() {
        console.log(
            `ConfigMapWatcher: Cleaning up watchers for ${this.filePath}`,
        );

        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }

    public async getFileContent() {
        if (!this.fileContent) {
            await this.updateFileContent();
        }

        return this.fileContent;
    }

    private updateFileContent = async () => {
        try {
            console.log(
                `ConfigMapWatcher: Reading file content from ${this.filePath}`,
            );

            const stats = fs.statSync(this.filePath, { throwIfNoEntry: false });
            if (!stats) {
                console.log(
                    `ConfigMapWatcher: File ${this.filePath} does not exist`,
                );
                return null;
            }

            const currentModified = stats.mtimeMs;
            console.log(
                `ConfigMapWatcher: File size: ${stats.size} bytes, modified: ${new Date(currentModified).toISOString()}`,
            );

            this.fileContent = (await Bun.file(
                this.filePath,
            ).json()) as FileContent;

            this.lastModified = currentModified;
            console.log(
                `ConfigMapWatcher: Successfully updated file content from ${this.filePath}`,
            );

            return this.fileContent;
        } catch (e) {
            console.error(
                `ConfigMapWatcher: Error reading configmap file ${this.filePath} - ${e}`,
            );
            return null;
        }
    };
}
