const fs = require("fs");
const GenerateInsert = require("./insert");

function ApenasNumero(valor) {
  return Number(
    valor
      .replace(" ", "")
      .replace("R$", "")
      .replace("-", "")
      .replace(".", "")
      .replace(",", ".")
  );
}

function AjustaObjetos(ListaObjs) {
  let copy = [...ListaObjs];
  ListaObjs.forEach((obj, i) => {
    copy.splice(i, 1, {
      x: obj.x,
      y: obj.y,
      text: decodeURIComponent(obj.R[0].T),
      i,
    });
  });
  return copy;
}

function AchaCampoHeaderPorTexto(Lista, text, text2, notInvert) {
  let copyList = Lista;
  let text2Ok = text2 || "";
  !notInvert && copyList.reverse();
  const Campo = copyList.find((obj) => {
    return (
      obj.text.toLowerCase().includes(text.toLowerCase()) &
      obj.text.toLowerCase().includes(text2Ok.toLowerCase())
    );
  });
  !notInvert && copyList.reverse(); /// Não remover, pois precisa voltar o array para o original
  return Campo;
}

function OrdenaPorCPF(data) {
  let list = data;
  list.sort((a, b) => (a[0] > b[0] ? 1 : b[0] > a[0] ? -1 : 0));
  return list;
}

function RetiraLinhasComValorZero(List) {
  return List.filter((data) => {
    return data[1] > 0;
  });
}

