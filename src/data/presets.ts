import { Itinerary } from '../types.ts';

export const PRESET_ITINERARIES: Record<string, Itinerary> = {
  kyoto: {
    city: "Kyoto",
    country: "Japan",
    currency: "JPY",
    summary: "A culturally rich 3-day exploration through ancient wooden shrines, serene zen gardens, historic geisha districts, and historic bamboo groves.",
    days: [
      {
        day: 1,
        theme: "Eastern Hills Heritage & Historic Lanes",
        stops: [
          {
            name: "Fushimi Inari Taisha",
            category: "history",
            description: "Wander through thousands of iconic vermilion torii gates winding up the sacred Mount Inari.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 34.9671,
            lng: 135.7727,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Sannenzaka & Ninenzaka",
            category: "shopping",
            description: "Stroll along preserved stone-paved pedestrian alleys lined with traditional wooden tea houses and artisan shops.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 34.9984,
            lng: 135.7801,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Kiyomizu-dera Temple",
            category: "history",
            description: "Marvel at the monumental wooden stage perched over cherry and maple trees with sweeping city panoramas.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 34.9949,
            lng: 135.7850,
            est_entry_price: { min: 400, max: 400 }
          },
          {
            name: "Gion & Hanamikoji Dori",
            category: "nightlife",
            description: "Discover the historic entertainment quarter illuminated by traditional lanterns where geiko and maiko hurry to evening appointments.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 35.0037,
            lng: 135.7770,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Nishiki Market Street Stalls",
            cuisine: "Japanese Street Food",
            description: "Bustling five-block arcade famed for grilled seafood skewers, tamagoyaki, and seasonal pickles.",
            price_level: "low"
          },
          {
            name: "Gion Karyo",
            cuisine: "Kaiseki Ryori",
            description: "Refined multi-course traditional dining celebrating seasonal Kyoto ingredients inside an authentic machiya townhouse.",
            price_level: "high"
          }
        ]
      },
      {
        day: 2,
        theme: "Arashiyama Groves & Golden Splendor",
        stops: [
          {
            name: "Arashiyama Bamboo Grove",
            category: "nature",
            description: "Walk beneath towering green bamboo stalks that sway gracefully in the morning mountain breeze.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 35.0171,
            lng: 135.6713,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Tenryu-ji Temple",
            category: "art",
            description: "Contemplate a 14th-century landscaped Zen garden reflecting the rolling hills of Arashiyama.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 35.0158,
            lng: 135.6776,
            est_entry_price: { min: 500, max: 500 }
          },
          {
            name: "Kinkaku-ji (Golden Pavilion)",
            category: "history",
            description: "Admire the top two floors gilded in pure gold leaf shimmering over Mirror Pond.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 35.0394,
            lng: 135.7292,
            est_entry_price: { min: 500, max: 500 }
          },
          {
            name: "Ryoan-ji Temple",
            category: "art",
            description: "Ponder Japan's most famous dry landscape rock garden with fifteen mysterious boulders set in raked gravel.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 35.0345,
            lng: 135.7182,
            est_entry_price: { min: 600, max: 600 }
          }
        ],
        food: [
          {
            name: "Shigetsu",
            cuisine: "Shojin Ryori (Buddhist Vegetarian)",
            description: "Tranquil temple dining serving nourishing multi-dish vegetarian delicacies overlooking Tenryu-ji gardens.",
            price_level: "mid"
          },
          {
            name: "Pontocho Robin",
            cuisine: "Kyoto Washoku",
            description: "Riverside timber restaurant featuring fresh sashimi and seasonal simmered pots along narrow Pontocho Alley.",
            price_level: "mid"
          }
        ]
      },
      {
        day: 3,
        theme: "Imperial Heritage & Philosophical Paths",
        stops: [
          {
            name: "Nijo Castle",
            category: "history",
            description: "Explore the fortified residence of Tokugawa shoguns with ornate cedar gate carvings and chirping nightingale floors.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 35.0142,
            lng: 135.7482,
            est_entry_price: { min: 800, max: 1300 }
          },
          {
            name: "Kyoto Imperial Palace",
            category: "history",
            description: "Tour the stately courtyards and vast gravel gardens that housed Japan's emperors until 1869.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 35.0254,
            lng: 135.7621,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Philosopher's Walk",
            category: "nature",
            description: "Follow a gentle stone pathway alongside a canal bordered by hundreds of flowering cherry trees.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 35.0272,
            lng: 135.7954,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Ginkaku-ji (Silver Pavilion)",
            category: "art",
            description: "Experience wabi-sabi aesthetics with a distinctive conical sand sculpture and moss-carpeted hill trails.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 35.0272,
            lng: 135.7982,
            est_entry_price: { min: 500, max: 500 }
          }
        ],
        food: [
          {
            name: "Omen Ginkaku-ji",
            cuisine: "Handmade Udon",
            description: "Celebrated noodle house serving springy udon accompanied by seasonal dipping vegetables and sesame broth.",
            price_level: "low"
          },
          {
            name: "Chao Chao Gyoza Sanjo",
            cuisine: "Gyoza & Craft Beer",
            description: "Lively local eatery famed for crispy-bottomed bite-sized dumplings and cold Japanese drafts.",
            price_level: "low"
          }
        ]
      }
    ],
    stays: [
      {
        name: "Piece Hostel Sanjo",
        type: "Design Hostel",
        area: "Downtown Kawaramachi",
        price_level: "low",
        description: "Modern minimalist accommodations with vibrant communal lounges right by Sanjo shopping arcades."
      },
      {
        name: "The Celestine Kyoto Gion",
        type: "Boutique Hotel",
        area: "Gion Higashiyama",
        price_level: "mid",
        description: "Elegant contemporary hotel blending Japanese craftsmanship with public baths near Kennin-ji temple."
      },
      {
        name: "Hiiragiya Ryokan",
        type: "Traditional Ryokan",
        area: "Nakagyo Ward",
        price_level: "high",
        description: "Historic two-hundred-year-old inn offering refined tatami suites, cedar baths, and exemplary omotenashi hospitality."
      }
    ]
  },
  rome: {
    city: "Rome",
    country: "Italy",
    currency: "EUR",
    summary: "A thrilling journey through classical antiquity, Renaissance piazzas, baroque fountains, and bustling Trastevere trattorias.",
    days: [
      {
        day: 1,
        theme: "Ancient Empire & Classical Marvels",
        stops: [
          {
            name: "Colosseum",
            category: "history",
            description: "Stand inside the grandest amphitheater of antiquity where gladiators and spectacle enthralled imperial crowds.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 41.8902,
            lng: 12.4922,
            est_entry_price: { min: 18, max: 24 }
          },
          {
            name: "Roman Forum & Palatine Hill",
            category: "history",
            description: "Wander through the political and ceremonial beating heart of the Roman Republic surrounded by ruined temples.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 41.8925,
            lng: 12.4853,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Capitoline Hill & Piazza del Campidoglio",
            category: "art",
            description: "Ascend Michelangelo's elegant trapezoidal piazza commanding dramatic viewpoints over the Forum ruins.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 41.8933,
            lng: 12.4831,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Monti Neighborhood",
            category: "nightlife",
            description: "Soak in the bohemian atmosphere of cobblestone alleys packed with wine bars and artisan boutiques.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 41.8953,
            lng: 12.4938,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "La Carbonara",
            cuisine: "Roman Trattoria",
            description: "Historic Monti institution serving authentic creamy carbonara and amatriciana since 1906.",
            price_level: "mid"
          },
          {
            name: "Ai Tre Scalini",
            cuisine: "Wine Bar & Small Plates",
            description: "Charming ivy-draped enoteca offering Italian regional wines and artisanal charcuterie boards.",
            price_level: "low"
          }
        ]
      },
      {
        day: 2,
        theme: "Baroque Heart & Monumental Piazzas",
        stops: [
          {
            name: "Pantheon",
            category: "history",
            description: "Gaze upward through the magnificent open oculus of Rome's best-preserved ancient domed marvel.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 41.8986,
            lng: 12.4769,
            est_entry_price: { min: 5, max: 5 }
          },
          {
            name: "Piazza Navona",
            category: "art",
            description: "Admire Bernini's dramatic Fountain of the Four Rivers situated on Emperor Domitian's ancient stadium footprint.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 41.8992,
            lng: 12.4731,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Trevi Fountain",
            category: "art",
            description: "Toss a lucky coin over your left shoulder into the monumental travertine waters of Salvi's baroque masterpiece.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 41.9009,
            lng: 12.4833,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Spanish Steps & Piazza di Spagna",
            category: "shopping",
            description: "Climb the grand 135-step staircase leading to the Trinità dei Monti church amidst luxury fashion avenues.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 41.9060,
            lng: 12.4828,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Roscioli Salumeria con Cucina",
            cuisine: "Roman Gourmet",
            description: "Celebrated deli and restaurant delivering benchmark cacio e pepe and cured meats.",
            price_level: "high"
          },
          {
            name: "Giolitti",
            cuisine: "Gelateria",
            description: "Rome's most famous historic ice cream parlor crafting dozens of velvety gelato flavors near the Pantheon.",
            price_level: "low"
          }
        ]
      },
      {
        day: 3,
        theme: "Vatican Treasures & Bohemian Riverbanks",
        stops: [
          {
            name: "Vatican Museums & Sistine Chapel",
            category: "art",
            description: "Marvel at Michelangelo's transcendent frescoes on the Sistine Chapel ceiling alongside vast papal art collections.",
            best_time: "morning",
            duration_hours: 3.5,
            lat: 41.9067,
            lng: 12.4536,
            est_entry_price: { min: 20, max: 25 }
          },
          {
            name: "St. Peter's Basilica",
            category: "history",
            description: "Experience the monumental grandeur of Catholicism's spiritual center housing Michelangelo's Pietà.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 41.9022,
            lng: 12.4539,
            est_entry_price: { min: 0, max: 10 }
          },
          {
            name: "Castel Sant'Angelo",
            category: "history",
            description: "Traverse Emperor Hadrian's fortress mausoleum linked to the Vatican via a historic fortified corridor.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 41.9031,
            lng: 12.4663,
            est_entry_price: { min: 15, max: 18 }
          },
          {
            name: "Trastevere Historic Quarter",
            category: "nightlife",
            description: "Immerse in spirited twilight lanes lit by gas lamps and filled with musicians and outdoor diner tables.",
            best_time: "evening",
            duration_hours: 2.0,
            lat: 41.8893,
            lng: 12.4704,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Da Enzo al 29",
            cuisine: "Authentic Roman Trattoria",
            description: "Beloved no-reservations Trastevere gem famous for crispy artichokes alla giudia and tiramisu.",
            price_level: "mid"
          },
          {
            name: "Trapizzino Trastevere",
            cuisine: "Roman Street Food",
            description: "Delicious pizza pockets stuffed with slow-cooked oxtail, chicken cacciatore, or eggplant parmigiana.",
            price_level: "low"
          }
        ]
      }
    ],
    stays: [
      {
        name: "The RomeHello Hostel",
        type: "Social Hostel",
        area: "Repubblica",
        price_level: "low",
        description: "Vibrant and spotless hostel adorned with street art murals and a friendly courtyard bar."
      },
      {
        name: "Hotel Campo de' Fiori",
        type: "Boutique Hotel",
        area: "Navona & Campo de' Fiori",
        price_level: "mid",
        description: "Romantic property with classic ivy-draped balconies and a rooftop terrace overlooking Rome's domes."
      },
      {
        name: "Hotel de Russie",
        type: "Luxury 5-Star Hotel",
        area: "Piazza del Popolo",
        price_level: "high",
        description: "Prestigious historic hotel boasting terraced secret gardens and luxurious rooms between the Spanish Steps and Borghese."
      }
    ]
  },
  barcelona: {
    city: "Barcelona",
    country: "Spain",
    currency: "EUR",
    summary: "A vibrant 3-day immersion into Gaudí modernisme architecture, gothic alleys, seaside promenades, and world-class tapas bars.",
    days: [
      {
        day: 1,
        theme: "Gaudí Masterpieces & Eixample Boulevard",
        stops: [
          {
            name: "Sagrada Família",
            category: "art",
            description: "Gaze in awe at Gaudí's soaring basilica columns branching like a stone forest under kaleidoscopic stained glass.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 41.4036,
            lng: 2.1744,
            est_entry_price: { min: 26, max: 36 }
          },
          {
            name: "Casa Batlló",
            category: "art",
            description: "Tour the dreamlike residential palace with its dragon-scaled rooftop and undulating oceanic interior forms.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 41.3917,
            lng: 2.1650,
            est_entry_price: { min: 29, max: 35 }
          },
          {
            name: "Casa Milà (La Pedrera)",
            category: "art",
            description: "Walk across the dramatic rooftop garden among surreal warrior-helmet chimneys overlooking Passeig de Gràcia.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 41.3954,
            lng: 2.1620,
            est_entry_price: { min: 25, max: 32 }
          },
          {
            name: "Passeig de Gràcia",
            category: "shopping",
            description: "Stroll down Barcelona's grandest avenue adorned with wrought-iron street lamps and premier fashion ateliers.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 41.3928,
            lng: 2.1648,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Cervecería Catalana",
            cuisine: "Tapas & Montaditos",
            description: "High-energy tapas counter renowned for freshly fried baby squid, patatas bravas, and beef tenderloin skewers.",
            price_level: "mid"
          },
          {
            name: "El Nacional",
            cuisine: "Culinary Market",
            description: "Magnificent multi-zone culinary temple featuring regional Spanish charcuterie, fresh seafood, and cava.",
            price_level: "high"
          }
        ]
      },
      {
        day: 2,
        theme: "Gothic Shadows, Vibrant Markets & Born Vibe",
        stops: [
          {
            name: "Barcelona Cathedral",
            category: "history",
            description: "Explore the soaring 14th-century Catalan Gothic cathedral and its secluded cloister garden guarded by thirteen white geese.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 41.3840,
            lng: 2.1762,
            est_entry_price: { min: 9, max: 14 }
          },
          {
            name: "La Boqueria Market",
            category: "food",
            description: "Experience the colorful sensory rush of freshly pressed fruit juices, Iberian hams, and glistening shellfish.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 41.3817,
            lng: 2.1716,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Picasso Museum",
            category: "art",
            description: "Discover extensive formative collections showcasing Pablo Picasso's deep artistic connection to Barcelona.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 41.3853,
            lng: 2.1810,
            est_entry_price: { min: 14, max: 15 }
          },
          {
            name: "El Born Quarter",
            category: "nightlife",
            description: "Weave through medieval passageways filled with independent fashion designers, cocktail lounges, and tapas bars.",
            best_time: "evening",
            duration_hours: 2.0,
            lat: 41.3849,
            lng: 2.1824,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Bar del Pla",
            cuisine: "Creative Tapas",
            description: "Cozy El Born tavern pairing crispy Iberian pork shoulder tapas with biodynamic natural wines.",
            price_level: "mid"
          },
          {
            name: "Churrería Manuel San Román",
            cuisine: "Churros con Chocolate",
            description: "Traditional corner shop frying golden crispy churros served with thick dipping dark chocolate.",
            price_level: "low"
          }
        ]
      },
      {
        day: 3,
        theme: "Hilltop Vistas & Mediterranean Breeze",
        stops: [
          {
            name: "Park Güell",
            category: "nature",
            description: "Wander through Gaudí's whimsical park featuring mosaic salamanders and undulating tiled benches overlooking the sea.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 41.4145,
            lng: 2.1527,
            est_entry_price: { min: 10, max: 10 }
          },
          {
            name: "Ciutadella Park",
            category: "nature",
            description: "Relax by the monumental Cascada fountain and row leisurely on the tranquil central park lake.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 41.3881,
            lng: 2.1874,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Barceloneta Beach Promenade",
            category: "nature",
            description: "Bask in Mediterranean sunshine along palm-lined boardwalks with views of fishing docks and the W sail tower.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 41.3784,
            lng: 2.1925,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Port Vell & Marina",
            category: "nightlife",
            description: "Enjoy sunset drinks along the wooden bridge and harbor docks watching sailboats glide into port.",
            best_time: "evening",
            duration_hours: 1.5,
            lat: 41.3768,
            lng: 2.1822,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Can Solé",
            cuisine: "Traditional Paella & Seafood",
            description: "Century-old seaside tavern famous for rich seafood paella and fideuà cooked in copper pans.",
            price_level: "high"
          },
          {
            name: "La Cova Fumada",
            cuisine: "Barceloneta Tapas",
            description: "Legendary rustic tavern credited with inventing the spicy bomb potato croquette in 1955.",
            price_level: "low"
          }
        ]
      }
    ],
    stays: [
      {
        name: "Yeah Hostel Barcelona",
        type: "Design Boutique Hostel",
        area: "Eixample Right",
        price_level: "low",
        description: "High-rated modern hostel with private privacy pod beds, rooftop splash pool, and communal dinners."
      },
      {
        name: "H10 Cubik",
        type: "Boutique 4-Star Hotel",
        area: "Gothic Quarter Edge",
        price_level: "mid",
        description: "Geometric design hotel featuring panoramic rooftop cocktail terrace overlooking Barcelona Cathedral."
      },
      {
        name: "Hotel Arts Barcelona",
        type: "Luxury Beachfront Hotel",
        area: "Port Olímpic",
        price_level: "high",
        description: "Iconic blue glass skyscraper hotel offering Mediterranean sea views, dual-star Michelin dining, and infinity pools."
      }
    ]
  },
  jaipur: {
    city: "Jaipur",
    country: "India",
    currency: "INR",
    summary: "A vibrant 2-day royal cultural journey through historic hill fortresses, UNESCO astronomical marvels, artisan craft museums, and lively pink-city food bazaars.",
    days: [
      {
        day: 1,
        theme: "Amer Fort Heritage, Traditional Textile Art & Historic Bazaars",
        stops: [
          {
            name: "Amber Palace (Amer Fort)",
            category: "history",
            description: "Ascend the majestic hilltop fort showcasing ornate mirror mosaics of Sheesh Mahal and expansive royal courtyards.",
            best_time: "morning",
            duration_hours: 3.0,
            lat: 26.9855,
            lng: 75.8513,
            est_entry_price: { min: 100, max: 550 }
          },
          {
            name: "Anokhi Museum of Hand Printing",
            category: "art",
            description: "Witness live demonstrations of traditional Rajasthani woodblock textile printing inside a restored historic haveli.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 26.9892,
            lng: 75.8524,
            est_entry_price: { min: 30, max: 80 }
          },
          {
            name: "Jal Mahal (Water Palace)",
            category: "nature",
            description: "Photograph the red sandstone palace floating serenely amidst the scenic waters of Man Sagar Lake.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 26.9534,
            lng: 75.8462,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Johari & Bapu Bazaar",
            category: "shopping",
            description: "Stroll through bustling pink-walled street arcades renowned for handcrafted lac bangles, tie-dye textiles, and mojari footwear.",
            best_time: "evening",
            duration_hours: 2.0,
            lat: 26.9205,
            lng: 75.8231,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Laxmi Misthan Bhandar (LMB)",
            cuisine: "Rajasthani Thali & Sweets",
            description: "Historic Johari Bazaar institution famed for authentic Dal Baati Churma, crisp kachoris, and royal sweetmeats.",
            price_level: "mid"
          },
          {
            name: "Rawat Mishthan Bhandar",
            cuisine: "Street Snacks & Kachoris",
            description: "Celebrated landmark shop famous across India for piping hot, crispy onion Pyaaz Kachoris and sweet Mawa Kachoris.",
            price_level: "low"
          }
        ]
      },
      {
        day: 2,
        theme: "Royal Palaces, Celestial Observatories & Heritage Art",
        stops: [
          {
            name: "City Palace of Jaipur",
            category: "history",
            description: "Tour the grand residence of Jaipur's royals featuring peacock courtyards, royal armor collections, and ornate archways.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 26.9258,
            lng: 75.8237,
            est_entry_price: { min: 200, max: 700 }
          },
          {
            name: "Jantar Mantar",
            category: "history",
            description: "Explore the 18th-century UNESCO World Heritage astronomical observatory housing the world's largest stone sundial.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 26.9248,
            lng: 75.8246,
            est_entry_price: { min: 50, max: 200 }
          },
          {
            name: "Hawa Mahal (Palace of Winds)",
            category: "history",
            description: "Marvel at the iconic five-story pink sandstone honeycomb facade with 953 jharokha latticed windows.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 26.9239,
            lng: 75.8267,
            est_entry_price: { min: 50, max: 200 }
          },
          {
            name: "Albert Hall Museum",
            category: "art",
            description: "Discover Rajasthan's state museum exhibiting rare miniature paintings, ivory carvings, and metal sculptures in an Indo-Saracenic palace.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 26.9116,
            lng: 75.8195,
            est_entry_price: { min: 40, max: 300 }
          }
        ],
        food: [
          {
            name: "Peacock Rooftop Restaurant",
            cuisine: "North Indian & Mughlai",
            description: "Charming multi-level garden terrace serving aromatic curries and fresh tandoori breads with scenic fort views.",
            price_level: "mid"
          },
          {
            name: "Tapri Central",
            cuisine: "Artisan Chai & Street Bites",
            description: "Lively rooftop hangout overlooking Central Park serving specialty spiced chai in earthen kulhads and Indian tapas.",
            price_level: "low"
          }
        ]
      }
    ],
    stays: [
      {
        name: "Alsisar Haveli",
        type: "Heritage Boutique Hotel",
        area: "Sansar Chandra Road",
        price_level: "mid",
        description: "A converted 19th-century royal townhouse offering frescoed arches, a peaceful courtyard pool, and traditional Rajasthani ambiance."
      },
      {
        name: "Shahpura House",
        type: "Heritage Hotel",
        area: "Bani Park",
        price_level: "mid",
        description: "Elegant royal residence showcasing Shekhawati frescoes, marble terraces, and warm Rajput hospitality."
      },
      {
        name: "Umaid Bhawan Heritage House Hotel",
        type: "Boutique Heritage Hotel",
        area: "Bani Park",
        price_level: "mid",
        description: "Classic Rajasthani heritage hotel with intricately carved balconies, antique furnishings, and a rooftop restaurant."
      }
    ]
  },
  lucknow: {
    city: "Lucknow",
    country: "India",
    currency: "INR",
    summary: "A cultural 2-day exploration of Awadhi architectural marvels, historic royal imambaras, state art collections, and legendary Nawabi street food markets.",
    days: [
      {
        day: 1,
        theme: "Nawabi Imambara Architecture, Rumi Darwaza & Historic Chowk",
        stops: [
          {
            name: "Bara Imambara & Bhool Bhulaiya",
            category: "history",
            description: "Explore the magnificent 18th-century pillarless central hall and its intricate three-dimensional labyrinth of arched passageways.",
            best_time: "morning",
            duration_hours: 2.5,
            lat: 26.8690,
            lng: 80.9129,
            est_entry_price: { min: 50, max: 500 }
          },
          {
            name: "Rumi Darwaza",
            category: "art",
            description: "Gaze up at the iconic sixty-foot ornamental gateway built by Nawab Asaf-ud-Daula resembling the historic Sublime Porte of Istanbul.",
            best_time: "morning",
            duration_hours: 1.0,
            lat: 26.8711,
            lng: 80.9118,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Chota Imambara (Palace of Lights)",
            category: "history",
            description: "Admire the gold-domed monument adorned with Belgian crystal chandeliers, gilt mirrors, and intricate Islamic calligraphy.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 26.8738,
            lng: 80.9048,
            est_entry_price: { min: 50, max: 500 }
          },
          {
            name: "Chowk Heritage Bazaars",
            category: "shopping",
            description: "Weave through centuries-old alleys filled with delicate hand-embroidered Chikankari garments, herbal attars, and silver jewelry.",
            best_time: "evening",
            duration_hours: 2.0,
            lat: 26.8658,
            lng: 80.9061,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Tunday Kababi",
            cuisine: "Awadhi Kebabs",
            description: "Legendary centennial eatery in old Chowk famous worldwide for melt-in-the-mouth buffalo and mutton Galouti kebabs.",
            price_level: "low"
          },
          {
            name: "Rahim's Kulcha Nihari",
            cuisine: "Awadhi Slow-Cooked Stew",
            description: "Akbari Gate landmark serving tender spiced bone-marrow nihari stew paired with flaky, layered tandoori kulchas.",
            price_level: "low"
          }
        ]
      },
      {
        day: 2,
        theme: "Residency Heritage, State Art Museum & Hazratganj Promenade",
        stops: [
          {
            name: "The British Residency",
            category: "history",
            description: "Walk through the evocative cannon-battered ruins and tranquil gardens that witnessed the historic 1857 Siege of Lucknow.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 26.8617,
            lng: 80.9272,
            est_entry_price: { min: 25, max: 300 }
          },
          {
            name: "State Museum Lucknow",
            category: "art",
            description: "Inspect rare ancient sculptures from the Mathura school, Awadhi miniature paintings, and historical artifacts inside Banarasi Bagh.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 26.8436,
            lng: 80.9572,
            est_entry_price: { min: 20, max: 100 }
          },
          {
            name: "Chattar Manzil (Umbrella Palace)",
            category: "history",
            description: "Photograph the distinctive Indo-European riverside palace topped with its graceful umbrella-shaped golden dome.",
            best_time: "afternoon",
            duration_hours: 1.0,
            lat: 26.8576,
            lng: 80.9324,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Hazratganj Promenade",
            category: "shopping",
            description: "Enjoy an evening heritage stroll down Lucknow's premier colonial-era boulevard lined with bookshops, cafes, and Chikankari boutiques.",
            best_time: "evening",
            duration_hours: 2.0,
            lat: 26.8489,
            lng: 80.9457,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Dastarkhwan",
            cuisine: "Mughlai & Awadhi Curries",
            description: "Hazratganj dining staple celebrated for fragrant Awadhi mutton biryani, Chicken Changezi, and butter roomali rotis.",
            price_level: "mid"
          },
          {
            name: "Royal Cafe",
            cuisine: "Lucknawi Chaat & Street Food",
            description: "Popular Hazratganj eatery acclaimed as the inventor of the crispy, savory Basket Chaat loaded with yogurt and chutneys.",
            price_level: "low"
          }
        ]
      }
    ],
    stays: [
      {
        name: "Lebua Lucknow (Saraca Estate)",
        type: "Heritage Boutique Hotel",
        area: "Mall Avenue",
        price_level: "mid",
        description: "An elegant 1936 Art Deco bungalow transformed into a luxury boutique retreat with lush courtyards and Nawabi fine dining."
      },
      {
        name: "The Piccadily Lucknow",
        type: "4-Star City Hotel",
        area: "Kanpur Road, Sector B",
        price_level: "mid",
        description: "A comfortable full-service business hotel featuring refined guestrooms, a swimming pool, and central city access."
      },
      {
        name: "Fairfield by Marriott Lucknow",
        type: "Modern Business Hotel",
        area: "Vibhuti Khand, Gomti Nagar",
        price_level: "mid",
        description: "Sleek contemporary hotel in prime Gomti Nagar with ergonomic rooms, an all-day restaurant, and fitness amenities."
      }
    ]
  },
  noida: {
    city: "Noida",
    country: "India",
    currency: "INR",
    summary: "An energetic 2-day itinerary balancing monumental regional heritage and serene wetlands with buzzing street food markets and lively open-air nightlife hubs.",
    days: [
      {
        day: 1,
        theme: "Sandstone Memorial Heritage, Bird Sanctuary & Sector 18 Nightlife",
        stops: [
          {
            name: "Rashtriya Dalit Prerna Sthal & Museum",
            category: "history",
            description: "Walk across the monumental 82-acre sandstone memorial plaza featuring grand carved elephant pillars and historical galleries.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 28.5583,
            lng: 77.3075,
            est_entry_price: { min: 20, max: 20 }
          },
          {
            name: "Okhla Bird Sanctuary",
            category: "nature",
            description: "Spot migratory waterfowl along tranquil wetland walking trails bordering the Yamuna River at the Noida gateway.",
            best_time: "morning",
            duration_hours: 2.0,
            lat: 28.5435,
            lng: 77.3168,
            est_entry_price: { min: 30, max: 30 }
          },
          {
            name: "Atta Market & Sector 18 Bazaar",
            category: "shopping",
            description: "Browse Noida's bustling central commercial street market packed with fashion apparel, electronics, and local street stalls.",
            best_time: "afternoon",
            duration_hours: 2.5,
            lat: 28.5708,
            lng: 77.3218,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Gardens Galleria Nightlife Hub",
            category: "nightlife",
            description: "Experience Noida's premier evening entertainment complex buzzing with open-air gastropubs, craft cocktail lounges, and live DJ sets.",
            best_time: "evening",
            duration_hours: 3.0,
            lat: 28.5645,
            lng: 77.3245,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Brahmaputra Market (Sector 29)",
            cuisine: "Mughlai & Street Food",
            description: "Famous evening street-food hub beloved for sizzling seekh kebabs, chicken biryani, and crispy kathi rolls.",
            price_level: "low"
          },
          {
            name: "Imperfecto Ruin Pub & Gastropub",
            cuisine: "Continental & Craft Cocktails",
            description: "Eclectic rustic-themed lounge in Gardens Galleria offering wood-fired pizzas, signature cocktails, and live music.",
            price_level: "mid"
          }
        ]
      },
      {
        day: 2,
        theme: "Spiritual Heritage, Local Haat Crafts & Skyline Evening Lounges",
        stops: [
          {
            name: "ISKCON Temple Noida",
            category: "history",
            description: "Admire the soaring white stone shikhara tower and peaceful Vedic shrine hall during morning devotional prayers.",
            best_time: "morning",
            duration_hours: 1.5,
            lat: 28.5912,
            lng: 77.3512,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Noida Haat & Cultural Center",
            category: "art",
            description: "Explore open-air artisan pavilions showcasing regional terracotta pottery, handloom textiles, and traditional crafts in Sector 33A.",
            best_time: "afternoon",
            duration_hours: 2.0,
            lat: 28.5835,
            lng: 77.3621,
            est_entry_price: { min: 20, max: 50 }
          },
          {
            name: "Sector 50 Street Food & Central Market",
            category: "food",
            description: "Sample beloved street delicacies including crispy raj kachori, steamed momos, and fresh fruit juices along lively market lanes.",
            best_time: "afternoon",
            duration_hours: 1.5,
            lat: 28.5768,
            lng: 77.3665,
            est_entry_price: { min: 0, max: 0 }
          },
          {
            name: "Advant Navis Skyline Lounges (Sector 142)",
            category: "nightlife",
            description: "Unwind at high-energy terrace bars and microbreweries offering craft beers with sweeping views of the illuminated expressway.",
            best_time: "evening",
            duration_hours: 2.5,
            lat: 28.5034,
            lng: 77.4121,
            est_entry_price: { min: 0, max: 0 }
          }
        ],
        food: [
          {
            name: "Bikanervala (Sector 18)",
            cuisine: "North Indian & Street Chaat",
            description: "Popular casual dining landmark famed for freshly fried chole bhature, samosas, and traditional Indian sweets.",
            price_level: "low"
          },
          {
            name: "Skyhouse Bar & Grill (Sector 142)",
            cuisine: "North Indian & Pan-Asian",
            description: "Spacious rooftop bar featuring live acoustic performances, tandoori specialties, and signature mocktails.",
            price_level: "mid"
          }
        ]
      }
    ],
    stays: [
      {
        name: "Radisson Blu Hotel Noida",
        type: "4-Star Business Hotel",
        area: "Sector 18",
        price_level: "mid",
        description: "Upscale contemporary hotel situated directly in Noida's central commercial, dining, and nightlife district."
      },
      {
        name: "Mosaic Hotel Noida",
        type: "Boutique City Hotel",
        area: "Sector 18",
        price_level: "mid",
        description: "Chic boutique hotel offering stylish rooms, an outdoor pool, and immediate access to Sector 18 markets."
      },
      {
        name: "Park Ascent",
        type: "4-Star Executive Hotel",
        area: "Sector 62",
        price_level: "mid",
        description: "Refined business property offering comfortable guestrooms, multi-cuisine dining, and expressway connectivity."
      }
    ]
  }
};

