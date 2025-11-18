/**
 * Quiz Questions Database
 * Based on educational research and NASA content for kids
 */

export interface QuizQuestion {
  id: string;
  module: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  xpReward: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // SOLAR SYSTEM - Easy Questions
  {
    id: 'ss-001',
    module: 'solar-system',
    question: 'How many planets are in our solar system?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    explanation: 'There are 8 planets in our solar system! They are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'ss-002',
    module: 'solar-system',
    question: 'Which planet is closest to the Sun?',
    options: ['Earth', 'Venus', 'Mercury', 'Mars'],
    correctAnswer: 2,
    explanation: 'Mercury is the closest planet to the Sun! It zooms around the Sun in just 88 Earth days.',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'ss-003',
    module: 'solar-system',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Mars', 'Jupiter', 'Venus', 'Mercury'],
    correctAnswer: 0,
    explanation: 'Mars is called the Red Planet because of its rusty red color, caused by iron oxide (rust) on its surface!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'ss-004',
    module: 'solar-system',
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Earth', 'Jupiter', 'Neptune'],
    correctAnswer: 2,
    explanation: 'Jupiter is the largest planet! It\'s so big that all the other planets could fit inside it.',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'ss-005',
    module: 'solar-system',
    question: 'Which planet has beautiful rings?',
    options: ['Mars', 'Saturn', 'Earth', 'Venus'],
    correctAnswer: 1,
    explanation: 'Saturn is famous for its spectacular rings made of billions of pieces of ice and rock!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'ss-006',
    module: 'solar-system',
    question: 'What do we call the path a planet takes around the Sun?',
    options: ['A circle', 'An orbit', 'A journey', 'A rotation'],
    correctAnswer: 1,
    explanation: 'An orbit is the path a planet takes as it travels around the Sun. Each planet has its own orbit!',
    difficulty: 1,
    xpReward: 10,
  },

  // SOLAR SYSTEM - Medium Questions
  {
    id: 'ss-101',
    module: 'solar-system',
    question: 'How long does it take Earth to orbit the Sun?',
    options: ['24 hours', '30 days', '365 days', '100 days'],
    correctAnswer: 2,
    explanation: 'Earth takes 365.25 days to orbit the Sun - that\'s one year! The extra 0.25 is why we have leap years.',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'ss-102',
    module: 'solar-system',
    question: 'Which planet is the hottest in our solar system?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctAnswer: 1,
    explanation: 'Venus is the hottest planet! Even though Mercury is closer to the Sun, Venus\'s thick atmosphere traps heat, making it even hotter.',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'ss-103',
    module: 'solar-system',
    question: 'How many moons does Earth have?',
    options: ['None', 'One', 'Two', 'Three'],
    correctAnswer: 1,
    explanation: 'Earth has one moon! We simply call it "the Moon," and it\'s the fifth-largest moon in the solar system.',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'ss-104',
    module: 'solar-system',
    question: 'What are the four inner planets called?',
    options: ['Gas giants', 'Ice giants', 'Rocky planets', 'Dwarf planets'],
    correctAnswer: 2,
    explanation: 'The four inner planets (Mercury, Venus, Earth, and Mars) are called rocky or terrestrial planets because they have solid, rocky surfaces.',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'ss-105',
    module: 'solar-system',
    question: 'Which planet has the Great Red Spot?',
    options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'],
    correctAnswer: 1,
    explanation: 'Jupiter has the Great Red Spot - a giant storm that has been raging for over 400 years! It\'s bigger than Earth!',
    difficulty: 2,
    xpReward: 15,
  },

  // SOLAR SYSTEM - Hard Questions
  {
    id: 'ss-201',
    module: 'solar-system',
    question: 'Which planet spins on its side?',
    options: ['Saturn', 'Uranus', 'Neptune', 'Jupiter'],
    correctAnswer: 1,
    explanation: 'Uranus spins on its side at almost a 90-degree angle! Scientists think a massive collision long ago knocked it sideways.',
    difficulty: 3,
    xpReward: 20,
  },
  {
    id: 'ss-202',
    module: 'solar-system',
    question: 'What is the farthest planet from the Sun?',
    options: ['Uranus', 'Pluto', 'Neptune', 'Saturn'],
    correctAnswer: 2,
    explanation: 'Neptune is the farthest planet from the Sun. It\'s about 2.8 billion miles away! (Pluto is no longer classified as a planet.)',
    difficulty: 3,
    xpReward: 20,
  },
  {
    id: 'ss-203',
    module: 'solar-system',
    question: 'Which planet\'s day is longer than its year?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctAnswer: 1,
    explanation: 'Venus! It takes 243 Earth days for Venus to spin once (one day), but only 225 Earth days to orbit the Sun (one year).',
    difficulty: 3,
    xpReward: 20,
  },
  {
    id: 'ss-204',
    module: 'solar-system',
    question: 'About how old is our solar system?',
    options: ['100 million years', '1 billion years', '4.6 billion years', '10 billion years'],
    correctAnswer: 2,
    explanation: 'Our solar system is about 4.6 billion years old! The Sun and planets formed from a giant cloud of gas and dust.',
    difficulty: 3,
    xpReward: 20,
  },

