import Explorer from './explorer';
import { catalog } from '@/lib/catalog.mjs';
import {LanguageProvider} from './language';
export default function Home(){return <LanguageProvider><Explorer data={catalog}/></LanguageProvider>;}
