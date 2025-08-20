import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import pluralize from 'pluralize';
import readline from 'readline';
import { execSync } from 'child_process';

export interface ModelOptions {
  fields?: string;
  migration?: boolean;
  seed?: boolean;
}

export default generateModel;
// Utility to load a Handlebars template from file
async function loadTemplateFromFile(
  templatePath: string
): Promise<Handlebars.TemplateDelegate> {
  const source = await fs.readFile(templatePath, 'utf-8');
  return Handlebars.compile(source);
}

// Handlebars Helpers
Handlebars.registerHelper('isString', function (value) {
  return typeof value === 'string';
});

function parseFields(fieldsString: string): Array<{
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  sqlType: string;
}> {
  if (!fieldsString) {
    return [
      {
        name: 'name',
        type: 'String',
        required: true,
        unique: false,
        sqlType: 'TEXT',
      },
    ];
  }

  return fieldsString.split(',').map((field) => {
    const [name, typeString] = field.trim().split(':');
    let type = typeString || 'String';
    let required = true;
    let unique = false;
    let sqlType = 'TEXT';

    // Parse modifiers
    if (type.includes('?')) {
      required = false;
      type = type.replace('?', '');
    }
    if (type.includes('!')) {
      unique = true;
      type = type.replace('!', '');
    }

    // Map types
    switch (type.toLowerCase()) {
      case 'int':
      case 'integer':
        type = 'Int';
        sqlType = 'INTEGER';
        break;
      case 'string':
      case 'text':
        type = 'String';
        sqlType = 'TEXT';
        break;
      case 'boolean':
      case 'bool':
        type = 'Boolean';
        sqlType = 'BOOLEAN';
        break;
      case 'datetime':
      case 'date':
        type = 'DateTime';
        sqlType = 'TIMESTAMP(3)';
        break;
      case 'float':
      case 'decimal':
        type = 'Float';
        sqlType = 'DOUBLE PRECISION';
        break;
      default:
        type = 'String';
        sqlType = 'TEXT';
    }

    return { name, type, required, unique, sqlType };
  });
}

