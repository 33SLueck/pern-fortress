import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { generateModel } from './model';

export interface RouteOptions {
  path?: string;
  methods?: string;
  validation?: boolean;
  tests?: boolean;
  swagger?: boolean;
}

// Register Handlebars helpers
Handlebars.registerHelper('eq', function (a: unknown, b: unknown) {
  return a === b;
});

Handlebars.registerHelper(
  'includes',
  function (array: string[], value: string) {
    return array.includes(value);
  }
);

// Helper functions
function toPascalCase(str: string): string {
  // Improved: Only remove trailing 's' if the word is plural and not a known singular ending with 's'
  // Use a basic exceptions list and fallback to original if unsure
  const exceptions = [
    'status',
    'news',
    'boss',
    'glass',
    'class',
    'pass',
    'species',
    'series',
  ];
  let singular = str;
  if (
    str.endsWith('s') &&
    !exceptions.includes(str.toLowerCase()) &&
    str.length > 3 &&
    str.toLowerCase() !== str.slice(0, -1).toLowerCase() + 's' // avoid double 'ss' words
  ) {
    singular = str.slice(0, -1);
  }
  return singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '_');
}

// Utility to load a Handlebars template from file
async function loadTemplateFromFile(
  templatePath: string
): Promise<Handlebars.TemplateDelegate> {
  const source = await fs.readFile(templatePath, 'utf-8');
  return Handlebars.compile(source);
}

// Function to update index.ts with new route
async function updateIndexFile(
  modelName: string,
  routePath: string
): Promise<void> {
  const indexPath = path.join(process.cwd(), 'backend/src/index.ts');

  if (!fs.existsSync(indexPath)) {
    console.warn(
      chalk.yellow(`Warning: ${indexPath} not found. Skipping index update.`)
    );
    return;
  }

  let content = await fs.readFile(indexPath, 'utf-8');
  const kebabName = toKebabCase(modelName);
  const lowerName = modelName.toLowerCase();

  // Add import statement
  const importLine = `import ${lowerName}Routes from './routes/${lowerName}';`;
  const importRegex = /import.*from.*routes.*;\s*$/gm;
  const lastImportMatch = [...content.matchAll(importRegex)].pop();

  if (lastImportMatch && !content.includes(importLine)) {
    const lastImportIndex = lastImportMatch.index! + lastImportMatch[0].length;
    content =
      content.slice(0, lastImportIndex) +
      '\n' +
      importLine +
      content.slice(lastImportIndex);
  }

  // Add route usage
  const routeLine = `app.use('/api/v1/${kebabName}', ${lowerName}Routes);`;
  const routeRegex = /app\.use\('\/api\/v1\/\w+',.*Routes\);\s*$/gm;
  const lastRouteMatch = [...content.matchAll(routeRegex)].pop();

  if (lastRouteMatch && !content.includes(routeLine)) {
    const lastRouteIndex = lastRouteMatch.index! + lastRouteMatch[0].length;
    content =
      content.slice(0, lastRouteIndex) +
      '\n' +
      routeLine +
      content.slice(lastRouteIndex);
  }

  await fs.writeFile(indexPath, content);
  console.log(chalk.green(`✓ Updated ${indexPath} with new route`));
}

// Function to update validation index
async function updateValidationIndex(modelName: string): Promise<void> {
  const validationIndexPath = path.join(
    process.cwd(),
    'backend/src/middleware/validation/index.ts'
  );

  if (!fs.existsSync(validationIndexPath)) {
    console.warn(
      chalk.yellow(
        `Warning: ${validationIndexPath} not found. Skipping validation index update.`
      )
    );
    return;
  }

  let content = await fs.readFile(validationIndexPath, 'utf-8');
  const pascalName = toPascalCase(modelName);
  // Always use singular for OpenAPI schema names
  const pascalNameSingular = toPascalCase(
    modelName.endsWith('s') ? modelName.slice(0, -1) : modelName
  );
  const lowerName = modelName.toLowerCase();

  // Add export statement
  const exportLines = `export {
  validateCreate${pascalName},
  validateUpdate${pascalName},
  validateGet${pascalName}ById,
} from './${lowerName}';`;

  if (!content.includes(`from './${lowerName}'`)) {
    // Find the last export statement and add after it
    const lastExportMatch = content.lastIndexOf("} from './");
    if (lastExportMatch !== -1) {
      const endOfLine = content.indexOf('\n', lastExportMatch);
      content =
        content.slice(0, endOfLine + 1) +
        exportLines +
        '\n' +
        content.slice(endOfLine + 1);
    } else {
      // If no exports found, add at the end
      content += '\n' + exportLines + '\n';
    }

    await fs.writeFile(validationIndexPath, content);
    console.log(
      chalk.green(
        `✓ Updated ${validationIndexPath} with new validation exports`
      )
    );
  }
}

