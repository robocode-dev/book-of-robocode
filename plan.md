# Plan: Overfør voice-guide og side-review fra intent-book til book-of-robocode

## Context

Brugeren har i `C:\Code\intent-book` en `voice.md` der holder prosa fra at læse som
AI-genereret, plus en `review-chapter` skill. Hun vil have det samme i denne bog
(`book-of-robocode`): agent-instruktioner om stemme/stil, og et review-skill for en
**side** (denne bog kalder dem "pages", ikke "chapters").

Vigtigt: `intent-book`s `voice.md` er skrevet til et **senior-ingeniør-publikum med tør
humor**, og flere af dens hårde regler kolliderer med denne bogs etablerede tone i
`AGENTS.md` (målgruppe: nysgerrige teenagere, "a science teacher with a smile", emoji
tilladt, fed skrift brugt til terminologi). Derfor **adapteres** guiden, ikke kopieres:

- Behold det publikum-neutrale anti-AI-maskineri (rytme-variation, varieret
  sætningskonstruktion, konkret frem for abstrakt, ingen "throat-clearing", aldrig
  opdigtede tal/anekdoter, hver paragraf fortjener sin plads, åbninger der skaber
  nysgerrighed, afsnit der peger fremad).
- Genkalibrér register til "science teacher with a smile" (fra `AGENTS.md`).
- Beskær listen af forbudte ord til ægte AI-floskler. Fjern forbud mod almindelige ord
  (can, may, just, imagine, discover, however, powerful) som en venlig teen-tone har brug for.
- Tillad fed til terminologi, emoji, og venlige analogier (alt sammen bogens konvention).
  Dette er bevidste opblødninger ift. intent-book.

Brugerens valg:
1. **Tilpas til Robocode-tonen, men med em-dash-forbud** (em-dashes er et AI-tell).
2. **Match eksisterende konvention** for placering: top-niveau `VOICE.md` + skill i
   `.github/skills/` ved siden af `create-page.md` / `create-illustration.md`,
   wired via `AGENTS.md`.
3. **Gennemgå og opdatér ALLE eksisterende sider** efter `VOICE.md`. Ikke valgfrit.
4. **Gem selve denne plan som `plan.md` i repo-roden** (som intent-book gør).

Em-dash-forbuddet rammer eksisterende indhold: **355 em-dashes (`—`, U+2014) i 50 sider**
plus **6 i `AGENTS.md`**. En-dash (`–`, U+2013) til talintervaller (300–800, 2–4) er et andet
tegn og bevares.

## Deliverables

### 1. Ny fil: `VOICE.md` (repo-rod)

Adapteret fra `intent-book/.agents/instructions/voice.md`. Top-niveau dokument ved siden af
`BOOK_STRATEGY.md` / `BOOK_STRUCTURE.md`. Indhold (sektioner):

- **Intro:** denne fil definerer hvordan prosaen skal lyde. `AGENTS.md` dækker mekanik
  (målgruppe, struktur, frontmatter, terminologi). Denne dækker det der holder en side fra
  at læse som AI-genereret.
- **Core philosophy:** sider underviser intuition først. Skal læse som en kyndig, venlig
  lærer der forklarer noget fedt, ikke som opsummeret dokumentation. Må aldrig føles:
  corporate, generisk, akademisk, steril, AI-genereret, overpoleret.
- **Register anchor:** "science teacher with a smile" (genbrug formuleringen fra
  `AGENTS.md`). Begejstret uden hype. Vis hvad der går galt først, så læseren forstår
  hvorfor løsningen ser ud som den gør. Tredjeperson.
- **Writing characteristics:** paragraf-disciplin (2–4 sætninger, jf. `AGENTS.md`, men
  variér længde aggressivt; ens-lange paragraffer i træk er et AI-tell); åbn med nysgerrighed,
  ikke framing; bliv på sidens emne (focus-test); aldrig opdigt (ingen opfundne tal,
  benchmarks eller "war stories", grund claims i RoboWiki/Tank Royale/community consensus,
  jf. `ATTRIBUTION.md`); spil-/ingeniørsprog frem for marketing-sprog (turns, gun heat,
  bullet power, energy, radar lock, wall smoothing); ingen opvarmning/scene-sætning.
