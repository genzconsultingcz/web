// Structured, bilingual case-study content transcribed from the client PDFs.
// All three studies share the same 6-section template; per-study flexibility
// lives in the optional fields (e.g. `assessed[].body`, `context.whyIntro`).

export type CaseStudyLocale = 'cs' | 'en';

export interface CaseStudy {
  client: string;
  logo: string;
  logoAlt: string;
  year: string;
  hero: { headline: string; intro: string };
  scope: { label: string; value: string }[];
  stats: { value: string; label: string }[];
  context: {
    headline: string;
    intro: string;
    clientLabel: string;
    client: string;
    whyTitle: string;
    whyIntro?: string;
    whyPoints: { title: string; body: string }[];
    briefLabel: string;
    brief: string;
  };
  approach: {
    headline: string;
    intro: string;
    steps: { num: string; title: string; body: string }[];
    assessedTitle: string;
    assessedIntro: string;
    assessed: { num: string; title: string; body?: string }[];
    assessedNote?: string;
  };
  findings: {
    headline: string;
    intro: string;
    columns: [string, string, string];
    items: { category: string; title: string; cols: [string, string, string] }[];
  };
  outputs: {
    headline: string;
    intro: string;
    items: { num: string; title: string; body: string }[];
    quote: string;
    quoteAuthor: string;
  };
  whyUs: {
    headline: string;
    intro: string;
    pillars: { num: string; title: string; body: string }[];
  };
  contact: { name: string; email: string; web: string };
}

const CONTACT = {
  name: 'Adam Dalecký',
  email: 'adam.dalecky@genzconsulting.cz',
  web: 'www.genzconsulting.cz',
} as const;

