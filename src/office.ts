import { PlaywrightCrawler, log, Dataset, purgeDefaultStorages } from 'crawlee';
import { router } from './office-router.ts'

await purgeDefaultStorages();
log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.imobiliariaoffice.com.br/imoveis/para-alugar/casa']);
await crawler.run();
const dataset = await Dataset.open('imobiliaria-office')
await dataset.exportToCSV('casas-para-alugar')