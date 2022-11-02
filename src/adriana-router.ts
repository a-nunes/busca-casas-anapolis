import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'
import { adrianaPriceCleaner } from './utils/adriana-price-cleaner.ts'

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('adriana-imoveis')
router.addHandler('DETAIL', async ({ request, page, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('h1').text()
  const infoCasa: string[] = []
  const infoConstrucao: string[] = []
  $('.condition-list').each((i, ul) => {
    const children = $(ul).children()
    children.each((i, li) => {
      infoCasa.push($(li).text())
    })
  })
  $('.pro-details-condition-inner').each((i, p) => {
    const children = $(p).children()
    children.each((i, p) => {
      infoConstrucao.push($(p).text())
    })
  })
  const rawPreco = infoCasa[5]
  const bairro = infoCasa[6]
  const rawAreaConstruida = infoConstrucao[6]
  const rawAreaTerreno = infoConstrucao[5]
  const rawQuartos = infoCasa[2]
  const rawSuites = infoCasa[3]
  const rawVagas = infoCasa[4]
  const rawBanheiros = ""
  const codigo = request.url.split('/').slice(-1)[0]
  const results = {
    codigo,
    interesse: false,
    contato: false,
    descarte: false,
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
  await page.waitForSelector('.pagination-list li a');
  await enqueueLinks({
      selector: '.pagination-list > li > a',
      label: 'LIST',
  })
  log.info(`Enqueueing actor details: ${request.url}`)
  await page.waitForSelector('.flat-item-image a');
  await enqueueLinks({
      selector: '.flat-item-image > a',
      label: 'DETAIL',
  })
});