// Default preset transportation data for instant reliability
export const PRESET_TRANSPORTATION = {
  jaipur: {
    trainStation: "Jaipur Junction (JP)",
    airport: "Jaipur International Airport (JAI)",
    trains: [
      {
        id: "tr-jp-1",
        name: "Marudhar Express",
        number: "14863",
        startingStation: "Varanasi Junction (BSB)",
        destinationStation: "Jaipur Junction (JP)",
        departureTime: "18:15",
        arrivalTime: "11:50 (+1 day)",
        duration: "17h 35m",
        classes: [
          { className: "SL", fare: "₹455" },
          { className: "3A", fare: "₹1,240" },
          { className: "2A", fare: "₹1,780" },
          { className: "1A", fare: "₹2,990" }
        ]
      },
      {
        id: "tr-jp-2",
        name: "Ajmer Shatabdi Express",
        number: "12015",
        startingStation: "New Delhi (NDLS)",
        destinationStation: "Jaipur Junction (JP)",
        departureTime: "06:10",
        arrivalTime: "10:40",
        duration: "4h 30m",
        classes: [
          { className: "CC", fare: "₹895" },
          { className: "EC", fare: "₹1,560" }
        ]
      },
      {
        id: "tr-jp-3",
        name: "Vande Bharat Express",
        number: "20978",
        startingStation: "Delhi Cantt (DEC)",
        destinationStation: "Jaipur Junction (JP)",
        departureTime: "18:40",
        arrivalTime: "22:45",
        duration: "4h 05m",
        classes: [
          { className: "CC", fare: "₹1,050" },
          { className: "EC", fare: "₹1,945" }
        ]
      },
      {
        id: "tr-jp-4",
        name: "Jaipur Superfast Express",
        number: "12955",
        startingStation: "Mumbai Central (MMCT)",
        destinationStation: "Jaipur Junction (JP)",
        departureTime: "19:05",
        arrivalTime: "12:00 (+1 day)",
        duration: "16h 55m",
        classes: [
          { className: "SL", fare: "₹530" },
          { className: "3A", fare: "₹1,410" },
          { className: "2A", fare: "₹2,020" },
          { className: "1A", fare: "₹3,410" }
        ]
      }
    ],
    flights: [
      {
        id: "fl-jp-1",
        airline: "IndiGo",
        flightNumber: "6E 214",
        departureAirport: "Delhi (DEL)",
        arrivalAirport: "Jaipur (JAI)",
        departureTime: "09:30",
        arrivalTime: "10:25",
        duration: "0h 55m",
        cabinClass: "Economy",
        fare: "₹3,450"
      },
      {
        id: "fl-jp-2",
        airline: "Air India",
        flightNumber: "AI 491",
        departureAirport: "Mumbai (BOM)",
        arrivalAirport: "Jaipur (JAI)",
        departureTime: "06:40",
        arrivalTime: "08:30",
        duration: "1h 50m",
        cabinClass: "Economy",
        fare: "₹5,200"
      },
      {
        id: "fl-jp-3",
        airline: "SpiceJet",
        flightNumber: "SG 2981",
        departureAirport: "Bengaluru (BLR)",
        arrivalAirport: "Jaipur (JAI)",
        departureTime: "14:15",
        arrivalTime: "16:45",
        duration: "2h 30m",
        cabinClass: "Economy",
        fare: "₹6,800"
      }
    ]
  },
  lucknow: {
    trainStation: "Lucknow Charbagh (LKO)",
    airport: "Chaudhary Charan Singh International Airport, Lucknow (LKO)",
    trains: [
      {
        id: "tr-lk-1",
        name: "Lucknow Tejas Express",
        number: "82502",
        startingStation: "New Delhi (NDLS)",
        destinationStation: "Lucknow Junction (LJN)",
        departureTime: "15:35",
        arrivalTime: "22:05",
        duration: "6h 30m",
        classes: [
          { className: "CC", fare: "₹1,280" },
          { className: "EC", fare: "₹2,450" }
        ]
      },
      {
        id: "tr-lk-2",
        name: "Lucknow Shatabdi Express",
        number: "12004",
        startingStation: "New Delhi (NDLS)",
        destinationStation: "Lucknow Charbagh (LKO)",
        departureTime: "06:10",
        arrivalTime: "12:55",
        duration: "6h 45m",
        classes: [
          { className: "CC", fare: "₹1,165" },
          { className: "EC", fare: "₹2,125" }
        ]
      },
      {
        id: "tr-lk-3",
        name: "Varanasi - Lucknow Superfast",
        number: "14219",
        startingStation: "Varanasi Junction (BSB)",
        destinationStation: "Lucknow Charbagh (LKO)",
        departureTime: "05:25",
        arrivalTime: "10:45",
        duration: "5h 20m",
        classes: [
          { className: "2S", fare: "₹155" },
          { className: "CC", fare: "₹530" }
        ]
      },
      {
        id: "tr-lk-4",
        name: "Pushpak Express",
        number: "12534",
        startingStation: "Mumbai CSMT",
        destinationStation: "Lucknow Junction (LJN)",
        departureTime: "08:25",
        arrivalTime: "07:10 (+1 day)",
        duration: "22h 45m",
        classes: [
          { className: "SL", fare: "₹635" },
          { className: "3A", fare: "₹1,675" },
          { className: "2A", fare: "₹2,410" },
          { className: "1A", fare: "₹4,120" }
        ]
      }
    ],
    flights: [
      {
        id: "fl-lk-1",
        airline: "IndiGo",
        flightNumber: "6E 521",
        departureAirport: "Delhi (DEL)",
        arrivalAirport: "Lucknow (LKO)",
        departureTime: "07:15",
        arrivalTime: "08:25",
        duration: "1h 10m",
        cabinClass: "Economy",
        fare: "₹3,200"
      },
      {
        id: "fl-lk-2",
        airline: "Air India Express",
        flightNumber: "IX 194",
        departureAirport: "Mumbai (BOM)",
        arrivalAirport: "Lucknow (LKO)",
        departureTime: "11:20",
        arrivalTime: "13:30",
        duration: "2h 10m",
        cabinClass: "Economy",
        fare: "₹4,900"
      },
      {
        id: "fl-lk-3",
        airline: "Vistara",
        flightNumber: "UK 631",
        departureAirport: "Bengaluru (BLR)",
        arrivalAirport: "Lucknow (LKO)",
        departureTime: "16:40",
        arrivalTime: "19:10",
        duration: "2h 30m",
        cabinClass: "Economy",
        fare: "₹6,150"
      }
    ]
  },
  noida: {
    trainStation: "Hazrat Nizamuddin (NZM) / Anand Vihar (ANVT)",
    airport: "Indira Gandhi International Airport, Delhi (DEL) / Noida Airport (DXN)",
    trains: [
      {
        id: "tr-nd-1",
        name: "Vande Bharat Express",
        number: "22435",
        startingStation: "Varanasi Junction (BSB)",
        destinationStation: "New Delhi (NDLS - connects to Noida)",
        departureTime: "15:00",
        arrivalTime: "23:00",
        duration: "8h 00m",
        classes: [
          { className: "CC", fare: "₹1,750" },
          { className: "EC", fare: "₹3,300" }
        ]
      },
      {
        id: "tr-nd-2",
        name: "Bhopal Shatabdi Express",
        number: "12001",
        startingStation: "Agra Cantt (AGC)",
        destinationStation: "Hazrat Nizamuddin (NZM - 15m to Noida)",
        departureTime: "21:15",
        arrivalTime: "23:30",
        duration: "2h 15m",
        classes: [
          { className: "CC", fare: "₹555" },
          { className: "EC", fare: "₹1,020" }
        ]
      },
      {
        id: "tr-nd-3",
        name: "Lucknow Swarna Shatabdi",
        number: "12003",
        startingStation: "Lucknow Charbagh (LKO)",
        destinationStation: "New Delhi (NDLS)",
        departureTime: "15:30",
        arrivalTime: "22:25",
        duration: "6h 55m",
        classes: [
          { className: "CC", fare: "₹1,165" },
          { className: "EC", fare: "₹2,125" }
        ]
      },
      {
        id: "tr-nd-4",
        name: "Mumbai Rajdhani Express",
        number: "12951",
        startingStation: "Mumbai Central (MMCT)",
        destinationStation: "Hazrat Nizamuddin (NZM)",
        departureTime: "17:00",
        arrivalTime: "08:32 (+1 day)",
        duration: "15h 32m",
        classes: [
          { className: "3A", fare: "₹2,410" },
          { className: "2A", fare: "₹3,450" },
          { className: "1A", fare: "₹4,950" }
        ]
      }
    ],
    flights: [
      {
        id: "fl-nd-1",
        airline: "IndiGo",
        flightNumber: "6E 2024",
        departureAirport: "Mumbai (BOM)",
        arrivalAirport: "Delhi (DEL - 45m to Noida)",
        departureTime: "08:00",
        arrivalTime: "10:15",
        duration: "2h 15m",
        cabinClass: "Economy",
        fare: "₹4,250"
      },
      {
        id: "fl-nd-2",
        airline: "Air India",
        flightNumber: "AI 506",
        departureAirport: "Bengaluru (BLR)",
        arrivalAirport: "Delhi (DEL - 45m to Noida)",
        departureTime: "09:45",
        arrivalTime: "12:35",
        duration: "2h 50m",
        cabinClass: "Economy",
        fare: "₹5,400"
      },
      {
        id: "fl-nd-3",
        airline: "Vistara",
        flightNumber: "UK 818",
        departureAirport: "Hyderabad (HYD)",
        arrivalAirport: "Delhi (DEL - 45m to Noida)",
        departureTime: "15:30",
        arrivalTime: "17:45",
        duration: "2h 15m",
        cabinClass: "Economy",
        fare: "₹4,800"
      }
    ]
  },
  kyoto: {
    trainStation: "Kyoto Station (JR Kyoto)",
    airport: "Kansai International Airport (KIX)",
    trains: [
      {
        id: "tr-ky-1",
        name: "Tokaido Shinkansen (Nozomi)",
        number: "Nozomi 215",
        startingStation: "Tokyo Station",
        destinationStation: "Kyoto Station",
        departureTime: "08:00",
        arrivalTime: "10:15",
        duration: "2h 15m",
        classes: [
          { className: "Ordinary", fare: "¥13,320" },
          { className: "Green Car", fare: "¥18,720" }
        ]
      },
      {
        id: "tr-ky-2",
        name: "Haruka Airport Express",
        number: "Haruka 14",
        startingStation: "Kansai Airport (KIX)",
        destinationStation: "Kyoto Station",
        departureTime: "09:16",
        arrivalTime: "10:35",
        duration: "1h 19m",
        classes: [
          { className: "Non-Reserved", fare: "¥2,900" },
          { className: "Reserved", fare: "¥3,430" }
        ]
      }
    ],
    flights: [
      {
        id: "fl-ky-1",
        airline: "All Nippon Airways (ANA)",
        flightNumber: "NH 95",
        departureAirport: "Tokyo Haneda (HND)",
        arrivalAirport: "Osaka Itami (ITM)",
        departureTime: "07:30",
        arrivalTime: "08:40",
        duration: "1h 10m",
        cabinClass: "Economy",
        fare: "¥12,500"
      }
    ]
  }
};

