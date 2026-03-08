---
name: escopo-tecnico
description: "Skill para criação, análise crítica e reescrita de documentos de escopo técnico funcional (.docx). Use sempre que o usuário mencionar 'escopo', 'escopo técnico', 'documento de requisitos', 'especificação funcional', 'história de usuário', 'critérios de aceite', 'regras de negócio', 'fluxo principal', 'fluxos alternativos', 'pontos em aberto', 'DRE', 'driver de receita', 'driver de despesa', 'orçamento', 'rateio', ou qualquer pedido para estruturar, criticar, reescrever ou validar um documento de escopo de sistema. Também deve ser usada quando o usuário pedir feedback sobre documentos técnicos de terceiros comparando com um escopo de referência. Trigger mesmo que o usuário não use a palavra 'escopo' explicitamente — se ele descreve regras de negócio, fluxos, personas ou critérios de aceite, esta skill se aplica."
---

# Escopo Técnico — Skill de Criação e Revisão

## Objetivo

Esta skill permite criar documentos de escopo técnico funcional de alta qualidade em formato .docx, seguindo uma estrutura padronizada e validada. Ela cobre três cenários de uso:

1. **Criação de escopo** a partir de rascunhos, anotações ou descrições do usuário
2. **Análise crítica** de escopos existentes com nota, feedback e sugestões
3. **Feedback comparativo** entre documentos de terceiros e um escopo de referência

## Princípios Fundamentais

### Escopo Funcional ≠ Solução Técnica

O documento deve responder **"o quê"** e **"por quê"**, nunca **"como"**. Jamais prescrever tecnologias (WebSockets, triggers de banco, queries SQL). Usar linguagem funcional:

| ❌ Incorreto (implementação)                     | ✅ Correto (funcional)                                     |
| ------------------------------------------------ | ---------------------------------------------------------- |
| "Executa uma query de filtragem por ID_Regional" | "O rateio considera apenas as lojas da região configurada" |
| "Utiliza triggers de banco de dados"             | "Alterações devem ser refletidas no consolidado"           |
| "WebSockets ou Long Polling"                     | "O painel deve exibir informações atualizadas"             |

### Nunca Inventar Requisitos

Se algo não está claro na coleta, marcar como **Ponto em Aberto** com a pergunta explícita. É melhor entregar um escopo com lacunas sinalizadas do que um escopo completo com requisitos falsos.

### Toda Regra Deve Ser Autocontida

Cada regra de negócio deve ser compreensível sem precisar ler outra seção. Se há dependência, referenciar explicitamente (ex.: "conforme RN-02").

## Estrutura Obrigatória do Documento

Todo escopo técnico criado por esta skill deve conter **exatamente** estas seções, nesta ordem:

### 1. Capa

- Título do documento
- Tabela de metadados: Projeto, Módulo, Versão, Data, Elaborado por, Status

### 2. Objetivo

- 2-3 parágrafos descrevendo a finalidade do módulo
- Referência ao vídeo/fonte de requisitos quando disponível

### 3. Atores e Personas

- Tabela com colunas: Persona | Responsabilidade | Interação com o Sistema
- Mínimo 2 personas (quem executa + quem aprova/audita)

### 4. Pré-Condições

- Tabela com colunas: ID | Descrição | Tipo (Obrigatória/Desejável)
- IDs no formato PC-01, PC-02...
- Listar tudo que precisa estar pronto antes do processo iniciar

### 5. Glossário

- Tabela com colunas: Termo | Definição
- Definir TODOS os termos de negócio usados no documento
- Mínimo 8-10 termos. Se o leitor puder interpretar um termo de forma ambígua, ele precisa estar no glossário

### 6. Regras de Negócio

- Cada regra com ID único: RN-01, RN-02...
- Formato: Heading2 com ID e nome → Parágrafo descritivo → Fórmula (quando aplicável) → Exemplo numérico (quando aplicável)
- **Toda fórmula deve ter um exemplo concreto com números reais**
- Regras transversais (que se aplicam a tudo) devem ser agrupadas sob um heading1 próprio

### 7. Fluxo Principal (Caminho Feliz)

- Tabela com colunas: Passo | Descrição
- Descrever o fluxo completo do início ao fim, passo a passo
- Mínimo 8 passos, máximo ~15
- Incluir: quem faz, o que faz, o que o sistema responde

### 8. Fluxos Alternativos e Exceções

- Tabela com colunas: ID | Cenário | Comportamento Esperado
- IDs no formato FA-01, FA-02...
- Cobrir pelo menos: dados ausentes, valores inválidos, edição após submissão, rejeição/reprovação
- Se um cenário não tem resposta definida, escrever o comportamento e marcar com texto claro indicando que precisa ser definido. **Não deixar vazio.**

### 9. Critérios de Aceite

- Tabela com colunas: ID | Critério
- IDs no formato CA-01, CA-02...
- Cada critério deve ser **testável e verificável** (não subjetivo)
- Mínimo 12 critérios. Cada regra de negócio relevante deve ter pelo menos 1 critério correspondente

### 10. Pontos em Aberto

