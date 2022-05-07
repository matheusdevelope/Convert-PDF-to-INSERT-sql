CREATE TABLE Customizado_Dados_Folha_Importacao (
ID varchar PRIMARY KEY,
CodEmpresa int, 
CodFilial int ,
CodFolha int,
CodTipoLancamento int,
Tipo int,
BaseDeDados varchar(20),
TabelaFuncionario varchar(20),
Tabelalancamento varchar(20),
Atual varchar(1),
DataCriacao date,
DataVirouPadrao date
)

;

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
  UPDATE Customizado_Dados_Folha_Importacao set Atual = 'N' where ID <>@ID 
  END
	  
end

;

--alter table folhalite.Lancamento ALTER COLUMN   NumeroDocumento varchar(100)

--INSERT INTO 
--Customizado_Dados_Folha_Importacao (
--ID ,
--CodEmpresa,
--CodFilial,
--CodFolha ,
--CodTipoLancamento ,
--Tipo ,
--BaseDeDados ,
--TabelaFuncionario ,
--Tabelalancamento ,
--Atual)values(
--1,1,1,1,1,1,1,1,1,'s'
--)


--update Customizado_Dados_Folha_Importacao set Atual = 'S'
--where id = 1

--select * from Customizado_Dados_Folha_Importacao
--WHERE Atual = 'S'

 INSERT INTO FolhaLite.Funcionario (CodEmpresa, CodFuncionario, CodFilial, Logradouro, Numero, Complemento, PontoReferencia, Bairro, CodMunicipio, CEP, Email, CarteiraTrabalho, CodFuncao, CodCentroCusto, CPF, DataAdmissao, DataDemissao, DataNascimento, Escolaridade, EstadoCivil, LocalNascimento, Nome, NomeConjuge, NomeMae, NomePai, Observacoes, NumeroBanco, NumeroAgencia, NumeroConta, TipoConta, CodSituacaoFuncionario, QtdeHorasMensais, QtdeHorasSemanais, ContribuicaoSindical, CodSindicato, RG, PercentualAdiantamento, TipoRemuneracao, TipoPagamento, HorasPericulosidade, HorasInsalubridade, TipoAdmissao, CodigoAfastamentoFGTS, PercentualFgtsPorFora, CodTurnoTrabalho, Telefone, Celular, PIS_PASEP, Reservista, TituloEleitor, CarteiraMotoristaNumero, CarteiraMotoristaCategoria, CarteiraMotoristaValidade, QtdeDependentes, QtdeDependenteMenor14, DocumentoApresentado, DocumentoOrgaoExpedidor, DocumentoDataEmissao, CodGrupoPagamento, Ativo, QtdeHorasDiarias, CodFornecedor, NumeroRegistro, CalculaINSS, CodRegraRateioContabil)
      VALUES (1, 1, 1, '', '', '', '', '', 9131, '', '', '', 1, 1, '108.870.216-38', '2022-05-06', null, null, '', 'S', '', 'teste', '', '', '', '', '', '', '', '''''', '1', 0.0, 0.0, '', null, '', 0.0, 'M', 'M', 0.0, 0.0, '', '', 0.0, 1, '', '', '', '', '', '', '', null, 0, 0, '', '', null, 1, 'S', 8.0, 0, '', 'Sim', null);

