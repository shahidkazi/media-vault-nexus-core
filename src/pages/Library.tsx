import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import MediaCard from "@/components/MediaCard";
import MediaDetails from "@/components/MediaDetails";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SortAsc, ChevronDown } from "lucide-react";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [watchedFilter, setWatchedFilter] = useState("all");
  const [backupFilter, setBackupFilter] = useState("all");
  const [mediaNumberFilter, setMediaNumberFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sample data
  const [mediaItems, setMediaItems] = useState<any[]>([
    {
      id: "1",
      title: "The Dark Knight",
      type: "movie",
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
      type: "movie",
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
      type: "tv-series",
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
      type: "mini-series",
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
      type: "tv-series",
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
  ]);

  const handleToggleWatched = (id: string) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === id ? { ...item, watched: !item.watched } : item
      )
    );
  };

  const handleToggleBackup = (id: string) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === id ? { ...item, backedUp: !item.backedUp } : item
      )
    );
  };

  const handleMediaClick = (mediaId: string) => {
    navigate(`/media/${mediaId}`);
  };

  const filteredItems = (type?: string) => {
    let filtered = mediaItems.filter(item => {
      const matchesType = !type || item.type === type;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuality = selectedQuality === "all" || item.quality === selectedQuality;
      const matchesGenre = selectedGenre === "all" || item.genre.includes(selectedGenre);
      const matchesWatched = watchedFilter === "all" || 
        (watchedFilter === "watched" && item.watched) ||
        (watchedFilter === "unwatched" && !item.watched);
      const matchesBackup = backupFilter === "all" ||
        (backupFilter === "backed-up" && item.backedUp) ||
        (backupFilter === "not-backed-up" && !item.backedUp);
      const matchesMediaNumber = !mediaNumberFilter || item.mediaNumber.includes(mediaNumberFilter);

      return matchesType && matchesSearch && matchesQuality && matchesGenre && matchesWatched && matchesBackup && matchesMediaNumber;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        case "added":
          aValue = a.id; // Using ID as proxy for date added
          bValue = b.id;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const FilterControls = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            key="search-input"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-surface border-border">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-surface-elevated border-border" align="end">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quality</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="SD">SD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Genre</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                    <SelectItem value="Horror">Horror</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Watch Status</label>
                <Select value={watchedFilter} onValueChange={setWatchedFilter}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="watched">Watched</SelectItem>
                    <SelectItem value="unwatched">Unwatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Backup Status</label>
                <Select value={backupFilter} onValueChange={setBackupFilter}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="backed-up">Backed Up</SelectItem>
                    <SelectItem value="not-backed-up">Not Backed Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Media Number</label>
                <Input
                  key="media-number-input"
                  placeholder="Filter by media number..."
                  value={mediaNumberFilter}
                  onChange={(e) => setMediaNumberFilter(e.target.value)}
                  className="bg-surface border-border"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-surface border-border">
              <SortAsc className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-surface-elevated border-border" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="year">Release Year</SelectItem>
                    <SelectItem value="added">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="bg-surface border-border">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const MediaGrid = ({ items }: { items: typeof mediaItems }) => {
    if (items.length === 0) {
      return (
        <Card className="bg-surface-elevated border-border p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No media items found. Add some media to get started!</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onToggleWatched={handleToggleWatched}
            onToggleBackup={handleToggleBackup}
            onClick={handleMediaClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Library</h1>
        <p className="text-muted-foreground">Browse and manage your media collection</p>
      </div>

      <Tabs defaultValue="movie" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface-elevated border border-border">
          <TabsTrigger value="movie">Movies</TabsTrigger>
          <TabsTrigger value="tv-series">TV Series</TabsTrigger>
          <TabsTrigger value="mini-series">Mini Series</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <FilterControls />
        </div>

        <TabsContent value="movie">
          <div className="mb-4">
            <Badge variant="secondary">{filteredItems("movie").length} movies</Badge>
          </div>
          <MediaGrid items={filteredItems("movie")} />
        </TabsContent>

        <TabsContent value="tv-series">
          <div className="mb-4">
            <Badge variant="secondary">{filteredItems("tv-series").length} TV series</Badge>
          </div>
          <MediaGrid items={filteredItems("tv-series")} />
        </TabsContent>

        <TabsContent value="mini-series">
          <div className="mb-4">
            <Badge variant="secondary">{filteredItems("mini-series").length} mini series</Badge>
          </div>
          <MediaGrid items={filteredItems("mini-series")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;