- Tabela com colunas: ID | Ponto | Questão
- IDs no formato PA-01, PA-02...
- Listar tudo que precisa de definição ou validação com o cliente
- Quando o usuário responde um ponto, a resposta deve virar uma Regra de Negócio ou atualizar um Fluxo Alternativo, e o ponto deve ser removido da lista

## Processo de Trabalho

### Cenário 1: Criação a partir de rascunho

1. Ler o material fornecido pelo usuário (PDF, texto, anotações)
2. **Antes de escrever**, fazer análise crítica:
   - Identificar ambiguidades e lacunas
   - Listar regras implícitas não documentadas
   - Apontar terminologia inconsistente
   - Dar uma nota de 0-10
3. Apresentar a crítica ao usuário
4. Criar o documento .docx seguindo a estrutura obrigatória
5. Usar o template de referência em [references/template-docx.md](references/template-docx.md) para gerar o arquivo
6. Marcar lacunas como Pontos em Aberto

### Cenário 2: Análise crítica de documento existente

1. Ler o documento fornecido
2. Avaliar em 5 dimensões:
   - **Clareza**: As regras são compreensíveis sem ambiguidade?
   - **Completude**: Faltam seções, regras, exceções ou pré-condições?
   - **Consistência**: A terminologia é uniforme? Há contradições?
   - **Implementabilidade**: Um desenvolvedor consegue construir a partir deste documento?
   - **Fidelidade ao negócio**: O documento reflete o processo real do cliente?
3. Dar nota de 0-10
4. Listar problemas com classificação de severidade (Crítico / Importante / Menor)
5. Sugerir a estrutura correta e oferecer reescrita

### Cenário 3: Feedback comparativo

1. Ler ambos os documentos (referência + documento a ser avaliado)
2. Criar quadro comparativo aspecto por aspecto
3. Identificar:
   - Desvios conceituais (entendeu errado o negócio)
   - Requisitos inventados (não levantados com o cliente)
   - Prescrições técnicas indevidas (linguagem de implementação)
   - Elementos ausentes
4. Gerar documento .docx de feedback com:
   - Resumo executivo com notas
   - Análise detalhada por documento
   - Quadro comparativo lado a lado
   - Recomendações imediatas + de desenvolvimento profissional

## Versionamento do Documento

- Iniciar em v2.0 (assumindo que o rascunho original é v1.0)
- Incrementar minor a cada atualização (v2.1, v2.2, v2.3...)
- Atualizar versão na capa E no header
- Quando todos os Pontos em Aberto forem respondidos, marcar como "Escopo completo"

## Atualização Incremental (Respondendo Pontos em Aberto)

Quando o usuário responde pontos em aberto:

1. Transformar a resposta em Regra de Negócio (nova RN) ou atualizar Fluxo Alternativo existente
2. Adicionar Critérios de Aceite correspondentes
3. Remover o ponto da lista de Pontos em Aberto
4. Se a resposta gera novos pontos, adicioná-los
5. Incrementar versão
6. Regenerar o documento completo

## Design Visual do Documento (.docx)

Para gerar o documento, ler o template de referência completo em [references/template-docx.md](references/template-docx.md). Padrão visual:

- **Fonte**: Arial, corpo 10.5pt (size: 21)
- **Cor primária**: #1B5E7B (headings, header, bordas de destaque)
- **Cor de fundo de tabelas header**: #1B5E7B com texto branco
- **Cor de fundo alternada**: #F5F5F5 (linhas pares)
- **Cor de destaque/accent**: #E8F4F8
- **Bordas**: #CCCCCC, SINGLE, size 1
- **Margens da página**: 1 polegada (1440 DXA) em todos os lados
- **Tamanho**: US Letter (12240 x 15840 DXA)
- **Header**: nome do módulo + versão, com borda inferior
- **Footer**: "Página X" centralizado

### Padrão de Tabelas

- Header com fundo #1B5E7B e texto branco bold
- Linhas alternadas com fundo #F5F5F5
- Cell margins: top: 60, bottom: 60, left: 100, right: 100
- Sempre usar WidthType.DXA (nunca PERCENTAGE)

### Destaques (Highlight Boxes)

Para notas, avisos e observações importantes, usar parágrafos com borda esquerda grossa:

- Verde (#27AE60): pontos positivos
- Vermelho (#C0392B): problemas críticos / impactos
- Laranja (#E67E22): riscos / atenção
- Amarelo (#F39C12): recomendações / sugestões
- Azul (#1B5E7B): ações / passos

## Referência Rápida: Checklist de Qualidade

Antes de entregar qualquer escopo, verificar:

- [ ] Todas as 10 seções obrigatórias estão presentes?
- [ ] Glossário tem pelo menos 8 termos?
- [ ] Toda fórmula tem exemplo numérico?
- [ ] Todo fluxo alternativo tem comportamento definido (ou está em Pontos em Aberto)?
- [ ] Critérios de aceite são testáveis e cobrem as regras de negócio?
- [ ] Não há prescrição técnica (SQL, WebSocket, trigger, API)?
- [ ] A terminologia é consistente em todo o documento?
- [ ] Versão está atualizada na capa e no header?
