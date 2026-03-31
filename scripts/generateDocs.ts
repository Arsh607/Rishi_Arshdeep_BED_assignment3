import fs from "fs";
import path from "path";
import { generateSwaggerSpec } from "../config/swaggerOptions";

const outputPath = path.join(__dirname, "../docs/openapi.json");

const spec = generateSwaggerSpec();

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));

console.log("OpenAPI spec generated!");