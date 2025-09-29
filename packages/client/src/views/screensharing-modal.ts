import { defineCustomElement } from "./custom-elements";

import {
    ScreenshareButtonPuzzel,
    ScreensharingModalPuzzel,
} from "./screensharing-modal-puzzel";

defineCustomElement("screensharing-modal", ScreensharingModalPuzzel);
defineCustomElement("screenshare-button", ScreenshareButtonPuzzel);
