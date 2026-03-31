const categories = [
  "Computer Science", "Artificial Intelligence", "Literature", "Mathematics", 
  "History", "Physics", "Philosophy", "Psychology", "Self-Help", "Finance",
  "Software Engineering", "Architecture", "Science Fiction", "Biography"
];

const publishers = [
  "O'Reilly", "Pearson", "MIT Press", "Addison-Wesley", "No Starch Press",
  "HarperCollins", "Penguin Random House", "Oxford University Press", 
  "Cambridge University Press", "Springer", "Wiley", "Manning"
];

const authors = [
  "Robert C. Martin", "Martin Fowler", "Eric Evans", "Donald Knuth",
  "Christopher Alexander", "Kent Beck", "Joshua Bloch", "Gayle Laakmann McDowell",
  "George Orwell", "Aldous Huxley", "F. Scott Fitzgerald", "Yuval Noah Harari",
  "Daniel Kahneman", "James Clear", "Simon Singh", "Stephen Hawking"
];

const adjectives = [
  "Advanced", "Pragmatic", "Modern", "Classic", "Universal", "Chamber of", 
  "The Art of", "Chasing", "Beyond", "Deep", "Atomic", "Intelligent"
];

const subjects = [
  "Algorithms", "Design Patterns", "Clean Architecture", "Microservices",
  "Probability", "Human History", "Cosmos", "Mindset", "Wealth", "Evolution"
];

const coverThemes = [
  "technology", "books", "library", "minimalist", "science", "space", 
  "abstract", "galaxy", "computer", "nature"
];

export const generateDynamicBook = (index: number) => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const subj = subjects[Math.floor(Math.random() * subjects.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const pub = publishers[Math.floor(Math.random() * publishers.length)];
  const theme = coverThemes[Math.floor(Math.random() * coverThemes.length)];
  
  // Create a unique ISBN for each generated book
  const isbn = `978-${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
  
  return {
    title: `${adj} ${subj} Vol.${index + 1}`,
    author: author,
    isbn: isbn,
    category: cat,
    subject: subj,
    year: 2020 + Math.floor(Math.random() * 5),
    publisher: pub,
    description: `A comprehensive deep-dive into ${subj.toLowerCase()} from the perspective of modern ${cat.toLowerCase()} analysis. Expertly peer-reviewed node contribution.`,
    coverImageUrl: `https://images.unsplash.com/photo-${1515879218367 + index}?auto=format&fit=crop&q=80&w=1000&sig=${index}`,
    totalPages: 200 + Math.floor(Math.random() * 800),
    language: "English"
  };
};

export const getDynamicSeedBatch = (count: number = 20) => {
  return Array.from({ length: count }).map((_, i) => generateDynamicBook(i));
};
