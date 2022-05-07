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

