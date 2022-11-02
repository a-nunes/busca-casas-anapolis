import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './maria-mendes-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.imobiliariamariamendes.com.br/imoveis/para-alugar/casa']);
await crawler.run();
const dataset = await Dataset.open('imobiliaria-maria-mendes')
await dataset.exportToCSV('imobiliaria-maria-mendes', {toKVS: 'imobiliaria-maria-mendes'})