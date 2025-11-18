/**
 * Reading Content Library
 * Age-appropriate articles and stories about space exploration
 * Based on educational standards and NASA educational resources
 */

export interface ReadingArticle {
  id: string;
  module: string;
  title: string;
  subtitle: string;
  readingLevel: 1 | 2 | 3; // 1=ages 6-8, 2=ages 9-10, 3=ages 11-12
  estimatedMinutes: number;
  content: ReadingSection[];
  funFacts: string[];
  quizQuestions?: string[]; // IDs of related quiz questions
  xpReward: number;
  imageUrl?: string;
}

export interface ReadingSection {
  type: 'heading' | 'paragraph' | 'callout' | 'image' | 'list';
  content: string | string[];
  emoji?: string;
}

export const READING_ARTICLES: ReadingArticle[] = [
  // ===== SOLAR SYSTEM MODULE =====
  {
    id: 'solar-system-intro',
    module: 'solar-system',
    title: 'Welcome to Our Solar System!',
    subtitle: 'Discover the amazing neighborhood we call home',
    readingLevel: 1,
    estimatedMinutes: 3,
    xpReward: 20,
    funFacts: [
      'Our solar system is 4.6 billion years old!',
      'If the Sun was the size of a basketball, Earth would be the size of a peppercorn!',
      'All the planets could fit between Earth and the Moon!',
    ],
    content: [
      {
        type: 'heading',
        content: 'What is the Solar System?',
        emoji: '🌌',
      },
      {
        type: 'paragraph',
        content:
          "Imagine a giant space neighborhood where the Sun is like a bright lamp in the middle, and all the planets are like houses circling around it. That's our solar system!",
      },
      {
        type: 'paragraph',
        content:
          'The Sun is a big, hot star that gives us light and warmth. Without it, Earth would be a dark, frozen place. The Sun is so big that over 1 million Earths could fit inside it!',
      },
      {
        type: 'callout',
        content: 'The word "solar" comes from "Sol," the Latin name for the Sun!',
        emoji: '☀️',
      },
      {
        type: 'heading',
        content: 'The Eight Planets',
        emoji: '🪐',
      },
      {
        type: 'paragraph',
        content:
          'Our solar system has 8 planets that travel around the Sun in paths called orbits. Think of it like a merry-go-round, but in space!',
      },
      {
        type: 'list',
        content: [
          'Mercury - The smallest and fastest planet, closest to the Sun',
          'Venus - The hottest planet with thick clouds',
          'Earth - Our home! The only planet with life',
          'Mars - The red planet that might have had water long ago',
          'Jupiter - The biggest planet with a giant red storm',
          'Saturn - Famous for its beautiful rings made of ice and rock',
          'Uranus - A blue-green planet that spins on its side',
          'Neptune - The farthest planet, blue and very windy',
        ],
      },
      {
        type: 'callout',
        content:
          'Here\'s a fun way to remember the planets in order: "My Very Educated Mother Just Served Us Nachos!" Each first letter matches a planet!',
        emoji: '📝',
      },
      {
        type: 'heading',
        content: 'Other Space Neighbors',
        emoji: '☄️',
      },
      {
        type: 'paragraph',
        content:
          "Our solar system isn't just planets! There are also moons (like Earth's Moon), asteroids (space rocks), comets (icy snowballs with tails), and dwarf planets like Pluto.",
      },
      {
        type: 'paragraph',
        content:
          "Everything in our solar system is held together by gravity - an invisible force that pulls things toward each other. It's like the Sun is giving all the planets a gentle hug, keeping them in their orbits!",
      },
    ],
  },
  {
    id: 'solar-system-earth',
    module: 'solar-system',
    title: 'Our Amazing Planet Earth',
    subtitle: 'Why Earth is the perfect place for life',
    readingLevel: 2,
    estimatedMinutes: 4,
    xpReward: 25,
    funFacts: [
      "Earth is the only planet not named after a Roman or Greek god - its name comes from old English meaning 'ground'!",
      "About 71% of Earth's surface is covered in water - that's why it looks so blue from space!",
      "Earth spins at about 1,000 miles per hour, but we don't feel dizzy!",
    ],
    content: [
      {
        type: 'heading',
        content: 'The Goldilocks Planet',
        emoji: '🌍',
      },
      {
        type: 'paragraph',
        content:
          "Earth is often called the 'Goldilocks Planet' - just like in the story of Goldilocks and the Three Bears, everything about Earth is 'just right' for life!",
      },
      {
        type: 'paragraph',
        content:
          "We're not too close to the Sun (like Mercury and Venus, where it's too hot) and not too far away (like Mars and the outer planets, where it's too cold). Our distance from the Sun means we have the perfect temperature for liquid water - and water is essential for all life!",
      },
      {
        type: 'heading',
        content: 'The Atmosphere: Our Protective Blanket',
        emoji: '🌫️',
      },
      {
        type: 'paragraph',
        content:
          "Earth is wrapped in a thick blanket of air called the atmosphere. This isn't just any air - it's a special mixture of gases that we breathe, including oxygen (which we need to live) and nitrogen.",
      },
      {
        type: 'callout',
        content:
          "The atmosphere also protects us like a shield! It burns up most meteors before they can reach the ground, blocks harmful radiation from the Sun, and keeps our planet at a comfortable temperature.",
        emoji: '🛡️',
      },
      {
        type: 'heading',
        content: 'A Day on Earth',
        emoji: '🌅',
      },
      {
        type: 'paragraph',
        content:
          "Earth spins like a top! One complete spin takes 24 hours - that's what we call a day. As Earth spins, different parts face the Sun (daytime) or face away from the Sun (nighttime).",
      },
      {
        type: 'paragraph',
        content:
          'At the same time Earth is spinning, it\'s also traveling around the Sun in a big oval path called an orbit. One trip around the Sun takes 365 days - that\'s one year!',
      },
      {
        type: 'heading',
        content: 'The Moon: Our Loyal Companion',
        emoji: '🌙',
      },
      {
        type: 'paragraph',
        content:
          'Earth has one natural satellite - the Moon! The Moon orbits Earth and takes about 27 days to make one complete trip. The Moon is responsible for ocean tides and has been a source of wonder for humans throughout history.',
      },
      {
        type: 'callout',
        content:
          'The Moon is slowly moving away from Earth - about 1.5 inches per year. Millions of years from now, it will be farther away!',
        emoji: '🔭',
      },
      {
        type: 'heading',
        content: 'Why Earth is Special',
        emoji: '✨',
      },
      {
        type: 'list',
        content: [
          'Liquid water on the surface - no other planet in our solar system has this!',
          'Perfect atmosphere with oxygen for breathing',
          'Magnetic field that protects us from solar radiation',
          'Diverse ecosystems with millions of species',
          'Active geology with volcanoes, earthquakes, and moving continents',
          'The only known planet with intelligent life (that\'s us!)',
        ],
      },
    ],
  },
  {
    id: 'solar-system-jupiter',
    module: 'solar-system',
    title: 'Jupiter: King of the Planets',
    subtitle: 'Explore the largest planet in our solar system',
    readingLevel: 2,
    estimatedMinutes: 4,
    xpReward: 25,
    funFacts: [
      'Jupiter is so big that all the other planets in our solar system could fit inside it!',
      'A day on Jupiter is only 10 hours long, making it the fastest-spinning planet!',
      'The Great Red Spot is a storm bigger than Earth that has been raging for at least 400 years!',
    ],
    content: [
      {
        type: 'heading',
        content: 'A Giant Among Planets',
        emoji: '🪐',
      },
      {
        type: 'paragraph',
        content:
          "Jupiter is absolutely enormous! It's the biggest planet in our solar system - so big that you could fit 1,300 Earths inside it. If Jupiter was a hollow ball, all the other planets could fit inside with room to spare!",
      },
      {
        type: 'paragraph',
        content:
          "But here's something amazing: even though Jupiter is so huge, it's mostly made of gas, not rock. Jupiter is called a 'gas giant' because it's made mostly of hydrogen and helium - the same stuff that stars are made of!",
      },
      {
        type: 'callout',
        content:
          'If Jupiter had been about 80 times more massive, it would have become a star instead of a planet!',
        emoji: '⭐',
      },
      {
        type: 'heading',
        content: 'The Great Red Spot',
        emoji: '🌀',
      },
      {
        type: 'paragraph',
        content:
          "One of Jupiter's most famous features is a giant storm called the Great Red Spot. This isn't just any storm - it's a hurricane-like storm that's been raging for hundreds of years! The spot is so big that two or three Earths could fit inside it.",
      },
      {
        type: 'paragraph',
        content:
          'The storm spins counterclockwise and has winds up to 400 miles per hour. Scientists have been watching it shrink slowly over the years, but it\'s still going strong!',
      },
      {
        type: 'heading',
        content: 'Jupiter\'s Many Moons',
        emoji: '🌙',
      },
      {
        type: 'paragraph',
        content:
          "Jupiter doesn't have just one moon like Earth - it has at least 95 known moons! That's like having 95 different Moon companions in the sky!",
      },
      {
        type: 'paragraph',
        content:
          'The four largest moons are called the Galilean moons, named after Galileo Galilei who discovered them in 1610 with his telescope. Their names are:',
      },
      {
        type: 'list',
        content: [
          'Io - The most volcanically active body in the solar system!',
          'Europa - Has an ocean of water beneath its icy surface',
          "Ganymede - The largest moon in the solar system, even bigger than Mercury!",
          'Callisto - Covered in ancient craters from space rocks',
        ],
      },
      {
        type: 'callout',
        content:
          "Europa's underground ocean might be one of the best places to look for alien life in our solar system!",
        emoji: '👽',
      },
      {
        type: 'heading',
        content: 'Jupiter\'s Protective Role',
        emoji: '🛡️',
      },
      {
        type: 'paragraph',
        content:
          "Jupiter acts like a cosmic vacuum cleaner for our solar system! Its massive gravity pulls in asteroids and comets that might otherwise crash into Earth. Scientists think Jupiter has protected Earth from many dangerous impacts over billions of years.",
      },
      {
        type: 'paragraph',
        content:
          "In 1994, astronomers watched as a comet named Shoemaker-Levy 9 broke into pieces and crashed into Jupiter. The impacts created dark spots on Jupiter bigger than Earth!",
      },
    ],
  },

  // ===== ASTRONAUTS MODULE =====
  {
    id: 'astronauts-intro',
    module: 'astronauts',
    title: 'What Does an Astronaut Do?',
    subtitle: 'Learn about the brave explorers of space',
    readingLevel: 1,
    estimatedMinutes: 3,
    xpReward: 20,
    funFacts: [
      'The word "astronaut" means "star sailor" in Greek!',
      'Astronauts grow about 2 inches taller in space because their spine stretches!',
      'Astronauts have to exercise 2 hours every day in space to keep their muscles strong!',
    ],
    content: [
      {
        type: 'heading',
        content: 'Who Are Astronauts?',
        emoji: '👨‍🚀',
      },
      {
        type: 'paragraph',
        content:
          "Astronauts are special people who travel to space! They're like explorers who go to places no one has been before. Some astronauts live on the International Space Station (ISS) for months at a time, while others go on shorter missions.",
      },
      {
        type: 'paragraph',
        content:
          "Being an astronaut is one of the most exciting jobs in the world - but it's also one of the hardest! Astronauts need to be very smart, very brave, and very healthy.",
      },
      {
        type: 'heading',
        content: 'Training to Be an Astronaut',
        emoji: '🎓',
      },
      {
        type: 'paragraph',
        content:
          'Becoming an astronaut takes years of training! Astronauts have to:',
      },
      {
        type: 'list',
        content: [
          'Study hard in school, especially math and science',
          'Learn how to fly airplanes',
          'Practice in a giant swimming pool that feels like space',
          'Study how to fix complicated machines',
          'Learn Russian (because they work with Russian astronauts on the ISS!)',
          'Train in simulators that feel like real spacecraft',
          'Stay very healthy and exercise a lot',
        ],
      },
      {
        type: 'callout',
        content:
          'Astronauts practice underwater because floating in water feels similar to floating in space!',
        emoji: '🏊',
      },
      {
        type: 'heading',
        content: 'Life in Space',
        emoji: '🚀',
      },
      {
        type: 'paragraph',
        content:
          "Living in space is very different from living on Earth! There's no gravity, so astronauts float everywhere. They sleep in sleeping bags attached to the walls, eat food from pouches, and have to use special toilets.",
      },
      {
        type: 'paragraph',
        content:
          'Astronauts work hard every day doing science experiments, fixing the space station, exercising to stay healthy, and sometimes going on spacewalks outside the station!',
      },
      {
        type: 'callout',
        content:
          'On the ISS, astronauts see 16 sunrises and 16 sunsets every day because they orbit Earth so fast!',
        emoji: '🌅',
      },
      {
        type: 'heading',
        content: 'What Do Astronauts Study?',
        emoji: '🔬',
      },
      {
        type: 'paragraph',
        content:
          'Astronauts are scientists too! They do experiments that can only be done in space. They study:',
      },
      {
        type: 'list',
        content: [
          'How plants grow without gravity',
          'How the human body changes in space',
          'New medicines that might help people on Earth',
          'How materials behave differently in space',
          'Earth\'s weather and environment from space',
          'The stars, planets, and galaxies',
        ],
      },
    ],
  },
  {
    id: 'astronauts-first-moon',
    module: 'astronauts',
    title: 'Apollo 11: The First Moon Landing',
    subtitle: 'The incredible story of humanity\'s greatest adventure',
    readingLevel: 2,
    estimatedMinutes: 5,
    xpReward: 30,
    funFacts: [
      'The computer that guided Apollo 11 to the Moon was less powerful than a modern smartphone!',
      'Armstrong and Aldrin had only 25 seconds of fuel left when they landed!',
      'The American flag they planted is still on the Moon, but it\'s been bleached white by the Sun!',
    ],
    content: [
      {
        type: 'heading',
        content: 'A Dream Becomes Reality',
        emoji: '🌙',
      },
      {
        type: 'paragraph',
        content:
          "For thousands of years, humans looked up at the Moon and wondered what it would be like to visit. On July 20, 1969, that dream finally came true when Apollo 11 landed on the Moon!",
      },
      {
        type: 'paragraph',
        content:
          'Three brave astronauts made this historic journey: Neil Armstrong, Buzz Aldrin, and Michael Collins. Their mission was to land on the Moon and return safely to Earth.',
      },
      {
        type: 'heading',
        content: 'The Journey to the Moon',
        emoji: '🚀',
      },
      {
        type: 'paragraph',
        content:
          "The journey began on July 16, 1969, when a massive Saturn V rocket - as tall as a 36-story building - blasted off from Florida. The rocket was so powerful that people watching from miles away could feel the ground shake!",
      },
      {
        type: 'paragraph',
        content:
          'It took Apollo 11 three days to travel the 240,000 miles to the Moon. During the trip, the astronauts lived in a small spacecraft called the Command Module, named "Columbia."',
      },
      {
        type: 'callout',
        content:
          'The astronauts could see the whole Earth from their spacecraft window. They said it looked like a beautiful blue marble floating in space!',
        emoji: '🌍',
      },
      {
        type: 'heading',
        content: 'Landing on the Moon',
        emoji: '🛸',
      },
      {
        type: 'paragraph',
        content:
          'When they reached the Moon, Armstrong and Aldrin climbed into the Lunar Module called "Eagle," while Collins stayed in orbit in Columbia. The Eagle began its descent to the lunar surface.',
      },
      {
        type: 'paragraph',
        content:
          "But there was a problem! As they got closer to the surface, Armstrong saw they were heading toward a crater filled with boulders. If they landed there, the Eagle could tip over or crash!",
      },
      {
        type: 'paragraph',
        content:
          'With only seconds of fuel left, Armstrong took manual control and flew the Eagle to a safer spot. Finally, with just 25 seconds of fuel remaining, they touched down safely.',
      },
      {
        type: 'callout',
        content:
          'Armstrong\'s calm voice radioed to Earth: "The Eagle has landed." Mission Control erupted in cheers!',
        emoji: '🎉',
      },
      {
        type: 'heading',
        content: '"One Small Step..."',
        emoji: '👣',
      },
      {
        type: 'paragraph',
        content:
          'Six and a half hours after landing, Neil Armstrong opened the hatch and climbed down the ladder. When his boot touched the lunar surface, he spoke the famous words:',
      },
      {
        type: 'callout',
        content:
          '"That\'s one small step for man, one giant leap for mankind."',
        emoji: '🗣️',
      },
      {
        type: 'paragraph',
        content:
          "Armstrong was the first human to walk on the Moon! Nineteen minutes later, Buzz Aldrin joined him, and together they spent about two and a half hours exploring the Moon's surface.",
      },
      {
        type: 'heading',
        content: 'What They Did on the Moon',
        emoji: '🔬',
      },
      {
        type: 'list',
        content: [
          'Took photos and videos of the lunar landscape',
          'Collected 47.5 pounds of Moon rocks and dust to bring back to Earth',
          'Set up scientific experiments to study moonquakes and the solar wind',
          'Planted an American flag',
          'Left a plaque that reads: "Here men from the planet Earth first set foot upon the Moon. July 1969 A.D. We came in peace for all mankind."',
          'Talked to President Richard Nixon on a phone call from the White House!',
        ],
      },
      {
        type: 'heading',
        content: 'Coming Home',
        emoji: '🏠',
      },
      {
        type: 'paragraph',
        content:
          'After their moonwalk, Armstrong and Aldrin climbed back into the Eagle and launched off the Moon to rejoin Collins in the Command Module. The three astronauts then began their journey back to Earth.',
      },
      {
        type: 'paragraph',
        content:
          'On July 24, eight days after they left, the astronauts splashed down safely in the Pacific Ocean. They were heroes! People all around the world celebrated this amazing achievement.',
      },
      {
        type: 'callout',
        content:
          'More than 600 million people - about one-fifth of the world\'s population at the time - watched the Moon landing on TV!',
        emoji: '📺',
      },
    ],
  },

  // ===== ROCKETS MODULE =====
  {
    id: 'rockets-how-work',
    module: 'rockets',
    title: 'How Do Rockets Work?',
    subtitle: 'Discover the science that sends us to space',
    readingLevel: 2,
    estimatedMinutes: 4,
    xpReward: 25,
    funFacts: [
      'Rockets have to go 25,000 mph to escape Earth\'s gravity!',
      'The Saturn V rocket used 20 tons of fuel every second!',
      'Some rockets can be reused - they land back on Earth after launching!',
    ],
    content: [
      {
        type: 'heading',
        content: 'The Basic Idea',
        emoji: '🚀',
      },
      {
        type: 'paragraph',
        content:
          "Rockets work using a simple idea from physics: for every action, there's an equal and opposite reaction. When you blow up a balloon and let it go, it flies around the room as the air rushes out. Rockets work the same way, but much more powerfully!",
      },
      {
        type: 'paragraph',
        content:
          "Rockets carry fuel and oxygen (most engines need oxygen to burn fuel). When the fuel burns, it creates hot gases that rush out of the bottom of the rocket at incredible speeds. As these gases blast downward, they push the rocket upward - that's the 'equal and opposite reaction'!",
      },
      {
        type: 'callout',
        content:
          "Try this experiment: Blow up a balloon and let it go without tying it. Watch it zoom around! That's the same principle that sends rockets to space!",
        emoji: '🎈',
      },
      {
        type: 'heading',
        content: 'Parts of a Rocket',
        emoji: '🔧',
      },
      {
        type: 'list',
        content: [
          '**Payload** - The stuff the rocket carries (satellites, astronauts, supplies)',
          '**Guidance System** - The "brain" that steers the rocket',
          '**Fuel Tanks** - Hold the fuel and oxygen',
          '**Engines** - Burn the fuel to create thrust (pushing power)',
          '**Fins or Thrusters** - Help steer the rocket',
          '**Stages** - Big rockets have multiple sections that fall away when empty',
        ],
      },
      {
        type: 'heading',
        content: 'Why Rockets Need Stages',
        emoji: '📦',
      },
      {
        type: 'paragraph',
        content:
          "Most big rockets are built in stages - like stacking boxes on top of each other. Each stage has its own fuel tank and engines. Here's why:",
      },
      {
        type: 'paragraph',
        content:
          "As the rocket uses up fuel, it doesn't need those big, heavy, empty fuel tanks anymore. So the rocket drops them! This makes the rocket lighter, so the remaining stages can push it even faster with less work.",
      },
      {
        type: 'callout',
        content:
          'The Saturn V rocket that took astronauts to the Moon had three stages. By the time it reached space, it had dropped most of its original weight!',
        emoji: '🌙',
      },
      {
        type: 'heading',
        content: 'Escaping Earth',
        emoji: '🌍',
      },
      {
        type: 'paragraph',
        content:
          "Earth's gravity is strong - it's what keeps us from floating off into space! To get to space, rockets need to reach 'escape velocity' - about 25,000 miles per hour. That's fast enough to go from New York to Los Angeles in just 7 minutes!",
      },
      {
        type: 'paragraph',
        content:
          'Rockets also have to deal with air resistance when launching. The atmosphere is like an invisible blanket of air around Earth. Pushing through it is hard work! That\'s why rockets are shaped like arrows - to cut through the air more easily.',
      },
      {
        type: 'heading',
        content: 'Modern Reusable Rockets',
        emoji: '♻️',
      },
      {
        type: 'paragraph',
        content:
          "In the past, rockets could only be used once. Each launch meant building a whole new rocket - very expensive! But companies like SpaceX have created rockets that can land back on Earth and be used again.",
      },
      {
        type: 'paragraph',
        content:
          "These reusable rockets have special landing legs and thrusters that let them fly back down and land gently - like a science fiction movie come to life! This makes spaceflight much cheaper and more common.",
      },
    ],
  },

  // ===== STARS MODULE =====
  {
    id: 'stars-lifecycle',
    module: 'stars',
    title: 'The Life Cycle of Stars',
    subtitle: 'How stars are born, live, and die',
    readingLevel: 3,
    estimatedMinutes: 5,
    xpReward: 30,
    funFacts: [
      'Our Sun has been shining for 4.6 billion years and will keep shining for another 5 billion!',
      'When massive stars die, they can explode and create all the elements in your body!',
      'Some dying stars become black holes - places where gravity is so strong that even light can\'t escape!',
    ],
    content: [
      {
        type: 'heading',
        content: 'Stars Are Born in Nebulae',
        emoji: '🌟',
      },
      {
        type: 'paragraph',
        content:
          "Stars begin their lives in giant clouds of gas and dust called nebulae. These clouds are mostly hydrogen - the lightest and most common element in the universe. A nebula might be hundreds of light-years across!",
      },
      {
        type: 'paragraph',
        content:
          "Something causes part of the nebula to start collapsing - maybe a shockwave from a nearby exploding star or just gravity pulling the cloud together. As the cloud collapses, it gets denser and hotter in the center.",
      },
      {
        type: 'paragraph',
        content:
          'Eventually, the center gets so hot (about 10 million degrees!) that nuclear fusion begins - hydrogen atoms smash together to make helium, releasing enormous amounts of energy. A star is born!',
      },
      {
        type: 'callout',
        content:
          'The Orion Nebula, visible to the naked eye, is a stellar nursery where new stars are being born right now!',
        emoji: '👶',
      },
      {
        type: 'heading',
        content: 'Main Sequence: A Star\'s Long Life',
        emoji: '☀️',
      },
      {
        type: 'paragraph',
        content:
          "Most of a star's life is spent in the 'main sequence' phase - steadily burning hydrogen into helium. Our Sun is in this phase right now and has been for about 4.6 billion years!",
      },
      {
        type: 'paragraph',
        content:
          "During this phase, stars are in perfect balance: gravity tries to crush the star inward, while the energy from fusion pushes outward. It's like a tug-of-war where both sides are equally strong.",
      },
      {
        type: 'paragraph',
        content:
          'How long a star stays in this phase depends on its mass:',
      },
      {
        type: 'list',
        content: [
          'Small stars (red dwarfs) burn slowly and can live for trillions of years!',
          'Medium stars like our Sun live for about 10 billion years',
          'Massive blue stars burn hot and fast, living only a few million years',
        ],
      },
      {
        type: 'callout',
        content:
          "It might seem backward, but the bigger a star is, the shorter it lives! Massive stars burn their fuel much faster.",
        emoji: '⚡',
      },
      {
        type: 'heading',
        content: 'Red Giants: Old Age',
        emoji: '🔴',
      },
      {
        type: 'paragraph',
        content:
          "Eventually, a star runs out of hydrogen fuel in its core. When this happens, the core shrinks and heats up, while the outer layers expand and cool. The star becomes a red giant - huge but cooler on the surface, giving it a reddish color.",
      },
      {
        type: 'paragraph',
        content:
          'In about 5 billion years, our Sun will become a red giant. It will swell up so much that it might swallow Mercury, Venus, and maybe even Earth!',
      },
      {
        type: 'paragraph',
        content:
          "During the red giant phase, the star starts fusing helium into heavier elements like carbon and oxygen. It's like a cosmic factory creating new elements!",
      },
      {
        type: 'heading',
        content: 'How Stars Die',
        emoji: '💫',
      },
      {
        type: 'paragraph',
        content:
          'What happens next depends on the mass of the star:',
      },
      {
        type: 'list',
        content: [
          '**Small/Medium Stars (like our Sun):** The outer layers drift off into space as a beautiful planetary nebula. The core shrinks into a white dwarf - a hot, dense star about the size of Earth. Over billions of years, the white dwarf cools and fades.',
          '**Massive Stars:** These stars go out with a bang! When they run out of fuel, the core collapses in less than a second, then rebounds in a catastrophic supernova explosion - briefly outshining an entire galaxy! The core becomes either a neutron star (incredibly dense) or a black hole (if massive enough).',
        ],
      },
      {
        type: 'callout',
        content:
          'Supernova explosions create and scatter heavy elements like gold, silver, and iron throughout space. The atoms in your body were made in ancient stars!',
        emoji: '✨',
      },
      {
        type: 'heading',
        content: 'The Circle of Life',
        emoji: '♻️',
      },
      {
        type: 'paragraph',
        content:
          "When stars die, they don't just disappear. The gas and dust they release mix with nebulae, where new stars will eventually form. These new stars might have planets - and those planets are made from the ashes of dead stars!",
      },
      {
        type: 'paragraph',
        content:
          'We are literally made of stardust. Every atom in your body (except hydrogen) was forged in the core of an ancient star and scattered through space when that star died. In a way, we are the universe looking back at itself!',
      },
    ],
  },

  // ===== SPACE EXPLORATION MODULE =====
  {
    id: 'exploration-iss',
    module: 'space-exploration',
    title: 'Living on the International Space Station',
    subtitle: 'A day in the life of astronauts in space',
    readingLevel: 2,
    estimatedMinutes: 4,
    xpReward: 25,
    funFacts: [
      'The ISS orbits Earth at 17,500 mph - 5 miles every second!',
      'Astronauts on the ISS see 16 sunrises and 16 sunsets every day!',
      'The ISS is as big as a football field and weighs about 1 million pounds!',
    ],
    content: [
      {
        type: 'heading',
        content: 'A Laboratory in the Sky',
        emoji: '🛰️',
      },
      {
        type: 'paragraph',
        content:
          "The International Space Station (ISS) is humanity's home in space! It's a huge laboratory orbiting 250 miles above Earth, where astronauts from different countries live and work together.",
      },
      {
        type: 'paragraph',
        content:
          'The ISS is a marvel of international cooperation. It was built by space agencies from the United States (NASA), Russia (Roscosmos), Europe (ESA), Japan (JAXA), and Canada (CSA). It took over 10 years and more than 30 missions to assemble it in space!',
      },
      {
        type: 'callout',
        content:
          'The ISS has been continuously occupied since November 2000 - that\'s over 20 years of humans living in space!',
        emoji: '🏠',
      },
      {
        type: 'heading',
        content: 'Waking Up in Space',
        emoji: '⏰',
      },
      {
        type: 'paragraph',
        content:
          "Astronauts on the ISS follow a strict schedule. Their day starts when Mission Control wakes them up with music - each astronaut gets to choose their wake-up song!",
      },
      {
        type: 'paragraph',
        content:
          "Since there's no gravity, astronauts sleep in sleeping bags attached to the walls. There's no 'up' or 'down' in space, so they can sleep in any direction! Some astronauts say they dream about floating even when they're asleep.",
      },
      {
        type: 'heading',
        content: 'Eating in Space',
        emoji: '🍽️',
      },
      {
        type: 'paragraph',
        content:
          'Eating in zero gravity is tricky! Astronauts eat three meals a day, but the food comes in special pouches and packages. Most food is dehydrated (has the water removed) to save weight. Astronauts add water to make it ready to eat.',
      },
      {
        type: 'list',
        content: [
          'Some foods stick to a spoon or fork naturally (like peanut butter)',
          'Liquids are drunk through straws from sealed pouches',
          'Salt and pepper come in liquid form so they don\'t float away!',
          'Fresh fruit and vegetables are a special treat when supply ships arrive',
          'Crumbs are dangerous - they can float into equipment or be inhaled!',
        ],
      },
      {
        type: 'callout',
        content:
          'The ISS gets fresh supplies every few months from cargo spacecraft launched from Earth.',
        emoji: '📦',
      },
      {
        type: 'heading',
        content: 'Working in Space',
        emoji: '🔬',
      },
      {
        type: 'paragraph',
        content:
          'Astronauts spend most of their day doing science experiments that can only be done in microgravity. They study:',
      },
      {
        type: 'list',
        content: [
          'How the human body changes in space (important for future Mars missions!)',
          'How plants grow without gravity',
          'New materials and medicines that could help people on Earth',
          'Physics experiments that are impossible on Earth',
          'Earth\'s climate and weather from space',
          'The effects of cosmic radiation',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Astronauts also maintain the space station. They fix broken equipment, update software, and sometimes go on spacewalks to repair the outside of the station!',
      },
      {
        type: 'heading',
        content: 'Staying Healthy',
        emoji: '💪',
      },
      {
        type: 'paragraph',
        content:
          "Without gravity, astronauts' muscles and bones don't have to work as hard. This means they can become weak! To prevent this, astronauts exercise for 2 hours every day using special equipment.",
      },
      {
        type: 'paragraph',
        content:
          'They use treadmills (with straps to hold them down!), stationary bikes, and resistance machines. Some astronauts say this is the hardest part of their day!',
      },
      {
        type: 'heading',
        content: 'Bathroom and Hygiene',
        emoji: '🚿',
      },
      {
        type: 'paragraph',
        content:
          "Using the bathroom in space is...different! The toilet uses air suction instead of water to pull waste away. It's not very comfortable, and astronauts say it takes practice to get good at it!",
      },
      {
        type: 'paragraph',
        content:
          "Showers are impossible - water would just float everywhere! Instead, astronauts use special no-rinse soap and shampoo, along with wet towels. They have to be careful not to let water droplets float away.",
      },
      {
        type: 'heading',
        content: 'Free Time and Fun',
        emoji: '🎮',
      },
      {
        type: 'paragraph',
        content:
          'Astronauts work hard, but they also have free time! During their off-hours, they might:',
      },
      {
        type: 'list',
        content: [
          'Look out the windows at Earth (their favorite activity!)',
          'Talk to their families on video calls',
          'Watch movies or listen to music',
          'Read books or play musical instruments',
          'Take photos of Earth and space',
          'Do fun experiments in zero gravity for social media!',
        ],
      },
      {
        type: 'callout',
        content:
          'Some astronauts have made viral videos showing what happens to water, fidget spinners, and other objects in zero gravity!',
        emoji: '📱',
      },
      {
        type: 'heading',
        content: 'Going to Sleep',
        emoji: '😴',
      },
      {
        type: 'paragraph',
        content:
          'After a long day of work, exercise, and experiments, astronauts go to sleep in their sleeping quarters - small phone-booth-sized rooms with sleeping bags. They zip themselves in so they don\'t float around while sleeping!',
      },
      {
        type: 'paragraph',
        content:
          "The ISS orbits Earth every 90 minutes, so the Sun is always rising or setting outside the windows. Astronauts use sleep masks or covers for the windows to block out the light.",
      },
    ],
  },
];

/**
 * Get reading articles by module
 */
export function getReadingArticlesByModule(moduleSlug: string): ReadingArticle[] {
  return READING_ARTICLES.filter((article) => article.module === moduleSlug);
}

/**
 * Get reading article by ID
 */
export function getReadingArticleById(id: string): ReadingArticle | undefined {
  return READING_ARTICLES.find((article) => article.id === id);
}

/**
 * Get reading articles by level
 */
export function getReadingArticlesByLevel(
  moduleSlug: string,
  readingLevel: 1 | 2 | 3
): ReadingArticle[] {
  return READING_ARTICLES.filter(
    (article) => article.module === moduleSlug && article.readingLevel === readingLevel
  );
}

/**
 * Get recommended reading based on child age
 */
export function getRecommendedReading(age: number, moduleSlug: string): ReadingArticle[] {
  let level: 1 | 2 | 3;
  if (age <= 8) level = 1;
  else if (age <= 10) level = 2;
  else level = 3;

  return getReadingArticlesByLevel(moduleSlug, level);
}
