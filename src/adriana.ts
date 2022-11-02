import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './adriana-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.adrianaimoveis.com.br/imoveis/aluguel/Casa?page=3']);
await crawler.run();
const dataset = await Dataset.open('adriana-imoveis')
await dataset.exportToCSV('adriana-imoveis', {toKVS: 'adriana-imoveis'})