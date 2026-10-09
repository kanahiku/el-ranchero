import { defineMiddleware } from 'astro:middleware';
import { isIndexableHost } from '~/lib/indexing';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (isIndexableHost(context.url.host)) {
    response.headers.delete('X-Robots-Tag');
  } else {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});
