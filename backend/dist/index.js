"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const security_1 = require("./config/security");
const users_1 = __importDefault(require("./routes/users"));
const health_1 = __importDefault(require("./routes/health"));
const info_1 = __importDefault(require("./routes/info"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
// Swagger setup function - nur für Development
function setupSwagger(app) {
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log('[swagger]: Swagger UI enabled for development');
            app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
                explorer: true,
                customCss: '.swagger-ui .topbar { display: none }',
                customSiteTitle: 'PERN Fortress API Documentation',
            }));
            // Swagger JSON endpoint
            app.get('/api-docs.json', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(swagger_1.default);
            });
        }
        catch (error) {
            console.warn('[swagger]: Failed to load swagger config:', error);
        }
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
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Security Middleware (muss früh kommen!)
(0, security_1.configureSecurity)(app);
// Basic Middleware
app.use(express_1.default.json());
app.use(security_1.setSecurityHeaders);
// Setup Swagger UI
setupSwagger(app);
// Root Routes (non-versioned)
app.use('/', info_1.default);
// API v1 Routes
app.use('/api/v1/health', health_1.default);
app.use('/api/v1/users', users_1.default);
// Start server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map