  // ASTRONAUTS & SPACE MISSIONS - Easy
  {
    id: 'astro-001',
    module: 'astronauts',
    question: 'What do we call a person who travels to space?',
    options: ['A pilot', 'An astronaut', 'A scientist', 'A captain'],
    correctAnswer: 1,
    explanation: 'An astronaut is a person trained to travel and work in space!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'astro-002',
    module: 'astronauts',
    question: 'Who was the first person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Alan Shepard'],
    correctAnswer: 1,
    explanation: 'Neil Armstrong was the first person to walk on the Moon on July 20, 1969, during the Apollo 11 mission!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'astro-003',
    module: 'astronauts',
    question: 'What does ISS stand for?',
    options: ['International Space Station', 'Inner Solar System', 'Interplanetary Space Ship', 'International Star Station'],
    correctAnswer: 0,
    explanation: 'ISS stands for International Space Station - a laboratory in space where astronauts live and work!',
    difficulty: 1,
    xpReward: 10,
  },

  // ASTRONAUTS & SPACE MISSIONS - Medium
  {
    id: 'astro-101',
    module: 'astronauts',
    question: 'Who was the first person in space?',
    options: ['Neil Armstrong', 'Yuri Gagarin', 'Alan Shepard', 'John Glenn'],
    correctAnswer: 1,
    explanation: 'Yuri Gagarin, a Soviet cosmonaut, became the first human in space on April 12, 1961, aboard Vostok 1!',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'astro-102',
    module: 'astronauts',
    question: 'What year did humans first land on the Moon?',
    options: ['1959', '1965', '1969', '1972'],
    correctAnswer: 2,
    explanation: '1969! The Apollo 11 mission landed on the Moon on July 20, 1969. "That\'s one small step for man, one giant leap for mankind!"',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'astro-103',
    module: 'astronauts',
    question: 'Which space mission was the first to land a rover on Mars?',
    options: ['Viking', 'Pathfinder', 'Curiosity', 'Opportunity'],
    correctAnswer: 1,
    explanation: 'Mars Pathfinder carried the first rover, Sojourner, which landed on Mars in 1997!',
    difficulty: 2,
    xpReward: 15,
  },

  // ROCKETS & TECHNOLOGY - Easy
  {
    id: 'rocket-001',
    module: 'rockets-technology',
    question: 'What pushes a rocket forward?',
    options: ['Propellers', 'Engines and hot gas', 'Wings', 'Solar panels'],
    correctAnswer: 1,
    explanation: 'Rocket engines create hot gas that shoots out the back, pushing the rocket forward - just like a balloon flying when you let the air out!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'rocket-002',
    module: 'rockets-technology',
    question: 'Why do rockets carry their own oxygen?',
    options: ['For astronauts to breathe', 'To burn fuel in space', 'To make water', 'For experiments'],
    correctAnswer: 1,
    explanation: 'Rockets carry oxygen because there\'s no air in space! The oxygen helps burn the fuel to create the power needed to fly.',
    difficulty: 1,
    xpReward: 10,
  },

  // STARS & CONSTELLATIONS - Easy
  {
    id: 'stars-001',
    module: 'stars-constellations',
    question: 'What is the Sun?',
    options: ['A planet', 'A star', 'A moon', 'A comet'],
    correctAnswer: 1,
    explanation: 'The Sun is a star! It\'s the closest star to Earth and provides us with light and heat.',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'stars-002',
    module: 'stars-constellations',
    question: 'What do we call a pattern of stars in the sky?',
    options: ['A galaxy', 'A constellation', 'A cluster', 'An orbit'],
    correctAnswer: 1,
    explanation: 'A constellation is a pattern of stars that forms a recognizable shape in the night sky. Ancient people named them after animals, heroes, and objects!',
    difficulty: 1,
    xpReward: 10,
  },
  {
    id: 'stars-003',
    module: 'stars-constellations',
    question: 'Which constellation looks like a big spoon or ladle?',
    options: ['Orion', 'The Big Dipper', 'Leo', 'Cassiopeia'],
    correctAnswer: 1,
    explanation: 'The Big Dipper looks like a big spoon or ladle! It\'s one of the easiest constellations to find in the night sky.',
    difficulty: 1,
    xpReward: 10,
  },

  // STARS & CONSTELLATIONS - Medium
  {
    id: 'stars-101',
    module: 'stars-constellations',
    question: 'What is the name of the brightest star in the night sky?',
    options: ['Polaris', 'Sirius', 'Vega', 'Betelgeuse'],
    correctAnswer: 1,
    explanation: 'Sirius, also called the "Dog Star," is the brightest star in the night sky. It\'s part of the constellation Canis Major!',
    difficulty: 2,
    xpReward: 15,
  },
  {
    id: 'stars-102',
    module: 'stars-constellations',
    question: 'What constellation contains three stars in a row called "Orion\'s Belt"?',
    options: ['Ursa Major', 'Orion', 'Leo', 'Gemini'],
    correctAnswer: 1,
    explanation: 'Orion the Hunter has three bright stars in a row that form Orion\'s Belt - one of the most recognizable patterns in the night sky!',
    difficulty: 2,
    xpReward: 15,
  },
];

/**
 * Get quiz questions for a specific module
 */
export function getQuizQuestions(moduleSlug: string, difficulty?: 1 | 2 | 3): QuizQuestion[] {
  let questions = QUIZ_QUESTIONS.filter((q) => q.module === moduleSlug);

  if (difficulty) {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  return questions;
}

/**
 * Get random quiz questions from a module
 */
export function getRandomQuizQuestions(
  moduleSlug: string,
  count: number = 5,
  difficulty?: 1 | 2 | 3
): QuizQuestion[] {
  const questions = getQuizQuestions(moduleSlug, difficulty);
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Calculate quiz score and XP reward
 */
export function calculateQuizReward(
  correctAnswers: number,
  totalQuestions: number
): { score: number; xp: number; perfectBonus: boolean } {
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  let xp = correctAnswers * 10; // Base XP per correct answer

  const perfectBonus = score === 100;
  if (perfectBonus) {
    xp += 50; // Bonus XP for perfect score
  }

  return { score, xp, perfectBonus };
}
