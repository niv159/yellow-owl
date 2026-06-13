// 36 hand-crafted questions: 6 per step, 3 steps per track, 2 tracks.
// Each session picks 2 from group1, 1 from group2, 2 from group3 — shuffled
// so every login is different.

export const QUESTION_BANK = {
  junior: {
    // Step 5 — generate: think up lots of different ideas
    group1: [
      {
        type: "generate", step: 5,
        title: "Noisy Library",
        scenario: "The school library is so noisy that nobody can read in peace.",
        prompt: "Think of 5 different ways to fix the noise problem.",
      },
      {
        type: "generate", step: 5,
        title: "Playground Litter",
        scenario: "The school playground is covered in litter after every lunch break.",
        prompt: "Think of 5 different ways to stop the litter problem.",
      },
      {
        type: "generate", step: 5,
        title: "Rainy Break",
        scenario: "It is raining and the whole school is stuck inside for break time.",
        prompt: "Think of 5 fun activities the children could do indoors instead.",
      },
      {
        type: "generate", step: 5,
        title: "Broken Bench",
        scenario: "The only bench in the playground is broken and cannot be fixed for two months.",
        prompt: "Think of 5 ways to give children somewhere to sit or rest at break.",
      },
      {
        type: "generate", step: 5,
        title: "New Student",
        scenario: "A new student joins your class halfway through the year and does not know anyone.",
        prompt: "Think of 5 ways to help them feel welcome and included.",
      },
      {
        type: "generate", step: 5,
        title: "Hot Classroom",
        scenario: "The classroom gets very hot every afternoon and it is hard to concentrate.",
        prompt: "Think of 5 ways to cool the room down without using air conditioning.",
      },
    ],

    // Step 6 — analyse: compare two options carefully
    group2: [
      {
        type: "analyse", step: 6,
        title: "Sports Day Plan",
        scenario: "The school wants to improve sports day. Two ideas are being compared.",
        prompt: "Look at both ideas carefully. Who does each one help? What could go wrong?",
        options: [
          "More events — every child takes part in at least three activities",
          "Prize ceremony — top three in each event get a trophy",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "Lunch Menu Change",
        scenario: "The canteen is changing its menu. Two plans are on the table.",
        prompt: "Look at both plans. Who do they help? What could go wrong with each?",
        options: [
          "Healthy only — no chips or sweets on the menu at all",
          "Free choice — children pick anything they want every day",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "Reading Challenge",
        scenario: "The school wants to get more children reading. Two ideas are being tested.",
        prompt: "Look at both ideas. Who do they help? What could go wrong?",
        options: [
          "Sticker prize for every book a child finishes",
          "Author visits once a month to talk about their books",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "Walk to School",
        scenario: "The school wants more children to walk or cycle. Two plans are being considered.",
        prompt: "Look at both plans. Who does each one help? What could go wrong?",
        options: [
          "House points for every child who walks or cycles that day",
          "Build a new safe path from the housing estate to school",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "New After-School Club",
        scenario: "The school is starting one new after-school club. Two options are shortlisted.",
        prompt: "Look at both options. Who does each one help? What could go wrong?",
        options: [
          "Coding club — learn to build games and apps",
          "Drama club — put on a play at the end of term",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "Year 6 Helper Role",
        scenario: "Year 6 students can help younger children in two different ways.",
        prompt: "Look at both roles. Who does each one help? What could go wrong?",
        options: [
          "Paired reading — sit with a younger child and read together twice a week",
          "Playground buddy — look out for children who are alone at break",
        ],
      },
    ],

    // Step 7 — evaluate / decision: pick the best option and say why
    group3: [
      {
        type: "evaluate", step: 7,
        title: "One School Trip",
        scenario: "Your class can afford only one school trip this year.",
        prompt: "Pick the trip you think is best and say why.",
        options: [
          "Science museum — hands-on experiments all day",
          "Working farm — see real animals and grow food",
          "Live theatre — watch a professional play",
        ],
        curveball: "The trip you picked has no spaces left for your year group. Does that change your answer?",
      },
      {
        type: "evaluate", step: 7,
        title: "Playground Upgrade",
        scenario: "The school has money for just one playground improvement.",
        prompt: "Pick the best improvement and say why.",
        options: [
          "New climbing frame",
          "Quiet reading garden with plants and benches",
          "Extra football goals and a painted sports court",
        ],
        curveball: "The improvement you picked means cutting down a 50-year-old tree. Does that change your mind?",
      },
      {
        type: "decision", step: 7,
        title: "Class Pet",
        scenario: "The school wants one class pet that all children can help look after.",
        prompt: "Pick the best pet and explain your reason.",
        options: [
          "Rabbits — friendly, can be stroked and held",
          "Tropical fish — colourful but hands-off",
          "Tortoise — lives a very long time",
        ],
        curveball: "The pet you chose needs to go home with a different student every school holiday. Does that change your pick?",
      },
      {
        type: "evaluate", step: 7,
        title: "Friday Lesson",
        scenario: "The school can add one new lesson every Friday afternoon.",
        prompt: "Pick the one you think is most useful and say why.",
        options: [
          "Cooking — learn to make real meals from scratch",
          "Gardening — grow food from seed in the school garden",
          "First aid — learn how to help someone in an emergency",
        ],
        curveball: "Adding this lesson means losing the last 30 minutes of PE every Friday. Does that change your answer?",
      },
      {
        type: "decision", step: 7,
        title: "Fundraiser Event",
        scenario: "The school is choosing one fundraising event to run this term.",
        prompt: "Pick the best event and explain why.",
        options: [
          "Sponsored run around the school field",
          "Talent show — tickets sold to parents and friends",
          "Bake sale — students cook and sell food",
        ],
        curveball: "Last year, the event you picked raised the least money of the three. Would you still choose it?",
      },
      {
        type: "evaluate", step: 7,
        title: "Community Project",
        scenario: "Your class gets to pick one community project to do for a whole month.",
        prompt: "Pick the one you think matters most and say why.",
        options: [
          "Litter picking in the local park every week",
          "Reading aloud to elderly people at the care home",
          "Making and sending cards to children in hospital",
        ],
        curveball: "The project you chose needs three lunch breaks a week to do properly. Does that change your mind?",
      },
    ],
  },

  senior: {
    // Step 9 — cause: work out why something keeps happening
    group1: [
      {
        type: "cause", step: 9,
        title: "Empty Bus",
        scenario: "The school bus used to be nearly full. Now only a few students use it. This term: the price went up 20%, the route changed slightly, and there were three breakdowns.",
        prompt: "What is most likely causing fewer students to use the bus? Rank the possible causes and explain your thinking.",
      },
      {
        type: "cause", step: 9,
        title: "Maths Results Drop",
        scenario: "Year 8 maths results fell this term. Three things changed: a new teacher started, the class moved to a cold portable classroom, and half the class joined a new after-school sports team.",
        prompt: "What is most likely causing the drop? Which reason would you investigate first, and why?",
      },
      {
        type: "cause", step: 9,
        title: "Empty Lunch Hall",
        scenario: "Fewer students are eating in the school hall. Three things changed: a sandwich shop opened nearby, the hall got louder after new bench tables were added, and lunch break was cut by 10 minutes.",
        prompt: "What is most likely causing fewer students to eat in the hall? Which reason seems strongest, and why?",
      },
      {
        type: "cause", step: 9,
        title: "Late Arrivals",
        scenario: "More students are arriving late. Three things changed: road works started on the main route, the local bus changed its timetable, and a popular café opened near the school gate.",
        prompt: "What is most likely causing the late arrivals? Which cause would be easiest to fix — and which would be hardest?",
      },
      {
        type: "cause", step: 9,
        title: "Chess Club Dropout",
        scenario: "The chess club lost half its members this term. Three things changed: a games club started on the same evening, the chess room moved upstairs, and the teacher who ran it went on long-term leave.",
        prompt: "What is most likely causing members to leave? Which cause do you think matters most, and why?",
      },
      {
        type: "cause", step: 9,
        title: "Library Decline",
        scenario: "Students are borrowing far fewer library books. Three things changed: the library now opens an hour later, e-books became available on school tablets, and the librarian who ran reading events retired.",
        prompt: "What is most likely causing the drop in borrowing? Which cause would you tackle first, and why?",
      },
    ],

    // Step 10 — pattern: spot the pattern in the data
    group2: [
      {
        type: "pattern", step: 10,
        title: "Breakfast Club Numbers",
        scenario: "A school records breakfast club attendance for two weeks — Mon 45, Tue 30, Wed 45, Thu 30, Fri 45 — Mon 43, Tue 31, Wed 44, Thu 29, Fri 46.",
        prompt: "What pattern do you see? What might explain it? What would you predict for the next Tuesday and Wednesday?",
      },
      {
        type: "pattern", step: 10,
        title: "Reading Test Scores",
        scenario: "A student's reading test scores over six months: Jan 62, Feb 65, Mar 63, Apr 66, May 64, Jun 67.",
        prompt: "What pattern do you see in these scores? What does it suggest about their progress? What would you predict for July?",
      },
      {
        type: "pattern", step: 10,
        title: "Playground Accidents",
        scenario: "The school logs minor accidents by day of the week for three weeks: Mon 2, Fri 8 — Mon 1, Fri 7 — Mon 3, Fri 9.",
        prompt: "What pattern do you notice? What might explain it? What would you predict for next Monday and next Friday?",
      },
      {
        type: "pattern", step: 10,
        title: "Canteen Queue Times",
        scenario: "Average canteen queue time each day last week: Monday 4 min, Tuesday 12 min, Wednesday 5 min, Thursday 13 min, Friday 4 min.",
        prompt: "What pattern do you see? What might be causing it? How could you test your explanation?",
      },
      {
        type: "pattern", step: 10,
        title: "School Water Use",
        scenario: "Monthly water use in litres: Sep 4200, Oct 3800, Nov 3100, Dec 2700, Jan 3100, Feb 3800.",
        prompt: "What pattern do you see? What might explain it? What would you predict for March and for July?",
      },
      {
        type: "pattern", step: 10,
        title: "Weekly Absences",
        scenario: "Student absences this half-term: Week 1 — 8, Week 2 — 7, Week 3 — 12, Week 4 — 11, Week 5 — 16, Week 6 — 15.",
        prompt: "What pattern do you notice? What might be causing it? If the pattern continues, what would you predict for Week 8?",
      },
    ],

    // Step 12 — mystery / information / dilemma: reason to a conclusion
    group3: [
      {
        type: "mystery", step: 12,
        title: "Copied Project",
        scenario: "Two students handed in almost identical science projects. They worked in separate rooms all week and did not meet outside school. Three people had access to both their files: a student helper, the IT technician, and the class teacher.",
        prompt: "Who most likely shared the work? What is your best clue?",
        options: [
          "The student helper — helped both students log in on the same afternoon",
          "The IT technician — fixed both students' laptops that week",
          "The class teacher — had full access to all files but no clear reason",
        ],
        curveball: "New information: the student helper was absent on the afternoon when both students were logged in. Does that change who you suspect?",
      },
      {
        type: "mystery", step: 12,
        title: "Missing Money",
        scenario: "£20 went missing from the class fundraising tin. The tin was in a locked cupboard. Only three people had a key: the class teacher, the head teacher, and the school secretary. The class teacher was in a staff meeting all morning.",
        prompt: "Who is most likely responsible? What is your best reasoning?",
        options: [
          "The class teacher — had a key but was in a meeting all morning",
          "The head teacher — had a key and was seen near the cupboard twice",
          "The school secretary — had a key and needed change for the office till",
        ],
        curveball: "The cupboard lock was not broken or forced open. Does that change who you suspect?",
      },
      {
        type: "information", step: 12,
        title: "Is It Healthy?",
        scenario: "You want to find out whether a new type of snack is actually good for you. Three sources give different answers.",
        prompt: "Which source do you trust most, and why?",
        options: [
          "A blog post by someone who says they feel much healthier since eating it",
          "A study by university scientists published in a health journal",
          "An advert from the company that makes and sells the snack",
        ],
        curveball: "The university study was paid for by the same company that makes the snack. Does that change which source you trust most?",
      },
      {
        type: "information", step: 12,
        title: "Homework Debate",
        scenario: "People disagree about whether homework actually helps students learn. Three sources share their view.",
        prompt: "Whose view is most trustworthy, and why?",
        options: [
          "A student who says homework is too stressful and ruins their evenings",
          "A teacher who has tracked her students' results carefully for ten years",
          "A newspaper article saying students today are overloaded with work",
        ],
        curveball: "The teacher's data also shows that students who do the most homework mostly come from wealthier families. Does that change how much you trust her conclusion?",
      },
      {
        type: "dilemma", step: 12,
        title: "Cramming Claim",
        scenario: "Your friend says: 'I always score better on tests when I study the night before rather than spreading it out. So cramming must be the best way to learn.'",
        prompt: "Is this a good conclusion? How would you check whether it is actually true?",
        curveball: "Your friend also admits they felt extremely stressed before every exam they crammed for. Does that affect your view of their conclusion?",
      },
      {
        type: "dilemma", step: 12,
        title: "Reading Programme",
        scenario: "A school says their new reading programme worked because students' test scores went up 15% after one term of using it.",
        prompt: "Is this enough evidence to say the programme worked? What else would you need to know to be sure?",
        curveball: "Another school that did not use the programme saw scores rise by 12% in the same term. Does that change your conclusion?",
      },
    ],
  },
};

// Build a randomised 5-challenge session from the bank.
// Layout: 2 from group1, 1 from group2, 2 from group3.
export function buildSessionFromBank(track) {
  const bank = QUESTION_BANK[track];
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

  return [
    ...pick(bank.group1, 2),
    ...pick(bank.group2, 1),
    ...pick(bank.group3, 2),
  ].map((q, i) => ({ ...q, id: `builtin-${i}` }));
}
