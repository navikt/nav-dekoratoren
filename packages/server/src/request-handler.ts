import { getMockSession, refreshToken } from './mockAuth';
import ContentService from './content-service';

import SearchService from './search-service';
import {
  NotificationList,
} from './views/notifications/notifications';
import { Texts } from 'decorator-shared/types';
import UnleashService from './unleash-service';
import TaConfigService from './task-analytics-service';
import { makeFetch } from './lib/handler';
import { FileSystemService, mainRouter } from './router';


export type NotificationsService = {
  getNotifications: (texts: Texts) => Promise<NotificationList[] | undefined>;
};


const requestHandler = async (
  contentService: ContentService,
  searchService: SearchService,
  fileSystemService: FileSystemService,
  notificationsService: NotificationsService,
  unleashService: UnleashService,
  taConfigService: TaConfigService,
) => {
    console.log(fileSystemService)
    const router = mainRouter.build({
        contentService,
        searchService,
        fileSystemService,
        notificationsService,
        unleashService,
        taConfigService,
        getMockSession,
        refreshToken,
    });

    return makeFetch(router);
};



export default requestHandler;
