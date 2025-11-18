/**
 * Comprehensive Planet Facts Database
 * Based on NASA and educational research for children ages 6-12
 */

export interface PlanetFact {
  id: string;
  planet: string;
  category: 'basic' | 'fun' | 'comparison' | 'advanced';
  fact: string;
  ageLevel: number; // 1=ages 6-8, 2=ages 9-10, 3=ages 11-12
}

export const PLANET_FACTS: PlanetFact[] = [
  // MERCURY
  {
    id: 'mercury-1',
    planet: 'Mercury',
    category: 'basic',
    fact: 'Mercury is the closest planet to the Sun.',
    ageLevel: 1,
  },
  {
    id: 'mercury-2',
    planet: 'Mercury',
    category: 'fun',
    fact: 'A year on Mercury (one trip around the Sun) takes only 88 Earth days!',
    ageLevel: 1,
  },
  {
    id: 'mercury-3',
    planet: 'Mercury',
    category: 'fun',
    fact: 'If you lived on Mercury, you would have a birthday every 88 days!',
    ageLevel: 1,
  },
  {
    id: 'mercury-4',
    planet: 'Mercury',
    category: 'comparison',
    fact: 'Mercury is the smallest planet in our solar system - even smaller than some moons!',
    ageLevel: 2,
  },
  {
    id: 'mercury-5',
    planet: 'Mercury',
    category: 'advanced',
    fact: 'Mercury has no atmosphere to trap heat, so temperatures range from -290°F at night to 800°F during the day.',
    ageLevel: 3,
  },
  {
    id: 'mercury-6',
    planet: 'Mercury',
    category: 'fun',
    fact: 'Mercury is covered in craters from asteroid and comet impacts, just like our Moon!',
    ageLevel: 2,
  },

  // VENUS
  {
    id: 'venus-1',
    planet: 'Venus',
    category: 'basic',
    fact: 'Venus is the second planet from the Sun.',
    ageLevel: 1,
  },
  {
    id: 'venus-2',
    planet: 'Venus',
    category: 'fun',
    fact: 'Venus is the hottest planet in our solar system, even hotter than Mercury!',
    ageLevel: 1,
  },
  {
    id: 'venus-3',
    planet: 'Venus',
    category: 'fun',
    fact: 'Venus spins backwards compared to most other planets. The Sun would rise in the west and set in the east!',
    ageLevel: 2,
  },
  {
    id: 'venus-4',
    planet: 'Venus',
    category: 'comparison',
    fact: 'Venus is almost the same size as Earth - they are like twin planets!',
    ageLevel: 1,
  },
  {
    id: 'venus-5',
    planet: 'Venus',
    category: 'advanced',
    fact: 'Venus has thick clouds of sulfuric acid and a crushing atmospheric pressure 90 times stronger than Earth.',
    ageLevel: 3,
  },
  {
    id: 'venus-6',
    planet: 'Venus',
    category: 'fun',
    fact: 'A day on Venus (one full spin) takes 243 Earth days - longer than its year!',
    ageLevel: 2,
  },

  // EARTH
  {
    id: 'earth-1',
    planet: 'Earth',
    category: 'basic',
    fact: 'Earth is the third planet from the Sun and our home!',
    ageLevel: 1,
  },
  {
    id: 'earth-2',
    planet: 'Earth',
    category: 'fun',
    fact: 'Earth is the only planet we know of that has life!',
    ageLevel: 1,
  },
  {
    id: 'earth-3',
    planet: 'Earth',
    category: 'basic',
    fact: 'About 71% of Earth\'s surface is covered by water.',
    ageLevel: 1,
  },
  {
    id: 'earth-4',
    planet: 'Earth',
    category: 'fun',
    fact: 'Earth has one natural satellite - the Moon!',
    ageLevel: 1,
  },
  {
    id: 'earth-5',
    planet: 'Earth',
    category: 'advanced',
    fact: 'Earth\'s atmosphere protects us from harmful radiation and keeps our planet at the right temperature for life.',
    ageLevel: 2,
  },
  {
    id: 'earth-6',
    planet: 'Earth',
    category: 'fun',
    fact: 'Earth takes 365.25 days to orbit the Sun - that\'s why we have a leap year every 4 years!',
    ageLevel: 2,
  },

  // MARS
  {
    id: 'mars-1',
    planet: 'Mars',
    category: 'basic',
    fact: 'Mars is the fourth planet from the Sun.',
    ageLevel: 1,
  },
  {
    id: 'mars-2',
    planet: 'Mars',
    category: 'fun',
    fact: 'Mars is called the "Red Planet" because of the rusty red color of its surface!',
    ageLevel: 1,
  },
  {
    id: 'mars-3',
    planet: 'Mars',
    category: 'fun',
    fact: 'Mars has the largest volcano in the solar system - Olympus Mons, which is almost 3 times taller than Mount Everest!',
    ageLevel: 2,
  },
  {
    id: 'mars-4',
    planet: 'Mars',
    category: 'fun',
    fact: 'Mars has two small moons named Phobos and Deimos, which means "fear" and "panic" in Greek!',
    ageLevel: 2,
  },
  {
    id: 'mars-5',
    planet: 'Mars',
    category: 'advanced',
    fact: 'Scientists have sent many rovers to Mars to look for signs of water and possible ancient life.',
    ageLevel: 2,
  },
  {
    id: 'mars-6',
    planet: 'Mars',
    category: 'comparison',
    fact: 'A day on Mars is just slightly longer than an Earth day - 24 hours and 37 minutes!',
    ageLevel: 2,
  },
  {
    id: 'mars-7',
    planet: 'Mars',
    category: 'advanced',
    fact: 'Mars has seasons just like Earth, but they are twice as long because Mars takes about 687 days to orbit the Sun.',
    ageLevel: 3,
  },

  // JUPITER
  {
    id: 'jupiter-1',
    planet: 'Jupiter',
    category: 'basic',
    fact: 'Jupiter is the largest planet in our solar system!',
    ageLevel: 1,
  },
  {
    id: 'jupiter-2',
    planet: 'Jupiter',
    category: 'fun',
    fact: 'Jupiter is so big that all the other planets could fit inside it!',
    ageLevel: 1,
  },
  {
    id: 'jupiter-3',
    planet: 'Jupiter',
    category: 'fun',
    fact: 'Jupiter has a Great Red Spot - a giant storm that has been raging for at least 400 years!',
    ageLevel: 2,
  },
  {
    id: 'jupiter-4',
    planet: 'Jupiter',
    category: 'basic',
    fact: 'Jupiter is a gas giant - it doesn\'t have a solid surface like Earth!',
    ageLevel: 2,
  },
  {
    id: 'jupiter-5',
    planet: 'Jupiter',
    category: 'fun',
    fact: 'Jupiter has at least 95 known moons! The four largest (Io, Europa, Ganymede, and Callisto) were discovered by Galileo in 1610.',
    ageLevel: 2,
  },
  {
    id: 'jupiter-6',
    planet: 'Jupiter',
    category: 'advanced',
    fact: 'Jupiter spins so fast that a day there lasts only about 10 hours!',
    ageLevel: 2,
  },
  {
    id: 'jupiter-7',
    planet: 'Jupiter',
    category: 'advanced',
    fact: 'Jupiter\'s strong gravity helps protect Earth by attracting comets and asteroids that might otherwise hit our planet.',
    ageLevel: 3,
  },

  // SATURN
  {
    id: 'saturn-1',
    planet: 'Saturn',
    category: 'basic',
    fact: 'Saturn is famous for its beautiful rings!',
    ageLevel: 1,
  },
  {
    id: 'saturn-2',
    planet: 'Saturn',
    category: 'fun',
    fact: 'Saturn\'s rings are made of billions of pieces of ice and rock, some as small as dust and others as big as houses!',
    ageLevel: 2,
  },
  {
    id: 'saturn-3',
    planet: 'Saturn',
    category: 'fun',
    fact: 'Saturn is so light that it could float in water if you had a bathtub big enough!',
    ageLevel: 2,
  },
  {
    id: 'saturn-4',
    planet: 'Saturn',
    category: 'basic',
    fact: 'Saturn is the second-largest planet in our solar system.',
    ageLevel: 1,
  },
  {
    id: 'saturn-5',
    planet: 'Saturn',
    category: 'fun',
    fact: 'Saturn has at least 146 known moons! The largest is Titan, which is bigger than the planet Mercury.',
    ageLevel: 2,
  },
  {
    id: 'saturn-6',
    planet: 'Saturn',
    category: 'advanced',
    fact: 'A year on Saturn (one orbit around the Sun) takes about 29.5 Earth years!',
    ageLevel: 2,
  },
  {
    id: 'saturn-7',
    planet: 'Saturn',
    category: 'advanced',
    fact: 'Titan, Saturn\'s largest moon, has lakes and rivers of liquid methane and ethane on its surface.',
    ageLevel: 3,
  },

  // URANUS
  {
    id: 'uranus-1',
    planet: 'Uranus',
    category: 'basic',
    fact: 'Uranus is the seventh planet from the Sun.',
    ageLevel: 1,
  },
  {
    id: 'uranus-2',
    planet: 'Uranus',
    category: 'fun',
    fact: 'Uranus spins on its side! It rotates at almost a 90-degree angle, unlike any other planet.',
    ageLevel: 2,
  },
  {
    id: 'uranus-3',
    planet: 'Uranus',
    category: 'fun',
    fact: 'Uranus is an ice giant with a blue-green color from methane gas in its atmosphere.',
    ageLevel: 2,
  },
  {
    id: 'uranus-4',
    planet: 'Uranus',
    category: 'advanced',
    fact: 'A year on Uranus takes 84 Earth years, which means each season lasts about 21 years!',
    ageLevel: 3,
  },
  {
    id: 'uranus-5',
    planet: 'Uranus',
    category: 'fun',
    fact: 'Uranus has 13 known rings, but they are very dark and hard to see.',
    ageLevel: 2,
  },
  {
    id: 'uranus-6',
    planet: 'Uranus',
    category: 'advanced',
    fact: 'Uranus was the first planet discovered using a telescope, found by William Herschel in 1781.',
    ageLevel: 3,
  },

  // NEPTUNE
  {
    id: 'neptune-1',
    planet: 'Neptune',
    category: 'basic',
    fact: 'Neptune is the eighth and farthest planet from the Sun.',
    ageLevel: 1,
  },
  {
    id: 'neptune-2',
    planet: 'Neptune',
    category: 'fun',
    fact: 'Neptune is a beautiful deep blue color because of methane in its atmosphere.',
    ageLevel: 1,
  },
  {
    id: 'neptune-3',
    planet: 'Neptune',
    category: 'fun',
    fact: 'Neptune has the strongest winds in the solar system - they can blow at speeds of up to 1,200 miles per hour!',
    ageLevel: 2,
  },
  {
    id: 'neptune-4',
    planet: 'Neptune',
    category: 'advanced',
    fact: 'A year on Neptune takes 165 Earth years - if you were born on Neptune, you wouldn\'t have a first birthday until you were 165 years old!',
    ageLevel: 2,
  },
  {
    id: 'neptune-5',
    planet: 'Neptune',
    category: 'fun',
    fact: 'Neptune has 16 known moons. The largest is Triton, which orbits Neptune backwards!',
    ageLevel: 2,
  },
  {
    id: 'neptune-6',
    planet: 'Neptune',
    category: 'advanced',
    fact: 'Neptune was discovered in 1846 through mathematical predictions before it was actually seen through a telescope.',
    ageLevel: 3,
  },

  // THE SUN
  {
    id: 'sun-1',
    planet: 'Sun',
    category: 'basic',
    fact: 'The Sun is a star at the center of our solar system.',
    ageLevel: 1,
  },
  {
    id: 'sun-2',
    planet: 'Sun',
    category: 'fun',
    fact: 'The Sun is so big that about 1.3 million Earths could fit inside it!',
    ageLevel: 1,
  },
  {
    id: 'sun-3',
    planet: 'Sun',
    category: 'fun',
    fact: 'The Sun is about 4.6 billion years old - that\'s really, really old!',
    ageLevel: 2,
  },
  {
    id: 'sun-4',
    planet: 'Sun',
    category: 'advanced',
    fact: 'The Sun is about 93 million miles away from Earth - that\'s so far that light from the Sun takes 8 minutes to reach us!',
    ageLevel: 2,
  },
  {
    id: 'sun-5',
    planet: 'Sun',
    category: 'advanced',
    fact: 'The Sun is made mostly of hydrogen and helium, and it creates energy through nuclear fusion.',
    ageLevel: 3,
  },
  {
    id: 'sun-6',
    planet: 'Sun',
    category: 'fun',
    fact: 'The Sun\'s core is super hot - about 27 million degrees Fahrenheit!',
    ageLevel: 2,
  },
];

