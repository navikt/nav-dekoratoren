import { Features } from "decorator-shared/types";
import { endpointUrlWithoutParams } from "./urls";

export const fetchFeatures = async (): Promise<Features | undefined> => {
    try {
        const url = endpointUrlWithoutParams("/api/features");

        const response = await fetch(url, {
            credentials: "include", // Ensures cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch features: ${response.status}`);
        }

        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error("Error fetching features:", error);
        return undefined;
    }
};
