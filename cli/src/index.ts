import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Utility: load fortress config
async function loadFortressConfig() {
  const configPaths = [
    path.join(process.cwd(), 'fortress.config.js'),
    path.join(process.cwd(), '.fortressrc.js'),
  ];
  for (const configPath of configPaths) {
    if (await fs.pathExists(configPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(configPath);
    }
  }
  return {};
}

// Utility: run hooks
async function runHooks(hooks: string[] = [], context: any = {}) {
  for (const hookPath of hooks) {
    const absPath = path.isAbsolute(hookPath)
      ? hookPath
      : path.join(process.cwd(), hookPath);
    if (await fs.pathExists(absPath)) {
      try {
        require(absPath)(context);
      } catch (e) {
        // Allow both JS scripts and shell scripts
        await import('child_process').then(({ execSync }) => {
          execSync(`node "${absPath}"`, { stdio: 'inherit' });
        });
      }
    }
  }
}

// Utility: write file (for generator API)
async function writeFile(filePath: string, content: string) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

// CLI Entrypoint
async function main() {
  const fortressConfig = await loadFortressConfig();
  const generators: string[] = fortressConfig.generators || [];
  const hooks = fortressConfig.hooks || {};
  const templatesDir =
    fortressConfig.templatesDir ||
    path.join(process.cwd(), '.fortress-templates');

  yargs(hideBin(process.argv))
    .command(
      'generate <generator> <name>',
      'Generiere Code mit einem Generator',
      (yargs) =>
        yargs
          .positional('generator', {
            describe: 'Name des Generators',
            type: 'string',
          })
          .positional('name', {
            describe: 'Name des zu generierenden Elements',
            type: 'string',
          })
          .option('template', {
            describe: 'Custom Template-Datei',
            type: 'string',
          }),
      async (argv) => {
        const { generator, name, template, ...rest } = argv;
        // Run beforeGenerate hooks
        await runHooks(hooks.beforeGenerate, {
          generator,
          name,
          options: argv,
        });

        // Find generator module
        let generatorPath: string | undefined = undefined;
        if (typeof generator === 'string') {
          generatorPath = generators
            .map((g) => (path.isAbsolute(g) ? g : path.join(process.cwd(), g)))
            .find((g) => g.toLowerCase().includes(generator.toLowerCase()));
        }
        if (!generatorPath && typeof generator === 'string') {
          // Fallback: try cli/src/generators
          generatorPath = path.join(__dirname, 'generators', `${generator}.js`);
          if (!(await fs.pathExists(generatorPath))) {
            console.error(`[fortress] Generator nicht gefunden: ${generator}`);
            process.exit(1);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        if (!generatorPath) {
          console.error('[fortress] Generator-Pfad ist nicht definiert.');
          process.exit(1);
        }
        const generatorModule = require(generatorPath);
        const generatorFn = generatorModule.default || generatorModule;
        // Prepare templateData (expandierbar)
        const templateData = { name, ...rest };
        // Call generator
        await generatorFn({
          name,
          options: { ...fortressConfig, ...argv, templatesDir, template },
          templateData,
          writeFile,
        });
        // Run afterGenerate hooks
        await runHooks(hooks.afterGenerate, { generator, name, options: argv });
      }
    )
    .demandCommand(1)
    .help()
    .strict()
    .parse();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
