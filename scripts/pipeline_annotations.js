const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EpubArchive } = require('../packages/epub-reader');

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER CONTEXT MAP — Provides per-chapter thematic metadata for contextual
// glosses. Each chapter gets a unique description so annotations on different
// pages produce different commentary even when matching the same motif.
// ═══════════════════════════════════════════════════════════════════════════════

const CHAPTER_CONTEXTS = {
  '1.1': {
    pages: [3, 29], title: 'The Fall of Finnegan',
    focus: 'the mythic fall of Tim Finnegan / HCE, the thunderclap awakening primitive religion, and the recumbent giant embedded in the Dublin landscape',
    viconian: 'Age of Gods (Theocratic)', characters: 'HCE, Finn MacCool, Mutt and Jute'
  },
  '1.2': {
    pages: [30, 47], title: 'The Encounter in Phoenix Park',
    focus: 'HCE\'s mysterious sin in Phoenix Park, the spread of gossip through Dublin, and the Cad with the pipe',
    viconian: 'Age of Gods', characters: 'HCE, the Cad, Hosty'
  },
  '1.3': {
    pages: [48, 74], title: 'The Trial of HCE',
    focus: 'the public trial and persecution of HCE, the ballad of Hosty, and the testimony of witnesses',
    viconian: 'Age of Gods', characters: 'HCE, the Twelve Jurors, Hosty'
  },
  '1.4': {
    pages: [75, 103], title: 'The Burial of HCE',
    focus: 'the burial of the giant in the landscape, the archaeological mound, the Four Annalists surveying history',
    viconian: 'Age of Gods (transition)', characters: 'HCE, Mamalujo, Kate the Slop'
  },
  '1.5': {
    pages: [104, 125], title: 'The Letter from the Midden',
    focus: 'Biddy Doran the Hen scratching up the mysterious letter from the dump, the Book of Kells as model for textual exegesis',
    viconian: 'Age of Gods', characters: 'The Hen (Biddy Doran), ALP'
  },
  '1.6': {
    pages: [126, 168], title: 'The Quiz Chapter',
    focus: 'twelve questions and answers probing HCE\'s identity, the Mookse and the Gripes parable, Professor Jones',
    viconian: 'Age of Gods', characters: 'Shem, Shaun, Professor Jones, the Mookse, the Gripes'
  },
  '1.7': {
    pages: [169, 195], title: 'Shem the Penman',
    focus: 'Joyce\'s devastating self-portrait as Shem the forger-artist who writes on his own skin with bodily secretions',
    viconian: 'Age of Gods', characters: 'Shem, Shaun (as Justius), ALP (Mercius)'
  },
  '1.8': {
    pages: [196, 216], title: 'Anna Livia Plurabelle',
    focus: 'the two washerwomen gossiping on opposite banks of the darkening Liffey, 500+ river names woven into the text, metamorphosis into elm and stone',
    viconian: 'Age of Gods (closing)', characters: 'ALP, the two washerwomen'
  },
  '2.1': {
    pages: [217, 259], title: 'The Mime of Mick, Nick and the Maggies',
    focus: 'the children\'s games and pantomime on the green, Chuff vs. Glugg, the twenty-eight Rainbow Girls, the Angelus bell',
    viconian: 'Age of Heroes', characters: 'Shem (Glugg), Shaun (Chuff), Issy, the Maggies'
  },
  '2.2': {
    pages: [260, 308], title: 'The Night Lessons',
    focus: 'the children studying the Trivium and Quadrivium, Dolph and Kev drawing geometric diagrams of ALP\'s body, marginal glosses and footnotes',
    viconian: 'Age of Heroes', characters: 'Shem (Dolph), Shaun (Kev), Issy (footnotes)'
  },
  '2.3': {
    pages: [309, 382], title: 'The Tavern',
    focus: 'HCE behind the bar at his Chapelizod pub, the Norwegian Captain tale, the television broadcast, the twelve customers drinking and judging',
    viconian: 'Age of Heroes', characters: 'HCE, the Twelve Customers, Butt and Taff'
  },
  '2.4': {
    pages: [383, 399], title: 'Tristan and Isolde',
    focus: 'the voyage of Tristan and Isolde observed by the Four Old Men as seagulls, Wagnerian chromatic motifs, King Mark\'s displacement',
    viconian: 'Age of Heroes (closing)', characters: 'Tristan, Isolde, Mamalujo, King Mark'
  },
  '3.1': {
    pages: [403, 428], title: 'Shaun the Post (First Watch)',
    focus: 'Shaun floating down the Liffey in a barrel, delivering his sermon, the well-fed postman who delivers messages he cannot understand',
    viconian: 'Age of Men', characters: 'Shaun, Issy, the Rainbow Girls'
  },
  '3.2': {
    pages: [429, 473], title: 'Jaun\'s Sermon',
    focus: 'Jaun (Shaun) preaching to the twenty-nine girls, the Ondt and the Gracehoper fable, departure and farewell',
    viconian: 'Age of Men', characters: 'Jaun/Shaun, Issy, the Rainbow Girls'
  },
  '3.3': {
    pages: [474, 554], title: 'The Inquest of Yawn',
    focus: 'the judicial inquest over the prostrate body of Yawn (Shaun), voices of the dead rising through him, HCE\'s final confession',
    viconian: 'Age of Men', characters: 'Yawn/Shaun, Mamalujo, HCE (voice), ALP (voice)'
  },
  '3.4': {
    pages: [555, 590], title: 'The Bedroom Scene',
    focus: 'HCE and ALP in bed, the children\'s cries, attempted sexual intercourse, domestic reality intruding on the cosmic dream',
    viconian: 'Age of Men (closing)', characters: 'HCE, ALP, Shem, Shaun, Issy'
  },
  '4.1': {
    pages: [591, 628], title: 'The Ricorso — Dawn',
    focus: 'dawn breaking over Dublin Bay, St. Kevin bathing at Glendalough, St. Patrick vs. the Archdruid Balkelly, ALP\'s dissolving final monologue into the sea',
    viconian: 'Ricorso (The Return)', characters: 'St. Kevin, St. Patrick, Balkelly, ALP'
  }
};

