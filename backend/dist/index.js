"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const security_1 = require("./config/security");
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const health_1 = __importDefault(require("./routes/health"));
const info_1 = __importDefault(require("./routes/info"));
// Swagger imports nur in Development
let swaggerUi;
let swaggerSpecs;
if (process.env.NODE_ENV !== 'production') {
    swaggerUi = require('swagger-ui-express');
    swaggerSpecs = require('./config/swagger').default;
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Security Middleware (muss früh kommen!)
(0, security_1.configureSecurity)(app);
// Basic Middleware
app.use(express_1.default.json());
app.use(security_1.setSecurityHeaders);
// Swagger UI setup - NUR in Development verfügbar!
if (process.env.NODE_ENV !== 'production' && swaggerUi && swaggerSpecs) {
    console.log('[swagger]: Swagger UI enabled for development');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'PERN Fortress API Documentation',
    }));
    // Swagger JSON endpoint - auch nur in Development
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpecs);
    });
}
else {
    console.log('[swagger]: Swagger UI disabled in production');
    // In Production: 404 für Swagger-Routen
    app.get('/api-docs*', (req, res) => {
        res
            .status(404)
            .json({ error: 'Documentation not available in production' });
    });
}
// Root Routes (non-versioned)
app.use('/', info_1.default);
// API v1 Routes
app.use('/api/v1/health', health_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/products', products_1.default);
// Start server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map