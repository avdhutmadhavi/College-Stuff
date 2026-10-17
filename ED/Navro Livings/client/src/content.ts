export interface Service {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
  imageAlt: string;
  suitable: string;
  includes: string[];
  considerations: string;
  faqs: { question: string; answer: string }[];
}

export const announcementMessage = "A more considered way to grow at home";

export const services: Service[] = [
  {
    slug: "balcony-garden",
    title: "Balcony gardens",
    eyebrow: "A little outside, a lot more alive",
    summary: "Thoughtful planting and simple layouts that help a balcony feel like a natural extension of home.",
    image: "/balcony.jpg",
    imageAlt: "Close-up of dense green fern foliage",
    suitable: "Apartments and homes with a balcony, from a compact ledge to a generous outdoor room.",
    includes: ["A conversation about how you use the space", "Plant and container suggestions for the light and exposure", "A considered layout for seating, movement, and greenery"],
    considerations: "We consider the balcony's sun, shade, wind, drainage, and the practical limits of containers. Building or structural questions should be reviewed by an appropriately qualified professional.",
    faqs: [
      { question: "Can a small balcony become a garden?", answer: "Often, yes. A few well-chosen containers and a clear layout can make a compact space feel greener without overcrowding it." },
      { question: "Will you recommend plants for my light conditions?", answer: "We can help shortlist plants after discussing the balcony's light and exposure. Plant choice should reflect the actual conditions and local climate." },
    ],
  },
  {
    slug: "rooftop-garden",
    title: "Rooftop & terrace gardens",
    eyebrow: "Make room for a greener outlook",
    summary: "A considered plan for an open-air space, with planting, movement, and everyday use in mind.",
    image: "/garden-main.jpg",
    imageAlt: "Gardening tools and potting soil ready for planting",
    suitable: "Homes with an accessible terrace or rooftop that is ready for a planting plan.",
    includes: ["A site and sunlight conversation", "Zones for planting and everyday use", "Plant and container guidance tailored to the setting"],
    considerations: "Load limits, waterproofing, drainage, permissions, and structural safety require review by qualified building professionals. NAVRO Living does not certify or guarantee these specialist works.",
    faqs: [
      { question: "Can you confirm that my roof is safe for a garden?", answer: "No. Please obtain assessment and approval from an appropriately qualified structural professional before adding loads or installing rooftop planters." },
      { question: "Can an existing terrace be improved without a full redesign?", answer: "A focused planting and layout plan may be possible. The best scope depends on the existing conditions and what you would like to change." },
    ],
  },
  {
    slug: "kitchen-gardens",
    title: "Kitchen gardens",
    eyebrow: "A little harvest, close to home",
    summary: "A practical growing corner for herbs and edible plants, planned around your light, routine, and available room.",
    image: "/rooftop.jpg",
    imageAlt: "Young seedlings growing in a tray",
    suitable: "People who would like to explore growing herbs or edible plants at home, indoors or outdoors.",
    includes: ["A growing-space and light check", "Suggestions for suitable containers and starter plants", "Straightforward guidance for getting started and keeping notes"],
    considerations: "Growing results depend on season, local climate, light, and the varieties chosen. We keep suggestions adaptable rather than promising a specific yield.",
    faqs: [
      { question: "What can I grow in a small kitchen garden?", answer: "The options depend on available light, season, space, and your routine. Herbs can be a gentle first step, but the right choices vary from home to home." },
      { question: "Do I need a garden or a yard?", answer: "Not necessarily. Some edible plants can grow in containers, provided their light and other growing needs are met." },
    ],
  },
  {
    slug: "garden-maintenance",
    title: "Garden care & maintenance",
    eyebrow: "Gentle care for growing things",
    summary: "Plant-care guidance and maintenance planning shaped around the garden you already have.",
    image: "/care.jpg",
    imageAlt: "A rubber plant in a pale pot against a light background",
    suitable: "Home gardeners looking for help understanding plant care or keeping an established space in good shape.",
    includes: ["A review of your existing plants and routine", "Seasonal care suggestions where appropriate", "Support with pruning, watering, and plant selection questions"],
    considerations: "Plant care changes with species, climate, season, and growing conditions. Advice is tailored to the information available and may need to be updated as conditions change.",
    faqs: [
      { question: "Can you help if I am not sure what a plant needs?", answer: "We can help you assess the growing conditions and build a more practical routine. Clear photos and details about light and watering are useful." },
      { question: "Do you offer ongoing care?", answer: "The right maintenance arrangement depends on your location and the garden's needs. Tell us what support you are looking for in your enquiry." },
    ],
  },
];

export const homeGuides = [
  { title: "A softer start to balcony gardening", category: "Balcony gardening", image: "/balcony.jpg" },
  { title: "Growing herbs in a small space", category: "Kitchen gardening", image: "/rooftop.jpg" },
  { title: "Learning to read the light at home", category: "Plant care", image: "/care.jpg" },
];

export const imageFallback = "/garden-main.jpg";