// Function to add routes to Swagger configuration
async function addRouteToSwagger(modelName: string): Promise<void> {
  const swaggerPath = path.join(process.cwd(), 'backend/src/config/swagger.ts');

  if (!fs.existsSync(swaggerPath)) {
    console.warn(
      chalk.yellow(
        `Warning: ${swaggerPath} not found. Skipping Swagger update.`
      )
    );
    return;
  }

  let content = await fs.readFile(swaggerPath, 'utf-8');
  const pascalName = toPascalCase(modelName);
  // Always use singular for OpenAPI schema names
  const pascalNameSingular = toPascalCase(
    modelName.endsWith('s') ? modelName.slice(0, -1) : modelName
  );
  const lowerName = modelName.toLowerCase();

  // Add import statement
  const importLine = `import {
  get${pascalName}Handler,
  get${pascalName}ByIdHandler,
  create${pascalName}Handler,
  update${pascalName}Handler,
  delete${pascalName}Handler,
} from '../routes/${lowerName}';`;

  if (!content.includes(`from '../routes/${lowerName}'`)) {
    // Find the last import and add after it
    const lastImportMatch = content.lastIndexOf("} from '../routes/");
    if (lastImportMatch !== -1) {
      const endOfLine = content.indexOf('\n', lastImportMatch);
      content =
        content.slice(0, endOfLine + 1) +
        importLine +
        '\n' +
        content.slice(endOfLine + 1);
    }
  }

  // Add tag to tags array
  const tagDefinition = `    {
      name: '${pascalName}',
      description: '${pascalName} management operations',
    },`;

  if (!content.includes(`name: '${pascalName}'`)) {
    const tagsEndMatch = content.indexOf('],', content.indexOf('tags: ['));
    if (tagsEndMatch !== -1) {
      content =
        content.slice(0, tagsEndMatch) +
        tagDefinition +
        '\n  ' +
        content.slice(tagsEndMatch);
    }
  }

  // Add schema definitions (basic template - should be customized based on model)
  const schemaDefinitions = `      ${pascalNameSingular}: {
        type: 'object',
        required: ['id', 'name', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the ${lowerName}',
            example: 1,
          },
          name: {
            type: 'string',
            description: '${pascalName} name',
            example: 'Sample ${pascalName}',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the ${lowerName} was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the ${lowerName} was last updated',
          },
        },
      },
      Create${pascalName}Request: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: '${pascalName} name',
            example: 'New ${pascalName}',
          },
        },
      },
      Update${pascalName}Request: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: '${pascalName} name',
            example: 'Updated ${pascalName}',
          },
        },
      },`
    .replace(/\$\{lowerName\}/g, lowerName)
    .replace(/\$\{pascalName\}/g, pascalName);

  if (!content.includes(`${pascalName}: {`)) {
    const schemasEndMatch = content.lastIndexOf(
      '},',
      content.indexOf('responses: {')
    );
    if (schemasEndMatch !== -1) {
      content =
        content.slice(0, schemasEndMatch + 2) +
        '\n      ' +
        schemaDefinitions +
        '\n    ' +
        content.slice(schemasEndMatch + 2);
    }
  }

  // Add paths to extractPathsFromHandlers function
  const pathsCode = `
  // ${pascalName} endpoints
  if (get${pascalName}Handler.apiDoc || create${pascalName}Handler.apiDoc) {
    paths['/api/v1/${toKebabCase(modelName)}'] = {};
    if (get${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}'].get = get${pascalName}Handler.apiDoc;
    }
    if (create${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}'].post = create${pascalName}Handler.apiDoc;
    }
  }

  if (get${pascalName}ByIdHandler.apiDoc || update${pascalName}Handler.apiDoc || delete${pascalName}Handler.apiDoc) {
    paths['/api/v1/${toKebabCase(modelName)}/{id}'] = {};
    if (get${pascalName}ByIdHandler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].get = get${pascalName}ByIdHandler.apiDoc;
    }
    if (update${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].put = update${pascalName}Handler.apiDoc;
    }
    if (delete${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].delete = delete${pascalName}Handler.apiDoc;
    }
  }`;

  if (!content.includes(`// ${pascalName} endpoints`)) {
    const returnStatementsMatch = content.indexOf('return paths;');
    if (returnStatementsMatch !== -1) {
      content =
        content.slice(0, returnStatementsMatch) +
        pathsCode +
        '\n\n  ' +
        content.slice(returnStatementsMatch);
    }
  }

  await fs.writeFile(swaggerPath, content);
  console.log(
    chalk.green(`✓ Updated ${swaggerPath} with new ${pascalName} documentation`)
  );
}

