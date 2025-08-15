import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import pluralize from 'pluralize';

export interface ModelOptions {
  fields?: string;
  migration?: boolean;
  seed?: boolean;
}

const modelTemplate = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

model {{pascalName}} {
  id        Int      @id @default(autoincrement())
  {{#each fields}}
  {{name}}  {{type}}{{#if required}} {{/if}}{{#if unique}} @unique{{/if}}
  {{/each}}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("{{tableName}}")
}
`;

const seedTemplate = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed{{pascalName}}() {
  console.log('Seeding {{name}} data...');

  const sample{{pascalName}} = await prisma.{{camelName}}.createMany({
    data: [
      {{#each sampleData}}
      {
        {{#each this}}
        {{@key}}: {{#if (isString this)}}'{{this}}'{{else}}{{this}}{{/if}},
        {{/each}}
      },
      {{/each}}
    ],
    skipDuplicates: true,
  });

  console.log(\`Created \${sample{{pascalName}}.count} {{name}} records\`);
  return sample{{pascalName}};
}
`;

const migrationTemplate = `-- CreateTable
CREATE TABLE "{{tableName}}" (
    "id" SERIAL NOT NULL,
    {{#each fields}}
    "{{name}}" {{sqlType}}{{#if required}} NOT NULL{{/if}},
    {{/each}}
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "{{tableName}}_pkey" PRIMARY KEY ("id")
);

{{#each uniqueFields}}
-- CreateIndex
CREATE UNIQUE INDEX "{{../tableName}}_{{name}}_key" ON "{{../tableName}}"("{{name}}");
{{/each}}
`;

// Handlebars Helpers
Handlebars.registerHelper('isString', function (value) {
  return typeof value === 'string';
});

function parseFields(
  fieldsString: string
): Array<{
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

  // Schema erweitern
  if (await fs.pathExists(schemaPath)) {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    const modelCompiled = Handlebars.compile(modelTemplate);
    const newModel = modelCompiled(templateData);

    await fs.writeFile(schemaPath, schemaContent + '\n\n' + newModel);
    console.log(chalk.green(`  ✓ Model zu Schema hinzugefügt: ${schemaPath}`));
  } else {
    console.log(chalk.yellow(`  ⚠️  Schema nicht gefunden: ${schemaPath}`));
  }

  // Seed-Datei erstellen
  if (seed) {
    await fs.ensureDir(path.dirname(seedPath));
    const seedCompiled = Handlebars.compile(seedTemplate);
    await fs.writeFile(seedPath, seedCompiled(templateData));
    console.log(chalk.green(`  ✓ Seed-Datei erstellt: ${seedPath}`));
  }

  // Migration anzeigen (wird manuell ausgeführt)
  if (migration) {
    console.log(chalk.yellow(`\n💡 Nächste Schritte:`));
    console.log(chalk.gray(`  1. Migration erstellen:`));
    console.log(
      chalk.gray(`     npx prisma migrate dev --name "add-${tableName}"`)
    );
    console.log(chalk.gray(`  2. Prisma Client generieren:`));
    console.log(chalk.gray(`     npx prisma generate`));
    if (seed) {
      console.log(chalk.gray(`  3. Seed-Daten einfügen:`));
      console.log(chalk.gray(`     npx prisma db seed`));
    }
  }
}