/// Salario hora extra
function MapearCamposHExtras(ListaCampos) {
  let Campo = {
    y_init: 1,
    CPF_x_init: 1,
    CPF_x_end: 1,
    Vlr50_x_init: 1,
    Vlr50_x_end: 1,
    Vlr100_x_init: 1,
    Vlr100_x_end: 1,
    VlrAdcN_x_init: 1,
    VlrAdcN_x_end: 1,
  };
  ///PEGA A ALTURA DA PRIMEIRA LINHA DE FUNCIONARIO
  const IndexPF = ListaCampos.findIndex(
    (obj) =>
      (obj.text.toLowerCase() === "afa") | (obj.text.toLowerCase() === "montec")
  );
  Campo.y_init = ListaCampos[IndexPF].y - 0.1;
  Campo.CPF_x_init = ListaCampos[IndexPF + 2].x - 1;
  Campo.CPF_x_end = ListaCampos[IndexPF + 3].x - 1;
  Campo.Vlr50_x_init =
    AchaCampoHeaderPorTexto(ListaCampos, "total", "50")?.x - 1;
  Campo.Vlr50_x_end = AchaCampoHeaderPorTexto(ListaCampos, "quant")?.x - 1;
  Campo.Vlr100_x_init =
    AchaCampoHeaderPorTexto(ListaCampos, "total", "100")?.x - 1;
  Campo.Vlr100_x_end =
    AchaCampoHeaderPorTexto(ListaCampos, "Noturno", "", "notInvert")?.x - 1;
  Campo.VlrAdcN_x_init = AchaCampoHeaderPorTexto(ListaCampos, "Noturno")?.x - 1;
  Campo.VlrAdcN_x_end = AchaCampoHeaderPorTexto(ListaCampos, "rateio")?.x - 1;

  return Campo;
}
function GeraListaFuncionariosExtras(PDF) {
  let Lista = [];
  let Func = [];

  const Dimensions = MapearCamposHExtras(PDF);

  ////RETIRA CABEÇALHO , DEIXANDO APENAS AS LINHAS DE FUNCIONARIOS
  PDF = PDF.filter((obj) => obj.y >= Dimensions.y_init); //Vai comparar com a altura do registro

  function MontaLista50() {
    PDF.forEach((obj) => {
      (obj.x >= Dimensions.CPF_x_init) & (obj.x < Dimensions.CPF_x_end) &&
        Func.push(obj.text);
      if (Dimensions.Vlr50_x_end > Dimensions.Vlr50_x_init) {
        if (
          (obj.x >= Dimensions.Vlr50_x_init) &
          (obj.x < Dimensions.Vlr50_x_end)
        ) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Hora Extra 50%");
        }
      } else {
        if (obj.x >= Dimensions.Vlr50_x_init) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Hora Extra 50%");
        }
      }
      if (Func.length === 3) {
        Lista.push(Func);

        //LIMPA FUNCIONARIO PARA O PROXIMO
        Func = [];
      }
    });
    Func = [];
  }

  function MontaLista100() {
    PDF.forEach((obj) => {
      (obj.x >= Dimensions.CPF_x_init) & (obj.x < Dimensions.CPF_x_end) &&
        Func.push(obj.text);
      if (
        Dimensions.VlrAdcN_x_init &
        (Dimensions.Vlr100_x_init < Dimensions.Vlr100_x_end)
      ) {
        if (
          (obj.x >= Dimensions.Vlr100_x_init) &
          (obj.x < Dimensions.Vlr100_x_end)
        ) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Hora Extra 100%");
        }
      } else {
        if (obj.x >= Dimensions.Vlr100_x_init) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Hora Extra 100%");
        }
      }
      if (Func.length === 3) {
        Lista.push(Func);

        //LIMPA FUNCIONARIO PARA O PROXIMO
        Func = [];
      }
    });
    Func = [];
  }
  function MontaListaAdcionalNoturno() {
    PDF.forEach((obj) => {
      // /ADICIONA O CPF
      (obj.x >= Dimensions.CPF_x_init) & (obj.x < Dimensions.CPF_x_end) &&
        Func.push(obj.text);
      // ADICNIONA ADICIONAL NOTURNO
      if (Dimensions.VlrAdcN_x_end) {
        if (
          (obj.x >= Dimensions.VlrAdcN_x_init) &
          (obj.x < Dimensions.VlrAdcN_x_end)
        ) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Adicional Noturno");
        }
      } else {
        if (obj.x >= Dimensions.VlrAdcN_x_init) {
          Func.push(ApenasNumero(obj.text || ""));
          Func.push("Adicional Noturno");
        }
      }
      if (Func.length === 3) {
        Lista.push(Func);

        //LIMPA FUNCIONARIO PARA O PROXIMO
        Func = [];
      }
    });
    Func = [];
  }

  Dimensions.Vlr50_x_init && MontaLista50();
  Dimensions.Vlr100_x_init && MontaLista100();
  Dimensions.VlrAdcN_x_init && MontaListaAdcionalNoturno();

  ///RESETA  OBJETO FUNCIONARIO
  Func = [];

  function GravaFile(name, lista) {
    fs.writeFileSync(`./output_file/file_${name}.json`, JSON.stringify(lista));
  }
  // GravaFile("PDF", PDF);
  // GravaFile("CPF", ListaCNPJ);
  // GravaFile("50", Lista50);
  // GravaFile("100", Lista100);
  // GravaFile("adcN", ListaAdcNotu);
  //GravaFile("Lista", Lista);

  return OrdenaPorCPF(RetiraLinhasComValorZero(Lista));
}

/// Salario normal
function MapearCamposSalario(ListaCampos) {
  let Campo = {
    y_init: 1,
    y_end: 1,
    y_endC: 1,
    CPF_x_init: 1,
    CPF_x_end: 1,
    Vlr_x_init: 1,
  };

  //PEGA INDEX DA LINHA ANTERIOR AO FUNCIONARIOS
  const IndexPF = ListaCampos.findIndex(
    (obj) => obj.text.toLowerCase() === "empregados"
  );
  const IndexLF = ListaCampos.findIndex((obj) =>
    obj.text.toLowerCase().includes("contribui")
  );

  ///PEGA A ALTURA DA PRIMEIRA LINHA DE FUNCIONARIO
  Campo.y_init = ListaCampos[IndexPF + 1].y - 0.1;
  ///PEGA A ALTURA DA ULTIMA LINHA DE FUNCIONARIO & PRIMEIRO FUNC CONTRIBUINTE
  Campo.y_end = ListaCampos[IndexLF].y - 0.1;
  ///PEGA A ALTURA DA ULTIMA LINHA DE FUNCIONARIO CONTRIBUINTE
  Campo.y_endC = AchaCampoHeaderPorTexto(ListaCampos, "contribuin").y;

  Campo.CPF_x_init = ListaCampos[IndexPF + 1].x - 1;
  Campo.CPF_x_end = ListaCampos[IndexPF + 3].x - 3;
  Campo.Vlr_x_init = ListaCampos[IndexPF + 3].x - 2;

  return Campo;
}

