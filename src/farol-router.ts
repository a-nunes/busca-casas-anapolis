import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'
import { adrianaPriceCleaner } from './utils/adriana-price-cleaner.ts'

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('casas-para-alugar')
router.addHandler('DETAIL', async ({ request, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('div.text h2').text()
  const infoCasa: string[] = []
  $('.features').each((i, ul) => {
    const children = $(ul).children()
    children.each((i, li) => {
      infoCasa.push($(li).text())
    })
  })
  const rawPreco = $('h4').text()
  const bairro = $('span.subheading').text()
  const rawAreaConstruida = infoCasa[5]
  const rawAreaTerreno = infoCasa[0]
  const rawQuartos = infoCasa[1]
  const rawSuites = ""
  const rawVagas = infoCasa[3]
  const rawBanheiros = infoCasa[2]
  const codigo = $('.badge.badge-secondary').text()
  const results = {
    codigo,
    url: request.url,
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
  await page.waitForSelector('a.page-numbers');
  await enqueueLinks({
      selector: 'a.page-numbers',
      label: 'LIST',
  })
  log.info(`Enqueueing actor details: ${request.url}`)
  await page.waitForSelector('a.icon.d-flex.align-items-center.justify-content-center.btn-custom');
  await enqueueLinks({
      selector: 'a.icon.d-flex.align-items-center.justify-content-center.btn-custom',
      label: 'DETAIL',
  })
});