- **Forbudte ord (beskåret):** behold ægte floskler: delve, leverage, tapestry, realm,
  game-changer, unlock(/potential), seamless, holistic, comprehensive solution, cutting-edge,
  groundbreaking, revolutionize, disruptive, in a world where, testament, navigating the
  landscape, in conclusion, in summary, furthermore, moreover, embark, illuminate, unveil,
  elucidate, harness, skyrocket, ever-evolving, transformative, recipe. **Fjern** forbud mod:
  can, may, just, imagine, discover, however, powerful, very, really.
- **Respect reader intelligence (rekalibreret):** gentag ikke, opsummér ikke i overflod,
  forklar ikke det åbenlyse. MEN: dette er en undervisningsbog for teenagere, så definér
  genuint nye tekniske termer én gang (afviger bevidst fra intent-books "forklar intet").
- **Compression / every paragraph earns its place / deletion-test.**
- **Vary rhythm + vary construction:** tærskler for copula-maksimer, kontrast-par,
  triple-parallels (genbrug intent-books mekanik, samme tærskler).
- **Technical explanation style:** forklar gennem situationer; konkret frem for abstrakt
  (substitution- + referent-test); navngiv tradeoffs (let touch, "Tips & Common Mistakes"
  findes allerede i sidestrukturen). Behold venlige analogier når de matcher mekanikken
  præcist (opblødning ift. intent-books "technical term over paraphrase").
- **Structural style:** side-åbninger skaber nysgerrighed; sektioner peger fremad;
  side-slutninger holder momentum mod næste emne (Asimov-teknik, opblødt).
- **Forbidden punctuation / formatting:**
  - **Em-dashes: nul.** Omskrivningsregler: punktum + ny sætning (aside), kolon (definition),
    komma eller parentes (kort indskud). Note: en-dash `–` til talintervaller bevares.
  - **Semikoloner:** undgå i prosa.
  - **Fed/kursiv:** behold fed til terminologi (bogens konvention), men ikke som refleks til
    enhver fremhævelse. Behold backticks, code fences, Mermaid, tabeller, emoji (alt
    `AGENTS.md`-konformt).
- **Preferred techniques:** retorisk spørgsmål, let venlig humor (AGENTS.md-register, IKKE
  mørk), kompakt præcis analogi, en stærk men kildedækket holdning. Eksempler i Robocode-register.
- **Quality bar.**

### 2. Ny fil: `.github/skills/review-page.md`

Modelleret efter `.github/skills/create-page.md` (struktur/format) og
`intent-book/.agents/skills/review-chapter.md` (checklist-idé). Sektioner:

- **Trigger:** `/review-page <path>` eller "Review this page".
- **Input:** sidens markdown-fil; valgfrit `BOOK_STRUCTURE.md`-entry for outline-tjek.
- **Process:** load `AGENTS.md`, `BOOK_STRATEGY.md`, `VOICE.md`,
  `specs/page-generation-spec.md`. Checklist:
  1. Struktur & frontmatter (felter, H1 matcher title, Origins-callout til stede, Further
     Reading til stede, illustration-placeholders hvor geometrisk).
  2. Focus: hver sektion fremmer sidens emne.
  3. Earns its place / padding (throat-clearing, gentagelse).
  4. Tone: science-teacher-smile, venlig, opmuntrende, tredjeperson, ingen sarkasme/slang/memes.
  5. Accuracy & sources: claims grundet i RoboWiki/Tank Royale, platform-distinktion korrekt
     (RoboWiki = classic, robocode.dev/GitHub = Tank Royale), intet opdigtet, attribution OK.
  6. Terminologi: "bot" ikke "robot", "units" ikke "pixels".
  7. Voice (`VOICE.md`): rytme, varieret konstruktion, åbninger, konkrethed, ingen floskler.
  8. Tegnsætning/format: **nul em-dashes**, ingen semikoloner i prosa, fed ikke overbrugt,
     linjelængde ≤120, emoji støttende ikke overdrevet, Mermaid theme-kompatibel (chocolate
     `#d2691e` akser), code-blocks har sprog-tags.
  9. Concreteness: substitution/referent-test.
- **Output:** findings først, sorteret efter alvor, med labels (`Focus drift`,
  `Does not earn its place`, `Padding`, `Abstract claim`, `Em-dash`, `Terminology`,
  `Source/accuracy`, `Tone drift`). Sig eksplicit hvis ingen blokerende problemer.
- **Reference Documents:** som i `create-page.md`.

### 3. Rediger `AGENTS.md`

