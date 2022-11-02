import { log, Dataset } from 'crawlee';
import fetch from 'node-fetch'

const BODY = {"aceitaFinanciamento":null,"areaMax":null,"areaMin":null,"bairros":[],"caracteristicas":null,"codigo":null,"condominioFechado":null,"condominios":[],"finalidade":"ALUGAR","minBanheiros":null,"minQuartos":null,"minSuites":null,"minVagas":null,"municipio":["Anapolis"],"permuta":null,"tipos":["CASA"],"unidadeArea":"METROS","valorMax":null,"valorMin":null,"uf":null}
interface anuncio {
    anuncioId: string,
    codigo: string,
    titulo: string,
    fotos: string[],
    quartos: number,
    banheiros: number,
    suites: number,
    vagas: number,
    tipo: string,
    logradouroNumero: string,
    municipio: string,
    uf: string,
    bairro: string,
    valor: number,
    destaque: boolean,
    superDestaque: boolean,
    favoritado: boolean,
    areaTotal: number,
    areaUtil: number,
    unidadeArea: string,
    composicao: string,
    composicaoLista: string[],
    latitude: number,
    longitude: number,
    finalidade: string,
    anuncioIndisponivel: boolean,
    precoM2: number,
    urlFichaCompartilhada: string,
    reservado: boolean,
    exclusivo: boolean,
    totalQuartosSendoSuites: boolean,
    totalQuartosSuitesIndividuais: boolean
}

interface response {
    total: number,
    anuncios: anuncio[]
}

const dataset = await Dataset.open('casas-para-alugar')
log.info('Setting up crawler for Imobiliaria Residencia.');
const res: response = await fetch('https://www.imobiliariaresidencia.com.br/api/tenants/IAC-IMOB-BE3D8076/anunciosSiteSemMapa?offset=0', {
  method: 'POST',
  body: JSON.stringify(BODY),
  headers: {
    'Content-type': 'application/json'
  }
}).then(res => res.json())
for(const anuncio of res.anuncios) {
    const results = {
      codigo: anuncio.codigo,
        url: anuncio.urlFichaCompartilhada,
        titulo: anuncio.titulo,
        preco: anuncio.valor,
        bairro: anuncio.bairro,
        areaConstruida: anuncio.areaUtil,
        areaTerreno: anuncio.areaTotal,
        quartos: anuncio.quartos,
        suites: anuncio.suites,
        banheiros: anuncio.banheiros,
        vagas: anuncio.vagas,
    }
    log.info(`Saving data: ${anuncio.anuncioId}`)
    await dataset.pushData(results);
}
