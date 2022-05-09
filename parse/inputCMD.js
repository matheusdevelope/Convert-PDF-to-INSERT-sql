const { exec } = require("child_process");
const { writeFileSync } = require("fs");
const { resolve } = require("path");
const CREATE_SQL_SCRIPT = `
-->> CREATE TABELA DE CONFIGUR^ÇÂO PARA IMPORTAÇÃO
CREATE TABLE Customizado_Dados_Folha_Importacao (
  ID varchar PRIMARY KEY,
  CodEmpresa int, 
  CodFilial int ,
  CodFolha int,
  CodTipoLancamento int,
  Atual varchar(1),
  DataCriacao date
  )

  GO
  -->>INSERT INICIAL PADRÃO
  INSERT INTO Customizado_Dados_Folha_Importacao
           (ID,
            CodEmpresa,
            CodFilial,
            CodFolha,
            CodTipoLancamento,
            Atual,
            DataCriacao)
    VALUES (1,
            1,
            1,
            1,
            1,
            'S',
            GETDATE())
  GO
  
  -->>> TRIGGER PRA SEMPRE MANTER APENAS UMA CONFIGURAÇÃO PADRÃO
  CREATE TRIGGER [dbo].tgr_ConfigAtual 
  ON [dbo].Customizado_Dados_Folha_Importacao
  for insert, update
  as
  begin
    declare   @ID int,
        @Atual varchar(1)
  
    select  @ID = inserted.ID, @Atual = inserted.Atual from inserted
  
    IF @Atual = 'S' 
    BEGIN
    UPDATE Customizado_Dados_Folha_Importacao set Atual = 'N'where ID <>@ID 
    END
  end
  
  -->>>>>>>>>>CREATE TABLE
  INSERT INTO tabela (CodTabela, CodCampoAutoIncremento, CodCampoEstrutura, ControlaPorEmpresa, CodGrupoTabela, Proprietario, CodDBSpaceTabela, CodDBSpaceIndice, Observacao, UtilizaGradeZebrada, MargemEditor, ConfirmaInclusao, ConfirmaAlteracao, DesabilitaExclusao, DesabilitaVisualizacao, DesabilitaInclusao, DesabilitaAlteracao, ExibirDentroQuadroRolagem, AlturaQuadroRolagem, EditaNaGrade, CodTabelaEdicao, CodPastaTabelaEdicao, DllFormEdicao, Nome, Titulo, CodCampoLegenda1, CodCampoLegenda2, CodTabelaPropriedadeCampo, CodCampoPreferenciaPesquisa, TodosRegistrosNoInicio, PermiteMultiplaSelecaoNaGrade, UsarCacheDeObjeto, CodCampoOrdemPadrao, OrdemCampoOrdemPadrao, InclusaoRecursiva, Descricao, LogProcessosAtivo, LogInclusaoAtivo, LogExclusaoAtivo, LogAlteracaoAtivo, FiltroFixoGrade, ModeloLayout, CodRelatorioInclusao, ValidacaoInclusao, ValidacaoAlteracao, ValidacaoExclusao, ValidacaoVisualizacao, NomeSchema, ArquivoProjetoApoio)
      VALUES ((SELECT MAX(CODTABELA) + 1 FROM TABELA  ), 1, null, null, 1, null, null, null, null, null, null, 'N', 'N', 'N', 'N', 'N', 'N', 'N', 0, 'N', null, null, '', 'Customizado_Dados_Folha_Importacao', 'Configuração Folha - PDF', null, null, null, 0, null, 'N', 'N', 7, 'D', 'N', null, null, null, null, null, '', '2', 0, '', '', '', '', '', null);
 
 GO

 -->>>>>>>>>>CONFIGURA CAMPOS DA TABELA
  INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 1, 'V', 'False', 'S', 'ID', '', null, '', '', 1, 0, 'S', 1, 1, null, '', 'R', null, '', '', 'False', 'False', null, 1, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'S', null, null, null, null, null, null, 'ID', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Nenhum', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 2, 'I', 'False', 'S', 'Empresa', '', null, '', '', 8, 0, 'S', 2, 2, null, '', 'R', null, '1', '', 'True', 'True', 227, 2, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', 'P', null, null, null, null, null, 'CodEmpresa', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Formula', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 3, 'I', 'False', 'S', 'Filial', '', null, '', '', 8, 0, 'S', 3, 3, null, '', 'R', null, '1', '', 'True', 'True', 287, 3, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', 'P', null, null, null, null, null, 'CodFilial', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Formula', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 4, 'I', 'False', 'S', 'Folha', '', null, '', '', 8, 0, 'S', 4, 4, null, '', 'R', null, '', '', 'True', 'True', 342, 4, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', 'P', null, null, null, null, null, 'CodFolha', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Nenhum', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 5, 'I', 'False', 'S', 'Tipo de Evento Folha', '', null, '', '', 8, 0, 'S', 5, 5, null, '', 'R', null, '', '', 'True', 'True', 335, 5, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', 'P', null, null, null, null, null, 'CodTipoLancamento', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Nenhum', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 7, 'V', 'False', 'S', 'Config Padrão', '', null, '', '', 1, 0, 'S', 7, 7, null, '', 'R', null, '''S''', 'Sim=S;Não=N', 'True', 'True', null, 7, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', null, null, null, null, null, null, 'Atual', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Formula', 'Nao', '');

 INSERT INTO campo (CodTabela, CodCampo, Tipo, CondicaoObrigatorio, CondicaoVisivelGrade, Titulo, TituloGrade, TituloRelatorio, TituloPesquisa, TituloEdicao, Tamanho, CasasDecimal, CondicaoVisivelEdicao, OrdemEdicao, OrdemGrade, MascaraEdicao, MascaraGrade, Contexto, CodPasta, FormulaValorPadrao, ListaOpcao, CondicaoEditarInclusao, CondicaoEditarAlteracao, CodPesquisaPadrao, OrdemPesquisa, CondicaoVisivelPesquisa, ValidacaoUsuario, CodMensagemValidacaoUsuario, ValidacaoSistema, CodMensagemValidacaoSistema, proprietario, observacao, LarguraGrade, LarguraEdicao, LarguraPesquisa, PosicaoX, PosicaoY, AlturaEdicao, FormulaCalculoValor, ScriptOnExit, Chave, TipoPesquisa, VisivelRelatorio, VisivelParametroRelatorio, TituloInicialParametroRelatorio, TituloFinalParametroRelatorio, ExibirResumo, Nome, ExibirNoRodapePesquisa, ExibirNoRodapeGrade, Caractere, TipoCaractere, CharCase, ScriptOnEnter, AlinhamentoEdicao, NomeFonteEdicao, TamanhoFonteEdicao, CorFonteEdicao, FonteNegritoEdicao, FonteItalicoEdicao, FonteSublinhadoEdicao, FonteRiscadoEdicao, CondicaoPadrao, PesquisaIncremental, Coluna, TipoValorPadrao, ManterConteudo, CondicaoPesquisaEspecifica)
      VALUES ((SELECT MAX(CODTABELA)  FROM TABELA  ), 8, 'D', 'False', 'S', 'Data Inclusão Config', '', null, '', '', 10, 0, 'S', 8, 8, null, '', 'R', null, 'dbo.DataAtual()', '', 'False', 'False', null, 8, 'S', '', null, '', null, 'U', 'Esse campo foi criado pela sincronização, configure suas devidas propriedades corretamente.', null, null, null, null, null, null, '', null, 'N', null, null, null, null, null, null, 'DataCriacao', 'N', 'N', '', 'V', 'P', null, null, '', null, 0, 'N', 'N', 'N', null, 0, 'N', 0, 'Formula', 'Nao', '');

`;

