// 64 hand-crafted questions: 8 per step, 4 steps per track, 2 tracks.
// Session layout: 1 from group0 + 2 from group1 + 1 from group2 + 1 from group3 = 5 challenges.
// Shuffled each session so every login is different.

export const QUESTION_BANK = {
  junior: {
    // Step 4 — research: work out what information you need and where to find it
    group0: [
      {
        type: "research", step: 4,
        title: "Holiday Club",
        scenario: "You want to sign up for the school holiday club but you are not sure which activities you would enjoy.",
        prompt: "Which piece of information would help you decide most?",
        options: [
          "What activities are running and on which days",
          "How many other children are going",
          "What the hall looks like inside",
        ],
        curveball: "You find out the activity list on the website is from last year. Where would you look now?",
      },
      {
        type: "research", step: 4,
        title: "Lost Library Book",
        scenario: "You borrowed a library book four weeks ago and cannot find it anywhere.",
        prompt: "What is the most important thing to find out first?",
        options: [
          "When the book was due back and whether there is a fine",
          "What the story in the book was about",
          "Whether anyone else has lost a book recently",
        ],
        curveball: "A note says the book was last seen in a friend's bag. Does that change what you need to find out first?",
      },
      {
        type: "research", step: 4,
        title: "Sports Trial",
        scenario: "You want to join the school football team. Trials are next week.",
        prompt: "Which information would help you most to prepare?",
        options: [
          "What skills the coaches are looking for",
          "How many people are in the team right now",
          "What kit the team wears on match days",
        ],
        curveball: "You hear the trial is now focusing on teamwork rather than individual skills. Is the same information still most useful?",
      },
      {
        type: "research", step: 4,
        title: "Class Pet",
        scenario: "Your class has voted to get a pet. Now you need to decide which one to choose.",
        prompt: "What is most important to find out before picking a pet?",
        options: [
          "What each animal needs to stay healthy and happy",
          "Which animal looks the most interesting",
          "Whether other schools have had a similar pet",
        ],
        curveball: "A classmate is allergic to animal fur. Does that change which information matters most?",
      },
      {
        type: "research", step: 4,
        title: "School Trip Permission",
        scenario: "Your school is running an overnight trip. You want to go but need your parent's permission.",
        prompt: "What information does your parent most need to help them decide?",
        options: [
          "Where you are going, what is planned, and how much it costs",
          "How many teachers are coming on the trip",
          "What other trips the school has done before",
        ],
        curveball: "Your parent says the cost is fine but wants to know about safety. Which information becomes most important now?",
      },
      {
        type: "research", step: 4,
        title: "Healthy Snack Bar",
        scenario: "A company is selling a new snack bar at school and saying it is very healthy.",
        prompt: "What would you most want to find out before deciding to buy it?",
        options: [
          "What ingredients it has and how much sugar is in it",
          "Who made the advert for it",
          "How many people at school have already tried it",
        ],
        curveball: "You find out the company paid for its own nutrition study. Does that change what you need to know?",
      },
      {
        type: "research", step: 4,
        title: "New Bike Route",
        scenario: "You want to start cycling to school but your parents are not sure it is safe.",
        prompt: "What information would most help your parents feel confident?",
        options: [
          "Whether there is a safe path with no busy roads",
          "How many minutes the journey takes",
          "How many other children at your school cycle",
        ],
        curveball: "The path is safe but has no shelter if it rains. Does that change what is most important to know?",
      },
      {
        type: "research", step: 4,
        title: "Science Project Websites",
        scenario: "You are researching a topic for your science project and find three different websites.",
        prompt: "What would you check first to decide if a website is reliable?",
        options: [
          "Who wrote it and whether they are an expert on that subject",
          "How many pictures and videos the website has",
          "Whether a classmate recommended it",
        ],
        curveball: "The most detailed website is run by a company that sells products related to your topic. Does that change your answer?",
      },
    ],

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
      {
        type: "generate", step: 5,
        title: "Eco Week",
        scenario: "Your school is running Eco Week to help the environment. Your class has to come up with ideas to make the school greener.",
        prompt: "Think of 5 different ways the school could become more eco-friendly.",
      },
      {
        type: "generate", step: 5,
        title: "Reading for Fun",
        scenario: "The school librarian wants more students to read for fun, not just for homework.",
        prompt: "Think of 5 different ways to encourage more students to read for enjoyment.",
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
      {
        type: "analyse", step: 6,
        title: "School Reports",
        scenario: "The school is changing how it shares progress updates with students and parents. Two ideas are being compared.",
        prompt: "Look at both ideas. Who does each one help? What could go wrong?",
        options: [
          "Written reports twice a year — a detailed summary of every subject",
          "Weekly online scores — parents can check progress any time",
        ],
      },
      {
        type: "analyse", step: 6,
        title: "Break Time Plans",
        scenario: "The school wants to make break times better for all students. Two plans are being considered.",
        prompt: "Look at both plans. Who does each one help? What could go wrong?",
        options: [
          "Free choice — children decide what to do with no adult direction",
          "Organised games — a teacher runs a different activity each day",
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
      {
        type: "evaluate", step: 7,
        title: "Science Fair",
        scenario: "Your class is entering the school science fair. You must submit one project, chosen from three approaches.",
        prompt: "Pick the approach you think is strongest and say why.",
        options: [
          "Experiment — test what happens when you change one thing and record results",
          "Research display — gather facts from books and websites to answer a question",
          "Invention — design and build something that solves a real problem",
        ],
        curveball: "The judges have said they especially want to see original experiments this year. Does that change your pick?",
      },
      {
        type: "decision", step: 7,
        title: "School Garden",
        scenario: "Your class is choosing one plant to grow in the school garden this term. There is only enough space for one type.",
        prompt: "Pick the plant you think is best and explain your reasoning.",
        options: [
          "Sunflowers — fast-growing and simple to look after",
          "Vegetables — the food could be used in the school canteen",
          "Wildflowers — attract bees and support local wildlife",
        ],
        curveball: "The canteen says it cannot use student-grown vegetables because of health and safety rules. Does that change your choice?",
      },
    ],
  },

  senior: {
    // Step 7 — evaluate: pick the best option with more complex trade-offs
    group0: [
      {
        type: "evaluate", step: 7,
        title: "School Council Budget",
        scenario: "The school council has £500 to spend on one improvement to the school. Three proposals have been shortlisted.",
        prompt: "Which improvement would you recommend and why?",
        options: [
          "New library books — benefits every student who reads",
          "Outdoor seating area — makes break times more comfortable for everyone",
          "New equipment for the drama club — helps the drama group specifically",
        ],
        curveball: "The outdoor seating cannot be used for five months of the year due to weather. Does that change your choice?",
      },
      {
        type: "decision", step: 7,
        title: "Phone Policy",
        scenario: "The school is deciding how to handle mobile phones during the school day.",
        prompt: "Which policy would you recommend?",
        options: [
          "Phones locked away at the start of the day and returned at the end",
          "Phones allowed only at lunch, stored in lockers at all other times",
          "Phones banned only during lessons, allowed freely at any other time",
        ],
        curveball: "One student needs their phone during the day to manage a medical condition. Does that change which policy you would support?",
      },
      {
        type: "evaluate", step: 7,
        title: "Environment Project",
        scenario: "Your school wants to run one project this term to cut its environmental impact. Three options are being considered.",
        prompt: "Which project would make the biggest difference?",
        options: [
          "Switch all classroom lights to energy-saving LEDs",
          "Start a school food-waste composting programme",
          "Run a car-free week where all staff cycle or use public transport",
        ],
        curveball: "The LED switch would save the most energy long-term but costs £2,000 upfront. The other two cost almost nothing. Does that change your choice?",
      },
      {
        type: "decision", step: 7,
        title: "Class Reading Project",
        scenario: "Your class must choose one reading project to run this term. There is only time and budget for one.",
        prompt: "Which project would you choose?",
        options: [
          "Class novel — everyone reads and discusses the same book together",
          "Reading passport — each student reads five books from different genres",
          "Author visit — a published writer comes in and talks about their work",
        ],
        curveball: "Three students in the class find reading very difficult. Does that change which project you would pick?",
      },
      {
        type: "evaluate", step: 7,
        title: "Library Upgrade",
        scenario: "The school library is getting a small improvement. There is only budget for one change.",
        prompt: "Which upgrade would most improve the library for students?",
        options: [
          "New fiction books for teenage readers",
          "Comfortable reading and study seating",
          "Computers with internet access for research",
        ],
        curveball: "The library already has ten computers that most students never use. Does that change your answer?",
      },
      {
        type: "evaluate", step: 7,
        title: "Sports Fund",
        scenario: "The school sports fund can only support one team or group with new equipment this year.",
        prompt: "Which should receive the funding?",
        options: [
          "Football team — the largest group, with the most members",
          "Gymnastics squad — recently won a regional competition",
          "Wheelchair basketball group — the only sport available to students with mobility difficulties",
        ],
        curveball: "The football team just signed a kit sponsorship with a local company. The other two have no external funding at all. Does that change your answer?",
      },
      {
        type: "decision", step: 7,
        title: "Volunteering Roles",
        scenario: "Year 8 students can choose one volunteering role to help the wider school community.",
        prompt: "Which role would make the most positive difference?",
        options: [
          "Peer mentor — support students who are finding school life hard",
          "Eco monitor — track and report on the school's energy use and waste",
          "Reading buddy — read weekly with younger students who struggle",
        ],
        curveball: "The peer mentor role takes place during your only free lunch break each week. Does that change which role you would pick?",
      },
      {
        type: "evaluate", step: 7,
        title: "Longer School Day",
        scenario: "Your school is considering extending the school day by one hour, three days a week, to create extra time for students.",
        prompt: "Which reason would make you most likely to support this?",
        options: [
          "Extra time given to clubs and creative activities",
          "More lesson time to reduce the amount of homework set",
          "Structured study support so every student can get help when they need it",
        ],
        curveball: "Students who walk or cycle home would miss their safe travel window if the day is extended. Does that affect which reason you support most?",
      },
    ],

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
      {
        type: "cause", step: 9,
        title: "Lunchtime Queue",
        scenario: "The canteen queue is taking 20 minutes, leaving students with only 10 minutes to eat. Three things changed recently: the canteen lost one member of staff, a new hot food option was added, and all year groups now have lunch at the same time.",
        prompt: "Which cause is most likely making the queue this long?",
        options: [
          "One fewer staff member means service is slower than before",
          "The new hot food takes longer to prepare, holding up the whole queue",
          "All year groups arriving together creates one large rush at the same time",
        ],
        curveball: "The canteen manager says the queue was this long last year too, before any of these changes were made. What would you investigate next?",
      },
      {
        type: "cause", step: 9,
        title: "Homework Drop",
        scenario: "A teacher notices students are submitting less homework this half-term. Three things changed: a popular TV show started on the evenings homework is due, a new online game launched this month, and homework was increased from one piece to two pieces a week.",
        prompt: "Which cause is most likely responsible for the drop?",
        options: [
          "The TV show occupies students on the evenings homework is due",
          "The new online game is distracting students during homework time",
          "Increasing to two pieces a week is too much for most students to manage",
        ],
        curveball: "A class survey shows fewer than one in five students actually watch the TV show. Does that change which cause you think is strongest?",
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
      {
        type: "pattern", step: 10,
        title: "Uniform Detentions",
        scenario: "A school logs uniform-related detentions by week: Week 1 — 4, Week 2 — 4, Week 3 — 12, Week 4 — 11, Week 5 — 5, Week 6 — 4.",
        prompt: "What pattern do you notice? What might explain the spike in weeks 3 and 4? What would you predict for Week 7?",
      },
      {
        type: "pattern", step: 10,
        title: "Sports Hall Use",
        scenario: "Monthly sports hall bookings for the year: Sep — 20, Oct — 24, Nov — 18, Dec — 8, Jan — 18, Feb — 24, Mar — 20.",
        prompt: "What pattern do you see in these numbers? What might explain the December figure? What would you predict for April?",
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
      {
        type: "mystery", step: 12,
        title: "Missing Poster",
        scenario: "A competition poster was removed overnight from the school notice board. Three people had a reason or ability to take it: a student whose entry was rejected, the competition organiser, and the caretaker who clears the board daily.",
        prompt: "Who most likely removed it, and what is your key piece of reasoning?",
        options: [
          "The rejected student — had a motive since their work was not accepted",
          "The competition organiser — had access and might want to update the display",
          "The caretaker — routinely clears the board but had no obvious motive",
        ],
        curveball: "You find out the competition was cancelled the same day the poster disappeared. Does that change who you think is most likely responsible?",
      },
      {
        type: "dilemma", step: 12,
        title: "Social Media Study",
        scenario: "A headline says: 'Study proves that using social media for more than one hour a day makes teenagers unhappy.' The study followed 200 teenagers for one month.",
        prompt: "Is this enough evidence to say social media causes unhappiness? What else would you need to know to be sure?",
        curveball: "The same study found that the unhappiest teenagers were also sleeping nearly two hours less per night than the happiest ones. Does this change what you think is causing the unhappiness?",
      },
    ],
  },
};

// Build a randomised 5-challenge session from the bank.
// Layout: 1 from group0 + 2 from group1 + 1 from group2 + 1 from group3.
export function buildSessionFromBank(track) {
  const bank = QUESTION_BANK[track];
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

  return [
    ...pick(bank.group0, 1),
    ...pick(bank.group1, 2),
    ...pick(bank.group2, 1),
    ...pick(bank.group3, 1),
  ].map((q, i) => ({ ...q, id: `builtin-${i}` }));
}
