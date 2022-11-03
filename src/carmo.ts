import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './carmo-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.carmoimoveis.com.br/imoveis/para-alugar/casa']);
await crawler.run();