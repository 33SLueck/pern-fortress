// fortress.config.js – Beispiel für CLI-Extensibility
module.exports = {
  templatesDir: './.fortress-templates',
  generators: [
    // Beispiel: './generators/customComponent.js'
  ],
  hooks: {
    beforeGenerate: ['./scripts/check-env.js'],
    afterGenerate: ['./scripts/format.js', './scripts/lint.js'],
  },
  /*
  * Beispiel für eigene Flags. Diese könnten in eigenen Components
  * abgefragt/genutzt werden
  */
 /*
  defaultAuthor: 'Sven',
  featureFlags: {
    enableI18n: false,
  },
  */
};
