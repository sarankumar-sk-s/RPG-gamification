import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import townBg from '../assets/town_quest_bg.png'
import wallSkyBg from '../assets/wall_sky_bg.png'

export const worldProgressionData = [
  {
    id: 'world-1',
    number: 'WORLD 1',
    name: 'The Genesis Citadel',
    subtitle: 'Cradle of the Awakened Operator',
    description: 'The fortified nexus where rookies master the foundational tri-discipline: coding architecture, physical conditioning, and unbroken circadian flow.',
    status: 'ACTIVE', // 'ACTIVE', 'COMPLETED', 'LOCKED'
    isLocked: false,
    levelRequired: 1,
    questsRequired: 0,
    questsCompleted: 0,
    totalQuests: 10,
    dominantRealm: 'INTELLECT & DISCIPLINE',
    colorTheme: 'cyan',
    accentColor: '#38bdf8',
    backgroundImage: panoramaBg,
    loreExcerpt: '“In the silence of the dawn citadel, the vanguard is forged not by ambition, but by repeatable execution.”',
    landmarks: [
      { name: 'Core Server Spire', status: 'In Progress' },
      { name: 'Bastion Training Yard', status: 'Undiscovered' },
      { name: 'Monastic Focus Archive', status: 'Undiscovered' }
    ]
  },
  {
    id: 'world-2',
    number: 'WORLD 2',
    name: 'Titan Sky Bastion',
    subtitle: 'High-Altitude Compound Proving Grounds',
    description: 'Floating monoliths anchored above cloud-banks where physical limits and metabolic fortitude are tested against progressive gravity matrices.',
    status: 'LOCKED',
    isLocked: true,
    levelRequired: 4,
    questsRequired: 5,
    questsCompleted: 0,
    totalQuests: 12,
    dominantRealm: 'STRENGTH & VITALITY',
    colorTheme: 'red',
    accentColor: '#f43f5e',
    backgroundImage: wallSkyBg,
    loreExcerpt: '“To command the external world, one must first master the biological vessel that carries the spirit.”',
    landmarks: [
      { name: 'Apex Pull Pillar', status: 'Locked' },
      { name: 'Hypobaric Cardio Ring', status: 'Locked' },
      { name: 'Cryo-Recovery Well', status: 'Locked' }
    ]
  },
  {
    id: 'world-3',
    number: 'WORLD 3',
    name: 'Voidwalker Nebula Archive',
    subtitle: 'Deep Cognitive & Philosophical Singularity',
    description: 'An ethereal realm beyond digital noise where high-leverage mental models, deep flow sanctuary, and stoic wisdom are woven into second nature.',
    status: 'LOCKED',
    isLocked: true,
    levelRequired: 8,
    questsRequired: 15,
    intellectRequired: 22,
    questsCompleted: 0,
    totalQuests: 16,
    dominantRealm: 'WISDOM & INTELLECT',
    colorTheme: 'purple',
    accentColor: '#c084fc',
    backgroundImage: townBg,
    loreExcerpt: '“Only those who silence the thousand false sirens of distraction may decode the sovereign frequency.”',
    unlockCriteria: [
      'Reach Character Level 8',
      'Complete 15 Quests in Worlds 1 & 2',
      'Achieve 22+ Intellect Stat Points'
    ],
    landmarks: [
      { name: 'The Silent Sanctum', status: 'Locked' },
      { name: 'Grand Algorithmic Oracle', status: 'Locked' },
      { name: 'Monk Reflection Pool', status: 'Locked' }
    ]
  },
  {
    id: 'world-4',
    number: 'WORLD 4',
    name: 'Ascendant Singularity',
    subtitle: 'The Pinnacle of Holistic Reality Mastery',
    description: 'The ultimate endgame frontier where all 5 pillars—Intellect, Strength, Vitality, Wisdom, and Discipline—fuse into an indomitable sovereign operator.',
    status: 'LOCKED',
    isLocked: true,
    levelRequired: 15,
    questsRequired: 30,
    disciplineRequired: 28,
    questsCompleted: 0,
    totalQuests: 20,
    dominantRealm: 'ALL PILLARS CONVERGENCE',
    colorTheme: 'gold',
    accentColor: '#fbbf24',
    backgroundImage: panoramaBg,
    loreExcerpt: '“Reality bends to the will of the disciplined. You are no longer playing the game—you are writing the engine.”',
    unlockCriteria: [
      'Reach Character Level 15',
      'Complete 30 Total Quests',
      'Achieve 28+ Discipline Stat Points',
      'Maintain a 21-Day Active Streak'
    ],
    landmarks: [
      { name: 'The Sovereign Throne', status: 'Locked' },
      { name: 'Eternal Flame of Habit', status: 'Locked' },
      { name: 'Transcendent Aegis', status: 'Locked' }
    ]
  }
]

