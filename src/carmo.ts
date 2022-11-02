import { PlaywrightCrawler, log, Dataset, purgeDefaultStorages } from 'crawlee';
import { router } from './carmo-router.ts'

await purgeDefaultStorages();
log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://www.carmoimoveis.com.br/imoveis/para-alugar/casa']);
await crawler.run();
const dataset = await Dataset.open('carmo-imoveis')
await dataset.exportToCSV('casas-para-alugar')