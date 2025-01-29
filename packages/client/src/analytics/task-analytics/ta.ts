import { TaskAnalyticsSurvey } from "decorator-server/src/task-analytics-config";
import { Context, Language } from "decorator-shared/params";
import { endpointUrlWithParams } from "../../helpers/urls";
import {
    taskAnalyticsGetSelectedSurveyId,
    taskAnalyticsRefreshState,
    taskAnalyticsSetSelected,
} from "./ta-cookies";
import {
    taskAnalyticsGetMatchingSurveys,
    taskAnalyticsIsMatchingSurvey,
} from "./ta-matching";
import { taskAnalyticsSelectSurvey } from "./ta-selection";

let fetchedSurveys: TaskAnalyticsSurvey[] | null = null;

const taFallback = (...args: any[]) => {
    window.TA.q = window.TA.q || [];
    window.TA.q.push(args);
};

const startSurvey = (surveyId: string) => {
    console.log(`Starting TA survey ${surveyId}`);
    window.TA("start", surveyId);
};

const startSurveyIfMatching = (
    surveyId: string,
    surveys: TaskAnalyticsSurvey[],
    currentLanguage: Language,
    currentAudience: Context,
) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (
        survey &&
        taskAnalyticsIsMatchingSurvey(survey, currentLanguage, currentAudience)
    ) {
        startSurvey(surveyId);
    }
};

const findAndStartSurvey = (surveys: TaskAnalyticsSurvey[]) => {
    const { params } = window.__DECORATOR_DATA__;

    // Do not show surveys if the simple header is used
    if (params.simple || params.simpleHeader) {
        return;
    }

    // If a survey was previously selected for the user, try to start it
    const selectedSurveyId = taskAnalyticsGetSelectedSurveyId();
    if (selectedSurveyId) {
        startSurveyIfMatching(
            selectedSurveyId,
            surveys,
            params.language,
            params.context,
        );
        return;
    }

    const matchingSurveys = taskAnalyticsGetMatchingSurveys(
        surveys,
        params.language,
        params.context,
    );
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

const fetchAndStart = async () => {
    return fetch(endpointUrlWithParams("/api/ta"))
        .then((res) => {
            if (!res.ok) {
                throw Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then((surveys) => {
            if (!Array.isArray(surveys)) {
                throw Error(
                    `Invalid type for surveys response - ${JSON.stringify(surveys)}`,
                );
            }
            fetchedSurveys = surveys;
            findAndStartSurvey(surveys);
        })
        .catch((e) => {
            console.error(`Error fetching Task Analytics surveys - ${e}`);
        });
};

const startTaskAnalyticsSurvey = () => {
    taskAnalyticsRefreshState();

    if (fetchedSurveys) {
        findAndStartSurvey(fetchedSurveys);
    } else {
        fetchAndStart();
    }
};

export const initTaskAnalytics = () => {
    window.TA = window.TA || taFallback;
    window.dataLayer = window.dataLayer || [];

    startTaskAnalyticsSurvey();
    window.addEventListener("historyPush", startTaskAnalyticsSurvey);
};

export const stopTaskAnalytics = () => {
    if (!window.TA) {
        return;
    }

    window.removeEventListener("historyPush", startTaskAnalyticsSurvey);

    const taScript = document.querySelector('script[src*="taskanalytics.com"]');

    if (taScript) {
        taScript.remove();
    }

    delete window.TA;
};