- Tilføj `VOICE.md` til **Reference Documents** med en linje der markerer den som obligatorisk
  at loade før skrivning/review.
- Tilføj en peger i **Audience & Tone** (eller Final Note) til `VOICE.md`.
- **Fjern de 6 em-dashes** og ret humor-eksemplet
  `"gravity always wins — unless you code around it!"` til
  `"gravity always wins, unless you code around it!"` (komma). Øvrige em-dash-linjer omskrives
  til komma/kolon/parentes. En-dashes til intervaller bevares.

### 4. Gennemgå og opdatér ALLE eksisterende sider (kerneopgave)

Kør hver eksisterende side i `book/` igennem `VOICE.md` via `/review-page` og anvend rettelserne.
Dette er den største del af arbejdet. Omfang pr. side:

- **Em-dashes (mekanisk men med vurdering):** fjern alle `—` (355 forekomster, 50 filer). Hver
  erstattes ud fra konteksten med punktum + ny sætning, kolon, komma eller parentes. En-dash `–`
  til talintervaller bevares. INGEN blind global find/replace.
- **Voice/tone-fixes flagget af `/review-page`:** AI-floskler, throat-clearing, ens-lange
  paragraffer i træk, ensformig sætningskonstruktion, abstrakte claims uden referent, åbninger
  uden nysgerrighed. Ret det der er flagget; bevar sidens faktuelle indhold, kilder og struktur.
- **Tegnsætning/format:** semikoloner i prosa, overbrug af fed, linjelængde ≤120.

Arbejdsgang (foreslået batching, så det er gennemskueligt):

1. Start med en lille pilot-batch (f.eks. mappen `book/introduction/` eller en enkelt side) så
   brugeren kan se hvordan rettelserne ser ud i praksis, før resten køres.
2. Kør derefter sektion for sektion (`getting-started`, `physics`, `radar`, `targeting`,
   `movement`, `energy-and-scoring`, `appendices`).
3. Hold faktuel nøjagtighed og attribution urørt. Dette er en stilpas, ikke en omskrivning af
   indhold. Tvivlsomme indholdsændringer flagges til brugeren frem for at gætte.

Filer: alle `*.md` under `book/` (de 50 i grep-listen plus evt. sider uden em-dashes der stadig
får en voice-gennemgang).

### 5. Ny fil: `plan.md` (repo-rod)

Denne fil. Gemt i repo-roden (som `intent-book` gør), så den er sporet i repoet og kan bruges
som tjekliste under implementeringen. Hold den synkroniseret med fremdriften (f.eks. afkryds
sektioner efterhånden som siderne gennemgås).

## Kritiske filer

- Ny: `VOICE.md`
- Ny: `.github/skills/review-page.md`
- Ny: `plan.md` (repo-rod)
- Rediger: `AGENTS.md`
- Rediger: alle `*.md` under `book/` (voice-gennemgang + em-dash-sweep)
- Kilde (kun reference): `C:\Code\intent-book\.agents\instructions\voice.md`,
  `C:\Code\intent-book\.agents\skills\review-chapter.md`
- Genbrugsmønstre: `.github/skills/create-page.md` (skill-format),
  `specs/page-generation-spec.md` (struktur/frontmatter-regler)

## Verifikation

- **VOICE.md / AGENTS.md selv-konsistens:** bekræft 0 em-dashes i `VOICE.md` og `AGENTS.md`
  (`grep "—"` skal give tomt for begge filer), og at en-dash-intervaller stadig findes.
- **Skill virker:** kør `/review-page` på en eksisterende side (f.eks.
  `book/targeting/simple-targeting/circular-targeting.md`) og bekræft at den producerer
  findings sorteret efter alvor, flagger em-dashes/terminologi, og refererer `VOICE.md`.
- **Ingen modsigelser:** læs `AGENTS.md` + `VOICE.md` sammen og bekræft ingen regel modsiger
  den anden (em-dashes, forbudte ord, fed skrift, emoji).
- **Alle sider fejet:** efter gennemgangen skal `grep "—"` over hele `book/` give 0 forekomster
  (en-dash `–`-intervaller bevaret). Stikprøvelæs et par opdaterede sider og bekræft at faktuelt
  indhold, kilder og struktur er urørt.
- **Build urørt:** `npm run docs:build` skal stadig bygge efter alle ændringer (kun .md-tekst og
  nye filer; ingen kode/config rørt).
