importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js');

workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/'
});

const { core, precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;
const { CacheFirst, NetworkFirst, NetworkOnly } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;

const cacheSuffixVersion = '-210605b',
    // precacheCacheName = core.cacheNames.precache,
    // runtimeCacheName = core.cacheNames.runtime,
    maxEntries = 100;

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key.includes('disqus-cdn-cache')) return caches.delete(key);
                if (key.includes('disqus-img-cache')) return caches.delete(key);
                if (!key.includes(cacheSuffixVersion)) return caches.delete(key);
            }));
        })
    );
});


core.setCacheNameDetails({
    prefix: '186blog',
    suffix: cacheSuffixVersion
});

core.skipWaiting();
core.clientsClaim();
precaching.cleanupOutdatedCaches();

/*
 * Cache File From jsDelivr
 * cdn.jsdelivr.net | shadow.elemecdn.com
 *
 * Method: CacheFirst
 * cacheName: static-immutable
 * cacheTime: 30d
 */

// cdn.jsdelivr.net - cors enabled
routing.registerRoute(
    /.*cdn\.jsdelivr\.net/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*i\.186526\.xyz/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*static\.186526\.top/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*fonts\.googleapis\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*www\.googletagmanager\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    new RegExp('https://www.google-analytics.com'),
    new NetworkOnly({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Google_Analytics', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
);

routing.registerRoute(
    new RegExp('https://comment.186526.xyz'),
    new NetworkFirst({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Comment', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
);

routing.registerRoute(
    new RegExp('https://comment.186526.xyz'),
    new NetworkFirst({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Comment_GET', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "GET"
);

routing.registerRoute(
    new RegExp('https://analytics.google.com'),
    new NetworkOnly({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Google_Analytics_New', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
)

const assert_js = core._private, cacheNames_js = core._private, cacheWrapper_js = core._private, fetchWrapper_js = core._private, getFriendlyURL_js = core._private, logger_js = core._private, WorkboxError_js = core._private;

const cacheOkAndOpaquePlugin = {
    /**
     * Returns a valid response (to allow caching) if the status is 200 (OK) or
     * 0 (opaque).
     *
     * @param {Object} options
     * @param {Response} options.response
     * @return {Response|null}
     *
     * @private
     */
    cacheWillUpdate: async ({
        response
    }) => {
        if (response.status === 200 || response.status === 0) {
            return response;
        }

        return null;
    }
};

const messages = {
    strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL_js.getFriendlyURL(request.url)}'`,
    printFinalResponse: response => {
        if (response) {
        }
    }
};

class StaleWhileRevalidate {
    /**
     * @param {Object} options
     * @param {string} options.cacheName Cache name to store and retrieve
     * requests. Defaults to cache names provided by
     * [workbox-core]{@link module:workbox-core.cacheNames}.
     * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} options.fetchOptions Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of all fetch() requests made by this strategy.
     * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
     */
    constructor(options = {}) {
        this._cacheName = cacheNames_js.cacheNames.getRuntimeName(options.cacheName);
        this._plugins = options.plugins || [];

        if (options.plugins) {
            const isUsingCacheWillUpdate = options.plugins.some(plugin => !!plugin.cacheWillUpdate);
            this._plugins = isUsingCacheWillUpdate ? options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
        } else {
            // No plugins passed in, use the default plugin.
            this._plugins = [cacheOkAndOpaquePlugin];
        }

        this._fetchOptions = options.fetchOptions;
        this._matchOptions = options.matchOptions;
    }
    /**
     * This method will perform a request strategy and follows an API that
     * will work with the
     * [Workbox Router]{@link module:workbox-routing.Router}.
     *
     * @param {Object} options
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {Event} [options.event] The event that triggered the request.
     * @return {Promise<Response>}
     */


    async handle({
        event,
        request
    }) {
        const logs = [];

        if (typeof request === 'string') {
            request = new Request(request);
        }

        const fetchAndCachePromise = this._getFromNetwork({
            request,
            event
        });

        let response = await cacheWrapper_js.cacheWrapper.match({
            cacheName: this._cacheName,
            request,
            event,
            matchOptions: this._matchOptions,
            plugins: this._plugins
        });
        let error;

        if (response) {
            {
                logs.push(`Found a cached response in the '${this._cacheName}'` + ` cache. Will update with the network response in the background.`);
            }

            if (event) {
                try {
                    event.waitUntil(fetchAndCachePromise);
                } catch (error) {
                    {
                    }
                }
            }
        } else {
            {
                logs.push(`No response found in the '${this._cacheName}' cache. ` + `Will wait for the network response.`);
            }

            try {
                response = await fetchAndCachePromise;
            } catch (err) {
                error = err;
            }
        }

        {

            for (const log of logs) {
            }

            messages.printFinalResponse(response);
        }

        if (!response) {
            throw new WorkboxError_js.WorkboxError('no-response', {
                url: request.url,
                error
            });
        }

        return response;
    }
    /**
     * @param {Object} options
     * @param {Request} options.request
     * @param {Event} [options.event]
     * @return {Promise<Response>}
     *
     * @private
     */


    async _getFromNetwork({
        request,
        event
    }) {
        const response = await fetchWrapper_js.fetchWrapper.fetch({
            request,
            event,
            fetchOptions: this._fetchOptions,
            plugins: this._plugins
        });
        const responseRealClone = response.clone();
        const responseClone = new Response(await responseRealClone.blob(), {
            status: responseRealClone.status,
            statusText: responseRealClone.statusText,
            headers: {
                ...Object.fromEntries(responseRealClone.headers.entries()),
                "server": '186526 Edge',
            }
        });
        const cachePutPromise = cacheWrapper_js.cacheWrapper.put({
            cacheName: this._cacheName,
            request,
            response: responseClone,
            event,
            plugins: this._plugins
        });

        if (event) {
            try {
                event.waitUntil(cachePutPromise);
            } catch (error) {
                {
                }
            }
        }

        return response;
    }
}

const StaleWhileRevalidateInstance = new StaleWhileRevalidate();
/*
 * Others img
 * Method: staleWhileRevalidate
 * cacheName: img-cache
 */
routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|gif|webp)/,
    StaleWhileRevalidateInstance
);

/*
 * Static Assets
 * Method: staleWhileRevalidate
 * cacheName: static-assets-cache
 */
routing.registerRoute(
    // Cache CSS files
    /.*\.(css|js)/,
    // Use cache but update in the background ASAP
    StaleWhileRevalidateInstance
);

/*
 * sw.js - Revalidate every time
 * staleWhileRevalidate
 */
routing.registerRoute(
    '/sw.js',
    StaleWhileRevalidateInstance
);



routing.registerRoute(
    /.*blog\.186526\.xyz/,
    StaleWhileRevalidateInstance
);

routing.registerRoute(
    /.*localhost/,
    StaleWhileRevalidateInstance
);


routing.registerRoute(
    /.*\.(?:svg)/,
    new NetworkOnly()
);

routing.registerRoute(
    /.*img-shields-io\.186526\.xyz/,
    new NetworkOnly()
);

/*
 * Default - Serve as it is
 * StaleWhileRevalidate
 */
routing.setDefaultHandler(
    new NetworkOnly()
);
