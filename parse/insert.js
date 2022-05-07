const fs = require("fs");

function aspas(value) {
  return `'` + value + `'`;
}

function GenerateInsert(LISTA, IDs) {
  console.log(IDs);
  fs.unlink("./output_file/insert.sql", (err) => {
    console.log(err);
  });

  fs.appendFileSync("./output_file/insert.sql", "USE Recapadora \n GO \n\n ");
  LISTA.forEach((obj) => {
    let ValorComum = {
      ID: "Select next value for Geral.SequenciaID",
      CodEmpresa: IDs.CodEmpresa,
      CodFilial: IDs.CodFilial,
      CodTipoLancamento: IDs.CodTipoLancamento,
      CodFolha: IDs.CodFolha,

      CodFuncionario: `(select Top 1 CodFuncionario from folhalite.Funcionario where CPF = '${obj[0]}')`,
      Historico: aspas(obj[2]),
      NumeroDocumento: aspas(obj[0]), ///CPF do funcionario
      Valor: obj[1],

      Origem: aspas("Manual"),
      Cancelado: aspas("N"),
      GeraFinanceiro: aspas("N"),
      NomeUsuario: aspas("Administrador"),
      EstacaoTrabalho: aspas("Caixa"),

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

    let lineInsert = "INSERT INTO FolhaLite.Lancamento (";
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
    fs.appendFileSync("./output_file/insert.sql", lineInsert);
  });
  fs.appendFileSync("./output_file/insert.sql", "GO \n");
}

module.exports = GenerateInsert;
