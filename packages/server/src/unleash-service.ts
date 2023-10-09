import { Unleash, initialize } from 'unleash-client';

type Config = {
  mock?: boolean;
  env: string;
};

export type Features = {
  'dekoratoren.skjermdeling': boolean;
  'dekoratoren.chatbotscript': boolean;
};

export default class UnleashService {
  unleashInstance: Unleash | null;
  expectedFeatures: string[];
  mock: boolean;

  constructor(config: Config = { env: 'production' }) {
    const { UNLEASH_SERVER_API_TOKEN, UNLEASH_SERVER_API_URL } = process.env;
    this.expectedFeatures = [
      'dekoratoren.skjermdeling',
      'dekoratoren.chatbotscript',
    ];
    this.unleashInstance = null;
    this.mock = config.mock || false;

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
      this.unleashInstance = initialize({
        url: `${UNLEASH_SERVER_API_URL}/api/`,
        appName: 'nav-dekoratoren',
        customHeaders: { Authorization: UNLEASH_SERVER_API_TOKEN },
      });
    } catch (e) {
      console.error('Error initializing unleash', e);
    }
  }

  private getDefaultFeatures() {
    return this.expectedFeatures.reduce((acc, feature: string) => {
      return { ...acc, [feature]: true };
    }, {}) as Features;
  }

  getFeatures(): Features {
    if (this.mock) {
      return this.getDefaultFeatures();
    }

    // Important: If the Unleash Next service goes down, we don't want
    // screen sharing or the chatbot to automatically be disabled,
    // so default these features to true by defaulting the feature set.
    if (!this.unleashInstance) {
      console.error(
        'Unleash has not been initialized, so unable to get features',
      );
      return this.getDefaultFeatures();
    }

    const features = this.expectedFeatures.reduce((acc, feature: string) => {
      const isEnabled =
        this.unleashInstance && this.unleashInstance.isEnabled(feature);
      return { ...acc, [feature]: isEnabled };
    }, {}) as Features;

    return features;
  }
}