export async function generateModel(
  name: string,
  options: ModelOptions = {}
): Promise<void> {
  console.log(chalk.blue(`📊 Generiere Model: ${name}`));

  const { fields: fieldsString = '', migration = true, seed = true } = options;

  // Namen verarbeiten
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const camelName = name.charAt(0).toLowerCase() + name.slice(1);
  const tableName = pluralize(name.toLowerCase());
  const fields = parseFields(fieldsString);

  // Sample Data für Seeding
  const sampleData = [
    {
      name: `Sample ${pascalName} 1`,
      ...fields.reduce(
        (acc, field) => {
          if (field.name !== 'name') {
            switch (field.type) {
              case 'Int':
                acc[field.name] = 1;
                break;
              case 'Boolean':
                acc[field.name] = true;
                break;
              case 'Float':
                acc[field.name] = 1.0;
                break;
              default:
                acc[field.name] = `Sample ${field.name}`;
            }
          }
          return acc;
        },
        {} as Record<string, any>
      ),
    },
    {
      name: `Sample ${pascalName} 2`,
      ...fields.reduce(
        (acc, field) => {
          if (field.name !== 'name') {
            switch (field.type) {
              case 'Int':
                acc[field.name] = 2;
                break;
              case 'Boolean':
                acc[field.name] = false;
                break;
              case 'Float':
                acc[field.name] = 2.0;
                break;
              default:
                acc[field.name] = `Another ${field.name}`;
            }
          }
          return acc;
        },
        {} as Record<string, any>
      ),
    },
  ];

  // Template-Daten
  const templateData = {
    name: name.toLowerCase(),
    pascalName,
    camelName,
    tableName,
    fields,
    sampleData,
    uniqueFields: fields.filter((f) => f.unique),
  };

  // Dateipfade
  const backendPath = path.join(process.cwd(), 'backend');
  const schemaPath = path.join(backendPath, 'prisma', 'schema.prisma');
  const seedPath = path.join(
    backendPath,
    'prisma',
    'seeds',
    `${name.toLowerCase()}.ts`
  );

  // Load template files
  const modelTemplatePath = path.join(
    __dirname,
    '../../templates/model/model.hbs'
  );
  const seedTemplatePath = path.join(
    __dirname,
    '../../templates/model/seed.hbs'
  );
  const migrationTemplatePath = path.join(
    __dirname,
    '../../templates/model/migration.hbs'
  );

  // Schema erweitern
  if (await fs.pathExists(schemaPath)) {
    let schemaContent = await fs.readFile(schemaPath, 'utf-8');
    const modelCompiled = await loadTemplateFromFile(modelTemplatePath);
    let newModel = modelCompiled(templateData);

    // Prüfung auf vorhandenes Modell
    if (schemaContent.includes(`model ${pascalName} {`)) {
      console.log(
        chalk.yellow(`Model ${pascalName} existiert bereits im Schema.`)
      );
      return;
    }

    // Formatierungsfix für Kommentare und Modellattribute
    // Kommentare mit // am Zeilenanfang
    newModel = newModel.replace(/^(?!\s*\/\/)(.*https?:\/\/.*)$/gm, '// $1');
    // Modellattribute und @@map immer mit Zeilenumbruch
    newModel = newModel.replace(
      /(\w+\s+\w+\s*@.*?)(\s+)(\w+\s+\w+\s*@.*?)/g,
      '$1\n  $3'
    );
    newModel = newModel.replace(/(@@map\(.*?\))/g, '\n  $1');

    await fs.writeFile(schemaPath, schemaContent + '\n\n' + newModel);
    console.log(chalk.green(`  ✓ Model zu Schema hinzugefügt: ${schemaPath}`));
  } else {
    console.log(chalk.yellow(`  ⚠️  Schema nicht gefunden: ${schemaPath}`));
  }

  // Seed-Datei erstellen
  if (seed) {
    await fs.ensureDir(path.dirname(seedPath));
    const seedCompiled = await loadTemplateFromFile(seedTemplatePath);
    await fs.writeFile(seedPath, seedCompiled(templateData));
    console.log(chalk.green(`  ✓ Seed-Datei erstellt: ${seedPath}`));
  }

  // Migration template is loaded but not used directly here (for future use)

  // Migration und Prisma Client automatisch ausführen? (Optional)
  if (migration) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    await new Promise<void>((resolve) => {
      rl.question(
        chalk.yellow(
          `\n❓ Soll automatisch eine Migration (create-only) und prisma generate ausgeführt werden? (ja/nein): `
        ),
        (answer) => {
          if (
            answer.trim().toLowerCase() === 'ja' ||
            answer.trim().toLowerCase() === 'j'
          ) {
            try {
              console.log(chalk.blue(`\n🚀 Starte Migration (create-only)...`));
              execSync(
                `npx prisma migrate dev --create-only --name "add-${tableName}"`,
                { stdio: 'inherit', cwd: backendPath }
              );
              console.log(chalk.green('✓ Migration erfolgreich erstellt.'));
              console.log(chalk.blue('🚀 Generiere Prisma Client...'));
              execSync('npx prisma generate', {
                stdio: 'inherit',
                cwd: backendPath,
              });
              console.log(chalk.green('✓ Prisma Client generiert.'));
            } catch (err) {
              console.log(
                chalk.red(
                  'Fehler beim Ausführen der Migration oder beim Generieren des Prisma Clients.'
                )
              );
            }
          } else {
            console.log(chalk.yellow(`\n💡 Nächste Schritte:`));
            console.log(chalk.gray(`  1. Migration erstellen:`));
            console.log(
              chalk.gray(
                `     npx prisma migrate dev --create-only --name "add-${tableName}"`
              )
            );
            console.log(chalk.gray(`  2. Prisma Client generieren:`));
            console.log(chalk.gray(`     npx prisma generate`));
            if (seed) {
              console.log(chalk.gray(`  3. Seed-Daten einfügen:`));
              console.log(chalk.gray(`     npx prisma db seed`));
            }
          }
          rl.close();
          resolve();
        }
      );
    });
  }
}
