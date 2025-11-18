/**
 * Astronaut and Space Mission Facts
 * Based on NASA resources and historical space exploration
 */

export interface AstronautFact {
  id: string;
  name: string;
  country: string;
  achievement: string;
  year: number;
  funFact: string;
  imageUrl?: string;
}

export const FAMOUS_ASTRONAUTS: AstronautFact[] = [
  {
    id: 'yuri-gagarin',
    name: 'Yuri Gagarin',
    country: 'Soviet Union (Russia)',
    achievement: 'First human in space',
    year: 1961,
    funFact:
      'On April 12, 1961, Yuri Gagarin became the first person to journey into outer space aboard Vostok 1. His historic flight lasted 108 minutes!',
  },
  {
    id: 'neil-armstrong',
    name: 'Neil Armstrong',
    country: 'United States',
    achievement: 'First person to walk on the Moon',
    year: 1969,
    funFact:
      'When Neil Armstrong stepped onto the Moon, he said "That\'s one small step for man, one giant leap for mankind." He and Buzz Aldrin spent 21 hours on the Moon!',
  },
  {
    id: 'buzz-aldrin',
    name: 'Buzz Aldrin',
    country: 'United States',
    achievement: 'Second person to walk on the Moon',
    year: 1969,
    funFact:
      'Buzz Aldrin followed Neil Armstrong onto the Moon\'s surface. He was also the first person to hold a religious ceremony on the Moon - he took communion!',
  },
  {
    id: 'valentina-tereshkova',
    name: 'Valentina Tereshkova',
    country: 'Soviet Union (Russia)',
    achievement: 'First woman in space',
    year: 1963,
    funFact:
      'Valentina was the first woman to fly in space aboard Vostok 6. She orbited Earth 48 times during her three-day mission!',
  },
  {
    id: 'alan-shepard',
    name: 'Alan Shepard',
    country: 'United States',
    achievement: 'First American in space',
    year: 1961,
    funFact:
      'Alan Shepard was the first American in space and later became the only person to play golf on the Moon during the Apollo 14 mission in 1971!',
  },
  {
    id: 'mae-jemison',
    name: 'Mae Jemison',
    country: 'United States',
    achievement: 'First African American woman in space',
    year: 1992,
    funFact:
      'Mae Jemison was not only an astronaut but also a doctor and engineer! She spent 8 days in space aboard the Space Shuttle Endeavour.',
  },
  {
    id: 'chris-hadfield',
    name: 'Chris Hadfield',
    country: 'Canada',
    achievement: 'First Canadian to walk in space and command the ISS',
    year: 2001,
    funFact:
      'Chris Hadfield became famous for his videos from space, including recording the first music video in space - singing "Space Oddity" aboard the ISS!',
  },
  {
    id: 'peggy-whitson',
    name: 'Peggy Whitson',
    country: 'United States',
    achievement: 'Most time in space by any American astronaut',
    year: 2017,
    funFact:
      'Peggy Whitson spent 665 days in space over her career - that\'s almost 2 years! She was also the first female commander of the ISS.',
  },
  {
    id: 'sally-ride',
    name: 'Sally Ride',
    country: 'United States',
    achievement: 'First American woman in space',
    year: 1983,
    funFact:
      'Sally Ride was not only an astronaut but also a physicist! She flew on the Space Shuttle Challenger and inspired generations of girls to pursue careers in science.',
  },
  {
    id: 'john-glenn',
    name: 'John Glenn',
    country: 'United States',
    achievement: 'First American to orbit Earth',
    year: 1962,
    funFact:
      'John Glenn orbited Earth three times in 1962. Later, at age 77, he became the oldest person to fly in space when he returned aboard Space Shuttle Discovery in 1998!',
  },
];

export interface SpaceMission {
  id: string;
  name: string;
  year: number;
  destination: string;
  achievement: string;
  description: string;
  funFact: string;
}