export interface PlanetInfo {
  name: string;
  position: number;
  diameter: string;
  distance: string; // from Sun
  dayLength: string;
  yearLength: string;
  moons: number;
  type: 'terrestrial' | 'gas-giant' | 'ice-giant';
  color: string;
  funFact: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    name: 'Mercury',
    position: 1,
    diameter: '4,879 km',
    distance: '57.9 million km',
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    moons: 0,
    type: 'terrestrial',
    color: 'gray',
    funFact: 'Your birthday would come every 88 days!',
  },
  {
    name: 'Venus',
    position: 2,
    diameter: '12,104 km',
    distance: '108.2 million km',
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    moons: 0,
    type: 'terrestrial',
    color: 'yellowish-white',
    funFact: 'A day is longer than a year here!',
  },
  {
    name: 'Earth',
    position: 3,
    diameter: '12,742 km',
    distance: '149.6 million km',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    moons: 1,
    type: 'terrestrial',
    color: 'blue and green',
    funFact: 'The only planet with life we know of!',
  },
  {
    name: 'Mars',
    position: 4,
    diameter: '6,779 km',
    distance: '227.9 million km',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    moons: 2,
    type: 'terrestrial',
    color: 'red',
    funFact: 'Has the tallest volcano in the solar system!',
  },
  {
    name: 'Jupiter',
    position: 5,
    diameter: '139,820 km',
    distance: '778.5 million km',
    dayLength: '10 hours',
    yearLength: '12 Earth years',
    moons: 95,
    type: 'gas-giant',
    color: 'orange and white',
    funFact: 'All other planets could fit inside Jupiter!',
  },
  {
    name: 'Saturn',
    position: 6,
    diameter: '116,460 km',
    distance: '1.4 billion km',
    dayLength: '11 hours',
    yearLength: '29.5 Earth years',
    moons: 146,
    type: 'gas-giant',
    color: 'golden',
    funFact: 'Light enough to float in water!',
  },
  {
    name: 'Uranus',
    position: 7,
    diameter: '50,724 km',
    distance: '2.9 billion km',
    dayLength: '17 hours',
    yearLength: '84 Earth years',
    moons: 27,
    type: 'ice-giant',
    color: 'cyan',
    funFact: 'Spins on its side!',
  },
  {
    name: 'Neptune',
    position: 8,
    diameter: '49,244 km',
    distance: '4.5 billion km',
    dayLength: '16 hours',
    yearLength: '165 Earth years',
    moons: 16,
    type: 'ice-giant',
    color: 'deep blue',
    funFact: 'Has the strongest winds in the solar system!',
  },
];

/**
 * Get random facts for a specific planet
 */
export function getRandomPlanetFacts(planet: string, count: number = 3): PlanetFact[] {
  const planetFacts = PLANET_FACTS.filter((f) => f.planet === planet);
  const shuffled = [...planetFacts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get facts filtered by age level
 */
export function getFactsByAgeLevel(ageLevel: number): PlanetFact[] {
  return PLANET_FACTS.filter((f) => f.ageLevel <= ageLevel);
}

/**
 * Get planet info by name
 */
export function getPlanetInfo(name: string): PlanetInfo | undefined {
  return PLANETS.find((p) => p.name === name);
}
