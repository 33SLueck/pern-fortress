import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';

export interface ComponentOptions {
  directory?: string;
  type?: string;
  tests?: boolean;
  styles?: boolean;
}

export default generateComponent;
const componentTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/component/Component.hbs'),
  'utf-8'
);

const testTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/component/Component.test.hbs'),
  'utf-8'
);

const storyTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/component/Component.stories.hbs'),
  'utf-8'
);

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function generateComponent(
  name: string,
  options: ComponentOptions = {}
): Promise<void> {
  console.log(chalk.blue(`🧩 Generiere Komponente: ${name}`));

  const {
    directory = 'src/components',
    type = 'functional',
    tests = true,
    styles = false,
  } = options;

  // Namen verarbeiten
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const camelName = toCamelCase(name);
  const kebabName = toKebabCase(name);
  const useHooks = type === 'functional';

  // Template-Daten
  const templateData = {
    name: name.toLowerCase(),
    pascalName,
    camelName,
    kebabName,
    useHooks,
  };

  // Dateipfade
  const frontendPath = path.join(process.cwd(), 'frontend');
  const componentDir = path.join(frontendPath, directory, pascalName);
  const componentPath = path.join(componentDir, `${pascalName}.tsx`);
  // Keine Style-Datei mehr
  // Test-Datei im src/__tests__-Ordner ablegen
  const testDir = path.join(frontendPath, 'src', '__tests__');
  await fs.ensureDir(testDir);
  const testPath = path.join(testDir, `${pascalName}.test.tsx`);
  const storyPath = path.join(componentDir, `${pascalName}.stories.tsx`);
  const indexPath = path.join(componentDir, 'index.ts');

  // Verzeichnis erstellen
  await fs.ensureDir(componentDir);

  // Templates kompilieren und Dateien schreiben
  const componentCompiled = Handlebars.compile(componentTemplate);
  await fs.writeFile(componentPath, componentCompiled(templateData));
  console.log(chalk.green(`  ✓ Komponente erstellt: ${componentPath}`));

  if (tests) {
    const testCompiled = Handlebars.compile(testTemplate);
    await fs.writeFile(testPath, testCompiled(templateData));
    console.log(chalk.green(`  ✓ Tests erstellt: ${testPath}`));
  }

  // Storybook Story (optional)
  const storyCompiled = Handlebars.compile(storyTemplate);
  await fs.writeFile(storyPath, storyCompiled(templateData));
  console.log(chalk.green(`  ✓ Storybook Story erstellt: ${storyPath}`));

  // Index-Datei für einfachen Import
  const indexContent = `export { default } from './${pascalName}';\nexport type { ${pascalName}Props } from './${pascalName}';\n`;
  await fs.writeFile(indexPath, indexContent);
  console.log(chalk.green(`  ✓ Index-Datei erstellt: ${indexPath}`));

  // Informationen anzeigen
  console.log(chalk.yellow(`\n💡 Nächste Schritte:`));
  console.log(chalk.gray(`  1. Komponente importieren:`));
  console.log(
    chalk.gray(`     import ${pascalName} from '${directory}/${pascalName}';`)
  );
  console.log(chalk.gray(`  2. In Parent-Komponente verwenden:`));
  console.log(chalk.gray(`     <${pascalName} title="Mein Title" />`));
  if (tests) {
    console.log(chalk.gray(`  3. Tests ausführen:`));
    console.log(chalk.gray(`     npm run test -- ${pascalName}`));
  }
}
