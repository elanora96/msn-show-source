import fs from 'fs';
import path from 'path';
import prettier, { type Config as prettierConfig } from 'prettier';
import { fileURLToPath } from 'url';
import __importedPackageJSON from '../package.json' with { type: 'json' };

interface UserScriptPackageObject {
  namespace: string;
  match: string[];
  'runs-at': string;
  grant: string[];
  downloadURL: string;
  homepageURL: string;
}

interface UserscriptMetadata {
  namespace?: string | undefined;
  match?: string[] | undefined;
  grant?: string[] | undefined;
  name?: string | undefined;
  version?: string | undefined;
  author?: string | undefined;
  description?: string | undefined;
  license?: string | undefined;
}

interface PackageJson {
  name: string;
  version: string;
  author: string;
  description: string;
  license: string;
  userscript?: UserScriptPackageObject;
  [key: string]:
    | string
    | string[]
    | UserScriptPackageObject
    | Record<string, unknown>
    | undefined;
}

const packageFields: PackageJson = __importedPackageJSON;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { name, version, author, description, license, userscript } =
  packageFields;

const metadata: UserscriptMetadata = {
  name,
  version,
  author,
  description,
  license,
  ...userscript,
};

const maxLength = Math.max(...Object.keys(metadata).map((k) => k.length)) + 1;

const createField = (key: string, padding: string, value: string) =>
  `// @${key}${padding}${value}`;

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

const projectRoot = path.join(__dirname);

const tscOutputFile = path.join(projectRoot, 'index.js');
const thisOutputFile = path.join(projectRoot, 'userscript.js');

const scriptContent: string = fs.readFileSync(tscOutputFile, 'utf8');

const prettierOptions: prettierConfig = {
  useTabs: false,
  singleQuote: true,
  semi: true,
  printWidth: 80,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',
  parser: 'babel-ts',
};

prettier
  .format(output.concat(scriptContent), prettierOptions)
  .then((formatted) => {
    fs.writeFileSync(thisOutputFile, formatted, 'utf8');
    fs.unlinkSync(tscOutputFile);
  })
  .catch((e: unknown) => {
    console.error(`${e}`);
  });