export const storyChaptersData = [
  {
    id: 'chapter-1',
    chapterNumber: 'CHAPTER 1',
    episodeNumber: 'EPISODE 1',
    title: 'To You, in 2000 Years: The Fall of Shiganshina, Part 1',
    japaneseTitle: '二千年後の君へ ―シガンシナ崩壊①―',
    status: 'COMPLETED', // 'COMPLETED', 'AVAILABLE', 'LOCKED'
    isLocked: false,
    coverImage: panoramaBg,
    synopsis: 'For over a century, the remnants of humanity have lived sheltered behind three massive concentric walls—Maria, Rose, and Sheena—in uneasy peace from monstrous, man-eating Titans. In the southern frontier district of Shiganshina, young Eren Yeager yearns to venture beyond the perimeter and explore the outside world. That century of peace is violently shattered when an unprecedented 60-meter Colossal Titan suddenly materializes and breaches the outer gate, allowing hordes of Titans to swarm the district.',
    shortSummary: 'Humanity has lived inside three concentric walls for 100 years in peace from Titans. Eren Yeager yearns for the outside world, but peaceful life is shattered when a 60-meter Colossal Titan breaches Wall Maria’s gate, unleashing Titans upon Shiganshina.',
    quote: '“On that day, mankind received a grim reminder. We lived in fear of the Titans and were disgraced to live in these cages we called walls.”',
    location: 'Wall Maria • Shiganshina District',
    rewardsGranted: '+150 XP • Cadet Recruit Insignia • Chapter 2 Access',
    keyMoments: [
      'A century of fragile peace behind 50-meter walls',
      'The sudden arrival of the 60-meter Colossal Titan',
      'Breach of Shiganshina outer gate and invasion of Titans',
      'Tragic fall of Eren’s home district'
    ]
  },
  {
    id: 'chapter-2',
    chapterNumber: 'CHAPTER 2',
    episodeNumber: 'EPISODE 2',
    title: 'That Day: The Fall of Shiganshina, Part 2',
    japaneseTitle: 'その日 ―シガンシナ崩壊②―',
    status: 'AVAILABLE',
    isLocked: false,
    coverImage: wallSkyBg,
    synopsis: 'In the chaotic aftermath of the initial breach, an Armored Titan plows through the inner gate of Wall Maria, forcing humanity to cede a third of its territory and retreat behind Wall Rose amid catastrophic famine and panic. Traumatized by the tragic death of his mother, Eren burns with an unyielding vengeance against the Titans. Alongside Mikasa and Armin, he enlists in the military to reclaim humanity’s future.',
    shortSummary: 'Following the devastating fall of Wall Maria and the tragic loss of his mother, Eren and the surviving refugees escape behind Wall Rose. Burning with an oath to exterminate every Titan, Eren, Mikasa, and Armin enlist in the military.',
    quote: '“I’ll wipe them out... every last one of them from this world!”',
    location: 'Wall Rose • Southern Refugee Camp',
    rewardsGranted: '+250 XP • +50 Gold • Cadet Ranks Unlocked',
    keyMoments: [
      'The Armored Titan smashes through Wall Maria’s inner gate',
      'Humanity retreats behind Wall Rose under martial rationing',
      'Eren makes his solemn vow of total Titan eradication',
      'Eren, Mikasa, and Armin enlist in the 104th Cadet Corps'
    ]
  },
  {
    id: 'chapter-3',
    chapterNumber: 'CHAPTER 3',
    episodeNumber: 'EPISODE 3',
    title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1",
    japaneseTitle: '絶望の中で鈍く光る ―人類の再起①―',
    status: 'AVAILABLE',
    isLocked: false,
    coverImage: townBg,
    synopsis: 'Eren and his fellow recruits commence their grueling military training in the 104th Cadet Corps under the ruthless drill instructor Keith Shadis. During vertical maneuvering equipment aptitude testing, Eren faces severe humiliation when he repeatedly fails to maintain basic balance on the suspension harness. Despite facing immediate dismissal, his relentless persistence reveals that his equipment was secretly defective.',
    shortSummary: 'Training begins for the 104th Cadet Corps under drill instructor Keith Shadis. Eren faces humiliation during vertical maneuvering equipment balance tests, but through sheer determination perseveres and overcomes broken gear.',
    quote: '“I have no talent... but I have more grit than anyone else here.”',
    location: 'Cadet Corps Training Grounds • Southern Division',
    rewardsGranted: '+350 XP • +75 Gold • ODM Maneuver License',
    keyMoments: [
      'The ruthless baptism of Cadet Instructor Keith Shadis',
      'Omni-Directional Mobility (ODM) harness balance evaluations',
      'Eren’s humiliation and desperate overnight practice',
      'Overcoming sabotage/defective belt gear through sheer willpower'
    ]
  },
  {
    id: 'chapter-4',
    chapterNumber: 'CHAPTER 4',
    episodeNumber: 'EPISODE 4',
    title: 'The Night of the Graduation Ceremony: Humanity\'s Comeback, Part 2',
    japaneseTitle: '解散式の夜 ―人類の再起②―',
    status: 'AVAILABLE',
    isLocked: false,
    coverImage: panoramaBg,
    synopsis: 'Five years after the catastrophe at Wall Maria, the 104th Cadet Corps completes their rigorous training. The top ten graduates earn the prestigious privilege to enlist in the safe interior Military Police. Despite having earned fifth rank, Eren delivers a fiery speech that inspires several comrades to join the perilous Scout Regiment. But peace is instantly shattered as lightning strikes and the Colossal Titan reappears at Trost District.',
    shortSummary: 'Five years after the fall of Wall Maria, the 104th Cadet Corps completes training. The top ten graduates are announced, but Eren inspires others to join the Scout Regiment. Suddenly, the Colossal Titan reappears at Trost.',
    quote: '“It’s been five years... but humanity will not cower today!”',
    location: 'Wall Rose • Trost District Gateway Wall',
    rewardsGranted: '+500 XP • +150 Gold • Scout Corps Cape Artifact',
    keyMoments: [
      'Top 10 graduates announced at the graduation ceremony',
      'Eren chooses the perilous Scout Regiment over the Military Police',
      'Maintenance duty on top of Wall Rose in Trost District',
      'The explosive reappearance of the Colossal Titan'
    ]
  }
]

