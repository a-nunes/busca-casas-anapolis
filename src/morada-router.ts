import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'
import { adrianaPriceCleaner } from './utils/adriana-price-cleaner.ts'

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('morada-imoveis')
router.addHandler('DETAIL', async ({ request, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('h1').text()
  const rawPreco = $('.valorImovel').text()
  const bairro = $('figure').text()
  const rawAreaConstruida = ""
  const rawAreaTerreno = ""
  const rawQuartos = ""
  const rawSuites = ""
  const rawVagas = ""
  const rawBanheiros = ""
  const codigo = $('span.tag').text()
  const results = {
    codigo: dataCleaner(codigo),
    url: request.url,
    interesse: false,
    contato: false,
    descarte: false,
    titulo,
    preco: adrianaPriceCleaner(rawPreco),
    bairro,
    areaConstruida: dataCleaner(rawAreaConstruida),
    areaTerreno: dataCleaner(rawAreaTerreno),
    quartos: dataCleaner(rawQuartos),
    suites: dataCleaner(rawSuites),
    banheiros: dataCleaner(rawBanheiros),
    vagas: dataCleaner(rawVagas),
  }
  log.info(`Saving data: ${request.url}`)
  await dataset.pushData(results);
})

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  log.info(`Enqueueing pagination: ${request.url}`)
  await page.waitForSelector('.pagination li a');
  await enqueueLinks({
      selector: '.pagination > li > a',
      label: 'LIST',
  })
  log.info(`Enqueueing actor details: ${request.url}`)
  await page.waitForSelector('div.property div.property-image a');
  await enqueueLinks({
      selector: 'div.property > div.property-image > a',
      label: 'DETAIL',
  })
});