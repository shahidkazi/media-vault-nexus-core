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
import { Search, Filter, SortAsc, ChevronDown } from "lucide-react";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [watchedFilter, setWatchedFilter] = useState("all");
  const [backupFilter, setBackupFilter] = useState("all");
  const [mediaNumberFilter, setMediaNumberFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Mock data - would come from your data store - removed for performance
  const [mediaItems, setMediaItems] = useState<any[]>([]);

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
      const matchesBackup = backupFilter === "all" ||
        (backupFilter === "backed-up" && item.backedUp) ||
        (backupFilter === "not-backed-up" && !item.backedUp);
      const matchesMediaNumber = !mediaNumberFilter || item.mediaNumber.includes(mediaNumberFilter);

      return matchesType && matchesSearch && matchesQuality && matchesGenre && matchesWatched && matchesBackup && matchesMediaNumber;
    });
  };

  const FilterControls = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-surface border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filters
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
            <Button variant="outline" className="bg-surface border-border">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-surface-elevated border-border" align="end">
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
  };

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