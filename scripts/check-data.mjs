import {readFileSync} from 'node:fs';
import {validateCatalog} from '../lib/catalog.mjs';
const data=validateCatalog(JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8')));
console.log(`Data valid: ${data.hadiths.length} hadiths, ${data.narrators.length} narrators, ${data.sources.length} sources.`);
