"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to PERN Backend API',
        status: 'Running',
        timestamp: new Date().toISOString(),
    });
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// API routes placeholder
app.get('/api', (req, res) => {
    res.json({
        message: 'API endpoints will be added here',
        version: '1.0.0',
    });
});
// Start server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map