import { Handler, HandlerFunction, r } from "./lib/handler";
import { validParams } from "./validateParams";

export const csrHandlerFunc: HandlerFunction = ({ request, query }) => {
    const data = validParams(query);
    // Get header and footer from decorator
    return r().json({
            name: "Max",
    }).build()
};

    export const csrHandler: Handler = {
  method: 'GET',
  path: '/env',
  handler: csrHandlerFunc,
};
