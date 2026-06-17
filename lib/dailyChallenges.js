// Daily Spark challenges — 21 quick thinking prompts.
// Each has one MCQ (with a clear best answer + explanation) and one open follow-up.
// Content types: reasoning traps, ethical choices, fair decisions, logic, real-world dilemmas.
// Selection: date-seeded so every user gets the same challenge on the same day.

export const DAILY_CHALLENGES = [
  {
    id: "d01",
    mcq: {
      question: "A coin lands heads 5 times in a row. What is the chance it lands heads on the next flip?",
      options: [
        "Less than 50% — it's overdue for tails",
        "More than 50% — it's on a hot streak",
        "Exactly 50% — each flip is completely independent",
        "Impossible to say without more flips",
      ],
      answer: 2,
      explain: "The coin has no memory. Every flip is 50/50 no matter what came before. Thinking past results affect future odds is called the Gambler's Fallacy — and casinos rely on it.",
    },
    open: "Can you think of another situation where people make bad decisions by assuming past events affect future ones?",
  },
  {
    id: "d02",
    mcq: {
      question: "Ice cream sales and drowning rates both rise in summer. Does eating ice cream cause drowning?",
      options: [
        "Yes — the data clearly shows a link",
        "No — but it does prove they are connected",
        "No — both happen because hot weather brings more people outside and near water",
        "It's impossible to say without experiments",
      ],
      answer: 2,
      explain: "Both rise because of hot weather — more swimming, more ice cream. That's called a confounding variable. Correlation is not causation: two things happening together doesn't mean one causes the other.",
    },
    open: "Make up your own example of two things that seem connected but neither causes the other.",
  },
  {
    id: "d03",
    mcq: {
      question: "A cereal ad says '9 out of 10 dentists recommend a low-sugar breakfast.' What's the problem with using this to sell cereal?",
      options: [
        "Nothing — dentists are experts, so it must be true",
        "We don't know what dentists were comparing it to, or what question they were asked",
        "Only one dentist disagreed, so the claim is still trustworthy",
        "Dentists don't know about nutrition",
      ],
      answer: 1,
      explain: "Recommending 'a low-sugar breakfast' is easy — that's not the same as recommending this specific cereal. The claim sounds scientific but hides what was actually asked. Always check what the comparison really was.",
    },
    open: "Find or make up an advert claim that sounds impressive but is actually vague or misleading. What question would you ask to test it?",
  },
  {
    id: "d04",
    mcq: {
      question: "Most car accidents happen within 10 miles of home. Does this prove that driving near home is more dangerous than driving far away?",
      options: [
        "Yes — the data proves it",
        "No — people do most of their driving near home, so of course more accidents happen there",
        "Yes — drivers are more distracted when they feel comfortable",
        "It's impossible to tell anything from this",
      ],
      answer: 1,
      explain: "If 90% of your driving is near home, you'd expect most accidents there too. To know if near-home driving is truly riskier, you'd need to compare accident rates per mile driven — not just total numbers.",
    },
    open: "What question would you need to answer to properly test whether near-home driving is actually more dangerous?",
  },
  {
    id: "d05",
    mcq: {
      question: "Studies show that depressed people use social media more. What does this actually prove?",
      options: [
        "Social media causes depression",
        "Depression causes people to use more social media",
        "The two are linked — but we can't tell which causes which without more research",
        "Studies about social media are never reliable",
      ],
      answer: 2,
      explain: "A correlation study shows two things happen together but can't tell you the direction of causation. Depressed people might scroll to cope, OR heavy scrolling might worsen mood. Both are possible — and a carefully designed experiment would be needed to tell them apart.",
    },
    open: "What kind of study would help figure out whether social media causes depression, or whether depressed people just use it more?",
  },
  {
    id: "d06",
    mcq: {
      question: "A product claims it's '50% more effective.' More effective than what?",
      options: [
        "Other leading brands — that's the standard comparison",
        "We don't know yet — we need to know what it's being compared to",
        "The old version of the same product",
        "The average product in its category",
      ],
      answer: 1,
      explain: "'More effective' is meaningless without a comparison. 50% more effective than doing nothing? Than a product that doesn't work at all? Marketing claims prove exactly what they say — nothing more.",
    },
    open: "Make up a product slogan that sounds impressive but actually says almost nothing. Then write the question that would expose it.",
  },
  {
    id: "d07",
    mcq: {
      question: "A politician says: 'Anyone who disagrees with this law clearly hasn't read it properly.' What's wrong with this argument?",
      options: [
        "Nothing — that's probably true of most critics",
        "It attacks the people who disagree instead of actually answering their argument",
        "Politicians should be trusted to understand laws better",
        "Reading the law isn't important for ordinary people",
      ],
      answer: 1,
      explain: "This is called an ad hominem — attacking the person rather than the argument. Dismissing all disagreement as ignorance avoids the actual criticism. A stronger response would address what the critics are saying.",
    },
    open: "Can you think of another example where someone dodges a difficult argument by attacking the person making it instead?",
  },
  {
    id: "d08",
    mcq: {
      question: "All chess club members are in Year 8. Sam is in Year 8. Is Sam in the chess club?",
      options: [
        "Yes — Sam is in Year 8, just like all chess club members",
        "No — the chess club is only for some Year 8 students",
        "Not necessarily — being in Year 8 doesn't mean Sam joined",
        "Yes — all Year 8 students must belong to a club",
      ],
      answer: 2,
      explain: "The statement says all chess members are in Year 8 — NOT that all Year 8 students are in chess. Sam being in Year 8 tells us nothing about whether they joined. This is one of the most common logic mistakes.",
    },
    open: "Write your own example of this logic mistake: 'All X are Y. Z is Y. Therefore Z must be X.' Show why it doesn't hold.",
  },
  {
    id: "d09",
    mcq: {
      question: "A sign at a fork in the road says 'Path A leads to the lake.' What can you figure out about Path B?",
      options: [
        "Path B does not lead to the lake",
        "Path B is longer than Path A",
        "Nothing certain — Path B might also lead to the lake by a different route",
        "Path B is the safer option",
      ],
      answer: 2,
      explain: "The sign only tells you where Path A goes. It says nothing about Path B. It might also reach the lake, or it might not — the sign simply doesn't give you that information.",
    },
    open: "Why do people often assume the opposite is true when they're only given one-sided information? Can you think of a real example?",
  },
  {
    id: "d10",
    mcq: {
      question: "You find a wallet with £50 cash and an ID card inside. What is the most ethical thing to do?",
      options: [
        "Keep the money, post the empty wallet back",
        "Keep everything — finders keepers",
        "Hand the entire wallet to the police or use the ID to contact the owner",
        "Take £10 for your trouble and return the rest",
      ],
      answer: 2,
      explain: "The money belongs to the owner. Taking any of it — even a small 'finder's fee' — means taking something that isn't yours. The ethical choice is to return everything intact.",
    },
    open: "Has something like this happened to you or someone you know? What did they do — and looking back, do you think it was the right call?",
  },
  {
    id: "d11",
    mcq: {
      question: "A rumour about a classmate is spreading. You don't know if it's true. What's the most responsible first step?",
      options: [
        "Share it — everyone has a right to information",
        "Don't share it and tell a trusted adult so the facts can be checked",
        "Investigate it yourself to find out if it's true",
        "Ignore it — rumours always die down on their own",
      ],
      answer: 1,
      explain: "Sharing an unverified rumour risks harming someone unfairly if it's false. Flagging it to a trusted adult stops the spread and gets the facts checked. Self-investigation can make things worse.",
    },
    open: "Why do you think rumours spread so fast? What would it actually take to make you pause and verify something before passing it on?",
  },
  {
    id: "d12",
    mcq: {
      question: "Two students get 70% on the same test. Student A studied 10 hours. Student B has a learning difficulty and studied 20 hours. Who showed more effort?",
      options: [
        "Student A — same result in half the time",
        "They're equal — the score is identical",
        "Student B — the same result required overcoming much greater challenges",
        "You can't compare — it depends on the subject",
      ],
      answer: 2,
      explain: "Equal outcomes don't mean equal effort. Student B had to work twice as long against greater difficulties to reach the same result. Fairness often means recognising different starting points, not just final scores.",
    },
    open: "Can you think of another situation where equal outcomes involved very different amounts of effort or difficulty for different people?",
  },
  {
    id: "d13",
    mcq: {
      question: "Which is a fairer system — everyone gets the same amount, or everyone gets what they actually need?",
      options: [
        "Same amount — it's simpler and treats everyone identically",
        "What they need — because people have genuinely different needs",
        "Same amount — equal always means fair",
        "It depends entirely on the situation, so neither is generally fairer",
      ],
      answer: 1,
      explain: "If everyone gets the same size shoe, some feet won't be covered. Identical treatment often creates unfairness when starting points differ. This is the difference between equality (same) and equity (what's needed).",
    },
    open: "Can you think of a real situation where giving everyone 'the same' actually creates unfairness rather than resolving it?",
  },
  {
    id: "d14",
    mcq: {
      question: "You notice a friend copying from another student's homework. What should you do first?",
      options: [
        "Tell the teacher immediately",
        "Ignore it — it's none of your business",
        "Talk to your friend privately and ask them to stop",
        "Copy the answers yourself since they're available",
      ],
      answer: 2,
      explain: "Starting with a private conversation gives your friend a chance to stop without immediate consequences. Going straight to a teacher skips a step that might resolve things with less harm. If they continue, escalating makes more sense.",
    },
    open: "Is there a situation where you'd go directly to a teacher without talking to your friend first? Describe when and why.",
  },
  {
    id: "d15",
    mcq: {
      question: "A school says 'Students who read 30 minutes daily score higher on tests' and makes daily reading compulsory. Will this definitely improve scores?",
      options: [
        "Yes — they proved it works with their own students",
        "No — students who choose to read are probably more motivated learners anyway",
        "No — reading doesn't help with most test subjects",
        "Yes — more reading always improves academic performance",
      ],
      answer: 1,
      explain: "Students who voluntarily read 30 minutes daily were probably already more motivated. Making everyone do it doesn't transplant that motivation. The school is assuming location (reading) causes performance rather than the other way around.",
    },
    open: "Can you think of another school policy that sounds logical but might not work because it confuses correlation with causation?",
  },
  {
    id: "d16",
    mcq: {
      question: "You can donate £10 to: help one person escape serious poverty permanently, OR give 100 people a slightly better meal today. Which creates more good?",
      options: [
        "Help one person escape poverty — permanent change outweighs temporary relief",
        "Help 100 people — more people directly benefit",
        "They're equal — £10 per person is the same either way",
        "Neither — money should go to local causes first",
      ],
      answer: 0,
      explain: "Most ethical frameworks prioritise lasting, life-changing impact over temporary small benefits. But this is genuinely hard — and smart people disagree. The key skill is thinking about depth of impact versus number of people affected.",
    },
    open: "Try to argue the opposite — that helping 100 people briefly is actually the better choice. What is your strongest argument?",
  },
  {
    id: "d17",
    mcq: {
      question: "A restaurant advertises 'Our burgers are fresh — never frozen.' What does this actually guarantee?",
      options: [
        "The burgers are higher quality than frozen ones",
        "The restaurant genuinely cares about its customers",
        "The burgers were never frozen — and nothing else beyond that",
        "The burgers are healthier than frozen alternatives",
      ],
      answer: 2,
      explain: "The claim is very narrow: only that they were never frozen. It says nothing about freshness when served, overall quality, or health. Marketing claims prove exactly what they say — nothing beyond the literal words.",
    },
    open: "Find real packaging or an advert and write down exactly what it proves — and what it deliberately doesn't say.",
  },
  {
    id: "d18",
    mcq: {
      question: "A teacher says 'Students who sit at the front do best in tests' and moves all weak students to the front. Will this work?",
      options: [
        "Yes — proximity to the board makes students pay more attention",
        "Probably not — students who choose the front are already more focused",
        "Yes — environment always affects performance",
        "Yes — the teacher has observed it directly, so it's reliable evidence",
      ],
      answer: 1,
      explain: "Motivated students sit at the front. Moving all students there doesn't give them that motivation. The teacher is treating location as the cause — but it's the effect. Moving students won't change why they sat at the back.",
    },
    open: "Can you think of another example where changing a symptom won't fix the underlying cause?",
  },
  {
    id: "d19",
    mcq: {
      question: "Someone argues: 'We should ban all cars in the city because cars cause pollution.' What's the weakest point in this argument?",
      options: [
        "Cars don't actually cause significant pollution",
        "It jumps to the most extreme solution without showing why alternatives wouldn't work",
        "Cities don't really need cars",
        "Air pollution doesn't affect enough people to matter",
      ],
      answer: 1,
      explain: "The jump from 'cars cause pollution' to 'ban all cars' skips the middle step: showing that a total ban is better than other solutions. Strong arguments compare options, not just identify a problem.",
    },
    open: "What less extreme solution to city air pollution might be more realistic AND still make a real difference?",
  },
  {
    id: "d20",
    mcq: {
      question: "You are deciding if a new school rule is fair. What's the most important thing to consider first?",
      options: [
        "Whether your friends support the rule",
        "Whether the head teacher backs it",
        "Who the rule helps and who it might disadvantage",
        "Whether other schools have the same rule",
      ],
      answer: 2,
      explain: "Fairness is about impact on people. Understanding who benefits and who might be harmed is the essential starting point. Popularity and precedent are less important than actual consequences.",
    },
    open: "Think of a rule — at school, home, or in society — that you think is unfair. Explain who it disadvantages and why.",
  },
  {
    id: "d21",
    mcq: {
      question: "Your school gets a £500 donation. Which reason most strongly justifies spending it on new library books?",
      options: [
        "The head teacher loves reading",
        "The library currently looks a bit bare",
        "Books benefit every student across all subjects and year groups",
        "A neighbouring school bought books recently",
      ],
      answer: 2,
      explain: "The strongest justification for shared resources is broad, lasting impact. Personal preferences and appearances are weak reasons. The question to ask is always: who does this help, how much, and for how long?",
    },
    open: "If you were on a school council, what one thing would you spend £500 on — and what would be your single strongest argument for it?",
  },
];

// Return today's challenge based on a date seed (same challenge for all users each day).
export function getTodaysChallenge() {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const epoch = new Date("2026-06-01").getTime();
  const dayIndex = Math.floor((new Date(today).getTime() - epoch) / 86400000);
  const i = ((dayIndex % DAILY_CHALLENGES.length) + DAILY_CHALLENGES.length) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[i];
}
