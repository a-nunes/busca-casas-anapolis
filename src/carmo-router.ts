import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('carmo-imoveis')
router.addHandler('DETAIL', async ({ request, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('span.first-line').text()
  const rawPreco = $('p.price').first().text()
  const bairro = $('.item-breadcrumb6').first().text()
  const codigo = $('span.property-reference').first().text()
  let rawQuartos = ""
  let rawAreaConstruida = ""
  let rawAreaTerreno = ""
  let rawSuites = ""
  let rawVagas = ""
  let rawBanheiros = ""
  $('.item-info').each((i, div) => {
    const children = $(div).children()
    if(children.hasClass('ga-bedrooms-02')) { rawQuartos = children.next().text() }
    if(children.hasClass('ga-bathroom-03')) { rawSuites = children.next().text() }
    if(children.hasClass('ga-bathroom-04')) { rawBanheiros = children.next().text() }
    if(children.hasClass('ga-garage-03')) { rawVagas = children.next().text() }
    if(children.hasClass('ga-ruler-02')) { rawAreaConstruida = children.next().text() }
  })
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
  await page.waitForSelector('.card.card-listing a');
  await enqueueLinks({
      selector: '.card.card-listing > a',
      label: 'DETAIL',
  })
});