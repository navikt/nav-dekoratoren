import { taskAnalyticsSelectSurvey } from './ta-selection';
import { taskAnalyticsRefreshState, taskAnalyticsGetSelectedSurveyId, taskAnalyticsSetSelected } from './ta-cookies';
import { taskAnalyticsGetMatchingSurveys, taskAnalyticsIsMatchingSurvey } from './ta-matching';
import { Context, Language } from 'decorator-shared/params';
import { AppState, TaskAnalyticsSurveyConfig } from 'decorator-shared/types';

let fetchedSurveys: TaskAnalyticsSurveyConfig[] | null = null;

const taFallback = (...args: any[]) => {
    window.TA.q = window.TA.q || [];
    window.TA.q.push(args);
};

const startSurvey = (surveyId: string) => {
    console.log(`Starting TA survey ${surveyId}`);
    window.TA('start', surveyId);
};

const startSurveyIfMatching = (surveyId: string, surveys: TaskAnalyticsSurveyConfig[], currentLanguage: Language, currentAudience: Context) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (survey && taskAnalyticsIsMatchingSurvey(survey, currentLanguage, currentAudience)) {
        startSurvey(surveyId);
    }
};

const findAndStartSurvey = (surveys: TaskAnalyticsSurveyConfig[], state: AppState) => {
    const { params } = state;
    // const { context } = state.params

    // Do not show surveys if the simple header is used
    if (params.simple || params.simpleHeader) {
        return;
    }

    // If a survey was previously selected for the user, try to start it
    const selectedSurveyId = taskAnalyticsGetSelectedSurveyId();
    if (selectedSurveyId) {
        startSurveyIfMatching(selectedSurveyId, surveys, params.language, params.context);
        return;
    }

    const matchingSurveys = taskAnalyticsGetMatchingSurveys(surveys, params.language, params.context);
    if (!matchingSurveys) {
        return;
    }

    const selectedSurvey = taskAnalyticsSelectSurvey(matchingSurveys);
    if (!selectedSurvey) {
        return;
    }

    const { id } = selectedSurvey;
    taskAnalyticsSetSelected(id);
    startSurvey(id);
};

const fetchAndStart = async (state: AppState) => {
    return fetch(`${state.env.APP_URL}/api/ta`)
        .then((res) => {
            if (!res.ok) {
                throw Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then((surveys) => {
            if (!Array.isArray(surveys)) {
                throw Error(`Invalid type for surveys response - ${JSON.stringify(surveys)}`);
            }
            fetchedSurveys = surveys;
            findAndStartSurvey(surveys, state);
        })
        .catch((e) => {
            console.error(`Error fetching Task Analytics surveys - ${e}`);
        });
};

const startTaskAnalyticsSurvey = (state: AppState) => {
    taskAnalyticsRefreshState();

    if (fetchedSurveys) {
        findAndStartSurvey(fetchedSurveys, state);
    } else {
        fetchAndStart(state);
    }
};

export const initTaskAnalytics = () => {
    window.TA = window.TA || taFallback;
    window.dataLayer = window.dataLayer || [];
    window.startTaskAnalyticsSurvey = startTaskAnalyticsSurvey;
};
