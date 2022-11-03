import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './olx-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxConcurrency: 3
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://go.olx.com.br/grande-goiania-e-anapolis/outras-cidades/anapolis/imoveis/aluguel/casas']);
await crawler.run();
const dataset = await Dataset.open('casas-para-alugar')
await dataset.exportToCSV('casas-para-alugar', { toKVS: 'casas-para-alugar' })
