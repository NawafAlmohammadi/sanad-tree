export type Source={id:string;title:string;reference:string;url?:string;rights:string};
export type Sourced={narratorId:string;text:string;sourceIds:string[]};
export type Reliability=Sourced & {status:'trusted'|'review'|'untrusted'};
export type Narrator={id:string;name:string;aliases:string[];sourceIds:string[];bio?:Sourced;period?:Sourced;classification?:Sourced;birth?:Sourced;death?:Sourced;kuniya?:Sourced;reliability?:Reliability;role?:{narratorId:string;type:'companion'|'prophet';sourceIds:string[]}};
export type Chain={id:string;label:string;sourceIds:string[];nodes:string[];links:{from:string;to:string;wording:string;sourceIds:string[]}[];isnad?:string;note?:{chainId:string;text:string;sourceIds:string[]}};
export type Hadith={id:string;title:string;matn:string;sourceIds:string[];chains:Chain[];judgement?:{hadithId:string;text:string;sourceIds:string[];grade?:'sahih'|'weak'|'fabricated'};compiler?:{name:string;wording:string;sourceIds:string[]}};
export type Data={sources:Source[];narrators:Narrator[];hadiths:Hadith[]};
