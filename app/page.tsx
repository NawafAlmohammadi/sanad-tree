import Explorer from './explorer';
import { catalog } from '@/lib/catalog.mjs';
export default function Home(){return <Explorer data={catalog}/>;}
