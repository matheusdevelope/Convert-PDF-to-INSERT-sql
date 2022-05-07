const fs = require("fs");
const { hostname } = require("os");
const dialog = require("node-file-dialog");
const PDFParser = require("pdf2json");
const Parse = require("./parse/parse");
const pdfParser = new PDFParser();

function getUsername() {
  return (
    process.env.SUDO_USER ||
    process.env.C9_USER ||
    process.env.LOGNAME ||
    process.env.USER ||
    process.env.LNAME ||
    process.env.USERNAME
  );
}

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);

pdfParser.on("pdfParser_dataReady", (pdfData) => {
  // fs.writeFileSync("./output_file/pdf_file.json", JSON.stringify(pdfData));

  //Salario = 1
  //Hora Extra = 2
  const TipoArquivo = 1;
  function SelectPadrao(Campo) {
    return `(select ${Campo} from Customizado_Dados_Folha_Importacao
    WHERE Atual = 'S')`;
  }
  const IDs = {
    CodEmpresa: SelectPadrao("CodEmpresa"),
    CodFilial: SelectPadrao("CodFilial"),
    CodTipoLancamento: SelectPadrao("CodTipoLancamento"),
    CodFolha: SelectPadrao("CodFolha"),
    Tipo: TipoArquivo,
    BaseDeDados: "BaseDeDados",
    TabelaFunc: "folhalite.Funcionario",
    TabelaLanc: "folhalite.Lancamento",
    EstacaoTrabalho: hostname(),
    NomeUsuario:
      "(select NomeLegivel FROM Usuario WHERE CodUsuario =  dbo.CodUsuarioConectado())",
    output_file: "./output_file/insert.sql",
  };

  Parse(pdfData, IDs);
  console.log("File Created!");
});

dialog({ type: "open-file" })
  .then((dir) => {
    pdfParser.loadPDF(dir[0]);
  })
  .catch((err) => console.log(err));

//;