function log(params, p2) {
  console.log(params, p2 || "");
}

function getParamsTerminal() {
  const input = process.argv.splice(2);
  const AcceptParams = [
    {
      param: "--help",
      defaultValue: ".",
      model: "[]",
      required: false,
      description: "Exibe ajuda para uso",
    },
    {
      param: "--path_dialog",
      defaultValue: "C:\\Data7\\ImportarPDF\\bin\\dialog.exe",
      model: "[C:\\Data7\\ImportarPDF\\bin\\dialog.exe] ",
      required: false,
      description: "Caminho do excutável de selecção do arquivo.",
    },

    {
      param: "--output_file",
      defaultValue: "C:\\Data7\\ImportarPDF\\temp",
      model: "[C:\\Data7\\ImportarPDF\\temp] ",
      required: false,
      description: "Pasta de destino do arquivo de insert gerado.",
    },
    {
      param: "--tabela_config",
      defaultValue: "",
      model: "[path de saida do arquivo] ",
      required: false,
      description:
        "Gera arquivo com as alterações necessárias no banco de dados para que o projeto possa funcionar como o esperado.",
    },

    {
      param: "--json",
      defaultValue: false,
      model: "[1]",
      required: false,
      description:
        "Use esse parametro para ter acesso ao dados antes da conversão parar INSERT.sql",
    },

    {
      param: "--executeinsertonly",
      defaultValue: false,
      model: "[y]",
      required: false,
      description:
        "Use esse parametro para fazer o INSERT.sql após conferência.",
    },
    {
      param: "--acao",
      defaultValue: 1,
      model: "[1] / [2]",
      required: false,
      description:
        "Caso a Acao seja [1] o sistema fará o insert direto no banco de dados, caso [2], o arquivo será aberto para conferencia e execução manual.",
    },
    {
      param: "--tipo",
      defaultValue: false,
      model: "[1] -Salario / [2] -Horas extras ",
      required: false,
      description:
        "Caso não informado o sistema tentará identificar o tipo de lançamento automaticamente.\n Use esse paremetro caso queira deixar explicito que to tipo de lançamento.",
    },

    {
      param: "--servidor",
      defaultValue: "localhost\\data7",
      model: "[localhost\\data7] ",
      required: false,
      description: "Servidor da base de dados.",
    },
    {
      param: "--db",
      defaultValue: "Data7",
      model: "[NomeDaBaseDeDados] ",
      required: false,
      description: "Nome da base de dados",
    },

    {
      param: "--tabelaLanc",
      defaultValue: "FolhaLite.Lancamento",
      model: "[FolhaLite.Lancamento] ",
      required: false,
      description: "Tabela no DB onde serão feitos os lançamentos",
    },
    {
      param: "--tabelaFunc",
      defaultValue: "FolhaLite.Funcionario",
      model: "[FolhaLite.Funcionario] ",
      required: false,
      description:
        "Tabela no DB onde serão buscados os dados dos funcionarios.",
    },
  ];

  let ParamsInput = {};
  let Errors = [];

  if (input.toString().toLowerCase().includes("--help") || input.length === 0) {
    Help();
    return false;
  }

  const GerarConfig = input.findIndex(
    (obj) => obj.toLowerCase() == "--tabela_config"
  );
  if (GerarConfig >= 0) {
    CriarArquivoTabelaAuxiliar(GerarConfig);
    return false;
  }

  function Help() {
    log("AJUDA>>>\n\n");
    log("Parametros aceitos >\n");
    AcceptParams.forEach((obj) => {
      log(obj.param + " " + obj.model);
      log("Descrição: ", obj.description);
      log("Valor padrão: ", obj.defaultValue);
      log("Obrigatório: ", obj.required.toString());
      log("-----------------------------");
    });
    log("\n");
  }

  function CriarArquivoTabelaAuxiliar(index) {
    function GetDefaultPath() {
      const ret = AcceptParams.find((obj) => obj.param === "--output_file");
      return ret.defaultValue;
    }
    let path = input[index + 1] ? input[index + 1] : GetDefaultPath();
    path = resolve(path, "configs_banco_de_dados.sql");

    writeFileSync(path, CREATE_SQL_SCRIPT);
    exec("explorer.exe /select, " + path, (ret) => null);
  }

  function AddError(message, parametro) {
    Errors.push({
      message,
      parametro,
    });
  }

  function ParamAccepted(param) {
    for (let i = 0; i < AcceptParams.length; i++) {
      if (AcceptParams[i].param.toLowerCase() === param.toLowerCase())
        return true;
    }
    return false;
  }

  input.forEach((text, i) => {
    if (text.includes("--")) {
      if (ParamAccepted(text)) {
        if (input[i + 1]) {
          ParamsInput[text.replace("--", "").toLowerCase()] = input[i + 1];
        } else {
          AddError("Informe um valor para o parametro informado", text);
        }
      } else {
        AddError("O parametro informado não é aceito.", text);
      }
    }
  });

  let Params = {};
  AcceptParams.forEach((obj, i) => {
    const NameParam = obj.param.replace("--", "");
    if (AcceptParams[i].required & !ParamsInput[NameParam])
      AddError(
        "Um parametro obrigatório não foi informado! ",
        AcceptParams[i].param + " " + AcceptParams[i].model
      );
    Params[NameParam] = ParamsInput[NameParam] || AcceptParams[i].defaultValue;
  });

  if (Errors.length > 0) {
    log("\nAlgo deu errado!\n");

    log("Parametros recebidos: ", input.toString().replaceAll(",", " "));
    log("\n");

    log("Parametros aceitos:");
    AcceptParams.forEach((obj) => log(obj.param, obj.model));
    log("\n");

    Errors.forEach((obj) => {
      log("----------------------------------");
      log("Mensagem: ", obj.message);
      log("Parametro: ", obj.parametro);
    });
    log("\n");
    return false;
  }

  return Params;
}
module.exports = getParamsTerminal;
