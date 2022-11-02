import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './adriana-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxConcurrency: 3
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.adrianaimoveis.com.br/imoveis/aluguel/Casa']);
await crawler.run();
const dataset = await Dataset.open('casas-para-alugar')
