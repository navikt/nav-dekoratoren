

/**
 * A handler function is a function that takes a request and returns a response.
 */
export type HandlerFunction<TContext> = ({
    request,
    url,
    query,
    ctx
}: {
    request: Request;
    url: URL;
    query: Record<string, string>;
    ctx: TContext;
}) => Response | Promise<Response>;

type Method = 'GET' | 'POST';
/**
 * The handler object contains the method, path and handler function.
 */
export type Handler<
    TPath extends string,
    TContext = any,
> = {
    method: string;
    path: TPath;
    handler: HandlerFunction<TContext>;
};

export function makeHandler<
    TPath extends string,
    TMethod extends Method,
    TContext = any,
>(
    method: TMethod,
    path: TPath,
    handler: HandlerFunction<TContext>,
): Handler<TPath> {
    return {
        method,
        path,
        handler,
    };
}

type HandlerMaker = typeof makeHandler;

/**
 * A builder for creating handlers.
 */
// @TODO: Make typesafe?
export class HandlerBuilder<
    THandlers extends Array<Handler<
        string
    >> = [],
    TContext extends object = any,
> {
    handlers: THandlers;
    // Context for handlers, can be anything
    ctx: TContext;
    providedHandlers: ((ctx: TContext) => Handler<string>[])[];

    constructor() {
        this.handlers = [] as any as THandlers;
        this.providedHandlers = [] as Array<(ctx: TContext) => Handler<string>[]>;
        this.ctx = {} as TContext;
    }

    get<
        TPath extends string,
    >(path: TPath, handler: HandlerFunction<TContext>) {
        this.handlers.push({
            method: 'GET',
            path,
            handler
        });

        return this as any as HandlerBuilder<
            [
                ...THandlers,
                Handler<TPath>,
            ],
            TContext
        >;
    }

    post<
        TPath extends string,
    >(path: TPath, handler: HandlerFunction<TContext>) {
        this.handlers.push({ method: 'POST', path, handler });

        return this as any as HandlerBuilder<[
            ...THandlers,
            Handler<TPath>
        ],
        TContext
        >;
    }

    useRouter<TRouter extends HandlerBuilder<any>>
        (
            router: TRouter
        ) {
        this.handlers = [
            ...this.handlers,
            ...router.handlers,
        ] as any;

        return this as any as HandlerBuilder<
            [
                ...THandlers,
                ...TRouter['handlers'],
            ],
            TContext
        >
    }

    use(handlers:
        (ctx: TContext) => Handler<string>[]
       )  {

        this.providedHandlers = [
            handlers
        ]

        return this as any as HandlerBuilder<
            THandlers,
            TContext
        >
    }

    build(ctx: TContext) {
        this.ctx = ctx;

        for (const handler of this.providedHandlers) {
            this.handlers = [
                ...this.handlers,
                ...handler(this.ctx)
            ] as any as THandlers;
        }

        return this
    }
}


/**
 * A helper function for creating a JSON response.
 */
export const jsonResponse = async (data: unknown) =>
    new Response(JSON.stringify(await data), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });


export async function makeFetch(
        router: HandlerBuilder<any[], any>,
    ) {
    return async (request: Request): Promise<Response> => {
        const url = new URL(request.url);


        const handler = router.handlers.find(
            ({ method, path }) => request.method === method && url.pathname === path,
        ) as unknown as Handler<string, any>;

        if (handler) {
            return handler.handler({
                request,
                url,
                query: Object.fromEntries(url.searchParams),
                ctx: router.ctx,
            });
        } else {
            return new Response('Not found', { status: 404 });
        }
    }
}
