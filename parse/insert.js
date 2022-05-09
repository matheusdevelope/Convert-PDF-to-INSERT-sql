const fs = require("fs");

function aspas(value) {
  return `'` + value + `'`;
}

function GenerateInsert(LISTA, IDs) {
  function AppendFile(data) {
    fs.appendFileSync(IDs.output_file, data);
  }

  AppendFile(`USE ${IDs.BaseDeDados} \n GO \n\n `);

  LISTA.forEach((obj) => {
    let ValorComum = {
      ID: "Select next value for Geral.SequenciaID",
      CodEmpresa: IDs.CodEmpresa,
      CodFilial: IDs.CodFilial,
      CodTipoLancamento: IDs.CodTipoLancamento,
      CodFolha: IDs.CodFolha,

      CodFuncionario: `(select Top 1 CodFuncionario from ${IDs.TabelaFunc} where CPF = '${obj[0]}' and Ativo = 'S')`,
      Historico: aspas(obj[2]),
      NumeroDocumento: aspas(obj[0]), ///CPF do funcionario
      Valor: obj[1],

      Origem: aspas("Manual"),
      Cancelado: aspas("N"),
      GeraFinanceiro: aspas("N"),
      NomeUsuario: aspas(IDs.NomeUsuario),
      EstacaoTrabalho: aspas(IDs.EstacaoTrabalho),

      CodContaFinanceira: null,
      CodNatureza: null,
      CodContaContabil: null,
      CodCentroCusto: null,
      CodItemContabil: null,
      Data: "dbo.DataAtual()",
      DataLancamento: "dbo.DataAtual()",
      HoraLancamento: "dbo.HoraAtual()",
      ValorQuantidade: 1,
      CodFolhaOrigem: 0,
    };

    let lineInsert = `INSERT INTO ${IDs.TabelaLanc} (`;
    /////CAMPOS DO INSERT
    Object.keys(ValorComum).forEach((key) => {
      lineInsert += key + ", ";
    });
    lineInsert = lineInsert.substring(0, lineInsert.length - 2);
    lineInsert += ") (";
    /////VALORES DO INSERT
    Object.keys(ValorComum).forEach((key) => {
      lineInsert += ValorComum[key] + ", ";
    });
    lineInsert = lineInsert.substring(0, lineInsert.length - 2);
    lineInsert += `);\n `;
    /////ANEXA A LINHA NO ARQUIVO
    AppendFile(lineInsert);
  });
  AppendFile("GO \n");
}

module.exports = GenerateInsert;
