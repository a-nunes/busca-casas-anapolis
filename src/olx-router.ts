import { createPlaywrightRouter, Dataset } from 'crawlee';
import { dataCleaner } from './utils/data-cleaner.ts'
import { olxCleaner } from './utils/olx-bairro-cleaner.ts';

export const router = createPlaywrightRouter();

const dataset = await Dataset.open('casas-para-alugar')
router.addHandler('DETAIL', async ({ request, log, parseWithCheerio }) => {
  log.info(`Extracting data: ${request.url}`)
  const $ = await parseWithCheerio();
  const titulo = $('h1').text()
  const rawPreco = $('h2.ad__sc-12l420o-1.cuGsvO.sc-drMfKT.fbofhg').first().text()
  const infoCasa: string[] = []
  $('div.sc-hmzhuo.ad__sc-1f2ug0x-3.sSzeX.sc-jTzLTM.iwtnNi').each((i, dd) => {
    infoCasa.push($(dd).text())
  })
  const bairro = infoCasa[10]
  const rawAreaConstruida = infoCasa[4]
  const rawAreaTerreno = ''
  const rawQuartos = infoCasa[5]
  const rawSuites = ''
  const rawVagas = infoCasa[7]
  const rawBanheiros = infoCasa[6]
  const codigo = $('span.ad__sc-16iz3i7-0.bTSFxO.sc-ifAKCX.fizSrB').text()
  const results = {
    codigo,
    url: request.url,
    titulo,
    preco: dataCleaner(rawPreco),
    bairro: olxCleaner(bairro),
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
  await page.waitForSelector('.sc-1ef50gp-0.hWozpX li a');
  await enqueueLinks({
      selector: '.sc-1ef50gp-0.hWozpX > li > a',
      label: 'LIST',
  })
  log.info(`Enqueueing actor details: ${request.url}`)
  await page.waitForSelector('.sc-12rk7z2-1.huFwya.sc-htoDjs.fpYhGm');
  await enqueueLinks({
      selector: '.sc-12rk7z2-1.huFwya.sc-htoDjs.fpYhGm',
      label: 'DETAIL',
  })
});