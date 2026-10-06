// Historical fixtures exercise generic identity and scope guards; never imported by the application.
import catalog from './fixtures/pre-guide-catalog.json' with {type:'json'};
import archived from './fixtures/archived-nasai-518.json' with {type:'json'};
export const archivedCatalog={...catalog,hadiths:[...catalog.hadiths,archived.hadith],narrators:[...catalog.narrators,...archived.narrators]};
