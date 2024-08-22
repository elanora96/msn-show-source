/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import __importedPackageJSON from './package.json' with { type: 'json' };

/**
 * @typedef {Object} PackageJson
 * @property {string} name
 * @property {string} version
 * @property {string} author
 * @property {string} description
 * @property {string} license
 * @property {Object.<string, unknown>} [additionalProperties]
 */

/**
 * @typedef {Object} UserscriptMetadata
 * @property {string} namespace
 * @property {string[]} match
 * @property {string[]} grant
 * @property {string} name
 * @property {string} version
 * @property {string} author
 * @property {string} description
 * @property {string} license
 */

/** @type {PackageJson} */
const packageFields = __importedPackageJSON;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { name, version, author, description, license, userscript } =
  packageFields;

/** @type {UserscriptMetadata} */
const metadata = {
  name,
  version,
  author,
  description,
  license,
  ...userscript,
};

const maxLength = Math.max(...Object.keys(metadata).map((k) => k.length)) + 1;

const createField = (key, padding, value) => `// @${key}${padding}${value}`;

const output = `// ==UserScript==
${Object.entries(metadata)
  .map(([key, value]) => {
    const padding = ' '.repeat(maxLength - key.length);
    return Array.isArray(value)
      ? value.map((v) => createField(key, padding, v)).join('\n')
      : createField(key, padding, value);
  })
  .join('\n')}
// ==/UserScript==\n\n`;

const outputPath = path.join(__dirname, 'dist', 'index.js');
/** @type {string} */
const scriptContent = fs.readFileSync(outputPath, 'utf8');

fs.writeFileSync(outputPath, output.concat(scriptContent), 'utf8');
