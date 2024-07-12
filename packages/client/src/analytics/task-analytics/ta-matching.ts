import {
    taskAnalyticsGetState,
    taskAnalyticsSetSurveyMatched,
} from "./ta-cookies";
import { Context } from "decorator-shared/params";
import {
    TaskAnalyticsSurvey,
    TaskAnalyticsUrlRule,
} from "decorator-server/src/task-analytics-config";

type Audience = Required<TaskAnalyticsSurvey>["audience"][number];
type Language = Required<TaskAnalyticsSurvey>["language"][number];
type Duration = TaskAnalyticsSurvey["duration"];

const isMatchingCurrentLocation = (
    url: URL,
    match: TaskAnalyticsUrlRule["match"],
) => {
    const { origin, pathname, search } = window.location;

    return (
        url.origin === origin &&
        (match === "startsWith"
            ? pathname.startsWith(url.pathname)
            : url.pathname === pathname) &&
        (!url.search || url.search === search)
    );
};

const isMatchingUrls = (urls: TaskAnalyticsUrlRule[]) => {
    let isMatched: boolean | null = null;
    let isExcluded = false;

    urls.every((urlRule) => {
        const { url, match, exclude } = urlRule;
        const urlParsed = new URL(url);

        if (isMatchingCurrentLocation(urlParsed, match)) {
            // If the url is excluded we can stop. If not, we need to continue checking the url-array, in case
            // there are exclusions in the rest of the array
            if (exclude) {
                isExcluded = true;
                return false;
            } else {
                isMatched = true;
            }
        } else if (!exclude) {
            // If there was a previous match, keep the true value
            // This handles the case where the url-array contains only excluded urls
            isMatched = isMatched || false;
        }

        return true;
    });

    return !(isExcluded || isMatched === false);
};

const isMatchingAudience = (currentAudience: Audience, audience?: Audience[]) =>
    !audience || audience.some((a) => a === currentAudience);

const isMatchingLanguage = (currentLanguage: Language, language?: Language[]) =>
    !language || language.some((lang) => lang === currentLanguage);

export const isMatchingDuration = (duration: Duration) => {
    if (!duration) {
        return true;
    }

    const { start, end } = duration;
    const now = new Date();

    return (
        (!start || now.getTime() > new Date(start).getTime()) &&
        (!end || now.getTime() < new Date(end).getTime())
    );
};

export const taskAnalyticsIsMatchingSurvey = (
    survey: TaskAnalyticsSurvey,
    currentLanguage: Language,
    currentAudience: Audience,
) => {
    const { urls, audience, language, duration } = survey;

    return (
        (!urls || isMatchingUrls(urls)) &&
        isMatchingAudience(currentAudience, audience) &&
        isMatchingLanguage(currentLanguage, language) &&
        isMatchingDuration(duration)
    );
};

export const taskAnalyticsGetMatchingSurveys = (
    surveys: TaskAnalyticsSurvey[],
    currentLanguage: Language,
    currentAudience: Context,
) => {
    const { matched: prevMatched = {} } = taskAnalyticsGetState();

    const matchingSurveys = surveys.filter((survey) => {
        const { id } = survey;
        if (!id) {
            console.log("No TA survey id specified!");
            return false;
        }

        if (prevMatched[id]) {
            return false;
        }

        const isMatching = taskAnalyticsIsMatchingSurvey(
            survey,
            currentLanguage,
            currentAudience,
        );
        if (!isMatching) {
            return false;
        }

        taskAnalyticsSetSurveyMatched(id);

        return true;
    });

    return matchingSurveys.length === 0 ? null : matchingSurveys;
};