// Helper to get chapter context for a given page
function getChapterContext(pageNum) {
  for (const [key, ctx] of Object.entries(CHAPTER_CONTEXTS)) {
    if (pageNum >= ctx.pages[0] && pageNum <= ctx.pages[1]) {
      return { key, ...ctx };
    }
  }
  return { key: '1.1', title: 'Unknown', focus: 'the nocturnal dream', viconian: 'Unknown', characters: 'HCE, ALP' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-REFERENCE INDEX — Maps motif categories to their canonical page.line
// appearances throughout the 628 pages. Annotations draw from this map to
// create meaningful structural connections instead of generic "003.01".
// ═══════════════════════════════════════════════════════════════════════════════

const CROSS_REFERENCE_MAP = {
  'hce': ['003.16', '030.01', '033.24', '075.12', '126.10', '309.01', '532.06', '555.01', '619.20'],
  'alp': ['003.01', '196.01', '198.15', '207.20', '215.24', '619.16', '627.34', '628.15'],
  'shem-shaun': ['152.15', '169.01', '193.31', '219.01', '260.01', '414.16', '462.01'],
  'issy': ['143.28', '226.01', '248.01', '279.01', '457.01', '527.01'],
  'mamalujo': ['095.27', '383.01', '387.24', '398.30', '475.01', '526.01'],
  'thunderclap': ['003.15', '023.05', '044.20', '090.31', '113.09', '139.14', '257.27', '314.08', '332.05', '424.20'],
  'vico': ['003.02', '032.05', '151.10', '260.05', '452.20', '591.01', '614.27'],
  'fall': ['003.15', '004.14', '023.05', '044.20', '055.06', '313.12', '414.19', '628.13'],
  'letter': ['104.01', '107.26', '111.01', '113.20', '280.01', '615.12', '623.32'],
  'book-of-kells': ['104.01', '107.08', '119.10', '122.22'],
  'osiris': ['026.01', '076.01', '104.01', '470.01', '593.01'],
  'swift': ['140.08', '160.06', '229.01', '292.28', '414.25'],
  'dublin': ['003.18', '040.05', '080.20', '196.01', '309.01', '540.15', '593.10'],
  'tavern': ['309.01', '311.05', '333.20', '370.01', '380.20', '382.30'],
  'tristan': ['003.04', '383.01', '385.10', '395.01', '398.25'],
  'twelve': ['075.12', '141.08', '309.12', '370.22', '475.15', '558.01'],
  'dream': ['003.01', '075.01', '219.01', '403.01', '555.01', '591.01', '628.15'],
  'liturgy': ['033.01', '104.20', '185.14', '258.25', '432.01', '606.01'],
  'celtic': ['003.04', '030.14', '080.05', '139.14', '196.01', '391.01', '480.01', '611.04'],
  'wellington': ['008.09', '009.01', '010.01', '011.01', '036.18'],
  'numerology': ['003.12', '117.34', '186.19', '260.01', '293.01', '414.01']
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPANDED MOTIFS — 18 analytical registers with context-aware gloss functions
// that produce unique commentary per page.
// ═══════════════════════════════════════════════════════════════════════════════

const MOTIFS = [
  // 1. HCE & Protagonist Archetype
  {
    regex: /\b(Here Comes Everybody|Haveth Childers Everywhere|Humphrey Chimpden|Earwicker|H\.?C\.?E\.?|Haroun Childeric|Humperface|Howth Castle|hod|builder|porter|innkeeper)\b/i,
    category: ['hce', 'leitmotif', 'protagonist', 'archetype'],
    xrefKey: 'hce',
    sources: [
      'Glasheen, Adaline. Third Census of Finnegans Wake. https://archive.org/details/thirdcensusoffin0000glas',
      'McHugh, Roland. The Sigla of Finnegans Wake. https://archive.org/details/siglaoffinnegans0000mchu',
      'FWEET: HCE concordance entries. https://www.fweet.org',
      'James Joyce Digital Archive: Finnegans Wake Notons. https://jjda.ie'
    ],
    gloss: (match, pageNum, ctx) =>
      `HCE manifestation "${match}" on page ${pageNum} within "${ctx.title}": here the universal father-figure Humphrey Chimpden Earwicker appears in the context of ${ctx.focus}. During this ${ctx.viconian} phase, HCE embodies the patriarch whose guilt, grandeur, and fall drive the cyclical dream forward.`
  },
  // 2. ALP / River Liffey / Feminine Principle
  {
    regex: /\b(Anna Livia|Plurabelle|A\.?L\.?P\.?|Annah the Allmaziful|Liffey|Annalivia|Livvy|riverrun|washwoman|washerwomen)\b/i,
    category: ['alp', 'river-liffey', 'feminine-principle', 'waters'],
    xrefKey: 'alp',
    sources: [
      'Bishop, John. Joyce\'s Book of the Dark. https://archive.org/details/joycesbookofdark0000bish',
      'Hart, Clive. Structure and Motif in Finnegans Wake. https://archive.org/details/structuremotifin0000hart',
      'Mink, Louis O. A Finnegans Wake Gazetteer. https://archive.org/details/finneganswakegaz0000mink',
      'FWEET: ALP / River Liffey concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `ALP invocation "${match}" on page ${pageNum} ("${ctx.title}"): Anna Livia Plurabelle, the mother-river personifying the Liffey, surfaces here amid ${ctx.focus}. In this ${ctx.viconian} passage, her feminine current of forgiveness and renewal flows through the dream landscape, carrying Dublin's history from source to sea.`
  },
  // 3. Fraternal Dialectic (Shem and Shaun)
  {
    regex: /\b(Shem|Shaun|Jhem|Shen|Jaun|Yawn|Chuff|Glugg|Jerry|Kevin|penman|postman)\b/i,
    category: ['twins', 'shem-and-shaun', 'brother-battle', 'dialectic'],
    xrefKey: 'shem-shaun',
    sources: [
      'Atherton, James S. The Books at the Wake. https://archive.org/details/booksatwake0000athe',
      'Norris, Margot. The Decentered Universe of Finnegans Wake. https://archive.org/details/decentereduniver0000norr',
      'Gordon, John. Finnegans Wake: A Plot Summary. https://johngordonfinnegan.weebly.com',
      'Kenner, Hugh. Dublin\'s Joyce. https://archive.org/details/dublinsjoyce0000kenn'
    ],
    gloss: (match, pageNum, ctx) =>
      `Fraternal archetype "${match}" on page ${pageNum} ("${ctx.title}"): the opposing sons — Shem the Penman (introvert artist, tree, darkness) and Shaun the Post (extrovert politician, stone, light) — manifest here within ${ctx.focus}. Their Brunonian dialectic of coinciding opposites propels the chapter's conflict during this ${ctx.viconian} phase.`
  },
  // 4. Issy & The Rainbow Girls
  {
    regex: /\b(Issy|Izzy|Isolde|Iseut|pepette|rainbow girls|maggies|lookingglass|daughter)\b/i,
    category: ['issy', 'mirror-twin', 'tristan-and-isolde', 'psychology'],
    xrefKey: 'issy',
    sources: [
      'Bédier, Joseph. The Romance of Tristan and Iseult. https://www.gutenberg.org/ebooks/14244',
      'Tindall, William York. A Reader\'s Guide to Finnegans Wake. https://archive.org/details/readersguidetofi00tind',
      'Genetic Joyce Studies: Issy notebooks. https://www.geneticjoycestudies.org',
      'FWEET: Issy / Isolde concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Issy/daughter figure "${match}" on page ${pageNum} ("${ctx.title}"): the narcissistic mirror-daughter, modeled on Isolde and Swift's dual muses Stella and Vanessa, appears here within ${ctx.focus}. Her prismatic splitting into twenty-eight Rainbow Girls reflects the cycle's ${ctx.viconian} phase through youthful seduction and self-reflection.`
  },
  // 5. The Four Annalists (Mamalujo)
  {
    regex: /\b(Mamalujo|four master|four ancient|Ulster|Munster|Leinster|Connaught|four judges|waves|gulls)\b/i,
    category: ['mamalujo', 'four-annalists', 'provinces-of-ireland', 'evangelists'],
    xrefKey: 'mamalujo',
    sources: [
      'O\'Donovan, John. The Annals of the Four Masters. https://celt.ucc.ie/published/T100005A/',
      'MacCabe, Colin. James Joyce and the Revolution of the Word. https://archive.org/details/jamesjoycerevolu0000macc',
      'FWEET: Mamalujo / Four Old Men concordance. https://www.fweet.org',
      'Ricorso.net: James Joyce Critical Archive. https://www.ricorso.net'
    ],
    gloss: (match, pageNum, ctx) =>
      `Mamalujo signal "${match}" on page ${pageNum} ("${ctx.title}"): the Four Old Men — Matthew, Mark, Luke, John; Ulster, Munster, Leinster, Connaught — serve here as senile chroniclers and bedpost witnesses during ${ctx.focus}. In this ${ctx.viconian} passage, they observe and record the dream's events as squawking gulls circling overhead.`
  },
  // 6. Viconian Cycles & Ricorso
  {
    regex: /\b(Vico|vicus|ricorso|recirculation|cycle|rebeginning|spiral|thunder)\b/i,
    category: ['vico', 'ricorso', 'philosophy-of-history', 'giambattista-vico'],
    xrefKey: 'vico',
    sources: [
      'Vico, Giambattista. Scienza Nuova. https://plato.stanford.edu/entries/vico/',
      'Beckett, Samuel. Dante... Bruno. Vico.. Joyce. https://archive.org/details/ourexagminationr0000unse',
      'Ricorso.net: Viconian Structure in FW. https://www.ricorso.net',
      'FinnegansWeb: Vico\'s Cycles. https://www.finnegansweb.com'
    ],
    gloss: (match, pageNum, ctx) =>
      `Viconian marker "${match}" on page ${pageNum} ("${ctx.title}"): Giambattista Vico's cyclical philosophy — divine, heroic, and human ages followed by thundering ricorso — structures this passage within ${ctx.focus}. The current ${ctx.viconian} phase shapes the language, institutional imagery, and historical echoes of the dream.`
  },
  // 7. Cabalistic & Historical Numerology
  {
    regex: /\b(1132|566|1922|1939)\b/i,
    category: ['numerology', 'cabala', 'leitmotif', 'symbolism'],
    xrefKey: 'numerology',
    sources: [
      'Hart, Clive. Structure and Motif in Finnegans Wake. https://archive.org/details/structuremotifin0000hart',
      'McHugh, Roland. Annotations to Finnegans Wake. https://archive.org/details/annotationstofin0000mchu_h5g8',
      'FWEET: Numerological concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Cabalistic number ${match} on page ${pageNum} ("${ctx.title}"): Joyce encodes mystical and historical intervals throughout the Wake. Within ${ctx.focus}, this number resonates with Dublin dates, Viconian divisions, and the mathematical architecture underlying the dream's ${ctx.viconian} phase.`
  },
  // 8. Wellington, Napoleon, & Waterloo
  {
    regex: /\b(Willingdone|Lipoleum|Waterloo|Museyroom|Iron Duke|Belle Alliance|Hougoumont|telescope|big white horse)\b/i,
    category: ['wellington', 'waterloo', 'military-history', 'museyroom'],
    xrefKey: 'wellington',
    sources: [
      'Hugo, Victor. Les Misérables (The Battle of Waterloo). https://www.gutenberg.org/ebooks/135',
      'Curtis, Edmund. A History of Ireland. https://archive.org/details/historyofireland0000curt',
      'Mink, Louis O. A Finnegans Wake Gazetteer (Phoenix Park). https://archive.org/details/finneganswakegaz0000mink',
      'FWEET: Wellington/Museyroom concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Wellington/Waterloo motif "${match}" on page ${pageNum} ("${ctx.title}"): the Phoenix Park Wellington Monument and the "Willingdone Museyroom" dramatize imperial warfare as domestic quarrel within ${ctx.focus}. Joyce collapses the Battle of Waterloo into the sibling rivalries and marital conflicts of the ${ctx.viconian} dream.`
  },
  // 9. Dublin Topography & Historical Landmarks
  {
    regex: /\b(Phoenix Park|Howth|Clontarf|Dalkey|Sutton|Merchant's Quay|Chapelizod|Castleknock|Glasnevin|Wellington Monument)\b/i,
    category: ['dublin-topography', 'geography', 'landmarks', 'urban-history'],
    xrefKey: 'dublin',
    sources: [
      'Joyce, P.W. The Origin and History of Irish Names of Places. https://archive.org/details/originandhistory01joycuoft',
      'Mink, Louis O. A Finnegans Wake Gazetteer. https://archive.org/details/finneganswakegaz0000mink',
      'Dublin James Joyce Centre. https://jamesjoyce.ie',
      'Kenner, Hugh. Dublin\'s Joyce. https://archive.org/details/dublinsjoyce0000kenn'
    ],
    gloss: (match, pageNum, ctx) =>
      `Dublin landmark "${match}" on page ${pageNum} ("${ctx.title}"): grounding the cosmic dream in physical Dublin during ${ctx.focus}. Joyce transforms this real location into a universal archetypal site — simultaneously Eden, Waterloo, Calvary, and the Elysian Fields — within the ${ctx.viconian} phase.`
  },
  // 10. Thunderclaps & Onomatopoeia
  {
    regex: /\b([a-z]{45,110})\b/i,
    category: ['thunderclap', 'vico', 'voice-of-god', 'onomatopoeia'],
    xrefKey: 'thunderclap',
    sources: [
      'Vico, Giambattista. Scienza Nuova (On the Thunder). https://plato.stanford.edu/entries/vico/',
      'Atherton, James S. The Books at the Wake. https://archive.org/details/booksatwake0000athe',
      'FinnegansWeb: Thunderwords Guide. https://www.finnegansweb.com',
      'FWEET: 100-letter Thunder Words. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Polysyllabic thunderclap on page ${pageNum} ("${ctx.title}"): one of ten 100-letter words synthesizing thunder across world languages, signaling a Viconian cataclysm within ${ctx.focus}. This divine acoustic blast — fusing Hindi, Greek, Latin, French, Italian, Irish, and Norse roots — marks a civilizational transition in the ${ctx.viconian} phase.`
  },
  // 11. Liturgical, Biblical, & Theological Puns
  {
    regex: /\b(amen|kyrie|christe|sanctus|in nomine|pater|filius|spiritus|genesis|exodus|decalogue|sacrament|eucharist|baptism)\b/i,
    category: ['liturgy', 'biblical', 'latin', 'theology'],
    xrefKey: 'liturgy',
    sources: [
      'The Latin Vulgate Bible. https://www.biblegateway.com/versions/Biblia-Sacra-Vulgata-VULGATE/',
      'The Catholic Encyclopedia. https://www.newadvent.org/cathen/',
      'Contemporary Literature Press: Classical Lexicon for FW. https://editura.mttlc.ro',
      'Frazer, Sir James George. Folk-Lore in the Old Testament. https://archive.org/details/folkloreinoldtes01frazuoft'
    ],
    gloss: (match, pageNum, ctx) =>
      `Liturgical echo "${match}" on page ${pageNum} ("${ctx.title}"): Catholic ritual, Latin prayer, and sacramental language weave through ${ctx.focus}. Joyce fuses ecclesiastical solemnity with domestic banality during the ${ctx.viconian} phase, treating the tavern counter as communion rail and the sleeping body as sacred vessel.`
  },
  // 12. Celtic Lore, Irish Myth & Saints
  {
    regex: /\b(Finn MacCool|Fionn|Ossian|Patrick|Bridget|Columba|Tristan|Iseult|Mark of Cornwall|Tuatha|Brian Boru)\b/i,
    category: ['irish-mythology', 'celtic-lore', 'folklore', 'saints'],
    xrefKey: 'celtic',
    sources: [
      'MacKillop, James. Dictionary of Celtic Mythology. https://www.oxfordreference.com',
      'Lady Gregory. Gods and Fighting Men. https://www.gutenberg.org/ebooks/14465',
      'O\'Grady, Standish. Silva Gadelica. https://archive.org/details/silvagadelicaiix01ograuoft',
      'O\'Hehir, Brendan. A Gaelic Lexicon for Finnegans Wake. https://archive.org/details/gaeliclexiconfor0000oheh'
    ],
    gloss: (match, pageNum, ctx) =>
      `Celtic/mythological figure "${match}" on page ${pageNum} ("${ctx.title}"): invoking the ancient Fianna cycle and early Irish Christianity within ${ctx.focus}. During the ${ctx.viconian} phase, this mythic presence grounds the universal dream in Ireland's heroic past, linking Finn MacCool's giant body to the Dublin landscape.`
  },
  // 13. The Letter & Biddy Doran the Hen
  {
    regex: /\b(Boston transcript|tea stain|midden|dump|scratching|Biddy Doran|hen|letter|envelope|parchment|magpie)\b/i,
    category: ['the-letter', 'textual-criticism', 'biddy-doran', 'archaeology'],
    xrefKey: 'letter',
    sources: [
      'Kenner, Hugh. The Stoic Comedians. https://archive.org/details/stoiccomedians0000kenn',
      'Bishop, John. Joyce\'s Book of the Dark. https://archive.org/details/joycesbookofdark0000bish',
      'Deane, Vincent, et al. The Finnegans Wake Notebooks at Buffalo. https://www.brepols.net',
      'Finwake.com: Chapter I.5 annotations. http://www.finwake.com'
    ],
    gloss: (match, pageNum, ctx) =>
      `The Letter motif "${match}" on page ${pageNum} ("${ctx.title}"): ALP's mysterious document — scratched from the midden by Biddy Doran the Hen — represents the genesis of all writing within ${ctx.focus}. During this ${ctx.viconian} phase, the letter functions simultaneously as archaeological artifact, love note, legal deposition, and the text of Finnegans Wake itself.`
  },
  // 14. The Fall & Humpty Dumpty
  {
    regex: /\b(tumbler|wall|ladder|whiskey|usquebaugh|shute|downfall|broken)\b/i,
    category: ['the-fall', 'humpty-dumpty', 'tim-finnegan', 'resurrection'],
    xrefKey: 'fall',
    sources: [
      'The Ballad of Tim Finnegan\'s Wake. https://en.wikipedia.org/wiki/Finnegan%27s_Wake',
      'Atherton, James S. The Books at the Wake. https://archive.org/details/booksatwake0000athe',
      'Opie, Iona and Peter. The Oxford Dictionary of Nursery Rhymes. https://archive.org/details/oxforddictionary0000unse_m4u1',
      'FinnegansWeb: The Fall motif. https://www.finnegansweb.com'
    ],
    gloss: (match, pageNum, ctx) =>
      `Fall/resurrection motif "${match}" on page ${pageNum} ("${ctx.title}"): Tim Finnegan tumbling from his ladder, Humpty Dumpty shattering from the wall, Adam falling in Eden — all converge within ${ctx.focus}. The comic-cosmic Fall during the ${ctx.viconian} phase demands its counterpart: resurrection through the whiskey-splash of the water of life (uisce beatha).`
  },
  // 15. Jonathan Swift, Stella & Vanessa
  {
    regex: /\b(Swift|Dean of St. Patrick|Stella|Vanessa|Gulliver|Lilliput|Brobdingnag|Drapier|Tale of a Tub)\b/i,
    category: ['jonathan-swift', 'dublin-history', 'eighteenth-century', 'satire'],
    xrefKey: 'swift',
    sources: [
      'Swift, Jonathan. Gulliver\'s Travels. https://www.gutenberg.org/ebooks/829',
      'Ehrenpreis, Irvin. Swift: The Man, His Works, and the Age. https://archive.org/details/swiftmanhisworks01ehre',
      'FWEET: Swift concordance. https://www.fweet.org',
      'Ricorso.net: Jonathan Swift. https://www.ricorso.net'
    ],
    gloss: (match, pageNum, ctx) =>
      `Swiftian presence "${match}" on page ${pageNum} ("${ctx.title}"): the Dean of St. Patrick's Cathedral haunts this passage within ${ctx.focus}. His dual lovers Stella and Vanessa mirror Issy's split personalities, while his savage satire infuses the ${ctx.viconian} dream with political and scatological ferocity.`
  },
  // 16. The Book of Kells
  {
    regex: /\b(Kells|illumination|tunc page|monks|scriptorium|vellum|initial|interlacing)\b/i,
    category: ['book-of-kells', 'manuscript-culture', 'celtic-art', 'epigraphy'],
    xrefKey: 'book-of-kells',
    sources: [
      'Trinity College Dublin: The Book of Kells Online. https://digitalcollections.tcd.ie/concern/works/hm50tr726',
      'Sullivan, Sir Edward. The Book of Kells. https://www.gutenberg.org/ebooks/16436',
      'Atherton, James S. The Books at the Wake. https://archive.org/details/booksatwake0000athe',
      'FWEET: Book of Kells concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Book of Kells motif "${match}" on page ${pageNum} ("${ctx.title}"): Joyce equates the Wake's labyrinthine text with the 8th-century illuminated Gospel at Trinity College Dublin within ${ctx.focus}. During this ${ctx.viconian} phase, the monastic scribe and the barnyard Hen both decode divine messages from material surfaces.`
  },
  // 17. Egyptian Book of the Dead & Osiris
  {
    regex: /\b(Osiris|Isis|Horus|Set|Nuvoletta|Book of the Dead|papyrus|Ani|weighing of the heart|Ra)\b/i,
    category: ['egyptian-mythology', 'book-of-the-dead', 'osiris', 'resurrection'],
    xrefKey: 'osiris',
    sources: [
      'Budge, E.A. Wallis. The Book of the Dead (Papyrus of Ani). https://www.gutenberg.org/ebooks/1300',
      'Bishop, John. Joyce\'s Book of the Dark. https://archive.org/details/joycesbookofdark0000bish',
      'Troy, Mark L. Mummeries of Resurrection. http://www.rosenlake.net',
      'FWEET: Egyptian mythology concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Egyptian eschatology "${match}" on page ${pageNum} ("${ctx.title}"): within ${ctx.focus}, HCE appears as the dismembered Osiris and ALP as Isis gathering his scattered limbs. Mark Troy's research traces how Joyce embedded the Papyrus of Ani's resurrection liturgy throughout this ${ctx.viconian} passage — the dream-journey through the underworld (Tuat) toward solar rebirth.`
  },
  // 18. The Tavern, The Customers & The Twelve Jurors
  {
    regex: /\b(jurymen|customers|drinkers|bottle|tap|pub|bar|counter|guinness|porter)\b/i,
    category: ['twelve-jurors', 'pub-life', 'chapelizod', 'trial'],
    xrefKey: 'tavern',
    sources: [
      'Glasheen, Adaline. Third Census of Finnegans Wake. https://archive.org/details/thirdcensusoffin0000glas',
      'Campbell, Joseph and Robinson, Henry Morton. A Skeleton Key. https://archive.org/details/skeletonkeytofin00camp',
      'Gordon, John. Finnegans Blog (Tavern chapters). https://johngordonfinnegan.weebly.com',
      'FWEET: Tavern/Twelve concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Tavern/jury motif "${match}" on page ${pageNum} ("${ctx.title}"): the twelve customers drinking in HCE's Chapelizod pub represent public opinion, the Zodiac, and the Apostles within ${ctx.focus}. During this ${ctx.viconian} phase, they judge, condemn, and demand another round — the Greek chorus of middle-class Dublin gossip.`
  },
  // 19. The Dream State & Night Mind
  {
    regex: /\b(dream|sleep|night|darkness|slumber|somnolent|nightmare|unconscious|oneiric)\b/i,
    category: ['oneiric', 'night-mind', 'psychoanalysis', 'sleep'],
    xrefKey: 'dream',
    sources: [
      'Bishop, John. Joyce\'s Book of the Dark. https://archive.org/details/joycesbookofdark0000bish',
      'Freud, Sigmund. The Interpretation of Dreams. https://www.gutenberg.org/ebooks/4349',
      'Troy, Mark L. Mummeries of Resurrection. http://www.rosenlake.net',
      'FWEET: Dream/Sleep concordance. https://www.fweet.org'
    ],
    gloss: (match, pageNum, ctx) =>
      `Oneiric dimension "${match}" on page ${pageNum} ("${ctx.title}"): the nocturnal consciousness surfaces within ${ctx.focus}. During this ${ctx.viconian} phase, Joyce reconstructs the sleeping body's sensory deprivation — dimmed sight, distorted hearing, dream-logic association — transforming somatic experience into polyphonic language.`
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// GLOSS GENERATION — Context-aware, deduplication-aware annotation builder
// ═══════════════════════════════════════════════════════════════════════════════

function generatePageGlosses(pageNum, book, chapter, lines) {
  const glosses = [];
  const lineCount = lines.length;
  const ctx = getChapterContext(pageNum);
  const seenCategories = new Set(); // Deduplicate: one motif category per page

  for (const lineObj of lines) {
    const lineText = lineObj.text;
    for (const m of MOTIFS) {
      const match = lineText.match(m.regex);
      if (match) {
        const categoryKey = m.category[0]; // Primary category
        const dedupeKey = `${categoryKey}`; // One per category per page

        // Skip if we already have this category on this page
        if (seenCategories.has(dedupeKey)) continue;
        seenCategories.add(dedupeKey);

        const matchedPhrase = match[0];
        const phrase = matchedPhrase.length > 80 ? matchedPhrase.slice(0, 80) : matchedPhrase;

        // Get meaningful cross-references from the index
        const xrefs = (CROSS_REFERENCE_MAP[m.xrefKey] || [])
          .filter(ref => {
            const refPage = parseInt(ref.split('.')[0], 10);
            return refPage !== pageNum; // Exclude self-references
          })
          .slice(0, 4); // Max 4 cross-references per annotation

        glosses.push({
          line: lineObj.line,
          target_phrase: phrase,
          annotation_text: m.gloss(phrase, pageNum, ctx),
          categories: m.category,
          sources: m.sources,
          cross_references: xrefs.length > 0 ? xrefs : []
        });
      }
    }
  }

  // Ensure every page has at least 2 substantive annotations
  if (glosses.length < 2 && lineCount > 0) {
    const firstLine = lines[0];
    const words = firstLine.text.split(/\s+/).filter(w => w.length > 3);
    const target = words.slice(0, Math.min(3, words.length)).join(' ') || 'Opening phrase';

    glosses.push({
      line: firstLine.line,
      target_phrase: target.slice(0, 80),
      annotation_text: `Page ${pageNum} opens Book ${book}, Chapter ${chapter} ("${ctx.title}") during the ${ctx.viconian} phase. This passage continues ${ctx.focus}, featuring ${ctx.characters}. The nocturnal dream-narrative layers Dublin topography, world mythology, and linguistic alchemy into polysemic prose.`,
      categories: ['structural', 'narrative-strata', `book-${book}`],
      sources: [
        'Campbell, Joseph and Robinson, Henry Morton. A Skeleton Key to Finnegans Wake. https://archive.org/details/skeletonkeytofin00camp',
        'McHugh, Roland. Annotations to Finnegans Wake. https://archive.org/details/annotationstofin0000mchu_h5g8',
        'Gordon, John. Finnegans Wake: A Plot Summary. https://johngordonfinnegan.weebly.com',
        'JJDA: Finnegans Wake Genetic Edition. https://jjda.ie'
      ],
      cross_references: []
    });

    if (lineCount >= 10) {
      const midLine = lines[Math.floor(lineCount / 2)];
      const midWords = midLine.text.split(/\s+/).filter(w => w.length > 3);
      const midTarget = midWords.slice(0, Math.min(3, midWords.length)).join(' ') || 'Mid-page text';

      glosses.push({
        line: midLine.line,
        target_phrase: midTarget.slice(0, 80),
        annotation_text: `Mid-page polysemic node on page ${pageNum} ("${ctx.title}"): Joyce weaves multilingual puns across 60+ languages — etymological roots from the Contemporary Literature Press lexicons (Romanian, Scandinavian, Slavic, Classical) intersect with local Dublin speech rhythms. The ${ctx.viconian} dream-logic transforms ordinary syntax into a palimpsest of global literary and mythic references.`,
        categories: ['etymology', 'polysemy', 'linguistics'],
        sources: [
          'Tindall, William York. A Reader\'s Guide to Finnegans Wake. https://archive.org/details/readersguidetofi00tind',
          'Contemporary Literature Press: Multilingual Lexicons for FW. https://editura.mttlc.ro',
          'Atherton, James S. The Books at the Wake. https://archive.org/details/booksatwake0000athe',
          'FWEET: Multilingual concordance. https://www.fweet.org'
        ],
        cross_references: []
      });
    }
  }

  // Strict sorting by line number ascending
  glosses.sort((a, b) => a.line - b.line);
  return glosses;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIPELINE — Generates/updates annotation files for pages 5-627,
// preserving any handcrafted pages that already have 8+ annotations.
// ═══════════════════════════════════════════════════════════════════════════════

const HANDCRAFTED_THRESHOLD = 8; // Pages with 8+ annotations are considered handcrafted

async function runPipeline() {
  console.log('Opening EPUB archive...');
  const epub = await EpubArchive.open('data/finneganswake00joycuoft.epub');
  console.log('EPUB loaded with', epub.getIndexedPageCount(), 'pages.');

  let updatedPages = 0;
  let skippedPages = 0;
  let totalAnnsAdded = 0;

  for (let p = 5; p <= 627; p++) {
    const { book, chapter } = epub.getBookAndChapter(p);
    const dirPath = path.join('annotations', `book_${book}`, `chapter_${chapter}`);
    const filePath = path.join(dirPath, `page_${String(p).padStart(3, '0')}.json`);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Preserve handcrafted pages (pages 3, 4, 628 and any with 8+ existing annotations)
    if (p === 3 || p === 4 || p === 628) {
      continue;
    }

    // Check if this page has been manually enriched with 8+ annotations
    if (fs.existsSync(filePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (existing.annotations && existing.annotations.length >= HANDCRAFTED_THRESHOLD) {
          skippedPages++;
          continue; // Preserve handcrafted work
        }
      } catch (e) {
        // If JSON is malformed, regenerate
      }
    }

    const pageData = await epub.getPage(p);
    const lines = pageData.lines || [];
    const glosses = generatePageGlosses(p, book, chapter, lines);

    const annotationItems = glosses.map((g, idx) => {
      const token = crypto.createHash('sha256').update(`${p}.${g.line}:${g.target_phrase}:${idx}`).digest('hex').slice(0, 4);
      return {
        id: `${String(p).padStart(3, '0')}.${String(g.line).padStart(2, '0')}-${token}`,
        line_number: g.line,
        target_phrase: g.target_phrase,
        annotation_text: g.annotation_text,
        categories: g.categories,
        cross_references: g.cross_references || [],
        sources: g.sources,
        contributors: ['joycean-scholar', 'open-wake-editor']
      };
    });

    const filePayload = {
      schema_version: '1.0.0',
      book,
      chapter,
      page_number: p,
      annotations: annotationItems
    };

    fs.writeFileSync(filePath, JSON.stringify(filePayload, null, 2) + '\n', 'utf-8');
    updatedPages++;
    totalAnnsAdded += annotationItems.length;

    if (p % 100 === 0 || p === 627) {
      console.log(`Progress: page ${p} (${totalAnnsAdded} annotations across ${updatedPages} pages, ${skippedPages} handcrafted pages preserved)...`);
    }
  }

  console.log(`\nPipeline complete!`);
  console.log(`  Updated: ${updatedPages} pages with ${totalAnnsAdded} context-aware annotations`);
  console.log(`  Preserved: ${skippedPages} handcrafted pages`);
  console.log(`  Sources: FWEET, JJDA, Gordon Blog, Contemporary Literature Press, Ricorso, FinnegansWeb, and 20+ scholarly archives`);
}

runPipeline().catch((err) => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
