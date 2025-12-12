## Arquitetura da Solucao

* escrita direto em um store rapido (cache first);
  * é muito tráfego e baixa criticidade para “consistência forte”;
    * Redis como storega primario do carrinho;
    * salvar o estado do carrinho diretamente;

`Eventos em fila (event-driven)`

Adicionar um item ao carrinho, alterar quantidade, remover item → não precisa ir para fila.

* “CartUpdated” → outros serviços podem ouvir
* “CartAbandoned” → campanhas / CRM
* “ItemAddedToCart” → analytics, recommendation engine
* “CheckoutStarted” → serviço de pedidos
* “CartExpired” → limpeza, telemetria

> Esses eventos são eventos de domínio, não o estado bruto do carrinho.

Porque nao enviar tudo pra fila?
\_ latência extra
\_ custo extra
\_ complexidade desnecessária
\_ concorrência e ordering problem
\_ risco de perder consistência se mensagens atrasarem

Fila é para propagar informação, não para ser o write-model do carrinho.

#### Consideracoes

O carrinho é um estado temporário, não é uma transação financeira.

* não precisa ACID;
* não precisa consistência forte;
* não precisa integridade transacional completa;
* não é objeto de domínio crítico;
* pode ser eventualmente consistente;
* pode ser reidratado a qualquer momento.

- Carrinho mantem preco estatico ate o checkout
- Carrinho é recalculado no checkout com dados fresh do catálogo

#### Padroes

* CQRS
  * Carrinho no Redis é o write model
  * Views para analytics ou search são read models

* Event Notification (Nao event sourcing)
  * Publica “aconteceu algo”, sem depender da fila para o estado

* TTL (Time To Live)
  * Carrinho expira em X horas
  * Redis limpa automaticamente
  * Evento “CartExpired” é disparado

## Arquitetura Firebase

Para o banco de dados do seu carrinho de compras:

* **Cloud Firestore** é uma excelente escolha. Ele é um banco de dados NoSQL flexível e escalável que permite armazenar dados do carrinho (itens, quantidades, status) de forma estruturada. Suas capacidades de sincronização em tempo real e consultas avançadas seriam muito úteis para gerenciar o estado do carrinho.

- Alternativamente, se você preferir um banco de dados SQL e tiver a necessidade de modelagem relacional, Firebase Data Connect pode ser usado para integrar seu aplicativo com uma instância PostgreSQL no Cloud SQL. Isso é ideal se sua arquitetura já estiver inclinada a SQL ou se você precisar de transações ACID mais complexas.

- **O Firebase Realtime Database** também pode ser uma opção para dados mais simples que precisam de sincronização ultrarrápida, embora o Firestore seja geralmente preferido para modelos de dados de comércio eletrônico mais complexos.

Para a integração com RabbitMQ, você pode usar Cloud Functions para Firebase . As funções podem ser acionadas por eventos, como:

* **Gatilhos de Firestore/Realtime Database:** Quando um item é adicionado, atualizado ou removido do carrinho, uma Cloud Function pode ser acionada. Essa função pode então se conectar ao RabbitMQ e publicar uma mensagem (por exemplo, "item\_adicionado", "carrinho\_atualizado").

* **Gatilhos HTTP:** Se o seu RabbitMQ puder enviar requisições HTTP, você pode criar uma Cloud Function com um endpoint HTTP para receber mensagens do RabbitMQ e processá-las no seu backend Firebase.
