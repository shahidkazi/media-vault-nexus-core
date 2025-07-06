import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MediaCard from "@/components/MediaCard";
import { Search, Filter, SortAsc } from "lucide-react";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [watchedFilter, setWatchedFilter] = useState("all");

  // Mock data - would come from your data store
  const [mediaItems, setMediaItems] = useState([
    {
      id: "1",
      title: "The Dark Knight",
      type: "movie" as const,
      year: 2008,
      quality: "4K",
      genre: ["Action", "Drama", "Crime"],
      watched: true,
      backedUp: true,
      mediaNumber: "001"
    },
    {
      id: "2", 
      title: "Breaking Bad",
      type: "tv-series" as const,
      year: 2008,
      quality: "1080p",
      genre: ["Drama", "Crime", "Thriller"],
      watched: false,
      backedUp: true,
      mediaNumber: "002"
    },
    {
      id: "3",
      title: "Inception",
      type: "movie" as const,
      year: 2010,
      quality: "4K",
      genre: ["Action", "Sci-Fi", "Thriller"],
      watched: true,
      backedUp: false,
      mediaNumber: "003"
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

  const filteredItems = (type?: string) => {
    return mediaItems.filter(item => {
      const matchesType = !type || item.type === type;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuality = selectedQuality === "all" || item.quality === selectedQuality;
      const matchesGenre = selectedGenre === "all" || item.genre.includes(selectedGenre);
      const matchesWatched = watchedFilter === "all" || 
        (watchedFilter === "watched" && item.watched) ||
        (watchedFilter === "unwatched" && !item.watched);

      return matchesType && matchesSearch && matchesQuality && matchesGenre && matchesWatched;
    });
  };

  const FilterControls = () => (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>
        <Select value={selectedQuality} onValueChange={setSelectedQuality}>
          <SelectTrigger className="w-full md:w-[140px] bg-surface border-border">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quality</SelectItem>
            <SelectItem value="4K">4K</SelectItem>
            <SelectItem value="1080p">1080p</SelectItem>
            <SelectItem value="SD">SD</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-[140px] bg-surface border-border">
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
        <Select value={watchedFilter} onValueChange={setWatchedFilter}>
          <SelectTrigger className="w-full md:w-[140px] bg-surface border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="watched">Watched</SelectItem>
            <SelectItem value="unwatched">Unwatched</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[140px] bg-surface border-border">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="year">Release Year</SelectItem>
            <SelectItem value="added">Date Added</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const MediaGrid = ({ items }: { items: typeof mediaItems }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onToggleWatched={handleToggleWatched}
          onToggleBackup={handleToggleBackup}
        />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Library</h1>
        <p className="text-muted-foreground">Browse and manage your media collection</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-surface-elevated border border-border">
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="movie">Movies</TabsTrigger>
          <TabsTrigger value="tv-series">TV Series</TabsTrigger>
          <TabsTrigger value="mini-series">Mini Series</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <FilterControls />
        </div>

        <TabsContent value="all">
          <div className="mb-4">
            <Badge variant="secondary">{filteredItems().length} items</Badge>
          </div>
          <MediaGrid items={filteredItems()} />
        </TabsContent>

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