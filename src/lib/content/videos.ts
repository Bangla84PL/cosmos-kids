/**
 * Video Content Library
 * Educational space videos for children
 * Using public domain NASA videos and educational content
 */

export interface VideoContent {
  id: string;
  module: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageLevel: 1 | 2 | 3; // 1=ages 6-8, 2=ages 9-10, 3=ages 11-12
  videoUrl: string; // YouTube embed or direct video URL
  thumbnailUrl?: string;
  topics: string[];
  learningObjectives: string[];
  discussionQuestions: string[];
  xpReward: number;
  transcript?: string;
}

/**
 * Video library with educational space content
 * Note: These use public domain NASA videos and educational content
 */
export const VIDEO_LIBRARY: VideoContent[] = [
  // ===== SOLAR SYSTEM MODULE =====
  {
    id: 'solar-system-overview',
    module: 'solar-system',
    title: 'Tour of the Solar System',
    description:
      'Take an amazing journey through our solar system! Visit all 8 planets and learn what makes each one special.',
    durationMinutes: 5,
    ageLevel: 1,
    videoUrl: 'https://www.youtube.com/embed/libKVRa01L8', // NASA Solar System video
    topics: ['planets', 'solar system', 'space exploration'],
    learningObjectives: [
      'Identify all 8 planets in order from the Sun',
      'Understand what makes each planet unique',
      'Learn basic facts about our solar system',
    ],
    discussionQuestions: [
      'Which planet would you most like to visit and why?',
      'What surprised you most about the solar system?',
      'How is Earth different from the other planets?',
    ],
    xpReward: 15,
  },
  {
    id: 'earth-from-space',
    module: 'solar-system',
    title: 'Earth from Space',
    description:
      'See our beautiful planet Earth from the view of astronauts! Watch stunning footage from the International Space Station.',
    durationMinutes: 4,
    ageLevel: 1,
    videoUrl: 'https://www.youtube.com/embed/FG0fTKAqZ5g', // ISS Earth views
    topics: ['Earth', 'ISS', 'space station', 'astronauts'],
    learningObjectives: [
      'See what Earth looks like from space',
      'Understand the beauty and fragility of our planet',
      'Learn about the International Space Station',
    ],
    discussionQuestions: [
      'What did you notice about Earth from space?',
      'Can you see your country from the space station?',
      'Why do you think astronauts say seeing Earth from space changed them?',
    ],
    xpReward: 15,
  },
  {
    id: 'mars-exploration',
    module: 'solar-system',
    title: 'Exploring Mars',
    description:
      'Journey to the Red Planet! Learn about the rovers exploring Mars and what scientists are discovering.',
    durationMinutes: 6,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/4czjS9h4Fpg', // Mars exploration
    topics: ['Mars', 'rovers', 'exploration', 'NASA'],
    learningObjectives: [
      'Learn about Mars and why it\'s called the Red Planet',
      'Understand how rovers explore Mars',
      'Discover what scientists are looking for on Mars',
    ],
    discussionQuestions: [
      'Why are scientists so interested in Mars?',
      'What challenges do rovers face on Mars?',
      'Would you want to be one of the first humans to visit Mars?',
    ],
    xpReward: 20,
  },

  // ===== ASTRONAUTS MODULE =====
  {
    id: 'astronaut-training',
    module: 'astronauts',
    title: 'How Astronauts Train',
    description:
      'Go behind the scenes to see how astronauts prepare for space! From underwater training to simulators, see what it takes.',
    durationMinutes: 5,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/pnbJEg9r1o8', // Astronaut training
    topics: ['astronauts', 'training', 'NASA', 'preparation'],
    learningObjectives: [
      'Understand the rigorous training astronauts undergo',
      'Learn about different types of training exercises',
      'Appreciate the dedication required to become an astronaut',
    ],
    discussionQuestions: [
      'What part of astronaut training looks the hardest?',
      'Why do astronauts train underwater?',
      'What skills would you need to work on to become an astronaut?',
    ],
    xpReward: 20,
  },
  {
    id: 'first-moon-landing',
    module: 'astronauts',
    title: 'Apollo 11: First Steps on the Moon',
    description:
      'Watch the historic moment when Neil Armstrong became the first human to walk on the Moon in 1969!',
    durationMinutes: 7,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/cwZb2mqId0A', // Apollo 11 footage
    topics: ['Moon landing', 'Apollo 11', 'Neil Armstrong', 'history'],
    learningObjectives: [
      'Learn about the historic Apollo 11 mission',
      'Understand the significance of the Moon landing',
      'See actual footage from the mission',
    ],
    discussionQuestions: [
      'How do you think the astronauts felt stepping on the Moon?',
      'Why was the Moon landing such an important achievement?',
      'What would you do first if you walked on the Moon?',
    ],
    xpReward: 25,
  },
  {
    id: 'day-in-life-iss',
    module: 'astronauts',
    title: 'A Day on the Space Station',
    description:
      'Follow astronauts through a typical day on the International Space Station! See how they eat, sleep, work, and exercise in space.',
    durationMinutes: 8,
    ageLevel: 1,
    videoUrl: 'https://www.youtube.com/embed/doN4t5NKW-k', // ISS daily life
    topics: ['ISS', 'astronauts', 'daily life', 'microgravity'],
    learningObjectives: [
      'Understand daily routines on the ISS',
      'Learn how astronauts adapt to living in space',
      'See the challenges and fun of zero gravity',
    ],
    discussionQuestions: [
      'What would be the hardest part of living in space?',
      'What would be the most fun part?',
      'How is eating in space different from eating on Earth?',
    ],
    xpReward: 20,
  },

  // ===== ROCKETS MODULE =====
  {
    id: 'rocket-launch',
    module: 'rockets',
    title: 'Rocket Launch Up Close',
    description:
      'Experience the power of a rocket launch! See and hear what it\'s like when a massive rocket blasts off to space.',
    durationMinutes: 4,
    ageLevel: 1,
    videoUrl: 'https://www.youtube.com/embed/OnoNITE-CLc', // Rocket launch
    topics: ['rockets', 'launch', 'engineering', 'power'],
    learningObjectives: [
      'Witness the incredible power of rocket launches',
      'Understand the stages of a launch',
      'Learn about the forces involved in reaching space',
    ],
    discussionQuestions: [
      'What surprised you most about the rocket launch?',
      'Why do rockets need to be so powerful?',
      'Would you be brave enough to ride in a rocket?',
    ],
    xpReward: 15,
  },
  {
    id: 'how-rockets-work',
    module: 'rockets',
    title: 'How Do Rockets Work?',
    description:
      'Discover the science behind rockets! Learn about Newton\'s laws, fuel, and how rockets can reach space.',
    durationMinutes: 6,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/4MaA_0IPSEQ', // Rocket science explained
    topics: ['rockets', 'physics', 'engineering', 'science'],
    learningObjectives: [
      'Understand the basic physics of how rockets work',
      'Learn about Newton\'s Third Law of Motion',
      'Discover different types of rocket engines',
    ],
    discussionQuestions: [
      'Can you explain how rockets work in your own words?',
      'What other things in everyday life use the same principle as rockets?',
      'Why is rocket science considered so difficult?',
    ],
    xpReward: 20,
  },
  {
    id: 'spacex-reusable-rockets',
    module: 'rockets',
    title: 'Reusable Rockets Landing',
    description:
      'Watch amazing footage of rockets landing themselves! See how modern technology is making space travel cheaper and more common.',
    durationMinutes: 5,
    ageLevel: 3,
    videoUrl: 'https://www.youtube.com/embed/Z4TXCZG_NEY', // SpaceX landings
    topics: ['reusable rockets', 'SpaceX', 'innovation', 'technology'],
    learningObjectives: [
      'Understand how reusable rockets work',
      'Learn why reusability is important for space exploration',
      'See cutting-edge aerospace technology in action',
    ],
    discussionQuestions: [
      'Why is landing a rocket so difficult?',
      'How will reusable rockets change space exploration?',
      'What other space technologies do you think we\'ll see in the future?',
    ],
    xpReward: 25,
  },

  // ===== STARS MODULE =====
  {
    id: 'life-of-stars',
    module: 'stars',
    title: 'The Life Cycle of Stars',
    description:
      'Discover how stars are born, live, and die! Learn about different types of stars and what happens when they explode.',
    durationMinutes: 7,
    ageLevel: 3,
    videoUrl: 'https://www.youtube.com/embed/PM9CQDlQI0A', // Star life cycle
    topics: ['stars', 'stellar evolution', 'supernovae', 'astronomy'],
    learningObjectives: [
      'Understand the life cycle of stars',
      'Learn about different types of stars',
      'Discover what happens when massive stars die',
    ],
    discussionQuestions: [
      'How are stars similar to living things?',
      'What will happen to our Sun in the future?',
      'Why do scientists say we are made of stardust?',
    ],
    xpReward: 25,
  },
  {
    id: 'hubble-deep-field',
    module: 'stars',
    title: 'Hubble\'s Deepest View',
    description:
      'Journey to the edge of the observable universe! See thousands of galaxies captured by the Hubble Space Telescope.',
    durationMinutes: 6,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/mcBV-cXVWFw', // Hubble Deep Field
    topics: ['galaxies', 'Hubble', 'universe', 'deep space'],
    learningObjectives: [
      'See the incredible depth of the universe',
      'Learn about the Hubble Space Telescope',
      'Understand the scale of galaxies and the universe',
    ],
    discussionQuestions: [
      'What does this view tell us about the size of the universe?',
      'How far back in time can the Hubble telescope see?',
      'What do you wonder about when you see so many galaxies?',
    ],
    xpReward: 20,
  },

  // ===== SPACE EXPLORATION MODULE =====
  {
    id: 'james-webb-telescope',
    module: 'space-exploration',
    title: 'James Webb Space Telescope',
    description:
      'Meet the most powerful space telescope ever built! See the amazing images it\'s capturing and learn what it\'s discovering.',
    durationMinutes: 8,
    ageLevel: 3,
    videoUrl: 'https://www.youtube.com/embed/gfbEMBL7N5Y', // JWST overview
    topics: ['James Webb', 'telescope', 'astronomy', 'technology'],
    learningObjectives: [
      'Learn about the James Webb Space Telescope',
      'Understand how it\'s different from Hubble',
      'See the incredible images it\'s capturing',
    ],
    discussionQuestions: [
      'What makes the James Webb telescope so special?',
      'What do you think it will discover?',
      'How does looking at distant galaxies let us see back in time?',
    ],
    xpReward: 30,
  },
  {
    id: 'future-mars-missions',
    module: 'space-exploration',
    title: 'Future Missions to Mars',
    description:
      'Could humans live on Mars one day? Explore the plans NASA and other space agencies have for sending humans to the Red Planet!',
    durationMinutes: 7,
    ageLevel: 2,
    videoUrl: 'https://www.youtube.com/embed/e0Qo_eSSY7s', // Mars missions
    topics: ['Mars', 'future missions', 'colonization', 'NASA'],
    learningObjectives: [
      'Learn about planned missions to Mars',
      'Understand the challenges of sending humans to Mars',
      'Explore the possibility of living on Mars',
    ],
    discussionQuestions: [
      'What would be the biggest challenges of living on Mars?',
      'Would you volunteer to be one of the first Mars colonists?',
      'What would you miss most about Earth if you lived on Mars?',
    ],
    xpReward: 25,
  },
];

/**
 * Get videos by module
 */
export function getVideosByModule(moduleSlug: string): VideoContent[] {
  return VIDEO_LIBRARY.filter((video) => video.module === moduleSlug);
}

/**
 * Get video by ID
 */
export function getVideoById(id: string): VideoContent | undefined {
  return VIDEO_LIBRARY.find((video) => video.id === id);
}

/**
 * Get videos by age level
 */
export function getVideosByAgeLevel(
  moduleSlug: string,
  ageLevel: 1 | 2 | 3
): VideoContent[] {
  return VIDEO_LIBRARY.filter(
    (video) => video.module === moduleSlug && video.ageLevel === ageLevel
  );
}

/**
 * Get recommended videos based on child age
 */
export function getRecommendedVideos(age: number, moduleSlug: string): VideoContent[] {
  let level: 1 | 2 | 3;
  if (age <= 8) level = 1;
  else if (age <= 10) level = 2;
  else level = 3;

  return getVideosByAgeLevel(moduleSlug, level);
}

/**
 * Get total video duration for a module
 */
export function getTotalDuration(moduleSlug: string): number {
  return VIDEO_LIBRARY.filter((video) => video.module === moduleSlug).reduce(
    (total, video) => total + video.durationMinutes,
    0
  );
}