export async function generateRoute(
  modelName: string,
  options: RouteOptions = {}
): Promise<void> {
  try {
    console.log(chalk.blue(`🚀 Generating CRUD route for ${modelName}...`));

    // Validate model name
    if (!modelName || typeof modelName !== 'string') {
      throw new Error('Model name is required and must be a string');
    }

    // Ensure model exists in Prisma schema
    await generateModel(modelName);

    const readline = await import('readline');
    const pascalName = toPascalCase(modelName);
    const lowerName = modelName.toLowerCase();
    const kebabName = toKebabCase(modelName);

    // Interactive singularization confirmation if model ends with 's'
    let pascalNameSingular = toPascalCase(modelName);
    if (modelName.endsWith('s')) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const answer = await new Promise<string>((resolve) => {
        rl.question(
          `\nThe model name "${modelName}" ends with an 's'. Is this already singular (e.g. 'boss', 'status')? [y/N]: `,
          (input) => resolve(input.trim().toLowerCase())
        );
      });
      rl.close();
      if (answer !== 'y' && answer !== 'yes') {
        pascalNameSingular = toPascalCase(modelName.slice(0, -1));
        console.log(
          chalk.yellow(`Using singular schema name: ${pascalNameSingular}`)
        );
      } else {
        pascalNameSingular = toPascalCase(modelName);
        console.log(
          chalk.yellow(`Using model name as singular: ${pascalNameSingular}`)
        );
      }
    }
    // Prepare template data
    const templateData = {
      pascalName,
      pascalNameSingular,
      lowerName,
      kebabName,
      methods: options.methods || 'GET,POST,PUT,DELETE',
    };

    // Create backend directories
    const backendDir = path.join(process.cwd(), 'backend');
    const routesDir = path.join(backendDir, 'src/routes');
    const validationDir = path.join(backendDir, 'src/middleware/validation');
    const testsDir = path.join(backendDir, 'src/__tests__/routes');

    await fs.ensureDir(routesDir);
    await fs.ensureDir(validationDir);

    if (options.tests !== false) {
      await fs.ensureDir(testsDir);
    }

    // Generate route file using external Handlebars template
    const routeTemplatePath = path.join(
      __dirname,
      '../../templates/route/fullCrudRoute.hbs'
    );
    const routeTemplateSource = await fs.readFile(routeTemplatePath, 'utf-8');
    const routeTemplate = Handlebars.compile(routeTemplateSource);
    const routeContent = routeTemplate(templateData);
    const routeFilePath = path.join(routesDir, `${lowerName}.ts`);

    await fs.writeFile(routeFilePath, routeContent);
    console.log(chalk.green(`✓ Generated route file: ${routeFilePath}`));

    // Generate validation file using external Handlebars template
    if (options.validation !== false) {
      const validationTemplatePath = path.join(
        __dirname,
        '../../templates/route/validation.hbs'
      );
      const validationTemplateCompiled = await loadTemplateFromFile(
        validationTemplatePath
      );
      const validationContent = validationTemplateCompiled(templateData);
      const validationFilePath = path.join(validationDir, `${lowerName}.ts`);

      await fs.writeFile(validationFilePath, validationContent);
      console.log(
        chalk.green(`✓ Generated validation file: ${validationFilePath}`)
      );

      // Update validation index
      await updateValidationIndex(modelName);
    }

    // Generate test file using external Handlebars template
    if (options.tests !== false) {
      const testTemplatePath = path.join(
        __dirname,
        '../../templates/route/test.hbs'
      );
      const testTemplateCompiled = await loadTemplateFromFile(testTemplatePath);
      const testContent = testTemplateCompiled(templateData);
      const testFilePath = path.join(testsDir, `${lowerName}.test.ts`);

      await fs.writeFile(testFilePath, testContent);
      console.log(chalk.green(`✓ Generated test file: ${testFilePath}`));
    }

    // Update main index.ts file
    await updateIndexFile(modelName, options.path || `/api/v1/${kebabName}`);

    // Update Swagger configuration
    if (options.swagger !== false) {
      await addRouteToSwagger(modelName);
    }

    console.log(
      chalk.green(`\n🎉 Successfully generated CRUD route for ${pascalName}!`)
    );
    console.log(chalk.cyan(`\nGenerated files:`));
    console.log(chalk.gray(`  • Route: backend/src/routes/${lowerName}.ts`));
    if (options.validation !== false) {
      console.log(
        chalk.gray(
          `  • Validation: backend/src/middleware/validation/${lowerName}.ts`
        )
      );
    }
    if (options.tests !== false) {
      console.log(
        chalk.gray(
          `  • Tests: backend/src/__tests__/routes/${lowerName}.test.ts`
        )
      );
    }
    console.log(chalk.gray(`  • Updated: backend/src/index.ts`));
    console.log(
      chalk.gray(`  • Updated: backend/src/middleware/validation/index.ts`)
    );
    if (options.swagger !== false) {
      console.log(chalk.gray(`  • Updated: backend/src/config/swagger.ts`));
    }

    console.log(chalk.cyan(`\nAvailable endpoints:`));
    console.log(
      chalk.gray(`  • GET    /api/v1/${kebabName}     - Get all ${lowerName}`)
    );
    console.log(
      chalk.gray(`  • GET    /api/v1/${kebabName}/:id - Get ${lowerName} by ID`)
    );
    console.log(
      chalk.gray(
        `  • POST   /api/v1/${kebabName}     - Create new ${lowerName}`
      )
    );
    console.log(
      chalk.gray(`  • PUT    /api/v1/${kebabName}/:id - Update ${lowerName}`)
    );
    console.log(
      chalk.gray(`  • DELETE /api/v1/${kebabName}/:id - Delete ${lowerName}`)
    );
  } catch (error) {
    console.error(chalk.red(`❌ Error generating route:`), error);
    throw error;
  }
}
