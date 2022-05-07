const fs = require("fs");
const dialog = require("node-file-dialog");
const PDFParser = require("pdf2json");
const Parse = require("./parse/parse");

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);

//Salario = 1
//Hora Extra = 2

const TipoArquivo = 1;
const PathArquivo = "./pdf_teste/foo.pdf";

pdfParser.on("pdfParser_dataReady", (pdfData) => {
  // fs.writeFileSync("./output_file/pdf_file.json", JSON.stringify(pdfData));

  const IDs = {
    CodEmpresa: 1,
    CodFilial: 1,
    CodTipoLancamento: 13,
    CodFolha: 21,
    Tipo: TipoArquivo,
  };
  Parse(pdfData, IDs);
  console.log("File Created!");
});

const config = { type: "open-file" };

dialog(config)
  .then((dir) => {
    console.log(dir);
    pdfParser.loadPDF(dir[0]);
  })
  .catch((err) => console.log(err));

//;
