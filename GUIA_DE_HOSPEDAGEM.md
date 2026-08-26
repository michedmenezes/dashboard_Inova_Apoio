# Hospedagem e configuração — InovApoio

## Recomendação principal

Para esta plataforma, a alternativa recomendada é utilizar a **hospedagem integrada do Manus**. O projeto já está estruturado como uma aplicação full-stack com banco de dados, servidor e autenticação; portanto, essa opção mantém a publicação, as variáveis de ambiente e a base de dados na mesma área de administração.

> A aplicação foi projetada para operar em hospedagem com escalonamento automático. Não requer servidor persistente, tarefas em segundo plano ou infraestrutura adicional.

| Etapa | Ação recomendada | Resultado esperado |
|---|---|---|
| 1 | Abra a versão salva do projeto no painel de gerenciamento. | Confirma a versão que será publicada. |
| 2 | Use o botão **Publish** no canto superior direito. | Publica a plataforma em uma URL gerenciada. |
| 3 | Em **Settings → Domains**, mantenha o domínio gerado ou vincule um domínio próprio. | Define o endereço público ou institucional. |
| 4 | Em **Settings → General**, revise nome, visibilidade e favicon. | Ajusta a identificação da plataforma. |
| 5 | Em **Settings → Database**, mantenha SSL ativado nas conexões administrativas. | Mantém a conexão de dados protegida. |

## Configuração operacional

O banco já contém as entidades de **etapas**, **grupos**, **integrantes**, **projetos** e **avaliações**. A primeira consulta da plataforma carrega a base inicial validada com 50 grupos, 50 projetos e 219 integrantes. Nenhum grupo da 1ª série ligado à Comunidade Gris foi incluído.

As credenciais e variáveis essenciais do ambiente são gerenciadas pelo próprio projeto. Não é necessário criar chaves adicionais para operar os fluxos atuais de cadastro, edição, consolidação e avaliação. Caso sejam incluídas integrações externas posteriormente, cadastre as novas variáveis exclusivamente na área de segredos do projeto, sem inseri-las no código-fonte.

## Rotina sugerida para o evento

Antes da feira, revise os grupos e projetos nas telas administrativas e use a tela de **Avaliar grupos** para realizar um teste operacional. Durante o evento, cada avaliador deve registrar nome, projeto, quatro critérios e observações. Após cada avaliação, a visão geral atualiza os indicadores e os rankings de grupos e de projetos.

Depois do evento, exporte ou consulte os dados pela área de banco de dados e preserve a versão do projeto usada no dia da avaliação. Essa rotina facilita auditoria dos resultados e recuperação do estado da plataforma em futuras edições.

## Alternativas externas

Caso a instituição possua uma política obrigatória de infraestrutura própria, a aplicação pode ser exportada para um repositório e adaptada a serviços externos compatíveis com Node.js e MySQL. Essa opção exige configurar manualmente banco, autenticação, variáveis de ambiente, domínio, HTTPS e rotinas de backup. Por isso, para a primeira publicação, a hospedagem integrada é a escolha de menor complexidade operacional.

## Referência

[1] [Central de ajuda Manus](https://help.manus.im)
