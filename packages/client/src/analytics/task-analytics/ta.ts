import { taskAnalyticsSelectSurvey } from "./ta-selection";
import {
    taskAnalyticsRefreshState,
    taskAnalyticsGetSelectedSurveyId,
    taskAnalyticsSetSelected,
} from "./ta-cookies";
import {
    taskAnalyticsGetMatchingSurveys,
    taskAnalyticsIsMatchingSurvey,
} from "./ta-matching";
import { Context, Language } from "decorator-shared/params";
import { AppState } from "decorator-shared/types";
import { TaskAnalyticsSurvey } from "decorator-server/src/task-analytics-config";

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
    currentUrl: URL,
) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (
        survey &&
        taskAnalyticsIsMatchingSurvey(
            survey,
            currentLanguage,
            currentAudience,
            currentUrl,
        )
    ) {
        startSurvey(surveyId);
    }
};

const findAndStartSurvey = (
    surveys: TaskAnalyticsSurvey[],
    state: AppState,
    currentUrl: URL,
) => {
    const { params } = state;
    // const { context } = state.params

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
            currentUrl,
        );
        return;
    }

    const matchingSurveys = taskAnalyticsGetMatchingSurveys(
        surveys,
        params.language,
        params.context,
        currentUrl,
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

const fetchAndStart = async (state: AppState, currentUrl: URL) => {
    return fetch(`${state.env.APP_URL}/api/ta`)
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
            findAndStartSurvey(surveys, state, currentUrl);
        })
        .catch((e) => {
            console.error(`Error fetching Task Analytics surveys - ${e}`);
        });
};

export const startTaskAnalyticsSurvey = (
    state: AppState,
    currentUrl = new URL(window.location.href),
) => {
    taskAnalyticsRefreshState();

    if (fetchedSurveys) {
        findAndStartSurvey(fetchedSurveys, state, currentUrl);
    } else {
        fetchAndStart(state, currentUrl);
    }
};

export const initTaskAnalytics = () => {
    window.TA = window.TA || taFallback;
    window.dataLayer = window.dataLayer || [];

    startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);

    window.addEventListener("historyPush", (e) =>
        startTaskAnalyticsSurvey(window.__DECORATOR_DATA__, e.detail.url),
    );
};
