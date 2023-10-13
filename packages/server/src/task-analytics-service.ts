// To mock this locally, create the file /config/ta-config.json on the project root
import { TaskAnalyticsSurveyConfig } from 'decorator-shared/types';
import taConfigJson  from './ta-config-mock.json'


export default class TaConfigService {
    constructor() {}

    getTaConfig(): TaskAnalyticsSurveyConfig[] {
        return taConfigJson as TaskAnalyticsSurveyConfig[];
    }
}
