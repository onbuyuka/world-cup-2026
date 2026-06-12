// ---------------------------------------------------------------------------
// Lightweight i18n. Every user-facing string lives here with its English and
// Turkish form side by side (so the two can't drift). Components translate via
// the `useT()` hook in settingsStore; pure helpers call `translate(lang, …)`.
//
// Interpolation: tokens like {n} in a string are replaced from the `vars` map.
// Proper nouns (team, player, club, coach, city and stadium names) are NOT
// translated — only UI chrome is.
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'tr';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
];

interface Entry {
  en: string;
  tr: string;
}

const S = {
  // Nav + brand
  'nav.bracket': { en: 'Bracket', tr: 'Tahmin' },
  'nav.teams': { en: 'Teams', tr: 'Takımlar' },
  'nav.calendar': { en: 'Calendar', tr: 'Takvim' },
  'brand.subtitle': { en: 'Bracket Predictor', tr: 'Tahmin Oyunu' },

  // Footer
  'footer.line1': {
    en: 'FIFA World Cup 2026 · 11 Jun – 19 Jul 2026 · Kickoff times shown in {zone} ({short}).',
    tr: 'FIFA Dünya Kupası 2026 · 11 Haz – 19 Tem 2026 · Başlama saatleri {zone} ({short}) saatine göre.',
  },
  'footer.localTime': { en: 'your local time', tr: 'yerel saatin' },
  'footer.line2pre': {
    en: 'Live starting XIs & player photos via ',
    tr: 'Canlı 11’ler ve oyuncu fotoğrafları ',
  },
  'footer.line2post': {
    en: '. An independent fan project — not affiliated with FIFA.',
    tr: ' üzerinden. Bağımsız bir taraftar projesi — FIFA ile bağlantılı değildir.',
  },
  'footer.language': { en: 'Language', tr: 'Dil' },
  'tz.yourTime': { en: 'Your time', tr: 'Yerel saatiniz' },

  // Bracket page
  'bracket.title': {
    en: 'Build your World Cup 2026 bracket',
    tr: '2026 Dünya Kupası tahminini oluştur',
  },
  'bracket.desc': {
    en: 'Set each group’s final standings, choose the eight best third-placed teams that advance, then pick your way through the knockout rounds. Hover any team for kits, recent form and a link to its live starting XI. Your picks are saved in this browser.',
    tr: 'Her grubun final sıralamasını belirle, gruptan çıkan en iyi sekiz üçüncüyü seç, sonra eleme turlarında ilerleyerek yolunu çiz. Formalar, son form ve canlı 11 bağlantısı için bir takımın üzerine gel. Seçimlerin bu tarayıcıda kaydedilir.',
  },
  'bracket.groupStage': { en: 'Group stage', tr: 'Grup aşaması' },
  'bracket.knockoutStage': { en: 'Knockout stage', tr: 'Eleme aşaması' },

  // Shared-bracket banner
  'shared.banner': {
    en: 'You’re viewing a shared bracket. Your own saved bracket is untouched.',
    tr: 'Paylaşılan bir tahmini görüntülüyorsun. Kendi kayıtlı tahminin değişmedi.',
  },
  'shared.saveAsMine': { en: 'Save as my bracket', tr: 'Tahminim olarak kaydet' },
  'shared.backToMine': { en: 'Back to mine', tr: 'Kendi tahminime dön' },

  // Live toggle
  'live.on': { en: 'Live results: ON', tr: 'Canlı sonuçlar: AÇIK' },
  'live.off': { en: 'Live results: OFF', tr: 'Canlı sonuçlar: KAPALI' },
  'live.loading': { en: 'loading…', tr: 'yükleniyor…' },
  'live.noResults': { en: 'no results yet', tr: 'henüz sonuç yok' },
  'live.live': { en: 'live', tr: 'canlı' },
  'live.updated': { en: 'updated {time}', tr: 'güncellendi {time}' },
  'live.autoUpdating': { en: '🔴 live · auto-updating', tr: '🔴 canlı · otomatik güncelleniyor' },
  'live.titleOn': {
    en: 'Order groups by real World Cup points',
    tr: 'Grupları gerçek Dünya Kupası puanlarına göre sırala',
  },
  'live.titleOff': {
    en: 'Switch to the live points view (everyone on 0 until games are played)',
    tr: 'Canlı puan görünümüne geç (maçlar oynanana kadar herkes 0)',
  },

  // Toolbar
  'toolbar.thirds': { en: 'Best third-placed teams: {n}/8', tr: 'En iyi üçüncüler: {n}/8' },
  'toolbar.reset3rds': { en: 'Reset 3rds ↺', tr: '3.leri sıfırla ↺' },
  'toolbar.resetBracket': { en: 'Reset bracket', tr: 'Tahmini sıfırla' },
  'toolbar.reset3rdsTitle': {
    en: 'Discard your what-if 3rd-placed picks and snap back to the real best 8',
    tr: 'Senaryo üçüncü seçimlerini bırak ve gerçek en iyi 8’e dön',
  },
  'hint.liveCustom': {
    en: 'Live: you’ve hand-picked which 3rd-placed teams advance. Reset to snap back to the real best 8.',
    tr: 'Canlı: hangi üçüncülerin geçeceğini elle seçtin. Gerçek en iyi 8’e dönmek için sıfırla.',
  },
  'hint.liveAuto': {
    en: 'Live: the 8 best 3rd-placed teams are auto-selected from real results. Tap “3rd ✓/＋” for “what-if” changes — your prediction stays separate.',
    tr: 'Canlı: en iyi 8 üçüncü gerçek sonuçlara göre otomatik seçilir. Senaryo için “3.✓/＋”ye dokun — tahminin ayrı kalır.',
  },
  'hint.liveGroups': {
    en: 'Live mode tracks real results automatically. You can still tweak for “what-if” scenarios.',
    tr: 'Canlı mod gerçek sonuçları otomatik izler. Yine de “senaryo” için değişiklik yapabilirsin.',
  },
  'hint.complete': {
    en: 'All eight third-placed qualifiers chosen — the Round of 32 is set.',
    tr: 'Sekiz üçüncü de seçildi — Son 32 hazır.',
  },
  'hint.pick': {
    en: 'Tap “3rd +” on third-placed teams until you have eight; they slot into the Round of 32 per FIFA’s rules.',
    tr: 'Sekiz olana kadar üçüncü takımlarda “3.+”ya dokun; FIFA kurallarına göre Son 32’ye yerleşirler.',
  },

  // Group card
  'group.label': { en: 'Group {id}', tr: 'Grup {id}' },
  'group.dragReorder': { en: 'drag to reorder', tr: 'sürükleyerek sırala' },
  'group.liveDrag': { en: '● Live · drag for what-if', tr: '● Canlı · senaryo için sürükle' },
  'group.customReset': { en: '✎ custom · reset ↺', tr: '✎ özel · sıfırla ↺' },
  'group.customResetTitle': {
    en: 'Discard your what-if order and snap back to live results',
    tr: 'Senaryo sıralamanı bırak ve canlı sonuçlara dön',
  },
  'group.third': { en: '3rd +', tr: '3.+' },
  'group.thirdSel': { en: '3rd ✓', tr: '3.✓' },
  'group.thirdTitle': {
    en: 'Advance this third-placed team to the Round of 32',
    tr: 'Bu üçüncü takımı Son 32’ye taşı',
  },
  'group.thirdFull': {
    en: 'You already chose 8 best third-placed teams',
    tr: 'Zaten en iyi 8 üçüncüyü seçtin',
  },
  'group.ptsUnit': { en: 'pts', tr: 'p' },
  'group.thirdPlaceLabel': { en: '3rd place: ', tr: '3.: ' },
  'group.advancing': { en: ' — advancing', tr: ' — geçiyor' },
  'group.provTooltip': {
    en: 'Provisional — {n} match in progress · Played {pld} · GD {gd}',
    tr: 'Geçici — {n} maç sürüyor · Oynanan {pld} · Averaj {gd}',
  },
  'group.playedTooltip': {
    en: 'Played {pld} · GD {gd}',
    tr: 'Oynanan {pld} · Averaj {gd}',
  },
  'group.dragRowAria': { en: 'Drag {team} to reorder', tr: '{team} takımını sürükleyerek sırala' },
  'group.dragTitle': { en: 'Drag to reorder', tr: 'Sürükleyerek sırala' },

  // Knockout
  'ko.r32': { en: 'Round of 32', tr: 'Son 32' },
  'ko.r16': { en: 'Round of 16', tr: 'Son 16' },
  'ko.qf': { en: 'Quarter-finals', tr: 'Çeyrek final' },
  'ko.sf': { en: 'Semi-finals', tr: 'Yarı final' },
  'ko.final': { en: 'Final', tr: 'Final' },
  'ko.thirdPlace': { en: 'Third-place', tr: 'Üçüncülük' },
  'champ.predicted': { en: 'Your predicted champion', tr: 'Tahmini şampiyonun' },
  'champ.prompt': {
    en: 'Pick winners through the bracket to crown your champion 🏆',
    tr: 'Şampiyonunu belirlemek için eşleşmelerde kazananları seç 🏆',
  },

  // Slot labels (unresolved knockout slots)
  'slot.winner': { en: 'Winner {group}', tr: 'Kazanan {group}' },
  'slot.runnerUp': { en: '2nd {group}', tr: '2. {group}' },
  'slot.third': { en: '3rd {groups}', tr: '3. {groups}' },
  'slot.matchWinner': { en: 'Winner M{n}', tr: 'M{n} galibi' },
  'slot.matchLoser': { en: 'Loser M{n}', tr: 'M{n} mağlubu' },

  // Scorecard
  'score.toggleOpen': { en: 'Score my bracket', tr: 'Tahminimi puanla' },
  'score.toggleClose': { en: 'Hide score', tr: 'Puanı gizle' },
  'score.title': { en: 'Your bracket score', tr: 'Tahmin puanın' },
  'score.noResults': { en: 'pts — no results yet', tr: 'puan — henüz sonuç yok' },
  'score.soFar': { en: '/ {n} so far', tr: '/ {n} şu ana dek' },
  'score.groups': { en: 'Groups', tr: 'Gruplar' },
  'score.thirds': { en: '3rds', tr: '3.ler' },
  'score.knockout': { en: 'Knockout', tr: 'Eleme' },
  'score.correct': { en: 'Correct', tr: 'Doğru' },
  'score.help': { en: 'How scoring works', tr: 'Puanlama nasıl işler' },
  'score.helpIntro': {
    en: 'Your prediction is graded against real results. Points are awarded only for outcomes that have actually been decided, so your score climbs as the tournament unfolds. The “/ N so far” figure is the most you could have earned from decided matches — so any two brackets stay directly comparable.',
    tr: 'Tahminin gerçek sonuçlara göre puanlanır. Puanlar yalnızca kesinleşen sonuçlar için verilir, böylece turnuva ilerledikçe puanın artar. “/ N şu ana dek” değeri, kesinleşen maçlardan kazanabileceğin en yüksek puandır — böylece iki tahmin her zaman doğrudan karşılaştırılabilir.',
  },
  'score.helpFootnote': {
    en: 'Knockout points are awarded per round for each team you correctly predicted to reach the next stage — deeper rounds are worth more, and naming the champion is the biggest prize.',
    tr: 'Eleme puanları, bir sonraki tura çıkacağını doğru tahmin ettiğin her takım için tur tur verilir — ileri turlar daha değerlidir ve şampiyonu bilmek en büyük ödüldür.',
  },
  'scoreRow.groupWinner': { en: 'Correct group winner', tr: 'Doğru grup birincisi' },
  'scoreRow.groupRunnerUp': { en: 'Correct group runner-up', tr: 'Doğru grup ikincisi' },
  'scoreRow.thirdAdvances': {
    en: 'Best third-placed team that advances',
    tr: 'Gruptan çıkan en iyi üçüncü',
  },
  'scoreRow.r32': { en: 'Round of 32 — team advances', tr: 'Son 32 — takım turu geçer' },
  'scoreRow.r16': { en: 'Round of 16 — team advances', tr: 'Son 16 — takım turu geçer' },
  'scoreRow.qf': { en: 'Quarter-final — team advances', tr: 'Çeyrek final — takım turu geçer' },
  'scoreRow.sf': { en: 'Semi-final — team advances', tr: 'Yarı final — takım turu geçer' },
  'scoreRow.thirdPlace': { en: 'Third-place play-off winner', tr: 'Üçüncülük maçı galibi' },
  'scoreRow.champion': { en: 'Champion (wins the final)', tr: 'Şampiyon (finali kazanır)' },

  // Share actions
  'share.copy': { en: '🔗 Copy link', tr: '🔗 Bağlantıyı kopyala' },
  'share.copied': { en: '✓ Link copied', tr: '✓ Bağlantı kopyalandı' },
  'share.saving': { en: 'Saving…', tr: 'Kaydediliyor…' },
  'share.saveImage': { en: 'Save image', tr: 'Görseli kaydet' },
  'share.tweet': { en: '𝕏 Share on X', tr: '𝕏 X’te paylaş' },
  'share.copyPrompt': { en: 'Copy your bracket link:', tr: 'Tahmin bağlantını kopyala:' },
  'tweet.text': {
    en: 'My 2026 World Cup bracket 🏆 — think you can beat it?',
    tr: '2026 Dünya Kupası tahminim 🏆 — geçebilir misin?',
  },

  // Winner celebration
  'winner.your': { en: 'Your champion', tr: 'Şampiyonun' },
  'winner.complete': {
    en: 'Your bracket is complete — share it and challenge your friends to beat it.',
    tr: 'Tahminin tamamlandı — paylaş ve arkadaşlarına geçmeleri için meydan oku.',
  },
  'winner.keepEditing': { en: 'Keep editing', tr: 'Düzenlemeye devam et' },
  'winner.close': { en: 'Close', tr: 'Kapat' },
  'winner.dialogLabel': { en: 'Bracket complete', tr: 'Tahmin tamamlandı' },

  // Calendar
  'cal.title': { en: 'Match calendar', tr: 'Maç takvimi' },
  'cal.descPre': {
    en: 'All 104 fixtures — kickoff times shown in your selected zone ',
    tr: '104 maçın tümü — başlama saatleri seçtiğin ',
  },
  'cal.descPost': {
    en: '. Change it from the menu in the top bar.',
    tr: ' saat diliminde. Üstteki menüden değiştirebilirsin.',
  },
  'stage.All': { en: 'All', tr: 'Tümü' },
  'stage.Group': { en: 'Group', tr: 'Grup' },
  'stage.Round of 32': { en: 'Round of 32', tr: 'Son 32' },
  'stage.Round of 16': { en: 'Round of 16', tr: 'Son 16' },
  'stage.Quarter-final': { en: 'Quarter-final', tr: 'Çeyrek final' },
  'stage.Semi-final': { en: 'Semi-final', tr: 'Yarı final' },
  'stage.Third place': { en: 'Third place', tr: 'Üçüncülük' },
  'stage.Final': { en: 'Final', tr: 'Final' },
  'cal.grp': { en: 'Grp {g}', tr: '{g} Grubu' },
  'cal.ft': { en: 'FT', tr: 'MS' },

  // Teams list
  'teams.count': { en: '48 teams', tr: '48 takım' },
  'teams.desc': {
    en: 'Tap a team for its full World Cup squad, head coach, kits and recent form.',
    tr: 'Tam Dünya Kupası kadrosu, teknik direktör, formalar ve son form için bir takıma dokun.',
  },
  'teams.search': { en: 'Search teams…', tr: 'Takım ara…' },

  // Team detail + hover
  'team.notFound': { en: 'Team not found.', tr: 'Takım bulunamadı.' },
  'team.backAll': { en: '← Back to all teams', tr: '← Tüm takımlara dön' },
  'team.back': { en: '← Back', tr: '← Geri' },
  'team.headCoach': { en: 'Head coach:', tr: 'Teknik direktör:' },
  'team.coachShort': { en: 'Coach:', tr: 'Teknik direktör:' },
  'team.liveXI': { en: 'Live starting XI ↗', tr: 'Canlı 11 ↗' },
  'team.kits': { en: 'Kits', tr: 'Formalar' },
  'team.home': { en: 'Home', tr: 'İç saha' },
  'team.away': { en: 'Away', tr: 'Deplasman' },
  'team.kitsSoon': { en: 'Kit colours coming soon', tr: 'Forma renkleri yakında' },
  'team.formBefore': { en: 'Form before world cup', tr: 'Dünya Kupası öncesi form' },
  'team.groupFixtures': { en: 'Group fixtures ({short})', tr: 'Grup maçları ({short})' },
  'team.squad': { en: 'World Cup squad', tr: 'Dünya Kupası kadrosu' },
  'team.squadPending': {
    en: 'Full 26-player squad list is being verified for this team.',
    tr: 'Bu takımın tam 26 kişilik kadrosu doğrulanıyor.',
  },
  'team.seeLatestXI': {
    en: 'See the latest starting XI on mylineups.app ↗',
    tr: 'En güncel 11’i mylineups.app üzerinde gör ↗',
  },
  'team.wcMatches': { en: 'World Cup matches', tr: 'Dünya Kupası maçları' },
  'team.noWcMatches': { en: 'No World Cup matches yet.', tr: 'Henüz Dünya Kupası maçı yok.' },
  'team.fullProfile': { en: 'Full profile →', tr: 'Tüm profil →' },

  // Positions
  'pos.GK': { en: 'Goalkeepers', tr: 'Kaleciler' },
  'pos.DF': { en: 'Defenders', tr: 'Defans' },
  'pos.MF': { en: 'Midfielders', tr: 'Orta saha' },
  'pos.FW': { en: 'Forwards', tr: 'Forvetler' },

  // Confederation regions
  'region.UEFA': { en: 'Europe', tr: 'Avrupa' },
  'region.CONMEBOL': { en: 'South America', tr: 'Güney Amerika' },
  'region.CONCACAF': { en: 'North America', tr: 'Kuzey Amerika' },
  'region.CAF': { en: 'Africa', tr: 'Afrika' },
  'region.AFC': { en: 'Asia', tr: 'Asya' },
  'region.OFC': { en: 'Oceania', tr: 'Okyanusya' },

  // Recent form
  'form.unavailable': {
    en: 'Recent results unavailable — check the live source.',
    tr: 'Son sonuçlar yok — canlı kaynağı kontrol et.',
  },

  // Live status labels
  'status.1h': { en: '1st half', tr: 'İlk yarı' },
  'status.2h': { en: '2nd half', tr: 'İkinci yarı' },
  'status.ht': { en: 'Half-time', tr: 'Devre arası' },
  'status.et': { en: 'Extra time', tr: 'Uzatma' },
  'status.break': { en: 'Break', tr: 'Ara' },
  'status.pens': { en: 'Penalties', tr: 'Penaltılar' },
  'status.live': { en: 'Live', tr: 'Canlı' },
  'status.ft': { en: 'Full time', tr: 'Maç sonu' },
  'status.aet': { en: 'After extra time', tr: 'Uzatmalar sonu' },
  'status.onPens': { en: 'On penalties', tr: 'Penaltılarda' },
} satisfies Record<string, Entry>;