export const FAMOUS_MISSIONS: SpaceMission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    year: 1969,
    destination: 'The Moon',
    achievement: 'First humans on the Moon',
    description:
      'Apollo 11 was the first mission to land humans on the Moon. Neil Armstrong and Buzz Aldrin walked on the lunar surface while Michael Collins orbited above.',
    funFact:
      'The astronauts left a plaque on the Moon that reads: "Here men from the planet Earth first set foot upon the Moon. July 1969 A.D. We came in peace for all mankind."',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    year: 1977,
    destination: 'Interstellar Space',
    achievement: 'Farthest human-made object from Earth',
    description:
      'Voyager 1 explored Jupiter and Saturn, then became the first spacecraft to enter interstellar space in 2012. It carries a golden record with sounds and images from Earth!',
    funFact:
      'Voyager 1 is over 14 billion miles from Earth and still sending signals! It will keep traveling through space long after humans are gone.',
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    year: 1990,
    destination: 'Earth Orbit',
    achievement: 'Revolutionary space observatory',
    description:
      'The Hubble Space Telescope orbits Earth and has taken over 1.5 million observations, helping us discover dark energy, the age of the universe, and thousands of galaxies!',
    funFact:
      'Hubble can see objects so far away that the light has been traveling for billions of years to reach us!',
  },
  {
    id: 'iss',
    name: 'International Space Station (ISS)',
    year: 2000,
    destination: 'Earth Orbit',
    achievement: 'Largest human-made structure in space',
    description:
      'The ISS is a laboratory in space where astronauts live and work. It orbits Earth every 90 minutes at 17,500 mph and has been continuously occupied since November 2000.',
    funFact:
      'The ISS is as big as a football field! Astronauts can see 16 sunrises and sunsets every day as they orbit Earth.',
  },
  {
    id: 'curiosity',
    name: 'Mars Curiosity Rover',
    year: 2012,
    destination: 'Mars',
    achievement: 'Largest Mars rover',
    description:
      'Curiosity is a car-sized rover exploring Mars to find out if the Red Planet ever had conditions suitable for life. It has driven over 18 miles on Mars!',
    funFact:
      'Curiosity sings "Happy Birthday" to itself every year on August 5th, the anniversary of its landing on Mars!',
  },
  {
    id: 'perseverance',
    name: 'Mars Perseverance Rover',
    year: 2021,
    destination: 'Mars',
    achievement: 'Search for ancient microbial life',
    description:
      'Perseverance is exploring Mars to collect rock samples and search for signs of ancient microbial life. It also brought the first helicopter to another planet - Ingenuity!',
    funFact:
      'Perseverance carries a small helicopter called Ingenuity that became the first aircraft to achieve powered flight on another planet!',
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    year: 2021,
    destination: 'Deep Space',
    achievement: 'Most powerful space telescope ever built',
    description:
      'The James Webb Space Telescope looks deeper into space than ever before, seeing the first galaxies formed after the Big Bang and studying planets around other stars.',
    funFact:
      'Webb\'s mirror is so powerful it could see a bee on the Moon! It took 30 years to build and is 100 times more powerful than Hubble.',
  },
];

export interface ISSFact {
  category: 'life' | 'science' | 'construction' | 'fun';
  fact: string;
}

export const ISS_FACTS: ISSFact[] = [
  {
    category: 'life',
    fact: 'Astronauts on the ISS exercise for 2 hours every day to keep their muscles and bones strong in zero gravity.',
  },
  {
    category: 'life',
    fact: 'Astronauts eat 3 meals a day on the ISS, and food comes in pouches. They add hot water to make it ready to eat!',
  },
  {
    category: 'life',
    fact: 'In space, astronauts sleep in sleeping bags attached to the walls so they don\'t float around!',
  },
  {
    category: 'life',
    fact: 'Astronauts have to use special toilets that use air suction instead of water because liquids float in space!',
  },
  {
    category: 'science',
    fact: 'Scientists on the ISS conduct over 200 experiments in areas like biology, physics, astronomy, and materials science.',
  },
  {
    category: 'science',
    fact: 'The ISS helps us learn how to grow plants in space - important for future missions to Mars!',
  },
  {
    category: 'construction',
    fact: 'The ISS is made of modules from different countries including the USA, Russia, Europe, Japan, and Canada.',
  },
  {
    category: 'construction',
    fact: 'The ISS took 10 years and more than 30 missions to assemble in space!',
  },
  {
    category: 'fun',
    fact: 'The ISS travels at 17,500 miles per hour - that\'s fast enough to go around Earth in just 90 minutes!',
  },
  {
    category: 'fun',
    fact: 'Astronauts can see the Earth\'s horizon curve and can watch 16 sunrises and sunsets every day!',
  },
  {
    category: 'fun',
    fact: 'In zero gravity, astronauts can do flips and float upside down - there is no up or down in space!',
  },
  {
    category: 'fun',
    fact: 'Astronauts can drink floating balls of water! They catch them with their mouths like fish.',
  },
];

/**
 * Get random astronaut facts
 */
export function getRandomAstronauts(count: number = 3): AstronautFact[] {
  const shuffled = [...FAMOUS_ASTRONAUTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get missions by destination
 */
export function getMissionsByDestination(destination: string): SpaceMission[] {
  return FAMOUS_MISSIONS.filter((m) =>
    m.destination.toLowerCase().includes(destination.toLowerCase())
  );
}

/**
 * Get ISS facts by category
 */
export function getISSFactsByCategory(category: ISSFact['category']): ISSFact[] {
  return ISS_FACTS.filter((f) => f.category === category);
}
