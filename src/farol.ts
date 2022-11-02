import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './farol-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://faroldi.com.br/imoveis/aluguel/casas/?bairro=0&valor=0~0']);
await crawler.run();
const dataset = await Dataset.open('farol-di')
await dataset.exportToCSV('farol-di', {toKVS: 'farol-di'})