const avMedia: Record<CaseStudyLocale, CaseStudy> = {
  cs: {
    client: 'AV MEDIA',
    logo: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png',
    logoAlt: 'AV Media Systems',
    year: '2026',
    hero: {
      headline: 'Co Gen Z chce od pracovního prostoru, a proč to firmy ještě nevědí.',
      intro:
        'Spojili jsme kvalitativní hloubkové rozhovory s aktivní Gen Z a kvantitativní šetření mezi běžnou Gen Z. Výsledkem jsou data ve čtyřech sekcích, Mindset, Práce, AI a Prostředí, která AV Media používá jako sales argument pro firmy, které chtějí stavět prostor pro mladé.',
    },
    scope: [
      { label: 'Rozsah', value: 'Kvalitativní + kvantitativní výzkum' },
      { label: 'Metodika', value: 'Hloubkové rozhovory + dotazník' },
      { label: 'Výstup', value: '2 reporty + interpretace dat' },
    ],
    stats: [
      { value: '318 + 20', label: 'respondentů celkem, kvantitativně i kvalitativně' },
      { value: '2', label: 'segmenty Gen Z, aktivní (podnikající) a běžná (studium + brigády)' },
      { value: '4', label: 'tematické sekce dat o tom, jak Gen Z přemýšlí, pracuje a kde chce být' },
    ],
    context: {
      headline: 'Když prostor přestává fungovat pro generaci, která ho nejvíc využívá.',
      intro:
        'AV MEDIA dodává audiovizuální technologie do kanceláří, zasedaček a eventových prostor už přes tři dekády. Trh se ale začal měnit rychleji než návrhy projektů, a to hlavně kvůli generaci, která má od pracovního prostoru jiná očekávání než kdokoliv předtím. Cílem projektu bylo dát AV Media tvrdá data, o která se mohou opřít v sales argumentaci pro své klienty.',
      clientLabel: 'Kdo je klient',
      client:
        'AV MEDIA je největší český dodavatel audiovizuálních technologií pro firmy. Stojí za displeji, ozvučením, videokonferencemi a kompletním vybavením zasedaček, huddle roomů, prezentačních i eventových prostor. Pracuje pro největší tuzemské i mezinárodní firmy, které potřebují, aby jejich prostor fungoval pro každodenní práci, prezentace i setkávání.',
      whyTitle: 'Proč to nebyl běžný projekt',
      whyPoints: [
        {
          title: 'Prostor jako strategická investice',
          body:
            'Pracovní prostředí přestalo být jen interiér. Pro firmy, které bojují o talenty, je to nástroj kultury i retence, a Gen Z na něj reaguje jinak než předchozí generace.',
        },
        {
          title: 'Hybrid je výchozí, ne benefit',
          body:
            'Gen Z neočekává flexibilitu jako bonus. Bere ji jako standard, podle kterého poměřuje, jestli vůbec stojí za to do kanceláře přijít.',
        },
        {
          title: 'Wi‑Fi, zásuvky a tabule jsou must‑have',
          body:
            'Základní vybavení už není argument, je to úplný standard. Pokud chybí, prostor selhává ještě dřív, než se v něm začne pracovat.',
        },
        {
          title: 'Smysl > status, čas > místo',
          body:
            'Gen Z neřeší prestiž ani sociální status práce. Řeší smysl. A místo home officu si víc cení časové flexibility, která jí dovoluje žít vlastní rytmus.',
        },
      ],
      briefLabel: 'Naše zadání',
      brief:
        'Postavit pro AV Media datový základ o tom, co Gen Z reálně očekává od práce, prostředí a nástrojů. Spojit kvalitativní hloubku s kvantitativní validací, oddělit aktivní a běžnou Gen Z, a předat výsledky tak, aby je sales i produktový tým uměli okamžitě používat v rozhovoru s klienty.',
    },
    approach: {
      headline: 'Tři kroky od dotazníku k použitelné strategii.',
      intro:
        'Postupovali jsme metodicky, od hloubky k šíři. Nejdřív jsme poslouchali, pak měřili, pak data interpretovali přímo s týmem AV Media. Každé doporučení tak má dvojí oporu, hlas konkrétních lidí a sílu čísel.',
      steps: [
        {
          num: '1',
          title: 'Kvalitativní výzkum',
          body:
            '20 hloubkových rozhovorů s aktivní Gen Z, která už podniká nebo akceleruje vlastní kariéru. Cíl: rozumět tomu, jak přemýšlí o práci, prostoru a nástrojích.',
        },
        {
          num: '2',
          title: 'Kvantitativní výzkum',
          body:
            'Dotazníkové šetření mezi 318 zástupci běžné Gen Z, převážně studenty SŠ a VŠ. Validace insightů z rozhovorů na škále, identifikace nejsilnějších patternů.',
        },
        {
          num: '3',
          title: 'Interpretace & prezentace',
          body:
            'Živý workshop u týmu AV Media. Procházeli jsme data sekci po sekci a překládali je do konkrétních byznysových úhlů, kde a jak je v sales pitchích použít.',
        },
      ],
      assessedTitle: 'Co konkrétně jsme posuzovali',
      assessedIntro:
        'Výzkum jsme strukturovali do čtyř tematických sekcí, které dohromady dávají kompletní obraz o tom, jak Gen Z přemýšlí o práci a v jakém prostředí chce fungovat.',
      assessed: [
        {
          num: '01',
          title: 'Mindset',
          body: 'Hodnoty, motivace, postoj k autoritě, vztah ke smyslu a statusu, kariérní očekávání.',
        },
        {
          num: '02',
          title: 'Práce',
          body: 'Co Gen Z od zaměstnání reálně chce, jak vnímá flexibilitu, kompenzaci a vztahy v týmu.',
        },
        {
          num: '03',
          title: 'AI',
          body:
            'Jak Gen Z používá AI v běžném životě i ve studiu, co od ní očekává v práci a jaké signály bere u zaměstnavatele.',
        },
        {
          num: '04',
          title: 'Prostředí',
          body: 'Jak má vypadat fyzický pracovní prostor, jaké zóny v něm Gen Z hledá a co ji od kanceláře odrazuje.',
        },
      ],
    },
    findings: {
      headline: 'Čtyři zjištění, která mění design pracovního prostoru.',
      intro:
        'Z desítek datových bodů vybíráme čtyři, jeden z každé sekce, které mají největší byznysový dopad pro AV Media. Každý z nich má praktický důsledek pro to, jak se dnes navrhují kanceláře.',
      columns: ['Co jsme zjistili', 'Proč to je důležité', 'Co z toho plyne pro AV Media'],
      items: [
        {
          category: 'Mindset',
          title: 'Smysl práce > status práce',
          cols: [
            'Gen Z neřeší prestiž titulu ani společenský status zaměstnavatele. Řeší, jestli to, co dělá, dává smysl jim osobně i světu kolem.',
            'Tradiční employer branding postavený na velikosti firmy a hierarchii ztrácí váhu. Mladí kandidáti si vybírají firmy podle hodnot a dopadu, ne podle vizitky.',
            'Argument „investice do prostředí“ je přesvědčivější, když ukazuje, že prostor odráží hodnoty firmy. AV řešení jsou součástí toho, jak firma žije své hodnoty navenek i dovnitř.',
          ],
        },
        {
          category: 'Práce',
          title: 'Časová flexibilita > home office',
          cols: [
            'Gen Z preferuje, kdy bude pracovat, před tím, odkud bude pracovat. Pevný 8–16 režim v kanceláři ji odrazuje víc než povinná docházka samotná.',
            'Pro Gen Z je klíčové rozhodovat si sami, kdy budou pracovat. Ve zbytku času chtějí sportovat, trávit čas s přáteli a věnovat se vlastním věcem. Práce už není střed života, ale jeden z pilířů.',
            'Prostor musí být použitelný v různou denní dobu a v různých režimech, ráno, večer, mezi tréninkem a schůzkou. Modulární zóny a snadné přepínání AV setupu mezi focus a sync prací.',
          ],
        },
        {
          category: 'AI',
          title: 'AI je už standard, ne novinka',
          cols: [
            'Drtivá většina Gen Z používá AI denně. Otázka už není „jestli“, ale „jak hluboko“. U aktivní Gen Z je AI strategický nástroj, u běžné je to každodenní pomocník.',
            'Pokud firma AI brzdí nebo neumí, Gen Z to čte jako signál zaostalosti. Naopak prostředí, které AI plně integruje, posílá tichý signál, že firma rozumí dnešku.',
            'Návrh prostoru musí počítat s AI nástroji v meeting flow, transkripcemi a hlasovými zápisy. AV se stává nositelem AI, ne jen displejem.',
          ],
        },
        {
          category: 'Prostředí',
          title: 'Klidné a sociální zóny musí být kvalitně oddělené',
          cols: [
            'Pro Gen Z je klíčové mít v kanceláři jasně oddělený prostor pro soustředěnou práci a prostor pro setkávání. Open space, kde se obojí mísí, ji vyčerpává.',
            'Pokud prostor neumí jedno z toho dvojího, Gen Z buď nepřijde, nebo přijde a pracuje s nasazenými sluchátky a mizí ze sdíleného života firmy.',
            'Klíčová příležitost pro projekty, kde se navrhují obě zóny ve vědomém kontrastu. Tichá místnost s kvalitní akustikou plus sociální zóna s lehkým AV setupem na neformální sync.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'Co konkrétně AV Media dostali do ruky.',
      intro:
        'Naše práce nekončila prezentací. AV Media odešli se sadou výstupů, které jejich sales i produktový tým mohou používat opakovaně, u každého projektu, ne jen u jedné kampaně.',
      items: [
        {
          num: '01',
          title: 'Kvalitativní výzkum',
          body:
            'Report z 20 hloubkových rozhovorů s aktivní Gen Z. Sekce Demografie, Online, Offline, Jiskra, AI a RAW data plus AI průvodce, který umožňuje data prohledávat konverzačně.',
        },
        {
          num: '02',
          title: 'Kvantitativní výzkum',
          body:
            'Report z dotazníkového šetření mezi 318 zástupci běžné Gen Z. Strukturovaný do čtyř sekcí, Kontext, Práce, Mindset a AI, s RAW daty pro vlastní analýzu.',
        },
        {
          num: '03',
          title: 'Prezentace výsledků živě u týmu',
          body:
            'Workshop, kde jsme tým AV Media provedli oběma reporty, vysvětlili kontext jednotlivých zjištění a otevřeli prostor pro otázky napříč sales i produktovými rolemi.',
        },
        {
          num: '04',
          title: 'Interpretace dat & insighty',
          body:
            'Překlad dat do byznysových důsledků pro AV Media, s konkrétními úhly, jak je použít v sales pitchích pro firmy a v argumentaci pro design pracovních prostor.',
        },
      ],
      quote:
        'AV Media měli silnou intuici, kam se generace posouvá. Naše práce byla dát té intuici jméno, čísla a slova, která jejich klienti slyší. Když sales drží v ruce hlas tří set Gen Z lidí, mluví se z toho úplně jinak.',
      quoteAuthor: '— tým GenZ Consulting',
    },
    whyUs: {
      headline: 'Děláme jednu věc. A tu pořádně.',
      intro:
        'Specializujeme se na Gen Z a propojujeme to s konzultační prací pro značky a HR týmy. Pracujeme s vlastními výzkumnými daty, která pravidelně aktualizujeme. Naše doporučení nikdy nestojí na pocitech.',
      pillars: [
        {
          num: '01',
          title: 'Data na pozadí',
          body:
            'Každé doporučení opíráme o vlastní výzkum mezi Gen Z. Pracujeme s aktuálními daty o této generaci, ne s odhady ani s trendovými zprávami z internetu.',
        },
        {
          num: '02',
          title: 'Komplexnost i detail',
          body:
            'Pracujeme na strategické vrstvě, segmentace, content pillars, pozice značky, i na jednotlivých formulacích a doporučeních pro design prostoru. Obojí v jednom týmu.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            'Naše doporučení vychází z přímé znalosti toho, jak Gen Z přemýšlí a komunikuje. Nemusíme tu generaci zkoumat zvenku, jsme její součástí.',
        },
      ],
    },
    contact: CONTACT,
  },
  en: {
    client: 'AV MEDIA',
    logo: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png',
    logoAlt: 'AV Media Systems',
    year: '2026',
    hero: {
      headline: "What Gen Z wants from the workplace — and why companies still don't know.",
      intro:
        'We combined qualitative in-depth interviews with active Gen Z and a quantitative survey among mainstream Gen Z. The result is data across four sections — Mindset, Work, AI and Environment — that AV Media uses as a sales argument for companies that want to build spaces for the young.',
    },
    scope: [
      { label: 'Scope', value: 'Qualitative + quantitative research' },
      { label: 'Method', value: 'In-depth interviews + survey' },
      { label: 'Output', value: '2 reports + data interpretation' },
    ],
    stats: [
      { value: '318 + 20', label: 'respondents in total, quantitative and qualitative' },
      { value: '2', label: 'Gen Z segments — active (entrepreneurial) and mainstream (study + part-time jobs)' },
      { value: '4', label: 'thematic data sections on how Gen Z thinks, works and where it wants to be' },
    ],
    context: {
      headline: 'When the space stops working for the generation that uses it most.',
      intro:
        'AV MEDIA has supplied audiovisual technology to offices, meeting rooms and event spaces for over three decades. But the market started changing faster than project proposals — mainly because of a generation that has different expectations of the workplace than anyone before. The goal of the project was to give AV Media hard data they can lean on in the sales argumentation for their clients.',
      clientLabel: 'Who is the client',
      client:
        'AV MEDIA is the largest Czech supplier of audiovisual technology for companies. It is behind the displays, sound systems, video conferencing and complete fit-out of meeting rooms, huddle rooms, presentation and event spaces. It works for the largest domestic and international companies that need their space to work for everyday work, presentations and gatherings.',
      whyTitle: "Why this wasn't a routine project",
      whyPoints: [
        {
          title: 'Space as a strategic investment',
          body:
            'The work environment stopped being just an interior. For companies fighting for talent it is a tool of culture and retention — and Gen Z reacts to it differently than previous generations.',
        },
        {
          title: 'Hybrid is the default, not a perk',
          body:
            "Gen Z doesn't expect flexibility as a bonus. It treats it as the standard by which it measures whether it's even worth coming to the office at all.",
        },
        {
          title: 'Wi‑Fi, sockets and whiteboards are must‑haves',
          body:
            'Basic equipment is no longer an argument — it is an absolute standard. If it is missing, the space fails before any work even starts.',
        },
        {
          title: 'Meaning > status, time > place',
          body:
            "Gen Z doesn't care about the prestige or social status of work. It cares about meaning. And rather than home office, it values the time flexibility that lets it live its own rhythm.",
        },
      ],
      briefLabel: 'Our brief',
      brief:
        'Build a data foundation for AV Media about what Gen Z really expects from work, environment and tools. Combine qualitative depth with quantitative validation, separate active and mainstream Gen Z, and hand over the results so that both the sales and product teams can use them immediately in conversations with clients.',
    },
    approach: {
      headline: 'Three steps from a questionnaire to a usable strategy.',
      intro:
        'We proceeded methodically — from depth to breadth. First we listened, then we measured, then we interpreted the data directly with the AV Media team. Every recommendation therefore has a double backing — the voice of specific people and the power of numbers.',
      steps: [
        {
          num: '1',
          title: 'Qualitative research',
          body:
            '20 in-depth interviews with active Gen Z who already run a business or are accelerating their own career. Goal: understand how they think about work, space and tools.',
        },
        {
          num: '2',
          title: 'Quantitative research',
          body:
            'A survey among 318 representatives of mainstream Gen Z, mostly high-school and university students. Validating interview insights at scale, identifying the strongest patterns.',
        },
        {
          num: '3',
          title: 'Interpretation & presentation',
          body:
            'A live workshop with the AV Media team. We went through the data section by section and translated it into concrete business angles — where and how to use it in sales pitches.',
        },
      ],
      assessedTitle: 'What exactly we assessed',
      assessedIntro:
        'We structured the research into four thematic sections that together give a complete picture of how Gen Z thinks about work and the environment it wants to function in.',
      assessed: [
        {
          num: '01',
          title: 'Mindset',
          body: 'Values, motivation, attitude to authority, relationship to meaning and status, career expectations.',
        },
        {
          num: '02',
          title: 'Work',
          body: 'What Gen Z really wants from a job, how it perceives flexibility, compensation and team relationships.',
        },
        {
          num: '03',
          title: 'AI',
          body:
            'How Gen Z uses AI in everyday life and study, what it expects from it at work and what signals it reads from an employer.',
        },
        {
          num: '04',
          title: 'Environment',
          body: 'What the physical workspace should look like, which zones Gen Z looks for and what puts it off the office.',
        },
      ],
    },
    findings: {
      headline: 'Four findings that change workspace design.',
      intro:
        'From dozens of data points we pick four — one from each section — with the biggest business impact for AV Media. Each has a practical consequence for how offices are designed today.',
      columns: ['What we found', 'Why it matters', 'What it means for AV Media'],
      items: [
        {
          category: 'Mindset',
          title: 'Meaning of work > status of work',
          cols: [
            "Gen Z doesn't care about the prestige of a title or the social status of an employer. It cares whether what it does makes sense — to itself and to the world around it.",
            'Traditional employer branding built on company size and hierarchy is losing weight. Young candidates choose companies by values and impact, not by the business card.',
            "The 'investment in the environment' argument is more convincing when it shows the space reflects the company's values. AV solutions are part of how a company lives its values, outward and inward.",
          ],
        },
        {
          category: 'Work',
          title: 'Time flexibility > home office',
          cols: [
            'Gen Z prefers choosing when it works over where it works. A fixed 9-to-5 in the office puts it off more than mandatory attendance itself.',
            'For Gen Z it is crucial to decide for themselves when they work. In the rest of the time they want to do sports, spend time with friends and pursue their own things. Work is no longer the centre of life, but one of its pillars.',
            'The space must be usable at different times of day and in different modes — morning, evening, between a workout and a meeting. Modular zones and easy switching of the AV setup between focus and sync work.',
          ],
        },
        {
          category: 'AI',
          title: 'AI is already a standard, not a novelty',
          cols: [
            "The vast majority of Gen Z uses AI daily. The question is no longer 'whether' but 'how deep'. For active Gen Z, AI is a strategic tool; for mainstream Gen Z, an everyday helper.",
            "If a company holds AI back or can't handle it, Gen Z reads it as a signal of being behind. Conversely, an environment that fully integrates AI sends a quiet signal that the company understands today.",
            'Space design must account for AI tools in the meeting flow — transcriptions and voice minutes. AV becomes the carrier of AI, not just a display.',
          ],
        },
        {
          category: 'Environment',
          title: 'Quiet and social zones must be properly separated',
          cols: [
            'For Gen Z it is crucial to have a clearly separated space for focused work and a space for meeting in the office. Open space where the two mix exhausts it.',
            "If the space can't do one of the two, Gen Z either won't come, or comes and works with headphones on, disappearing from the shared life of the company.",
            'A key opportunity for projects that design both zones in deliberate contrast. A quiet room with quality acoustics plus a social zone with a light AV setup for informal sync.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'What exactly AV Media got in hand.',
      intro:
        "Our work didn't end with a presentation. AV Media left with a set of outputs that their sales and product teams can reuse repeatedly — on every project, not just one campaign.",
      items: [
        {
          num: '01',
          title: 'Qualitative research',
          body:
            'A report from 20 in-depth interviews with active Gen Z. Sections Demographics, Online, Offline, Spark, AI and RAW data, plus an AI guide that lets you search the data conversationally.',
        },
        {
          num: '02',
          title: 'Quantitative research',
          body:
            'A report from the survey among 318 representatives of mainstream Gen Z. Structured into four sections — Context, Work, Mindset and AI — with RAW data for your own analysis.',
        },
        {
          num: '03',
          title: 'Live presentation of the results with the team',
          body:
            'A workshop where we walked the AV Media team through both reports, explained the context of each finding and opened space for questions across sales and product roles.',
        },
        {
          num: '04',
          title: 'Data interpretation & insights',
          body:
            'Translating the data into business consequences for AV Media — with concrete angles on how to use it in sales pitches and in arguments for workspace design.',
        },
      ],
      quote:
        'AV Media had a strong intuition about where the generation is heading. Our job was to give that intuition a name, numbers and words their clients hear. When sales holds the voice of three hundred Gen Z people in hand, the conversation is completely different.',
      quoteAuthor: '— the GenZ Consulting team',
    },
    whyUs: {
      headline: 'We do one thing. And we do it properly.',
      intro:
        'We specialise in Gen Z and connect it with consulting work for brands and HR teams. We work with our own research data, which we update regularly. Our recommendations never rest on feelings.',
      pillars: [
        {
          num: '01',
          title: 'Data in the background',
          body:
            'We back every recommendation with our own research among Gen Z. We work with current data about this generation, not estimates or trend reports from the internet.',
        },
        {
          num: '02',
          title: 'Big picture and detail',
          body:
            'We work at the strategic layer — segmentation, content pillars, brand positioning — and on individual wordings and recommendations for space design. Both in one team.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            "Our recommendations come from direct knowledge of how Gen Z thinks and communicates. We don't have to study this generation from the outside — we're part of it.",
        },
      ],
    },
    contact: CONTACT,
  },
};

const generali: Record<CaseStudyLocale, CaseStudy> = {
  cs: {
    client: 'Generali ČP',
    logo: '/logo-orizzontale.2020-07-16-17-41-47.jpeg',
    logoAlt: 'Generali',
    year: '2025',
    hero: {
      headline: 'Trainee program, který Gen Z skutečně chce',
      intro:
        'Spoluvytvořili jsme s Generali Českou pojišťovnou trainee program pro generaci Z. Od přepracování náborových textů přes metodiku osobního rozvoje až po komunikační strategii. Cílem bylo postavit program, který přitáhne a udrží ty nejlepší mladé talenty.',
    },
    scope: [
      { label: 'Rozsah', value: '10 fází programu' },
      { label: 'Délka projektu', value: 'do 6 měsíců' },
      { label: 'Metodika', value: 'Audit + výzkum + design' },
    ],
    stats: [
      { value: '10', label: 'fází programu kompletně přepracovaných z pohledu Gen Z' },
      { value: '6', label: 'průřezových oblastí (komunikace, manažeři, rozvoj, networking…)' },
      { value: '100 %', label: 'doporučení opřena o vlastní výzkum mezi Gen Z' },
    ],
    context: {
      headline: 'Trainee program v době, kdy Gen Z přepisuje pravidla náboru.',
      intro:
        'Generali Česká pojišťovna připravovala devítiměsíční trainee program pro 12 čerstvých absolventů. Otázka byla, jak ho udělat tak, aby skutečně oslovil generaci s radikálně jinými očekáváními, než ty předchozí.',
      clientLabel: 'Kdo je klient',
      client:
        'Generali Česká pojišťovna je největší pojišťovna na českém trhu s více než 200letou historií. Trainee program patří mezi klíčové nástroje pro dlouhodobý talent pipeline a staví na modelu 60 % reálná práce v týmu, 20 % rozvoj, 20 % společný udržitelnostní projekt, s rotacemi napříč odděleními (IT, data, právo, strategie) a networkingem s top managementem.',
      whyTitle: 'Proč to nebyl běžný projekt',
      whyIntro:
        'Gen Z je nejtěžší skupina pro nábor a zároveň skupina, která rozhoduje o budoucnosti firem. Má radikálně jiná očekávání než předchozí generace. Generali potřebovali:',
      whyPoints: [
        {
          title: 'Atraktivní nábor',
          body: 'Texty inzerátů, video komunikaci a nábor na platformách, kde Gen Z reálně hledá.',
        },
        {
          title: 'Smysluplnou práci',
          body: 'Trainees zapojené do reálných projektů, s jasnou strukturou rozvoje, kterou si sami řídí.',
        },
        {
          title: 'Komunitu uvnitř programu',
          body: 'Vztahy mezi trainees, neformální setkání s vedením, aktivity, které lidi propojí i mimo Teams.',
        },
        {
          title: 'Komunikaci, která sedne',
          body: 'Tón, formát i kanály, které Gen Z bere vážně, protože respektují její způsob komunikace.',
        },
      ],
      briefLabel: 'Naše zadání',
      brief:
        'Generali nás přizvali, abychom prošli celý devítiměsíční program pohledem Gen Z a společně s nimi ho dotvořili do podoby, která reálně osloví talenty z této generace. Měli program lehce předpřipravený interním týmem, naším úkolem bylo dovést ho do detailu, v textech, formátech, metodikách i komunikační strategii.',
    },
    approach: {
      headline: 'Tři kroky od insightu k funkčnímu programu.',
      intro:
        'Postupovali jsme metodicky. Nejdřív jsme rozuměli, pak měřili, pak spolu s Generali stavěli. Každá z našich úprav vycházela z dat o Gen Z nebo z diagnostiky reálného stavu programu.',
      steps: [
        {
          num: '1',
          title: 'Diagnostika',
          body:
            'Společný audit existujícího návrhu programu napříč 10 kroky, od náboru po development centrum.',
        },
        {
          num: '2',
          title: 'Výzkum',
          body: 'Vlastní výzkum mezi Gen Z, co od trainee programu reálně očekávají.',
        },
        {
          num: '3',
          title: 'Spolutvorba',
          body:
            'Konkrétní změny v textech, formátech, metodikách i kanálech komunikace, podložené daty z výzkumu.',
        },
      ],
      assessedTitle: 'Co konkrétně jsme posuzovali',
      assessedIntro:
        'Program Generali se skládá z 10 na sebe navazujících fází, každá s vlastní strukturou, komunikací a cílem. Posuzovali jsme každou fázi samostatně i v celku, aby na sebe smysluplně navazovaly z pohledu zkušenosti Gen Z trainee.',
      assessed: [
        { num: '1', title: 'Nábor' },
        { num: '2', title: 'Onboarding' },
        { num: '3', title: 'Smysluplná práce' },
        { num: '4', title: 'Rotace' },
        { num: '5', title: 'Den s ředitelem' },
        { num: '6', title: 'Praxe na retailu' },
        { num: '7', title: 'Kariérní rozvoj' },
        { num: '8', title: 'Networking' },
        { num: '9', title: 'Společný projekt' },
        { num: '10', title: 'Development centrum' },
      ],
      assessedNote:
        'Plus 6 průřezových oblastí: Komunikace náboru, Spolupráce s manažery, Očekávání kandidátů, Nástupní balíčky, Propojení trainees a chatbot Arnold. Každá s vlastní sadou společně vytvořených řešení.',
    },
    findings: {
      headline: 'Čtyři příklady toho, jak GenZ-friendly mění detaily i celek.',
      intro:
        'Vybíráme čtyři z desítek konkrétních řešení, která jsme společně s Generali nastavili. Ukazují, že rozdíl mezi „obyčejným“ a „GenZ-funkčním“ programem často spočívá v detailech i ve strukturálních volbách.',
      columns: ['Původní stav', 'Naše řešení', 'Proč to funguje'],
      items: [
        {
          category: 'Komunikace náboru',
          title: 'Hooky, které zaujmou',
          cols: [
            'Popisné texty inzerátů. Formulace „seberozvoj“, „bere vážně“, „vlastní projekt“.',
            'Hooky typu „Hledáš něco víc?“, „Nebudeš jen běhat ke kopírce“. Formulace „osobní rozvoj“ a jasně uvedený plat (200 Kč/h).',
            'Gen Z reaguje na konkrétní hooky a transparentnost, zejména u peněz.',
          ],
        },
        {
          category: 'Onboarding',
          title: 'E-learning videa pro asynchronní svět',
          cols: [
            'Online meetingy v úvodním dni s přednášejícími z jednotlivých oddělení.',
            'Krátká kvalitní e-learningová videa, pustitelná kdykoliv (i v MHD). Plus tři možné LMS varianty podle rozpočtu.',
            'Gen Z je mobile-first a asynchronní. Šetří čas firmy (jednou natočit) i trainees (kdykoliv pustit).',
          ],
        },
        {
          category: 'Společný projekt',
          title: 'Čtyřčlenné týmy s jasným ownership',
          cols: [
            'Všech 12 trainees pracovalo na jednom společném udržitelnostním projektu.',
            'Tři čtyřčlenné týmy. Každý s vlastním mentorem v roli PM. Příprava přes 8h design thinking session („Birth Giving“).',
            'Čtyřčlenný tým je ideální velikost pro skutečnou kolaboraci, jasný ownership a zdravou soutěživost mezi týmy.',
          ],
        },
        {
          category: 'Networking a visibility',
          title: 'Influenceři + neformální setkání',
          cols: [
            'Speed dating s top managementem jako forma networkingu. Tradiční komunikační kanály.',
            'Neformální setkání typu „pivko s CEO“ a spolupráce s Gen Z influencery (David Luu, Vilém Franěk z Close Friends & Co.).',
            'Neformální setkání podporují autenticitu. Influenceři navíc dostávají program tam, kde Gen Z reálně tráví čas.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'Co konkrétně dostalo Generali do ruky.',
      intro:
        'Naše práce nekončila prezentací. Generali odcházeli s materiály, které jejich HR a L&D tým může reálně používat u tohoto i dalších ročníků programu.',
      items: [
        {
          num: '01',
          title: 'Spolutvorba 10 fází programu',
          body:
            'Společná práce na každém kroku, od formulací inzerátů přes ikonografii v komunikačních materiálech až po metodiku ukončovacího development centra. Vše s jasným „jak“ a „proč“.',
        },
        {
          num: '02',
          title: 'Komunikační manuál',
          body:
            'Hierarchie sdělení (odměna, seberozvoj, vlastní projekt, flexibilita, setkání s vedením, komunita), tonalita, formáty a doporučené kanály včetně jobs.cz, sociálních sítí a influencer marketingu.',
        },
        {
          num: '03',
          title: 'Metodika Learning Contractu',
          body:
            'Plán osobního rozvoje, který si trainee píše sám, s jasnou strukturou cílů, pravidelných check-upů s manažerem a závěrečné reflexe. Nástroj použitelný opakovaně i u dalších ročníků programu.',
        },
        {
          num: '04',
          title: 'Spolupráce manažerů s trainees',
          body:
            'Mentoring, dobrovolné check-upy, obousměrná zpětná vazba, zapojení trainees do standardních týmových procesů. Praktický návod, jak trainees skutečně rozvíjet.',
        },
        {
          num: '05',
          title: 'Validační data z výzkumu mezi Gen Z',
          body:
            'Ke každému doporučení dohledatelná evidence z našeho výzkumu, co Gen Z reálně očekává od trainee programů a co je přitahuje.',
        },
      ],
      quote:
        'Generali měli skvělý záměr a solidně předpřipravený program. My jsme ho s nimi spolustavěli v detailech, kde se rozhoduje, jestli Gen Z řekne „tohle je pro mě“. Je to často neviditelná, ale rozhodující práce.',
      quoteAuthor: '— GenZ Consulting tým, vedoucí projektu',
    },
    whyUs: {
      headline: 'Děláme jednu věc. A tu pořádně.',
      intro:
        'Specializujeme se na Gen Z a propojujeme to s HR konzultací. Pracujeme s vlastními výzkumnými daty, která pravidelně aktualizujeme.',
      pillars: [
        {
          num: '01',
          title: 'Data na pozadí',
          body:
            'Každé doporučení opíráme o vlastní výzkum mezi Gen Z. Pracujeme s aktuálními daty o této generaci.',
        },
        {
          num: '02',
          title: 'Komplexnost i detail',
          body:
            'Pracujeme na strategické vrstvě (struktura programu) i na jednotlivých formulacích v textech. Obojí v jednom týmu.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            'Naše doporučení vychází z přímé znalosti toho, jak generace Z přemýšlí a komunikuje. Mluvíme jejím jazykem.',
        },
      ],
    },
    contact: CONTACT,
  },
  en: {
    client: 'Generali ČP',
    logo: '/logo-orizzontale.2020-07-16-17-41-47.jpeg',
    logoAlt: 'Generali',
    year: '2025',
    hero: {
      headline: 'A trainee program Gen Z actually wants.',
      intro:
        'Together with Generali Česká pojišťovna we co-created a trainee program for Gen Z — from rewriting recruitment copy through a personal-development methodology to a communication strategy. The goal was to build a program that attracts and retains the best young talent.',
    },
    scope: [
      { label: 'Scope', value: '10 program phases' },
      { label: 'Project length', value: 'up to 6 months' },
      { label: 'Method', value: 'Audit + research + design' },
    ],
    stats: [
      { value: '10', label: 'program phases completely reworked from a Gen Z perspective' },
      { value: '6', label: 'cross-cutting areas (communication, managers, development, networking…)' },
      { value: '100 %', label: 'of recommendations backed by our own research among Gen Z' },
    ],
    context: {
      headline: 'A trainee program at a time when Gen Z is rewriting the rules of recruitment.',
      intro:
        'Generali Česká pojišťovna was preparing a nine-month trainee program for 12 fresh graduates. The question was how to make it genuinely appeal to a generation with radically different expectations than the previous ones.',
      clientLabel: 'Who is the client',
      client:
        'Generali Česká pojišťovna is the largest insurer on the Czech market, with over 200 years of history. The trainee program is one of its key tools for a long-term talent pipeline and is built on a model of 60% real work in a team, 20% development, 20% a shared sustainability project — with rotations across departments (IT, data, legal, strategy) and networking with top management.',
      whyTitle: "Why this wasn't a routine project",
      whyIntro:
        'Gen Z is the hardest group to recruit and at the same time the group that decides the future of companies. It has radically different expectations than previous generations. Generali needed:',
      whyPoints: [
        {
          title: 'Attractive recruitment',
          body: 'Ad copy, video communication and recruiting on the platforms where Gen Z actually looks.',
        },
        {
          title: 'Meaningful work',
          body: 'Trainees involved in real projects, with a clear development structure they manage themselves.',
        },
        {
          title: 'A community inside the program',
          body: 'Relationships between trainees, informal meetings with leadership, activities that connect people beyond Teams.',
        },
        {
          title: 'Communication that lands',
          body: 'Tone, format and channels Gen Z takes seriously, because they respect its way of communicating.',
        },
      ],
      briefLabel: 'Our brief',
      brief:
        'Generali invited us to go through the entire nine-month program through a Gen Z lens and, together with them, finish it into a form that genuinely appeals to talent from this generation. They had the program loosely pre-prepared by an internal team — our task was to bring it to the detail level: in copy, formats, methodologies and communication strategy.',
    },
    approach: {
      headline: 'Three steps from insight to a working program.',
      intro:
        'We proceeded methodically. First we understood, then we measured, then we built together with Generali. Every adjustment of ours came from data about Gen Z or from a diagnosis of the program’s real state.',
      steps: [
        {
          num: '1',
          title: 'Diagnosis',
          body:
            'A joint audit of the existing program design across 10 steps — from recruitment to the development centre.',
        },
        {
          num: '2',
          title: 'Research',
          body: 'Our own research among Gen Z — what they really expect from a trainee program.',
        },
        {
          num: '3',
          title: 'Co-creation',
          body:
            'Concrete changes in copy, formats, methodologies and communication channels, backed by research data.',
        },
      ],
      assessedTitle: 'What exactly we assessed',
      assessedIntro:
        'The Generali program consists of 10 consecutive phases, each with its own structure, communication and goal. We assessed each phase individually and as a whole, so they follow on meaningfully from the perspective of the Gen Z trainee experience.',
      assessed: [
        { num: '1', title: 'Recruitment' },
        { num: '2', title: 'Onboarding' },
        { num: '3', title: 'Meaningful work' },
        { num: '4', title: 'Rotations' },
        { num: '5', title: 'A day with the CEO' },
        { num: '6', title: 'Retail practice' },
        { num: '7', title: 'Career development' },
        { num: '8', title: 'Networking' },
        { num: '9', title: 'Shared project' },
        { num: '10', title: 'Development centre' },
      ],
      assessedNote:
        'Plus 6 cross-cutting areas: Recruitment communication, Cooperation with managers, Candidate expectations, Onboarding packages, Connecting trainees and the chatbot Arnold. Each with its own set of co-created solutions.',
    },
    findings: {
      headline: 'Four examples of how Gen Z-friendly changes both the details and the whole.',
      intro:
        "We pick four of dozens of concrete solutions we set up together with Generali. They show that the difference between an 'ordinary' and a 'Gen Z-functional' program often lies in details as well as structural choices.",
      columns: ['Original state', 'Our solution', 'Why it works'],
      items: [
        {
          category: 'Recruitment communication',
          title: 'Hooks that grab attention',
          cols: [
            "Descriptive ad copy. Phrases like 'self-development', 'takes you seriously', 'own project'.",
            "Hooks like 'Looking for something more?', 'You won't just run to the copier'. The phrase 'personal development' and a clearly stated salary (200 CZK/h).",
            'Gen Z responds to concrete hooks and transparency — especially about money.',
          ],
        },
        {
          category: 'Onboarding',
          title: 'E-learning videos for an asynchronous world',
          cols: [
            'Online meetings on the first day with speakers from individual departments.',
            'Short quality e-learning videos, playable anytime (even on the tram). Plus three possible LMS variants by budget.',
            'Gen Z is mobile-first and asynchronous. It saves the company time (film once) and the trainees’ time (play anytime).',
          ],
        },
        {
          category: 'Shared project',
          title: 'Four-person teams with clear ownership',
          cols: [
            'All 12 trainees worked on a single shared sustainability project.',
            "Three four-person teams. Each with its own mentor as PM. Prepared via an 8-hour design-thinking session ('Birth Giving').",
            'A four-person team is the ideal size for real collaboration, clear ownership and healthy competition between teams.',
          ],
        },
        {
          category: 'Networking & visibility',
          title: 'Influencers + informal meetings',
          cols: [
            'Speed dating with top management as a form of networking. Traditional communication channels.',
            "Informal meetings like 'a beer with the CEO' and cooperation with Gen Z influencers (David Luu, Vilém Franěk from Close Friends & Co.).",
            'Informal meetings foster authenticity. And influencers carry the program to where Gen Z actually spends its time.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'What exactly Generali got in hand.',
      intro:
        "Our work didn't end with a presentation. Generali left with materials their HR and L&D team can really use for this and future cohorts of the program.",
      items: [
        {
          num: '01',
          title: 'Co-creation of the 10 program phases',
          body:
            "Joint work on every step — from ad wording through iconography in communication materials to the methodology of the closing development centre. All with a clear 'how' and 'why'.",
        },
        {
          num: '02',
          title: 'Communication manual',
          body:
            'A hierarchy of messages (reward, self-development, own project, flexibility, meeting leadership, community), tone, formats and recommended channels including jobs.cz, social media and influencer marketing.',
        },
        {
          num: '03',
          title: 'Learning Contract methodology',
          body:
            'A personal development plan the trainee writes themselves — with a clear structure of goals, regular check-ups with a manager and a final reflection. A tool reusable for future cohorts too.',
        },
        {
          num: '04',
          title: 'Manager–trainee collaboration',
          body:
            'Mentoring, voluntary check-ups, two-way feedback, involving trainees in standard team processes. A practical guide to genuinely developing trainees.',
        },
        {
          num: '05',
          title: 'Validation data from research among Gen Z',
          body:
            'For every recommendation, traceable evidence from our research — what Gen Z really expects from trainee programs and what attracts it.',
        },
      ],
      quote:
        "Generali had a great intention and a solidly pre-prepared program. We co-built it with them in the details where it's decided whether Gen Z says 'this is for me'. It's often invisible but decisive work.",
      quoteAuthor: '— GenZ Consulting team, project lead',
    },
    whyUs: {
      headline: 'We do one thing. And we do it properly.',
      intro:
        'We specialise in Gen Z and connect it with HR consulting. We work with our own research data, which we update regularly.',
      pillars: [
        {
          num: '01',
          title: 'Data in the background',
          body:
            'We back every recommendation with our own research among Gen Z. We work with current data about this generation.',
        },
        {
          num: '02',
          title: 'Big picture and detail',
          body:
            'We work at the strategic layer (program structure) and on individual wordings in the copy. Both in one team.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            'Our recommendations come from direct knowledge of how Gen Z thinks and communicates. We speak its language.',
        },
      ],
    },
    contact: CONTACT,
  },
};

const globalPayments: Record<CaseStudyLocale, CaseStudy> = {
  cs: {
    client: 'Global Payments',
    logo: '/globalpayments.jpeg',
    logoAlt: 'Global Payments',
    year: '2026',
    hero: {
      headline: 'Když produkt funguje, ale Gen Z zákazník se k němu nedostane.',
      intro:
        'Prošli jsme celou cestu zákazníka Global Payments pohledem Gen Z mikropodnikatele, od Googlu přes web a objednávku až po terminál. Pojmenovali jsme, kde se ztrácí potenciální zákazníci a dali konkrétní playbook, jak je získat zpátky.',
    },
    scope: [
      { label: 'Rozsah', value: 'Komplexní audit cesty zákazníka' },
      { label: 'Metodika', value: 'Mystery shopping, výzkum, analýza' },
      { label: 'Výstup', value: 'Konkrétní playbook' },
    ],
    stats: [
      { value: '8', label: 'fází cesty zákazníka pod drobnohledem, od vyhledávání po terminál' },
      { value: '2', label: 'segmenty výzkumu, kvantitativní i kvalitativní data' },
      { value: '100 %', label: 'doporučení opřená o vlastní výzkum mezi Gen Z' },
    ],
    context: {
      headline: 'Skrytí zákazníci, které tradiční sales motion nevidí.',
      intro:
        'Global Payments má funkční produkt a silnou globální značku, ale Gen Z mikropodnikatelé se k jeho terminálům prakticky nedostanou. Když jsme se na tu cestu podívali jako zákazník, pochopili jsme proč.',
      clientLabel: 'Kdo je klient',
      client:
        'Global Payments je globální fintech, který v Česku nabízí platební terminály a online platební brány pro kavárny, restaurace, e-shopy, maloobchody a živnostníky. V portfoliu má řešení od mobilního terminálu po komplexní pokladní systém.',
      whyTitle: 'Proč to nebyl běžný projekt',
      whyIntro:
        'Gen Z mikropodnikatelé jsou rychle rostoucí segment, freelanceři, kreativci, malé e-shopy, kavárny, brand owneři. Stojí ale mimo tradiční B2B sales motion, kterým fintech tradičně cílí na korporátní klientelu. Global Payments potřebovali:',
      whyPoints: [
        {
          title: 'Najít je tam, kde hledají',
          body: 'AI search, Google a sociální sítě jsou pro Gen Z první kontaktní body, klasické sales kanály už nestačí.',
        },
        {
          title: 'Mluvit tak, jak mluví oni',
          body: 'Korporátní žargon a prázdné fráze Gen Z odrazují, čekají věcnost, transparentnost a srozumitelnost.',
        },
        {
          title: 'Nabídnout cestu, která neodrazuje',
          body: 'UX webu, formuláře, CTA, onboardingové emaily, každý krok rozhoduje, jestli Gen Z dotáhne objednávku do konce.',
        },
        {
          title: 'Postavit obsah, který je zajímá',
          body: 'Nejde o korporátní novinky a B2B partnerství, Gen Z podnikatel řeší cashflow, daně, fakturace, růst.',
        },
      ],
      briefLabel: 'Naše zadání',
      brief:
        'Projít celou cestu zákazníka jako Gen Z mikropodnikatel a pojmenovat, kde Global Payments ztrácí tento segment. Doplnit pohled vlastním výzkumem mezi Gen Z a předat klientovi konkrétní playbook se srozumitelnými doporučeními pro každou fázi.',
    },
    approach: {
      headline: 'Tři kroky od mystery shoppingu k playbooku.',
      intro:
        'Postupovali jsme metodicky. Sami jsme prošli cestu zákazníka, doplnili ji výzkumem mezi Gen Z mikropodnikateli a teprve potom napsali doporučení.',
      steps: [
        {
          num: '1',
          title: 'Diagnostika',
          body:
            'Mystery shopping celé cesty zákazníka jako Gen Z mikropodnikatel, od googlení přes web a formulář až po terminál v ruce.',
        },
        {
          num: '2',
          title: 'Výzkum',
          body:
            'Vlastní kvantitativní i kvalitativní výzkum mezi Gen Z mikropodnikateli, co reálně řeší při výběru platebního řešení.',
        },
        {
          num: '3',
          title: 'Audit & playbook',
          body:
            'Pojmenování insightů a konkrétní doporučení pro každou fázi cesty, prioritizovaný seznam změn s jasným „jak“ a „proč“.',
        },
      ],
      assessedTitle: 'Co konkrétně jsme posuzovali',
      assessedIntro:
        'Audit pokryl čtyři pohledy, které dohromady dávají kompletní obraz, jak Gen Z mikropodnikatel značku Global Payments vidí, hledá, kupuje a hodnotí.',
      assessed: [
        {
          num: '01',
          title: 'Cesta zákazníka & UX',
          body: 'Osm fází od prvního vyhledávání přes web, formulář, objednávku, podporu a terminál. Každý krok detailně rozebraný.',
        },
        {
          num: '02',
          title: 'Social media',
          body: 'Kde Global Payments komunikuje, jaké formáty používá, jak rezonuje obsah. Co tam Gen Z reálně zajímá a co tam chybí.',
        },
        {
          num: '03',
          title: 'Google reviews',
          body: 'Sběr a analýza online recenzí, co konkrétně zákazníkům na Global Payments vadí, co naopak chválí a kde jsou opakované patterny.',
        },
        {
          num: '04',
          title: 'Konkurence',
          body: 'Jak komunikují SumUp, KB SmartPay, Dotykačka, Comgate, ČSOB. Kde jsou silnější, kde slabší a co z toho plyne pro Global Payments.',
        },
      ],
    },
    findings: {
      headline: 'Čtyři místa, kde se Gen Z ztrácí.',
      intro:
        'Z desítek nálezů z auditu vybíráme čtyři, které mají největší byznysový dopad. Tři z nich rozhodují o tom, jestli Gen Z vůbec dorazí, a jeden o tom, jak na firmu vzpomíná po prvním nákupu.',
      columns: ['Co jsme našli', 'Proč to bolí', 'Naše doporučení'],
      items: [
        {
          category: '01 · Vyhledávání',
          title: 'Global Payments „neexistuje“',
          cols: [
            'ChatGPT vidí Global Payments jen jako řešení pro velké firmy. Google bez placené reklamy ukazuje firmu až na druhé straně výsledků.',
            'Gen Z začíná každou rešerši přes ChatGPT a Google, pokud tam nejste, neexistujete. Konkurence vyhrává hned na prvním kroku.',
            'SEO a AI search optimalizace, jasná pozice „pro mikropodnikatele“, brand awareness na platformách, kde Gen Z reálně tráví čas.',
          ],
        },
        {
          category: '02 · Web',
          title: 'Složitý na orientaci',
          cols: [
            'Bílá přesměrovací stránka, dlouhé texty bez ceny. Není jasně řečeno, že terminály jsou v podstatě zdarma. CTA „Získat nabídku“ vyvolává obavu z prodejního hovoru.',
            'Gen Z odchází po pár vteřinách dezorientace. Konkurence (SumUp 399 Kč) přebíjí jednoduchostí a transparentní cenou.',
            'Zkrátit copy, „zdarma“ jako hero claim, transparentní ceník, srozumitelné CTA, kalkulačka eligibility pro self-service.',
          ],
        },
        {
          category: '03 · Objednávka',
          title: 'Zahlcující záplava emailů',
          cols: [
            'Po objednání chodí nadměrné množství emailů (potvrzení, přihlašovací údaje, smluvní dokumenty, návody, marketing) v rychlém sledu, často duplicitně.',
            'Gen Z čeká krátkou, přehlednou onboarding zprávu. Email overload působí amatérsky a generuje frustraci ještě před prvním použitím terminálu.',
            'Konsolidovat do dvou až tří strukturovaných emailů, zbytek přesunout do zákaznického portálu nebo notifikací v aplikaci.',
          ],
        },
        {
          category: '04 · Social media',
          title: 'Mluvíme o tom, co Gen Z nezajímá',
          cols: [
            'Global Payments komunikuje korporátní novinky, B2B partnerství a technické features. Gen Z mikropodnikatelé řeší cashflow, daně, fakturace a růst byznysu.',
            'Obsah neoslovuje cílovku. Nulový engagement, nulový brand build, neviditelnost u segmentu, který by mohl značku organicky šířit.',
            'Content pillars mířené na reálné starosti Gen Z podnikatele, edukační obsah, use cases v krátkých videoformátech.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'Co konkrétně Global Payments dostali do ruky.',
      intro:
        'Naše práce nekončila prezentací. Klient odešel s pěti samostatnými výstupy, které jeho marketing, sales i UX tým mohou používat opakovaně, ne jen u jedné kampaně.',
      items: [
        {
          num: '01',
          title: 'Mystery shopping report',
          body:
            'Kompletní průchod cestou zákazníka v osmi fázích, vyhledávání, web, kontaktní formulář, objednávka, podpora, GP TOM, terminál a další tipy. Každá fáze s nálezy a doporučeními.',
        },
        {
          num: '02',
          title: 'Konkurenční analýza',
          body:
            'Kdo a jak v segmentu komunikuje, SumUp, KB SmartPay, Dotykačka, ČSOB, Comgate. V čem je každý silný, kde má slabiny a co z toho plyne pro pozici Global Payments.',
        },
        {
          num: '03',
          title: 'Výzkum mezi Gen Z mikropodnikateli',
          body:
            'Kvantitativní i kvalitativní data o tom, co rozhoduje při výběru platebního řešení, jaké brandy znají, čeho se bojí a co je naopak motivuje k nákupu.',
        },
        {
          num: '04',
          title: 'Google reviews report',
          body:
            'Sběr a analýza online recenzí, co konkrétně zákazníkům na Global Payments vadí, kde se opakují vzorce a jaké patterny komunikace by recenze posunuly k lepšímu.',
        },
        {
          num: '05',
          title: 'Playbook s konkrétními doporučeními',
          body:
            'Pro každou fázi cesty zákazníka prioritizovaný seznam změn s odhadem dopadu a náročnosti. Použitelný jako roadmap pro marketing, UX i product tým.',
        },
      ],
      quote:
        'Global Payments mají skvělý produkt. My jsme jim ukázali, kde mezi produktem a zákazníkem stojí překážky, které nikdo zevnitř firmy už nevidí. Mystery shopping očima Gen Z je jedno z nejtvrdších zrcadel, jaké si firma může dát.',
      quoteAuthor: '— tým GenZ Consulting',
    },
    whyUs: {
      headline: 'Děláme jednu věc. A tu pořádně.',
      intro:
        'Specializujeme se na Gen Z a propojujeme to s konzultační prací pro značky a HR týmy. Pracujeme s vlastními výzkumnými daty, která pravidelně aktualizujeme. Naše doporučení nikdy nestojí na pocitech.',
      pillars: [
        {
          num: '01',
          title: 'Data na pozadí',
          body:
            'Každé doporučení opíráme o vlastní výzkum mezi Gen Z. Pracujeme s aktuálními daty o této generaci, ne s odhady ani trendovými zprávami z internetu.',
        },
        {
          num: '02',
          title: 'Komplexnost i detail',
          body:
            'Pracujeme na strategické vrstvě, pozice značky, segmentace, content pillars, i na jednotlivých formulacích v textech a CTA. Obojí v jednom týmu.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            'Naše doporučení vychází z přímé znalosti toho, jak Gen Z přemýšlí a komunikuje. Nemusíme tu generaci zkoumat, jsme její součástí.',
        },
      ],
    },
    contact: CONTACT,
  },
  en: {
    client: 'Global Payments',
    logo: '/globalpayments.jpeg',
    logoAlt: 'Global Payments',
    year: '2026',
    hero: {
      headline: "When the product works, but the Gen Z customer can't reach it.",
      intro:
        'We walked the entire Global Payments customer journey through the eyes of a Gen Z micro-entrepreneur — from Google through the website and order to the terminal. We named where potential customers are lost and gave a concrete playbook on how to win them back.',
    },
    scope: [
      { label: 'Scope', value: 'Comprehensive customer-journey audit' },
      { label: 'Method', value: 'Mystery shopping, research, analysis' },
      { label: 'Output', value: 'A concrete playbook' },
    ],
    stats: [
      { value: '8', label: 'customer-journey phases under the microscope — from search to terminal' },
      { value: '2', label: 'research segments — quantitative and qualitative data' },
      { value: '100 %', label: 'of recommendations backed by our own research among Gen Z' },
    ],
    context: {
      headline: "Hidden customers the traditional sales motion can't see.",
      intro:
        'Global Payments has a working product and a strong global brand, but Gen Z micro-entrepreneurs barely reach its terminals. When we looked at that journey as a customer, we understood why.',
      clientLabel: 'Who is the client',
      client:
        'Global Payments is a global fintech that in the Czech Republic offers payment terminals and online payment gateways for cafés, restaurants, e-shops, retailers and sole traders. Its portfolio ranges from a mobile terminal to a complete POS system.',
      whyTitle: "Why this wasn't a routine project",
      whyIntro:
        'Gen Z micro-entrepreneurs are a fast-growing segment — freelancers, creatives, small e-shops, cafés, brand owners. But they stand outside the traditional B2B sales motion fintech uses to target corporate clients. Global Payments needed:',
      whyPoints: [
        {
          title: 'Find them where they search',
          body: "AI search, Google and social media are Gen Z's first touchpoints — classic sales channels are no longer enough.",
        },
        {
          title: 'Speak the way they speak',
          body: 'Corporate jargon and empty phrases put Gen Z off — it expects substance, transparency and clarity.',
        },
        {
          title: "Offer a journey that doesn't deter",
          body: 'Website UX, forms, CTAs, onboarding emails — every step decides whether Gen Z finishes the order.',
        },
        {
          title: 'Build content they care about',
          body: "It's not about corporate news and B2B partnerships — the Gen Z entrepreneur deals with cashflow, taxes, invoicing, growth.",
        },
      ],
      briefLabel: 'Our brief',
      brief:
        'Walk the entire customer journey as a Gen Z micro-entrepreneur and name where Global Payments loses this segment. Complement the view with our own research among Gen Z and hand the client a concrete playbook with clear recommendations for each phase.',
    },
    approach: {
      headline: 'Three steps from mystery shopping to a playbook.',
      intro:
        'We proceeded methodically. We walked the customer journey ourselves, complemented it with research among Gen Z micro-entrepreneurs, and only then wrote the recommendations.',
      steps: [
        {
          num: '1',
          title: 'Diagnosis',
          body:
            'Mystery shopping of the entire customer journey as a Gen Z micro-entrepreneur — from googling through the website and form to the terminal in hand.',
        },
        {
          num: '2',
          title: 'Research',
          body:
            'Our own quantitative and qualitative research among Gen Z micro-entrepreneurs — what they really deal with when choosing a payment solution.',
        },
        {
          num: '3',
          title: 'Audit & playbook',
          body:
            "Naming the insights and concrete recommendations for each phase of the journey — a prioritised list of changes with a clear 'how' and 'why'.",
        },
      ],
      assessedTitle: 'What exactly we assessed',
      assessedIntro:
        'The audit covered four lenses that together give a complete picture of how a Gen Z micro-entrepreneur sees, searches, buys and evaluates the Global Payments brand.',
      assessed: [
        {
          num: '01',
          title: 'Customer journey & UX',
          body: 'Eight phases from the first search through the website, form, order, support and terminal. Every step analysed in detail.',
        },
        {
          num: '02',
          title: 'Social media',
          body: 'Where Global Payments communicates, what formats it uses, how the content resonates. What actually interests Gen Z there and what is missing.',
        },
        {
          num: '03',
          title: 'Google reviews',
          body: 'Collecting and analysing online reviews — what specifically bothers customers about Global Payments, what they praise and where the recurring patterns are.',
        },
        {
          num: '04',
          title: 'Competition',
          body: 'How SumUp, KB SmartPay, Dotykačka, Comgate and ČSOB communicate. Where they are stronger, where weaker and what that means for Global Payments.',
        },
      ],
    },
    findings: {
      headline: 'Four places where Gen Z gets lost.',
      intro:
        'From dozens of audit findings we pick four with the biggest business impact. Three decide whether Gen Z arrives at all, and one decides how it remembers the company after the first purchase.',
      columns: ['What we found', 'Why it hurts', 'Our recommendation'],
      items: [
        {
          category: '01 · Search',
          title: "Global Payments 'doesn't exist'",
          cols: [
            'ChatGPT sees Global Payments only as a solution for large companies. Without paid ads, Google shows the company on the second page of results.',
            "Gen Z starts every search via ChatGPT and Google — if you're not there, you don't exist. The competition wins at the very first step.",
            "SEO and AI-search optimisation, a clear 'for micro-entrepreneurs' positioning, brand awareness on the platforms where Gen Z actually spends its time.",
          ],
        },
        {
          category: '02 · Website',
          title: 'Hard to navigate',
          cols: [
            "A blank redirect page, long texts without a price. It's not clearly said that the terminals are essentially free. The 'Get a quote' CTA triggers fear of a sales call.",
            'Gen Z leaves after a few seconds of disorientation. The competition (SumUp at 399 CZK) wins with simplicity and a transparent price.',
            "Shorten the copy, 'free' as the hero claim, a transparent price list, a clear CTA, an eligibility calculator for self-service.",
          ],
        },
        {
          category: '03 · Order',
          title: 'An overwhelming flood of emails',
          cols: [
            'After ordering, an excessive number of emails arrive (confirmation, login details, contract documents, guides, marketing) in quick succession, often duplicated.',
            'Gen Z expects a short, clear onboarding message. Email overload feels amateurish and generates frustration before the terminal is even first used.',
            'Consolidate into two or three structured emails, move the rest into a customer portal or in-app notifications.',
          ],
        },
        {
          category: '04 · Social media',
          title: "We talk about what Gen Z doesn't care about",
          cols: [
            'Global Payments communicates corporate news, B2B partnerships and technical features. Gen Z micro-entrepreneurs deal with cashflow, taxes, invoicing and business growth.',
            'The content does not reach the target. Zero engagement, zero brand building, invisibility with a segment that could spread the brand organically.',
            'Content pillars aimed at the real worries of the Gen Z entrepreneur, educational content, use cases in short video formats.',
          ],
        },
      ],
    },
    outputs: {
      headline: 'What exactly Global Payments got in hand.',
      intro:
        "Our work didn't end with a presentation. The client left with five standalone outputs that its marketing, sales and UX teams can reuse repeatedly — not just for one campaign.",
      items: [
        {
          num: '01',
          title: 'Mystery shopping report',
          body:
            'A complete walk-through of the customer journey in eight phases — search, website, contact form, order, support, GP TOM, terminal and further tips. Each phase with findings and recommendations.',
        },
        {
          num: '02',
          title: 'Competitive analysis',
          body:
            "Who communicates in the segment and how — SumUp, KB SmartPay, Dotykačka, ČSOB, Comgate. Where each is strong, where it has weaknesses and what that means for Global Payments' positioning.",
        },
        {
          num: '03',
          title: 'Research among Gen Z micro-entrepreneurs',
          body:
            'Quantitative and qualitative data on what decides the choice of a payment solution, which brands they know, what they fear and what motivates them to buy.',
        },
        {
          num: '04',
          title: 'Google reviews report',
          body:
            'Collecting and analysing online reviews — what specifically bothers customers, where patterns repeat and which communication patterns would move the reviews for the better.',
        },
        {
          num: '05',
          title: 'Playbook with concrete recommendations',
          body:
            'For each phase of the customer journey, a prioritised list of changes with an estimate of impact and effort. Usable as a roadmap for marketing, UX and product teams.',
        },
      ],
      quote:
        "Global Payments has a great product. We showed them where the obstacles between product and customer stand — ones no one inside the company can see anymore. Mystery shopping through Gen Z's eyes is one of the toughest mirrors a company can hold up to itself.",
      quoteAuthor: '— the GenZ Consulting team',
    },
    whyUs: {
      headline: 'We do one thing. And we do it properly.',
      intro:
        'We specialise in Gen Z and connect it with consulting work for brands and HR teams. We work with our own research data, which we update regularly. Our recommendations never rest on feelings.',
      pillars: [
        {
          num: '01',
          title: 'Data in the background',
          body:
            'We back every recommendation with our own research among Gen Z. We work with current data about this generation, not estimates or trend reports from the internet.',
        },
        {
          num: '02',
          title: 'Big picture and detail',
          body:
            'We work at the strategic layer — brand positioning, segmentation, content pillars — and on individual wordings in copy and CTAs. Both in one team.',
        },
        {
          num: '03',
          title: 'Gen Z native',
          body:
            "Our recommendations come from direct knowledge of how Gen Z thinks and communicates. We don't have to study this generation — we're part of it.",
        },
      ],
    },
    contact: CONTACT,
  },
};

export const CASE_STUDIES: Record<string, Record<CaseStudyLocale, CaseStudy>> = {
  'av-media': avMedia,
  'global-payments': globalPayments,
  generali: generali,
};

export const caseStudySlugs = Object.keys(CASE_STUDIES);

export function getCaseStudy(slug: string, locale: string): CaseStudy | null {
  const entry = CASE_STUDIES[slug];
  if (!entry) return null;
  const loc: CaseStudyLocale = locale === 'en' ? 'en' : 'cs';
  return entry[loc];
}