export const comingSoonStoryChapters = [
  {
    id: 'chapter-5',
    chapterNumber: 'CHAPTER 5',
    episodeNumber: 'EPISODE 5',
    title: 'First Battle: The Struggle for Trost, Part 1',
    status: 'LOCKED',
    isLocked: true,
    badgeText: 'COMING SOON 🔒',
    shortSummary: 'The Colossal Titan’s assault breaches the outer gate of Trost. Newly graduated cadets are thrust straight into the vanguard of frontline combat.'
  },
  {
    id: 'chapter-6',
    chapterNumber: 'CHAPTER 6',
    episodeNumber: 'EPISODE 6',
    title: 'The World the Girl Saw: The Struggle for Trost, Part 2',
    status: 'LOCKED',
    isLocked: true,
    badgeText: 'COMING SOON 🔒',
    shortSummary: 'As panic overwhelms the evacuation routes, Mikasa reflects on the fateful day she met Eren and the brutal world they must survive.'
  },
  {
    id: 'chapter-7',
    chapterNumber: 'CHAPTER 7',
    episodeNumber: 'EPISODE 7',
    title: 'Small Blade: The Struggle for Trost, Part 3',
    status: 'LOCKED',
    isLocked: true,
    badgeText: 'COMING SOON 🔒',
    shortSummary: 'Out of gas and cornered at the military supply depot, the surviving cadets must execute a desperate, high-stakes gamble to resupply.'
  },
  {
    id: 'chapter-8',
    chapterNumber: 'CHAPTER 8',
    episodeNumber: 'EPISODE 8',
    title: 'I Can Hear His Heartbeat: The Struggle for Trost, Part 4',
    status: 'LOCKED',
    isLocked: true,
    badgeText: 'COMING SOON 🔒',
    shortSummary: 'A mysterious rogue Titan displaying unprecedented martial combat skills enters the battlefield, turning the tide against the Titan swarm.'
  }
]

