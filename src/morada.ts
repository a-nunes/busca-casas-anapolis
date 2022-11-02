import { PlaywrightCrawler, log, Dataset } from 'crawlee';
import { router } from './morada-router.ts'

log.info('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});
log.info('Adding requests to the queue.');
await crawler.addRequests(['https://moradaimoveis.com.br/filtro/finalidade/2/tipo-imovel/casa/cidade/anapolis/ordenacao/2/pagina/1']);
await crawler.run();
const dataset = await Dataset.open('casas-para-alugar')