function GeraListaFuncionariosSalario(PDF) {
  let Lista = [];
  let Func = [];
  let SalarioNormal;
  let SalarioContribuinte;

  const Dimensions = MapearCamposSalario(PDF);

  ////RETIRA CABEÇALHO , DEIXANDO APENAS AS LINHAS DE FUNCIONARIOS
  SalarioNormal = PDF.filter(
    (obj) => (obj.y >= Dimensions.y_init) & (obj.y < Dimensions.y_end)
  ); //Vai comparar com a altura do registro

  //// DEIXANDO APENAS AS LINHAS DE FUNCIONARIOS CONTRIBUINTES
  SalarioContribuinte = PDF.filter(
    (obj) => (obj.y > Dimensions.y_end) & (obj.y < Dimensions.y_endC)
  ); //Vai comparar com a altura do registro

  SalarioNormal.forEach((obj) => {
    // /ADICIONA O CPF
    (obj.x >= Dimensions.CPF_x_init) & (obj.x < Dimensions.CPF_x_end) &&
      Func.push(obj.text);

    //     //ADICIONA O VALOR DAS HORAS 50%
    if (obj.x >= Dimensions.Vlr_x_init) {
      Func.push(ApenasNumero(obj.text || ""));
      Func.push("Salario");
    }

    //     /// QUANDO AS INFORMACOES DO FUNCIONARIO
    //     /// ESTIVEREM CORRETAS ADICONA NA LISTA DE FUNCIONARIOS
    if (Func.length === 3) {
      Lista.push(Func);
      //LIMPA FUNCIONARIO PARA O PROXIMO
      Func = [];
    }
  });

  SalarioContribuinte.forEach((obj) => {
    // /ADICIONA O CPF
    (obj.x >= Dimensions.CPF_x_init) & (obj.x < Dimensions.CPF_x_end) &&
      Func.push(obj.text);

    //     //ADICIONA O VALOR DAS HORAS 50%
    if (obj.x >= Dimensions.Vlr_x_init) {
      Func.push(ApenasNumero(obj.text || ""));
      Func.push("Salario Contribuinte");
    }

    //     /// QUANDO AS INFORMACOES DO FUNCIONARIO
    //     /// ESTIVEREM CORRETAS ADICONA NA LISTA DE FUNCIONARIOS
    if (Func.length === 3) {
      Lista.push(Func);
      //LIMPA FUNCIONARIO PARA O PROXIMO
      Func = [];
    }
  });

  // fs.writeFileSync("./output_file/listaSalario.json", JSON.stringify(Lista));
  return Lista;
}
function Parse(PDF_JSON, IDs) {
  //Loop para ler as paginas:
  let Tipo = IDs.Tipo;
  for (let i = 0; i < PDF_JSON.Pages.length; i++) {
    const page = PDF_JSON.Pages[i];

    if (!Tipo) {
      const TipoArquivo = AjustaObjetos(page.Texts).findIndex((obj) =>
        obj.text.toLowerCase().includes("contribui")
      );
      if (TipoArquivo > 1) {
        Tipo = 1;
      } else {
        Tipo = 2;
      }
    }
    if (Tipo == 1) {
      const Lista = GeraListaFuncionariosSalario(AjustaObjetos(page.Texts));
      // console.log(Lista);
      //GenerateInsert(Lista, IDs);
      return Lista;
    } else if (Tipo == 2) {
      // console.log(AjustaObjetos(page.Texts));
      const Lista = GeraListaFuncionariosExtras(AjustaObjetos(page.Texts));
      //  console.log("Extras::::", Lista);
      // GenerateInsert(Lista, IDs);
      return Lista;
    } else {
      return false;
    }
  }
  return true;
}

module.exports = Parse;
