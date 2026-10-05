import {catalog} from '../lib/catalog.mjs';
import archived from './fixtures/archived-nasai-518.json' with {type:'json'};
export const archivedCatalog={...catalog,hadiths:[...catalog.hadiths,archived.hadith],narrators:[...catalog.narrators,...archived.narrators]};
