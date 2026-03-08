# Template de Referência — Helpers JavaScript para Geração de Escopo .docx

Este arquivo contém o código-base reutilizável para gerar documentos de escopo técnico em .docx usando a biblioteca `docx` (npm). Copie e adapte conforme o módulo sendo documentado.

## Setup Obrigatório

```bash
npm list -g docx 2>/dev/null || npm install -g docx
```

## Código Base (copiar e adaptar)

```javascript
const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageNumber,
  PageBreak,
} = require("docx");

// ===== DESIGN TOKENS (não alterar) =====
const COLORS = {
  primary: "1B5E7B",
  accent: "E8F4F8",
  headerBg: "1B5E7B",
  headerText: "FFFFFF",
  lightGray: "F5F5F5",
  darkText: "333333",
  border: "CCCCCC",
  red: "C0392B",
  orange: "E67E22",
  green: "27AE60",
  yellow: "F39C12",
};
const FONTS = { main: "Arial" };
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

// ===== HELPERS (não alterar) =====

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({ text, font: FONTS.main, size: 32, bold: true, color: COLORS.primary }),
    ],
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: COLORS.primary, space: 4 } },
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({ text, font: FONTS.main, size: 26, bold: true, color: COLORS.primary }),
    ],
    spacing: { before: 280, after: 160 },
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [
      new TextRun({ text, font: FONTS.main, size: 22, bold: true, color: COLORS.darkText }),
    ],
    spacing: { before: 200, after: 120 },
  });
}

// Para texto simples ou com formatação inline
// Aceita string OU array de objetos {text, bold, italics, color}
function para(text) {
  const runs = [];
  if (typeof text === "string") {
    runs.push(new TextRun({ text, font: FONTS.main, size: 21, color: COLORS.darkText }));
  } else {
    text.forEach((t) => {
      if (typeof t === "string")
        runs.push(new TextRun({ text: t, font: FONTS.main, size: 21, color: COLORS.darkText }));
      else runs.push(new TextRun({ font: FONTS.main, size: 21, color: COLORS.darkText, ...t }));
    });
  }
  return new Paragraph({ children: runs, spacing: { after: 120, line: 276 } });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}

// Células de tabela
function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, font: FONTS.main, size: 20, bold: true, color: COLORS.headerText }),
        ],
      }),
    ],
  });
}

function dataCell(text, width, opts = {}) {
  const shade = opts.shade
    ? { fill: COLORS.lightGray, type: ShadingType.CLEAR }
    : opts.fill
      ? { fill: opts.fill, type: ShadingType.CLEAR }
      : undefined;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shade,
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            font: FONTS.main,
            size: 20,
            color: opts.color || COLORS.darkText,
            bold: opts.bold || false,
            italics: opts.italics || false,
          }),
        ],
      }),
    ],
  });
}

// Tabela genérica — aceita headerTexts + array de arrays de dados
// Cada célula pode ser string ou {text, bold, color, ...}
function makeTable(colWidths, headerTexts, dataRows) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headerTexts.map((h, i) => headerCell(h, colWidths[i])) }),
      ...dataRows.map(
        (row, ri) =>
          new TableRow({
            children: row.map((cell, ci) => {
              const isObj = typeof cell === "object" && cell !== null;
              const text = isObj ? cell.text : cell;
              const extraOpts = isObj ? cell : {};
              return dataCell(text, colWidths[ci], { shade: ri % 2 === 1, ...extraOpts });
            }),
          }),
      ),
    ],
  });
}

// Caixa de destaque com borda esquerda colorida
function highlightBox(label, text, color) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: color, space: 8 } },
    indent: { left: 200 },
    spacing: { after: 140, line: 276 },
    children: [
      new TextRun({ text: label + " ", font: FONTS.main, size: 21, bold: true, color: color }),
      new TextRun({ text, font: FONTS.main, size: 21, color: COLORS.darkText }),
    ],
  });
}

// ===== ESTRUTURA DO DOCUMENTO =====
// Montar o array children[] com o conteúdo, depois usar:

const children = [];

// ... (montar conteúdo aqui) ...

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONTS.main, size: 21 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: FONTS.main, color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: FONTS.main, color: COLORS.primary },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 22, bold: true, font: FONTS.main, color: COLORS.darkText },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary, space: 4 },
              },
              children: [
                new TextRun({
                  text: "NOME DO MÓDULO",
                  font: FONTS.main,
                  size: 16,
                  color: COLORS.primary,
                  italics: true,
                }),
                new TextRun({ text: "\tvX.X", font: FONTS.main, size: 16, color: "999999" }),
              ],
              tabStops: [{ type: "right", position: 9360 }],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Página ", font: FONTS.main, size: 16, color: "999999" }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: FONTS.main,
                  size: 16,
                  color: "999999",
                }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/claude/output.docx", buffer);
  console.log("Document created!");
});
```

## Larguras de Coluna Padrão

Largura total do conteúdo com margens de 1": **9360 DXA**

| Configuração                           | Colunas            | Larguras                                       |
| -------------------------------------- | ------------------ | ---------------------------------------------- |
| 2 colunas (ID + Descrição)             | 900 + 8460         | Critérios de aceite, fluxo alternativo simples |
| 3 colunas (ID + Ponto + Questão)       | 900 + 2600 + 5860  | Pontos em aberto, exceções                     |
| 3 colunas (Persona + Resp + Interação) | 2000 + 2500 + 4860 | Personas                                       |
| 2 colunas (Termo + Definição)          | 2800 + 6560        | Glossário                                      |
| 2 colunas (Meta label + valor)         | 2800 + 6560        | Tabela de metadados da capa                    |
