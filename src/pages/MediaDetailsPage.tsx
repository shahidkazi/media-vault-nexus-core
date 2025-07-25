import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MediaDetails from "@/components/MediaDetails";
import NotFound from "./NotFound";

// Mock data - in a real app this would come from your data store
const mockMediaData = [
  {
    id: "1",
    title: "The Dark Knight",
    type: "movie" as const,
    year: 2008,
    genre: ["Action", "Drama"],
    quality: "4K",
    watched: true,
    backedUp: true,
    mediaNumber: "M001",
    poster: "/placeholder.svg",
    rating: 9.0,
    fileSize: "8.5 GB",
    director: "Christopher Nolan",
    onlineRating: "9.0/10",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: [
      { character: "Batman/Bruce Wayne", actor: "Christian Bale" },
      { character: "Joker", actor: "Heath Ledger" },
      { character: "Harvey Dent", actor: "Aaron Eckhart" }
    ]
  },
  {
    id: "2", 
    title: "Inception",
    type: "movie" as const,
    year: 2010,
    genre: ["Sci-Fi", "Action"],
    quality: "1080p",
    watched: false,
    backedUp: false,
    pendingBackup: true,
    mediaNumber: "M002",
    poster: "/placeholder.svg",
    rating: 8.8,
    fileSize: "4.2 GB",
    director: "Christopher Nolan",
    onlineRating: "8.8/10",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: [
      { character: "Dom Cobb", actor: "Leonardo DiCaprio" },
      { character: "Arthur", actor: "Tom Hardy" },
      { character: "Ariadne", actor: "Elliot Page" }
    ]
  },
  {
    id: "3",
    title: "Breaking Bad",
    type: "tv-series" as const,
    year: 2008,
    genre: ["Drama", "Crime"],
    quality: "1080p", 
    watched: true,
    backedUp: true,
    mediaNumber: "TV001",
    poster: "/placeholder.svg",
    rating: 9.5,
    fileSize: "45.8 GB",
    seasons: 5,
    totalEpisodes: 62,
    director: "Vince Gilligan",
    onlineRating: "9.5/10",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    cast: [
      { character: "Walter White", actor: "Bryan Cranston" },
      { character: "Jesse Pinkman", actor: "Aaron Paul" },
      { character: "Skyler White", actor: "Anna Gunn" }
    ],
    episodes: [
      { season: 1, episode: 1, title: "Pilot", plot: "Walter White begins cooking meth", watched: true, backedUp: true },
      { season: 1, episode: 2, title: "Cat's in the Bag...", plot: "Walter and Jesse dispose of bodies", watched: true, backedUp: true },
      { season: 1, episode: 3, title: "...And the Bag's in the River", plot: "Walter confronts his first kill", watched: true, backedUp: false }
    ]
  },
  {
    id: "4",
    title: "Chernobyl",
    type: "mini-series" as const,
    year: 2019,
    genre: ["Drama", "History"],
    quality: "4K",
    watched: false,
    backedUp: false,
    pendingBackup: true,
    mediaNumber: "MS001", 
    poster: "/placeholder.svg",
    rating: 9.3,
    fileSize: "12.4 GB",
    totalEpisodes: 5,
    director: "Craig Mazin",
    onlineRating: "9.3/10",
    description: "The true story of one of the worst man-made catastrophes in history: the catastrophic nuclear accident at Chernobyl.",
    cast: [
      { character: "Valery Legasov", actor: "Jared Harris" },
      { character: "Boris Shcherbina", actor: "Stellan Skarsgård" },
      { character: "Ulana Khomyuk", actor: "Emily Watson" }
    ],
    episodes: [
      { season: 1, episode: 1, title: "1:23:45", plot: "The nuclear accident occurs", watched: false, backedUp: false },
      { season: 1, episode: 2, title: "Please Remain Calm", plot: "The Soviet response begins", watched: false, backedUp: false },
      { season: 1, episode: 3, title: "Open Wide, O Earth", plot: "The cleanup effort intensifies", watched: false, backedUp: false }
    ]
  },
  {
    id: "5",
    title: "Stranger Things",
    type: "tv-series" as const,
    year: 2016,
    genre: ["Sci-Fi", "Horror"],
    quality: "4K",
    watched: true,
    backedUp: false,
    pendingBackup: true,
    mediaNumber: "TV002",
    poster: "/placeholder.svg", 
    rating: 8.7,
    fileSize: "78.2 GB",
    seasons: 4,
    totalEpisodes: 34,
    director: "The Duffer Brothers",
    onlineRating: "8.7/10",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    cast: [
      { character: "Eleven", actor: "Millie Bobby Brown" },
      { character: "Mike Wheeler", actor: "Finn Wolfhard" },
      { character: "Jim Hopper", actor: "David Harbour" }
    ],
    episodes: [
      { season: 1, episode: 1, title: "Chapter One: The Vanishing of Will Byers", plot: "Will Byers disappears", watched: true, backedUp: false },
      { season: 1, episode: 2, title: "Chapter Two: The Weirdo on Maple Street", plot: "The boys meet Eleven", watched: true, backedUp: false }
    ]
  }
];

const MediaDetailsPage = () => {
  const { id } = useParams();
  const [mediaItems, setMediaItems] = useState(mockMediaData);
  
  const media = mediaItems.find(item => item.id === id);

  const handleToggleWatched = (mediaId: string) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === mediaId ? { ...item, watched: !item.watched } : item
      )
    );
  };

  const handleToggleBackup = (mediaId: string) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === mediaId ? { ...item, backedUp: !item.backedUp } : item
      )
    );
  };

  const handleUpdateMedia = (updatedMedia: any) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === updatedMedia.id ? { ...item, ...updatedMedia } : item
      )
    );
  };

  if (!media) {
    return <NotFound />;
  }

  return (
    <MediaDetails
      media={media}
      onToggleWatched={handleToggleWatched}
      onToggleBackup={handleToggleBackup}
      onUpdateMedia={handleUpdateMedia}
    />
  );
};

export default MediaDetailsPage;