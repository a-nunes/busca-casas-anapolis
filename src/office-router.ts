import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('imobiliaria-office')
router.addHandler('DETAIL', async ({ request, page, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('span.first-line').text()
  const rawPreco = $('p.price').first().text()
  const bairro = $('.item-breadcrumb6').first().text()
  const rawAreaConstruida = $('.digital .usable_floor_area').first().text()
  const rawAreaTerreno = $('.digital .gross_floor_area').first().text()
  const rawQuartos = $('.digital .bedrooms').first().text()
  const rawSuites = $('.digital .suites').first().text()
  const rawVagas = $('.digital .garages').first().text()
  const rawBanheiros = $('.digital .bathrooms').first().text()
  const codigo = await page.locator('.property-reference').textContent()
  const results = {
    codigo,
    interesse: false,
    contato: false,
    descarte: false,
    url: request.url,
    titulo,
    preco: dataCleaner(rawPreco),
    bairro,
    areaConstruida: dataCleaner(rawAreaConstruida),
    areaTerreno: dataCleaner(rawAreaTerreno),
    quartos: dataCleaner(rawQuartos),
    suites: dataCleaner(rawSuites),
    banheiros: dataCleaner(rawVagas),
    vagas: dataCleaner(rawBanheiros),
  }
  log.info(`Saving data: ${request.url}`)
  await dataset.pushData(results);
});

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  log.info(`Enqueueing pagination: ${request.url}`)
  await page.waitForSelector('.pagination-buttons a');
  await enqueueLinks({
      selector: '.pagination-buttons > a',
      label: 'LIST',
  })
  log.info(`Enqueueing actor details: ${request.url}`)
  await page.waitForSelector('.card_split_vertically');
  await enqueueLinks({
      selector: '.card_split_vertically',
      label: 'DETAIL',
  })
});