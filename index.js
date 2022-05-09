const fs = require("fs");
const { hostname } = require("os");
const dialog = require("node-file-dialog");
const PDFParser = require("pdf2json");
const Parse = require("./parse/parse");
const getParamsTerminal = require("./parse/inputCMD");
const { exec, execSync } = require("child_process");
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

function InsertON_DB(path) {
  exec(
    "sqlcmd -S " + normalize(Params.servidor) + " -i " + path,
    (err, stdout, stderr) => {
      fs.appendFileSync(
        path.substring(0, path.length - 4) + "-ERROR.txt",
        "\n\n\nData >>  " + new Date() + "\n\n"
      );
      fs.appendFileSync(
        path.substring(0, path.length - 4) + "-ERROR.txt",
        "Erro>> " + err + "\n\n"
      );
      fs.appendFileSync(
        path.substring(0, path.length - 4) + "-ERROR.txt",
        "Stdout>> " + stdout + "\n\n"
      );
      fs.appendFileSync(
        path.substring(0, path.length - 4) + "-ERROR.txt",
        "Stderr>> " + stderr || "Nenhum" + "\n\n"
      );
      stdout.includes("Cannot") &&
        exec(
          "explorer.exe /select, " +
            path.substring(0, path.length - 4) +
            "-ERROR.txt",
          (ret) => null
        );
    }
  );
}
pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);

pdfParser.on("pdfParser_dataReady", (pdfData) => {
  function SelectPadrao(Campo) {
    return `(select ${Campo} from Customizado_Dados_Folha_Importacao
    WHERE Atual = 'S')`;
  }
  let path = resolve(
    Params.output_file,
    "insert-" +
      HashUnique(5) +
      "-" +
      new Date().toLocaleDateString().replace(/[\/"]/g, "-") +
      ".sql"
  );
  path = normalize(path);
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

  if (Number(Params.json) === 1) {
    if (retorno.length > 1) {
      retorno.forEach((obj) => {
        fs.appendFileSync(
          path.substring(0, path.length - 4) + "-JSON.txt",
          obj.toString().replaceAll(",", " , ") + "\n\n"
        );
      });
    }
  }

  if (Number(Params.acao) == 2) {
    exec("explorer.exe /select, " + path, (ret) => null);
    return;
  }

  InsertON_DB(path);
  console.log("Finalizado!");
});

if (Params) {
  exec(path.join(Params.path_dialog + " -o"), (error, stdout, stderr) => {
    if (stdout) {
      if (stdout.trim() === "None") console.log(new Error("Nothing selected"));
      else {
        if (Params.executeinsertonly) {
          InsertON_DB(normalize(stdout.trim().split("\n")[0]));
        } else {
          pdfParser
            .loadPDF(stdout.trim().split("\n")[0])
            .catch((o) => console.log("erro:", o));
        }
      }
    } else if (error) {
      console.log(new Error(error));
    } else if (stderr) {
      console.log(new Error(stderr));
    }
  });
}
