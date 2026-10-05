# Sunnah.com English-text audit

Reviewed on 3 October 2026. All ten current records have an exact English quotation tied to the Arabic record, source IDs and selected chain nodes. The library retains four authentic, three weak and three fabricated reports.

| Catalog record | Exact source | In-book reference | Classification |
| --- | --- | --- | --- |
| bukhari-1 | [Sahih al-Bukhari 1](https://sunnah.com/bukhari:1) | Book 1, Hadith 1 | sahih |
| bukhari-10 | [Sahih al-Bukhari 10](https://sunnah.com/bukhari:10) | Book 2, Hadith 3 | sahih |
| bukhari-6018 | [Sahih al-Bukhari 6018](https://sunnah.com/bukhari:6018) | Book 78, Hadith 49 | sahih |
| bukhari-6116 | [Sahih al-Bukhari 6116](https://sunnah.com/bukhari:6116) | Book 78, Hadith 143 | sahih |
| tirmidhi-3371 | [Jami at-Tirmidhi 3371](https://sunnah.com/tirmidhi:3371) | Book 48, Hadith 2 | weak (Darussalam) |
| tirmidhi-2687 | [Jami` at-Tirmidhi 2687](https://sunnah.com/tirmidhi:2687) | Book 41, Hadith 43 | weak |
| ibnmajah-802 | [Sunan Ibn Majah 802](https://sunnah.com/ibnmajah:802) | Book 4, Hadith 68 | weak |
| ibnmajah-1388 | [Sunan Ibn Majah 1388](https://sunnah.com/ibnmajah:1388) | Book 5, Hadith 586 | fabricated |
| ibnmajah-4313 | [Sunan Ibn Majah 4313](https://sunnah.com/ibnmajah:4313) | Book 37, Hadith 214 | fabricated |
| ibnmajah-4054 | [Sunan Ibn Majah 4054](https://sunnah.com/ibnmajah:4054) | Book 36, Hadith 129 | fabricated |

## Replacement records

At the team’s request, the previous three fabricated reports without matching Sunnah.com English texts were replaced with Ibn Majah 1388, 4313 and 4054. These are different reports, with their own Arabic texts, chains and narrator profiles. All three pages display Maudu’ (Darussalam); the project explicitly attributes that classification and retains a non-attribution warning in the map, text view and assistant.

Ibn Majah 1388: “from his father” is Abdullah ibn Ja’far, distinct from his son Mu’awiyah. The name link in Ibn Majah 1388 leads directly to Sunnah.com narrator 11814, Ibrahim ibn Muhammad al-Hashimi. That profile records “Truthful, Good Hadith”, Ibn Hajar’s “saduq” and Ibn Hibban’s inclusion in al-Thiqat. Its teacher and student match the recorded chain. The green card uses this cited assessment; al-Mizzi’s earlier uncertainty remains documented in the chain note.

Ibn Majah 4313: Ahmad ibn Yunus maps to Ahmad ibn Abdullah ibn Yunus. Alaq’s unknown status and Anbasah’s accusation of fabrication belong to separate identities.

Ibn Majah 4054: Abu Shajarah is the kunyah of Kathir ibn Murrah, represented by one node. Abu al-Zahiriyyah is Hudayr ibn Kurayb. Sa’id ibn Sinan is Abu Mahdi al-Himsi. Ibn Umar remains distinct from Ibn Amr.

The compiler is Ibn Majah, followed by the narrators in the Arabic source’s order. Companion and Prophet cards remain green; their colour does not authenticate a fabricated report.

## Source binding and reproduction

data/hadith-english.json preserves the visible English introduction, wording and punctuation. Library titles are exact excerpts. A SHA-256 digest covers the introduction and body. Editing the Arabic matn, source IDs or chain nodes invalidates the English quotation until checked again. The map, text view and assistant use the same lookup.

[Sunnah.com About, section 8](https://sunnah.com/about) permits individual hadith selections for teaching, didactic and presentation purposes. Ten attributed English records are included for this educational selection. No full pages, books or scraped collections are distributed. Translation rights remain with their owners.

65 automated checks pass, including source bindings, quotation digests, missing-information refusals, fabricated-report warnings and identity isolation. These software checks do not constitute a new scholarly grading.
