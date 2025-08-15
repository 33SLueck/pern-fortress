#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { generateRoute } from './generators/route';
import { generateModel } from './generators/model';
import { generateComponent } from './generators/component';
import { packageInfo } from './utils/package-info';

const program = new Command();

// CLI Header
console.log(chalk.cyan.bold('🏰 PERN-Fortress CLI Generator'));
console.log(chalk.gray(`Version ${packageInfo.version}\n`));

// Hauptbefehl konfigurieren
program
  .name('fortress')
  .description('CLI Generator für das PERN-Fortress Framework')
  .version(packageInfo.version);

// Route Generator
program
  .command('generate:route <name>')
  .alias('g:route')
  .description('Generiert eine neue Express Route mit Validierung und Tests')
  .option('-p, --path <path>', 'Pfad für die Route', '/api/v1')
  .option(
    '-m, --methods <methods>',
    'HTTP Methoden (komma-getrennt)',
    'GET,POST,PUT,DELETE'
  )
  .option('--no-validation', 'Route ohne Input-Validierung generieren')
  .option('--no-tests', 'Route ohne Tests generieren')
  .action(async (name, options) => {
    try {
      await generateRoute(name, options);
      console.log(
        chalk.green.bold(`✅ Route '${name}' erfolgreich generiert!`)
      );
    } catch (error) {
      console.error(
        chalk.red.bold('❌ Fehler beim Generieren der Route:'),
        error
      );
      process.exit(1);
    }
  });

// Model Generator
program
  .command('generate:model <name>')
  .alias('g:model')
  .description('Generiert ein Prisma Model mit Migration')
  .option('-f, --fields <fields>', 'Felder (name:type,email:string)', '')
  .option('--no-migration', 'Model ohne Migration generieren')
  .option('--no-seed', 'Model ohne Seed-Daten generieren')
  .action(async (name, options) => {
    try {
      await generateModel(name, options);
      console.log(
        chalk.green.bold(`✅ Model '${name}' erfolgreich generiert!`)
      );
    } catch (error) {
      console.error(
        chalk.red.bold('❌ Fehler beim Generieren des Models:'),
        error
      );
      process.exit(1);
    }
  });

// Component Generator
program
  .command('generate:component <name>')
  .alias('g:component')
  .description('Generiert eine React Komponente mit TypeScript und Tests')
  .option('-d, --directory <dir>', 'Zielverzeichnis', 'src/components')
  .option('-t, --type <type>', 'Komponenten-Typ', 'functional')
  .option('--no-tests', 'Komponente ohne Tests generieren')
  .option('--no-styles', 'Komponente ohne CSS Module generieren')
  .action(async (name, options) => {
    try {
      await generateComponent(name, options);
      console.log(
        chalk.green.bold(`✅ Komponente '${name}' erfolgreich generiert!`)
      );
    } catch (error) {
      console.error(
        chalk.red.bold('❌ Fehler beim Generieren der Komponente:'),
        error
      );
      process.exit(1);
    }
  });

// Interactive Generator
program
  .command('generate')
  .alias('g')
  .description('Interaktiver Generator-Wizard')
  .action(async () => {
    const inquirer = await import('inquirer');

    const answers = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Was möchtest du generieren?',
        choices: [
          { name: '🛣️  Route (Backend)', value: 'route' },
          { name: '📊 Model (Database)', value: 'model' },
          { name: '🧩 Component (Frontend)', value: 'component' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Name:',
        validate: (input) => input.length > 0 || 'Name ist erforderlich',
      },
    ]);

    try {
      switch (answers.type) {
        case 'route':
          await generateRoute(answers.name, {});
          break;
        case 'model':
          await generateModel(answers.name, {});
          break;
        case 'component':
          await generateComponent(answers.name, {});
          break;
      }
      console.log(
        chalk.green.bold(
          `✅ ${answers.type} '${answers.name}' erfolgreich generiert!`
        )
      );
    } catch (error) {
      console.error(chalk.red.bold('❌ Fehler beim Generieren:'), error);
      process.exit(1);
    }
  });

// Help für unbekannte Befehle
program.on('command:*', () => {
  console.error(chalk.red.bold('❌ Unbekannter Befehl!'));
  console.log(chalk.yellow('💡 Verfügbare Befehle:'));
  console.log(
    chalk.gray('  pern generate:route <name>     # Route generieren')
  );
  console.log(
    chalk.gray('  pern generate:model <name>     # Model generieren')
  );
  console.log(
    chalk.gray('  pern generate:component <name> # Komponente generieren')
  );
  console.log(
    chalk.gray('  pern generate                  # Interaktiver Wizard')
  );
  console.log(chalk.gray('  pern --help                    # Hilfe anzeigen'));
  process.exit(1);
});

// CLI starten
program.parse();
