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
    this.handlers.push({ method: 'GET', path, handler });
    return this;
  }

  post(path: string, handler: HandlerFunction): HandlerBuilder {
    this.handlers.push({ method: 'POST', path, handler });
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

/**
 * A helper function for creating a JSON response.
 */
export const jsonResponse = async (data: unknown) =>
  new Response(JSON.stringify(await data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const htmlResponse =  async (text: string) =>
    new Response(text, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
    });

