export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverUrl: string;
  pageCount: number;
  publishedYear: number;
  rating: number;
  featured?: boolean;
}

export const genres = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Fantasy",
  "Biography",
  "Self-Help",
];

export const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    pageCount: 288,
    publishedYear: 2020,
    rating: 4.2,
    featured: true,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    description: "An easy & proven way to build good habits & break bad ones. Tiny changes, remarkable results.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    pageCount: 320,
    publishedYear: 2018,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    coverUrl: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=300&h=450&fit=crop",
    pageCount: 688,
    publishedYear: 1965,
    rating: 4.5,
    featured: true,
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    description: "Alicia Berenson's life is seemingly perfect until one evening her husband returns home late and she shoots him five times in the face. Then she never speaks another word.",
    coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
    pageCount: 336,
    publishedYear: 2019,
    rating: 4.0,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    description: "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, and marriage.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=450&fit=crop",
    pageCount: 432,
    publishedYear: 1813,
    rating: 4.7,
  },
  {
    id: "6",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    description: "Told in Kvothe's own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=450&fit=crop",
    pageCount: 662,
    publishedYear: 2007,
    rating: 4.6,
  },
  {
    id: "7",
    title: "Becoming",
    author: "Michelle Obama",
    genre: "Biography",
    description: "In her memoir, the former First Lady chronicles the experiences that have shaped her—from her childhood to her years as an executive and her time in the White House.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    pageCount: 448,
    publishedYear: 2018,
    rating: 4.6,
  },
  {
    id: "8",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science Fiction",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he can't figure out what he's doing, humanity and Earth itself will perish.",
    coverUrl: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=300&h=450&fit=crop",
    pageCount: 476,
    publishedYear: 2021,
    rating: 4.7,
    featured: true,
  },
  {
    id: "9",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island.",
    coverUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=450&fit=crop",
    pageCount: 180,
    publishedYear: 1925,
    rating: 4.3,
  },
  {
    id: "10",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "Mystery",
    description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark.",
    coverUrl: "https://images.unsplash.com/photo-1510172951991-856a62a9580f?w=300&h=450&fit=crop",
    pageCount: 384,
    publishedYear: 2018,
    rating: 4.4,
  },
  {
    id: "11",
    title: "Educated",
    author: "Tara Westover",
    genre: "Biography",
    description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop",
    pageCount: 334,
    publishedYear: 2018,
    rating: 4.5,
  },
  {
    id: "12",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    description: "A magical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    pageCount: 197,
    publishedYear: 1988,
    rating: 4.2,
  },
];

export const getBookById = (id: string) => books.find((b) => b.id === id);
export const getFeaturedBooks = () => books.filter((b) => b.featured);
export const getBooksByGenre = (genre: string) =>
  genre === "All" ? books : books.filter((b) => b.genre === genre);