export type StrKey = keyof typeof S;

/** The raw string table (exported for completeness tests). */
export const STRINGS = S;

/** Translate `key` into `lang`, replacing {tokens} from `vars`. */
export function translate(
  lang: Lang,
  key: StrKey,
  vars?: Record<string, string | number>,
): string {
  const entry = S[key] as Entry | undefined;
  let str = entry ? entry[lang] ?? entry.en : (key as string);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

// ---------------------------------------------------------------------------
// Proper nouns that DO get localised on request: the 48 team names and the
// kit colour labels. Keyed so the English source stays the fallback.
// ---------------------------------------------------------------------------

/** Turkish names for the 48 teams (keyed by team id). */
export const TEAM_NAME_TR: Record<string, string> = {
  mexico: 'Meksika',
  'south-africa': 'Güney Afrika',
  'south-korea': 'Güney Kore',
  czechia: 'Çekya',
  canada: 'Kanada',
  'bosnia-and-herzegovina': 'Bosna-Hersek',
  qatar: 'Katar',
  switzerland: 'İsviçre',
  brazil: 'Brezilya',
  morocco: 'Fas',
  haiti: 'Haiti',
  scotland: 'İskoçya',
  usa: 'ABD',
  paraguay: 'Paraguay',
  australia: 'Avustralya',
  turkiye: 'Türkiye',
  germany: 'Almanya',
  curacao: 'Curaçao',
  'ivory-coast': 'Fildişi Sahili',
  ecuador: 'Ekvador',
  netherlands: 'Hollanda',
  japan: 'Japonya',
  sweden: 'İsveç',
  tunisia: 'Tunus',
  belgium: 'Belçika',
  egypt: 'Mısır',
  iran: 'İran',
  'new-zealand': 'Yeni Zelanda',
  spain: 'İspanya',
  'cape-verde': 'Cabo Verde',
  'saudi-arabia': 'Suudi Arabistan',
  uruguay: 'Uruguay',
  france: 'Fransa',
  senegal: 'Senegal',
  iraq: 'Irak',
  norway: 'Norveç',
  argentina: 'Arjantin',
  algeria: 'Cezayir',
  austria: 'Avusturya',
  jordan: 'Ürdün',
  portugal: 'Portekiz',
  'dr-congo': 'DR Kongo',
  uzbekistan: 'Özbekistan',
  colombia: 'Kolombiya',
  england: 'İngiltere',
  croatia: 'Hırvatistan',
  ghana: 'Gana',
  panama: 'Panama',
};

/** Localised team name: Turkish when available, else the English source. */
export function teamName(id: string, fallback: string, lang: Lang): string {
  return lang === 'tr' ? TEAM_NAME_TR[id] ?? fallback : fallback;
}

/** Turkish names for the kit colour labels used in data/kits.ts. */
export const KIT_COLOR_TR: Record<string, string> = {
  Green: 'Yeşil',
  White: 'Beyaz',
  Gold: 'Altın',
  Red: 'Kırmızı',
  Navy: 'Lacivert',
  Blue: 'Mavi',
  Maroon: 'Bordo',
  Yellow: 'Sarı',
  Orange: 'Turuncu',
  Black: 'Siyah',
  Celeste: 'Gök mavisi',
  'Dark red': 'Koyu kırmızı',
  'Sky blue': 'Gök mavisi',
  'Red & white stripes': 'Kırmızı-beyaz çizgili',
  'Sky-blue & white stripes': 'Gök mavisi-beyaz çizgili',
  'Red & white checks': 'Kırmızı-beyaz kareli',
};

/** Localised kit colour label: Turkish when available, else the English source. */
export function kitColor(label: string, lang: Lang): string {
  return lang === 'tr' ? KIT_COLOR_TR[label] ?? label : label;
}
