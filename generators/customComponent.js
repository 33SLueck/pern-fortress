// generators/customComponent.js
module.exports = async function generateCustomComponent({
  name,
  options,
  templateData,
  writeFile,
}) {
  // Beispiel: Generiere eine React-Komponente mit Custom-Template
  const fs = require('fs-extra');
  const path = require('path');
  const Handlebars = require('handlebars');

  const templatesDir =
    options.templatesDir || path.join(process.cwd(), '.fortress-templates');
  const templatePath = path.join(templatesDir, 'component.hbs');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const content = template(templateData);

  const outPath = path.join(process.cwd(), 'src/components', `${name}.tsx`);
  await writeFile(outPath, content);
  console.log(`[fortress] Custom component generated: ${outPath}`);
};
