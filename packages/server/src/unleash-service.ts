import { Features } from 'decorator-shared/types';
import { Unleash, initialize } from 'unleash-client';

type Config = {
  mock?: boolean;
};


/**
 * @deprecated Only for testing deployment
 */
export interface GetFeatures {
    getFeatures(): Features;
}

export default class UnleashService {
  unleashInstance: Unleash | null;
  supportedFeatures: { [key: string]: boolean };
  mock: boolean;

  constructor({ mock }: Config) {
    // @TODO: Here we should use server/env/schema
    const { UNLEASH_SERVER_API_TOKEN, UNLEASH_SERVER_API_URL } = process.env;
    // Important: If the Unleash Next service goes down, we don't want
    // screen sharing or the chatbot to automatically be disabled.
    // However, future toggles may want to default to false, so assign
    // this below:
    this.supportedFeatures = {
      'dekoratoren.skjermdeling': true,
      'dekoratoren.chatbotscript': true,
    };
    this.unleashInstance = null;
    this.mock = mock || false;

    if (this.mock) {
      return;
    }

    if (!UNLEASH_SERVER_API_TOKEN || !UNLEASH_SERVER_API_URL) {
      console.error(
        'Missing UNLEASH_SERVER_API_TOKEN or UNLEASH_SERVER_API_URL',
      );
      return;
    }

    try {
      console.log('Initializing unleash');
      this.unleashInstance = initialize({
        url: `${UNLEASH_SERVER_API_URL}/api/`,
        appName: 'nav-dekoratoren',
        customHeaders: { Authorization: UNLEASH_SERVER_API_TOKEN },
      });
    } catch (e) {
      console.error('Error initializing unleash', e);
    }
  }

  getFeatures(): Features {
    const features = Object.keys(this.supportedFeatures).reduce(
      (acc, feature: string) => {
        if (this.mock) return { ...acc, [feature]: true };
        const isEnabled = this.unleashInstance?.isSynchronized()
          ? this.unleashInstance.isEnabled(feature)
          : this.supportedFeatures[feature];
        return { ...acc, [feature]: isEnabled };
      },
      {},
    ) as Features;

    return features;
  }
}
