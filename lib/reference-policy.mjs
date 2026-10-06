// Scientific reference guide: domain approval is necessary, not proof of a claim.
export const GUIDE_ID='competition-guide-2026';
export const GUIDE_PROMPT=`Follow the competition scientific reference guide. Every religious assertion must be supported by the supplied approved original evidence. Distinguish original text from your explanation, and a published translation from another Arabic version. Never invent a quotation, grade, consensus, narrator identity or a source. Weak and fabricated reports are criticism exercises, not religious proof. Preserve differences and all material qualifications. No personal fatwas, judgements of people/groups, medical/legal advice or unverified personal cases. Explain neutrally and respectfully for Muslims and non-Muslims; define technical terms from the supplied glossary. Be brief, state uncertainty, and refer sensitive or disputed questions to qualified specialists. AI verification is not human scholarly or linguistic approval.`;
export const REFERENCE_SERVICES=[
 {id:'shamela',name:'المكتبة الشاملة',url:'https://shamela.ws',scope:'طبعات الأحاديث وكتب الرجال',mode:'reviewed-editions'},
 {id:'dorar',name:'الدرر السنية',url:'https://dorar.net/article/389',scope:'الأحاديث وأحكام المحدثين',mode:'public-json-api'},
 {id:'hadeethenc',name:'موسوعة الأحاديث النبوية',url:'https://hadeethenc.com/api-docs/',scope:'ترجمات منشورة وشروح',mode:'public-rest-api'},
 {id:'islamiccontent',name:'المحتوى الإسلامي',url:'https://mcp.islamiccontent.org/mcp',scope:'بحث واسترجاع مقاطع المصدر',mode:'public-mcp'},
 {id:'quranenc',name:'موسوعة القرآن الكريم',url:'https://quranenc.com/en/home/api',scope:'ترجمات القرآن؛ خارج أدوات الأسانيد',mode:'reference-only'},
 {id:'byenah',name:'بينات',url:'https://dawa.center/file/7937',scope:'أسئلة وأجوبة عن الإسلام',mode:'reference-only'},
 {id:'terminology',name:'قاموس المصطلحات',url:'https://islamic-content.com/dictionary',scope:'المصطلحات الشرعية المعتمدة',mode:'reference-only'}
];
const hosts=new Set(['shamela.ws','dorar.net','hadeethenc.com','quranenc.com','islamenc.com','dawa.center','byenah.com','islamic-content.com','terminologyenc.com']);
export function approvedReferenceUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&hosts.has(u.hostname)?u.href:null;}catch{return null;}}
export function assertApprovedCatalog(data){
 if(data.referencePolicy!==GUIDE_ID)return;
 for(const s of data.sources)if(!approvedReferenceUrl(s.url)||!s.verifiedAt||!s.evidence||!s.provider)throw Error('Unreviewed reference in approved catalog: '+s.id);
}
const response=(status,answer,en,locale,extra={})=>({status,answer:locale==='en'?en:answer,engine:'none',claims:[],sources:[],hits:[],blocks:[],...extra});
export function guidePreflight(input){
 const raw=String(input.question||input.text||''),q=raw.normalize('NFKC').replace(/[\u064b-\u065f\u0670]/gu,'').toLowerCase(),locale=input.locale;
 if(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|(?:\+966|00966|05)\d{8}|(?:رقم هويتي|رقم الهوية|رقم إقامتي)\s*[:：]?\s*\d+/iu.test(raw))return response('refused','احذف بيانات الاتصال أو الهوية من سؤالك ثم أرسله. لا نحتاج بيانات شخصية لفهم الإسناد.','Remove contact or identity details before sending. Personal details are not needed to study a chain.',locale,{policyLevel:'privacy'});
 if(input.action==='extract')return null;
 if(/(?:^|\s)(?:اخترع|الف|ألف|اصنع|make up|invent|fabricate)\s+.{0,40}(?:حديث|اية|آية|hadith|verse)|(?:احكم على|تكفير|is .+ a disbeliever|judge .+ person)/iu.test(q))return response('refused','لا أنشئ نصًا منسوبًا إلى القرآن أو السنة ولا أحكم على الأشخاص. يمكنني عرض النص المثبت ومرجعه أو مساعدتك على قراءة سنده.','I cannot invent scripture or judge individuals. I can show an established text and its reference or explain its chain.',locale,{policyLevel:'D'});
 if(/(?:هل|حكم|يصح|صحيح|حلال|حرام|يجوز|فتوى|fatwa|valid|permitted|should i|can i).{0,70}(?:زواجي|طلاق|زوجتي|زوجي|عقدي|معاملتي|صلاتي|صيامي|مرض|دواء|marriage|divorce|my prayer|my fast|contract|medication)|(?:زواجي|طلاق|صلاتي|صيامي|my marriage|my prayer|my fast|my contract).{0,50}(?:صحيح|حكم|يصح|حلال|يجوز|valid|permitted|correct)/iu.test(q))return response('referral','سؤالك يتعلق بحالة شخصية تحتاج معرفة تفاصيلها ومراجعة مختص مؤهل. لا يصدر سَنَد فتوى شخصية؛ يمكنه مساعدتك على فهم نص الحديث ومرجعه بصورة عامة.','This personal case needs a qualified specialist who can examine its details. Sanad does not issue personal fatwas; it can explain a report and its source in general terms.',locale,{policyLevel:'D'});
 if(/(?:الخلاف الفقهي|اختلف العلماء|اختلاف العلماء|disputed ruling|scholarly disagreement|scholars differ|المذاهب|عقيدة|creed|الجميع متفق|كل المسلمين|all muslims|consensus)/iu.test(q))return response('referral','هذا سؤال يحتمل خلافًا أو يحتاج مراجعة علمية متخصصة. لا تعني بيانات هذه المكتبة إجماعًا. حدّد الحديث أو القول ومرجعه لنقرأ النص المسجل دون إصدار حكم مستقل.','This may involve scholarly disagreement or specialist review. This library does not establish a consensus. Specify the report or statement and its source so we can read the recorded evidence without an independent ruling.',locale,{policyLevel:'C'});
 return null;
}
