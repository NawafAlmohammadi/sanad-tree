// UI labels and transliterated names. Hadith quotations come only from verified Sunnah.com records.
import {verifiedTexts,verifiedTitles,englishMatnClaim} from './hadith-english.mjs';
import pathNames from './path-names.mjs';
export const names = {
 'al-humaydi':'Al-Humaydi, Abdullah ibn al-Zubayr','sufyan':'Sufyan ibn Uyaynah','yahya-al-ansari':'Yahya ibn Said al-Ansari','muhammad-al-taymi':'Muhammad ibn Ibrahim al-Taymi','alqama-al-laythi':'Alqamah ibn Waqqas al-Laythi','umar-ibn-al-khattab':'Umar ibn al-Khattab','messenger':'The Messenger of Allah ﷺ',
 'abu-dawud-sulayman-sayf':'Abu Dawud, Sulayman ibn Sayf al-Harrani','said-amir-dubai':'Said ibn Amir al-Dubai','shuba-hajjaj':'Shubah ibn al-Hajjaj',"saad-ibrahim-zuhri":"Sa'd ibn Ibrahim ibn Abd al-Rahman ibn Awf",'nasr-abdurrahman-qurashi':'Nasr ibn Abd al-Rahman al-Qurashi','muadh-qurashi-grandfather':'Muadh al-Qurashi — Nasr’s grandfather','muadh-ibn-afra':'Muadh ibn al-Harith — Ibn Afra',
 'adam-abi-iyas':'Adam ibn Abi Iyas','abdullah-abi-safar':'Abdullah ibn Abi al-Safar al-Hamdani','ismail-abi-khalid':'Ismail ibn Abi Khalid al-Bajali','amir-shabi':'Amir ibn Sharahil al-Shabi','abdullah-amr-as':'Abdullah ibn Amr ibn al-As','qutayba-said':'Qutaybah ibn Said al-Thaqafi','salam-sulaym-ahwas':'Abu al-Ahwas, Sallam ibn Sulaym al-Hanafi','uthman-asim-hasin':'Abu Hasin (Ḥaṣīn), Uthman ibn Asim','dhakwan-samman':'Abu Salih, Dhakwan al-Samman','abu-hurayra':'Abu Hurayrah al-Dawsi','yahya-yusuf-zammi':'Yahya ibn Yusuf al-Zammi','abu-bakr-ayyash':'Abu Bakr ibn Ayyash al-Asadi',
 'muhammad-umar-walid':'Muhammad ibn Umar ibn al-Walid al-Kindi','abdullah-numayr':'Abdullah ibn Numayr al-Hamdani','ibrahim-fadl':'Ibrahim ibn al-Fadl al-Makhzumi','said-maqburi':'Said ibn Abi Said al-Maqburi','muhammad-ala-kuraib':'Abu Kurayb, Muhammad ibn al-Ala al-Hamdani','rushdin-saad':'Rushdin ibn Sad al-Mahri','amr-harith-masri':'Amr ibn al-Harith al-Misri','darraj-abi-samh':'Darraj Abu al-Samh','sulayman-amr-haytham':'Abu al-Haytham, Sulayman ibn Amr al-Laythi','abu-said-khudri':'Abu Said al-Khudri',
 'umar-sinan-kamil':'Umar ibn Sinan','abbas-walid-khallal':'Abbas ibn al-Walid al-Khallal','musa-muhammad-ata':'Musa ibn Muhammad ibn Ata al-Balqawi','hasan-umar-malih':'Abu al-Malih, al-Hasan ibn Umar al-Raqqi','maymun-mihran':'Maymun ibn Mihran','abdullah-abbas':'Abdullah ibn Abbas','ahmad-abdullah-yunus':'Ahmad ibn Abdullah ibn Yunus','abd-rabbih-shihab':'Abu Shihab, Abd Rabbih ibn Nafi al-Hannat','hamza-abi-hamza':'Hamzah ibn Abi Hamzah al-Nasibi','nafi-umar':'Nafi, the freedman of Ibn Umar','abdullah-umar':'Abdullah ibn Umar ibn al-Khattab','ali-ishaq-kamil':'Ali ibn Ishaq','muhammad-muhammad-nuuman':'Muhammad ibn Muhammad ibn al-Numan ibn Shibl','nuuman-shibl':'Al-Numan ibn Shibl al-Bahili','malik-anas':'Malik ibn Anas al-Asbahi'
};
names['musa-muhammad-ata']='Musa ibn Muhammad ibn Ata al-Balqawi';
names['uthman-asim-hasin']='Abu Hasin (Ḥaṣīn), Uthman ibn Asim';
names['said-amir-dubai']="Sa'id ibn Amir al-Duba'i";
names['saad-ibrahim-zuhri']="Sa'd ibn Ibrahim ibn Abd al-Rahman ibn Awf";
names['rushdin-saad']="Rushdin ibn Sa'd al-Mahri";
names['shuba-hajjaj']="Shu'bah ibn al-Hajjaj";
names['yahya-al-ansari']="Yahya ibn Sa'id al-Ansari";
names['sufyan']="Sufyan ibn 'Uyaynah";
Object.assign(names,{"hasan-ali-khallal": "Al-Hasan ibn Ali al-Khallal", "abdrazzaq-hammam": "Abd al-Razzaq ibn Hammam al-San'ani", "ibn-abi-sabra": "Abu Bakr ibn Abi Sabrah", "ibrahim-muhammad-sabra": "Ibrahim ibn Muhammad al-Hashimi", "muawiya-abdullah-jafar": "Mu’awiyah ibn Abdullah ibn Ja’far", "abdullah-jafar": "Abdullah ibn Ja’far ibn Abi Talib", "ali-abi-talib": "Ali ibn Abi Talib", "said-marwan": "Sa’id ibn Marwan al-Baghdadi", "anbasa-abdurrahman": "Anbasah ibn Abd al-Rahman", "alaq-abi-muslim": "Alaq ibn Abi Muslim", "aban-uthman": "Aban ibn Uthman ibn Affan", "uthman-affan": "Uthman ibn Affan", "muhammad-musaffa": "Muhammad ibn al-Musaffa al-Himsi", "muhammad-harb": "Muhammad ibn Harb al-Khawlani", "said-sinan-himsi": "Sa’id ibn Sinan al-Himsi — Abu Mahdi", "hudayr-kurayb": "Abu al-Zahiriyyah — Hudayr ibn Kurayb", "kathir-murra": "Abu Shajarah — Kathir ibn Murrah"});
Object.assign(names,{"ali-hujr":"Ali ibn Hujr al-Sadi","walid-muslim":"Al-Walid ibn Muslim al-Qurashi","abdullah-lahia":"Abdullah ibn Lahiah al-Hadrami","ubaydullah-abi-jafar":"Ubayd Allah ibn Abi Jafar al-Misri","aban-salih":"Aban ibn Salih al-Qurashi","anas-malik":"Anas ibn Malik al-Ansari"});
export const titles=verifiedTitles;
Object.assign(names,pathNames);
export const texts=verifiedTexts;
export const compilers={'الإمام البخاري':'Imam al-Bukhari','الإمام النسائي':'Imam al-Nasai','الإمام الترمذي':'Imam al-Tirmidhi','الإمام ابن ماجه':'Imam Ibn Majah','ابن عدي':'Ibn Adi','عبد بن حميد':'Abd ibn Humayd'};
export const wordings={'أنبأنا':'informed us','عن أبيه':'from his father','عن النبي ﷺ قال (نسبة لا تثبت)':'attributed to the Prophet ﷺ (not established)','حدثنا':'narrated to us','حدثني':'narrated to me','أخبرنا':'informed us','أخبرني':'informed me','عن':'from','أنه سمع':'he heard','سمعت':'I heard','قال':'said','حدثني جدي':'my grandfather narrated to me','عن جدّه':'from his grandfather','أنه طاف معه، فقال':'he walked with him, then said','أن رجلًا قال للنبي ﷺ… قال':'a man said to the Prophet ﷺ… he said','إن رسول الله ﷺ قال':'the Messenger of Allah ﷺ said','عن النبي ﷺ قال':'from the Prophet ﷺ, who said','عن رسول الله ﷺ قال':'from the Messenger of Allah ﷺ, who said','قال: قال رسول الله ﷺ':'he said: the Messenger of Allah ﷺ said','أن رسول الله ﷺ قال (نسبة لا تثبت)':'attributed to the Messenger of Allah ﷺ (not established)','قال: قال رسول الله ﷺ (نسبة لا تثبت)':'he said: attributed to the Messenger of Allah ﷺ (not established)'};
Object.assign(wordings,{'أن رسول الله ﷺ قال':'the Messenger of Allah ﷺ said','قال: قال النبي ﷺ':'he said: the Prophet ﷺ said'});
export const trust={trusted:'Trustworthy',review:'Requires review',untrusted:'Weak / rejected',unknown:'Not assessed',companion:'Companion',prophet:'The Prophet ﷺ'};
const englishKey=q=>String(q).trim().toLowerCase().replace(/[?؟.]+$/u,'').replace(/\s+/g,' ');
const questions={
 'explain this chain':'اشرح لي هذا السند','who narrated from whom':'من روى عن من','show the chain':'اعرض سلسلة الرواة','how many narrators are in this chain':'كم عدد الرواة في هذا السند',
 'show the hadith text':'اعرض متن الحديث','what is the source of this hadith':'ما مصدر هذا الحديث','what is the judgement on this hadith':'ما حكم هذا الحديث','what is the judgement on this chain':'ما حكم هذا الإسناد','what is the note on this chain':'ما ملاحظة هذا السند',
 'who is this narrator':'من هذا الراوي','give me a biography of this narrator':'أعطني نبذة عن هذا الراوي','when did this narrator die':'متى توفي هذا الراوي','when was this narrator born':'متى ولد هذا الراوي','what is the judgement on this narrator':'ما حكم هذا الراوي'
};
Object.assign(questions,{'what is an isnad':'ما معنى السند','what is isnad':'ما معنى السند','what is the matn':'ما معنى المتن','what does matn mean':'ما معنى المتن','who did this narrator narrate from':'عن من روى هذا الراوي','who narrated from this narrator':'من روى عن هذا الراوي','ما هو السند':'ما معنى السند','ما هو المتن':'ما معنى المتن','مين هذا الراوي':'من هذا الراوي','مين روى عنه':'من روى عنه','اشرح لي سند الحديث':'اشرح هذا السند','وضح لي السند':'اشرح هذا السند'});
// Exact, whole-question aliases only: translation cannot broaden the scope gate.
export function canonicalQuestion(data,question){
 const cleaned=String(question).trim().replace(/^(?:لو سمحت|من فضلك|ممكن|please|can you)\s+/iu,'').replace(/\s+(?:لو سمحت|من فضلك|please)[?؟.]*$/iu,'');
 const key=englishKey(cleaned);if(questions[key])return questions[key];
 const forms=[['who is ','','من هو '],['who narrated from ','','من روى عن '],['from whom did ',' narrate','عن من روى '],['give me a biography of ','','أعطني نبذة عن '],['when did ',' die','متى توفي '],['when was ',' born','متى ولد '],['what is the judgement on ','','ما حكم ']];
 for(const n of data.narrators){const name=names[n.id];if(!name)continue;for(const [prefix,suffix,arabic] of forms)if(key===englishKey(prefix+name+suffix))return arabic+n.name;}
 return cleaned;
}
export function translatedClaim(f,h,c,data){
 if(f.id.startsWith('edge-')){const l=c.links[Number(f.id.slice(5))];if(l)return `${names[l.from]||data.narrators.find(n=>n.id===l.from)?.name} narrated from ${names[l.to]||data.narrators.find(n=>n.id===l.to)?.name}. Recorded transmission: ${wordings[l.wording]||l.wording}.`;}
 if(f.id==='matn')return englishMatnClaim(h);
 if(f.id==='count')return `This path contains ${c.nodes.length} names, in the order recorded in the source.`;
 if(f.id==='hadith-source')return `Source of “${titles[h.id]||h.title}” — see the original references below.`;
 if(f.id==='attribution-warning'||f.id==='hadith-judgement')return h.judgement?.grade==='fabricated'?'Fabricated report: this wording is not established as a saying of the Prophet ﷺ. The original scholarly judgement is quoted below.':h.judgement?.grade==='weak'?'Weak report: consult the original judgement and the specific chain below.':'Authentic report: consult the recorded scholarly judgement below.';
 const n=data.narrators.filter(n=>f.id.startsWith(`narrator-${n.id}-`)).sort((a,b)=>b.id.length-a.id.length)[0];
 if(n&&f.id.endsWith('-identity'))return `${names[n.id]} — position ${c.nodes.indexOf(n.id)+1} of ${c.nodes.length} in this path.`;
 if(n&&f.id.endsWith('-role'))return `${names[n.id]} — ${n.role?.type==='prophet'?'The Prophet ﷺ; narrator criticism does not apply.':'Companion; this role is displayed separately from narrator criticism.'}`;
 return null;
}
