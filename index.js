const fs = require("fs");
const { hostname } = require("os");
const dialog = require("node-file-dialog");
const PDFParser = require("pdf2json");
const Parse = require("./parse/parse");
const getParamsTerminal = require("./parse/inputCMD");
const { exec } = require("child_process");
const { resolve, normalize } = require("path");
const { exit } = require("process");
const path = require("path");
const pdfParser = new PDFParser();

const Params = getParamsTerminal();
function HashUnique(size) {
  let dt = new Date().getTime();
  let base_size = "xxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxxxxx";
  let new_size = base_size.substring(0, Number(size) < 5 ? 5 : Number(size));
  let uuid = new_size.replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);

pdfParser.on("pdfParser_dataReady", (pdfData) => {
  function SelectPadrao(Campo) {
    return `(select ${Campo} from Customizado_Dados_Folha_Importacao
    WHERE Atual = 'S')`;
  }
  const path = resolve(
    Params.output_file,
    "insert-" +
      HashUnique(5) +
      "-" +
      new Date().toLocaleDateString().replace(/[\/"]/g, "-") +
      ".sql"
  );
  const IDs = {
    CodEmpresa: SelectPadrao("CodEmpresa"),
    CodFilial: SelectPadrao("CodFilial"),
    CodTipoLancamento: SelectPadrao("CodTipoLancamento"),
    CodFolha: SelectPadrao("CodFolha"),
    Tipo: Params.tipo,
    BaseDeDados: Params.db,
    TabelaFunc: Params.tabelaFunc,
    TabelaLanc: Params.tabelaLanc,
    EstacaoTrabalho: hostname(),
    NomeUsuario: "Administrador",
    output_file: path,
    servidor: Params.servidor,
  };

  const retorno = Parse(pdfData, IDs);
  if (!retorno) return console.log("Houve um erro!");

  if (Number(Params.acao) == 2) {
    exec("explorer.exe /select, " + path, (ret) => null);
    return;
  }

  exec("sqlcmd -S " + Params.servidor + " -i " + path, (err) => {
    console.log(err);
  });

  console.log("Finalizado!");
  exit();
});

if (Params) {
  exec(path.join("C:\\Data7\\bin\\dialog.exe -o"), (error, stdout, stderr) => {
    if (stdout) {
      if (stdout.trim() === "None") console.log(new Error("Nothing selected"));
      else {
        // console.log(stdout.trim().split("\n")[0]);
        pdfParser
          .loadPDF(stdout.trim().split("\n")[0])
          .catch((o) => console.log("erro:", o));
      }
      // resolve(stdout.trim().split('\n'))
    } else if (error) {
      console.log(new Error(error));
    } else if (stderr) {
      console.log(new Error(stderr));
    }
  });

  // exec(resolve("C:\\Data7\\dialog.exe -o"), (a, b, c) => {
  //   console.log("A:", a);
  //   console.log("B:", b);
  //   console.log("C:", c);
  //   console.log("B:", b.replace(/[\/"]/g, "\\"));
  //   // exec(b, (e) => {
  //   //   console.log(e);
  //   // });
  //   const path = b;
  //   console.log(fs.statSync(path).mtimeMs);
  //   console.log("foi");
  //   //   pdfParser.loadPDF(path).catch((o) => console.log("erro:", o));
  // });

  // dialog({ type: "open-file" })
  //   .then((dir) => {
  //    // pdfParser.loadPDF(dir[0]);
  //   })
  //   .catch((err) => console.log("Processo Cancelado!"));
}
