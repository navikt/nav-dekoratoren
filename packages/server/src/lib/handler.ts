import ContentService from "../content-service";
import { csp } from "../csp";

type Params = ConstructorParameters<typeof Response>;

export type DefaultContext = {
    contentService: ContentService;
};

class HandlerResponse<TData extends Params[0]> {
    headers = new Headers();
    data?: TData;

    html(data: TData) {
        this.data = data;
        this.headers.set("content-type", "text/html; charset=utf-8");
        return this;
    }

    json(data: TData | unknown) {
        // better handling here
        this.data = JSON.stringify(data) as TData;
        this.headers.set("content-type", "application/json; charset=utf-8");
        return this;
    }

    setHeader(key: string, value: string) {
        this.headers.set(key, value);
        return this;
    }

    build() {
        this.headers.append("Content-Security-Policy", csp);

        return new Response(this.data, {
            headers: this.headers,
        });
    }
}

export const responseBuilder = () => new HandlerResponse();
/**
 * A handler function is a function that takes a request and returns a response.
 */
export type HandlerFunction = ({
    request,
    url,
    query,
}: {
    request: Request;
    url: URL;
    query: Record<string, string>;
}) => Response | Promise<Response>;

/**
 * The handler object contains the method, path and handler function.
 */
export type Handler = {
    method: string;
    path: string;
    handler: HandlerFunction;
};

/**
 * A builder for creating handlers.
 */
// @TODO: Make typesafe?
export class HandlerBuilder {
    handlers: Handler[] = [];

    get(path: string, handler: HandlerFunction): HandlerBuilder {
        this.handlers.push({ method: "GET", path, handler });
        return this;
    }

    post(path: string, handler: HandlerFunction): HandlerBuilder {
        this.handlers.push({ method: "POST", path, handler });
        return this;
    }

    use(handlers: Handler[]): HandlerBuilder {
        this.handlers = [...this.handlers, ...handlers];
        return this;
    }

    build() {
        return this.handlers;
    }
}
