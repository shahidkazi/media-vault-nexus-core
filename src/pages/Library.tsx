import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MediaCard from "@/components/MediaCard";
import MediaDetails from "@/components/MediaDetails";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SortAsc, ChevronDown, Grid3X3, List, Eye, EyeOff, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedQuality: string;
  setSelectedQuality: (value: string) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  watchedFilter: string;
  setWatchedFilter: (value: string) => void;
  backupFilter: string;
  setBackupFilter: (value: string) => void;
  mediaNumberFilter: string;
  setMediaNumberFilter: (value: string) => void;
}

interface SortControlsProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const FilterControls = ({
  searchTerm,
  setSearchTerm,
  selectedQuality,
  setSelectedQuality,
  selectedGenre,
  setSelectedGenre,
  watchedFilter,
  setWatchedFilter,
  backupFilter,
  setBackupFilter,
  mediaNumberFilter,
  setMediaNumberFilter,
}: FilterControlsProps) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search media..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 bg-surface border-border"
    />
  </div>
);

const FilterPopover = ({
  selectedQuality,
  setSelectedQuality,
  selectedGenre,
  setSelectedGenre,
  watchedFilter,
  setWatchedFilter,
  backupFilter,
  setBackupFilter,
  mediaNumberFilter,
  setMediaNumberFilter,
}: Omit<FilterControlsProps, 'searchTerm' | 'setSearchTerm'>) => (
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
            placeholder="Filter by media number..."
            value={mediaNumberFilter}
            onChange={(e) => setMediaNumberFilter(e.target.value)}
            className="bg-surface border-border"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const SortControls = ({ sortBy, setSortBy, sortOrder, setSortOrder }: SortControlsProps) => (
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
              <SelectItem value="year">Year</SelectItem>
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
);

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
  const [viewMode, setViewMode] = useState<"grid" | "table">(
    () => (localStorage.getItem("defaultView") as "grid" | "table") || "grid"
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedia();
    }
  }, [user]);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;

      // Fetch episodes for each media item
      const mediaWithEpisodes = await Promise.all(
        (mediaData || []).map(async (media) => {
          const { data: episodesData } = await supabase
            .from('episodes')
            .select('*')
            .eq('media_id', media.id)
            .order('season', { ascending: true })
            .order('episode', { ascending: true });

          // Map database format to UI format
          const typeMap: Record<string, string> = {
            "Movie": "movie",
            "TV Series": "tv-series",
            "Mini Series": "mini-series"
          };

          return {
            id: media.id,
            title: media.title,
            type: typeMap[media.type] || media.type.toLowerCase(),
            genre: media.genres || [],
            quality: media.quality,
            watched: media.seen,
            backedUp: media.backed_up,
            mediaNumber: media.media_number,
            poster: media.poster_url || "/placeholder.svg",
            cast: media.cast_members || [],
            edition: media.edition,
            episodes: episodesData?.map(ep => ({
              season: ep.season,
              episode: ep.episode,
              title: ep.title,
              watched: ep.seen,
              backedUp: ep.backed_up
            })) || []
          };
        })
      );

      setMediaItems(mediaWithEpisodes);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to load media library",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const MediaGrid = ({ items }: { items: typeof mediaItems }) => {
    if (isLoading) {
      return (
        <Card className="bg-surface-elevated border-border p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">Loading media library...</p>
          </CardContent>
        </Card>
      );
    }

    if (items.length === 0) {
      return (
        <Card className="bg-surface-elevated border-border p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No media items found. Add some media to get started!</p>
          </CardContent>
        </Card>
      );
    }

    if (viewMode === "table") {
      return (
        <Card className="bg-surface-elevated border-border">
          <CardContent className="p-0">
            {/* Desktop table view */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Media #</TableHead>
                    <TableHead>IMDB</TableHead>
                    <TableHead>My Rating</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-surface-hover"
                      onClick={() => handleMediaClick(item.id)}
                    >
                      <TableCell>
                        {item.type === "movie" ? (
                          <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">M</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-accent/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-accent">TV</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>
                        <Badge 
                          className={item.quality === "4K" ? "bg-primary text-primary-foreground" : 
                                    item.quality === "1080p" ? "bg-accent text-accent-foreground" : 
                                    "bg-secondary text-secondary-foreground"}
                        >
                          {item.quality}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.language || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.genre.slice(0, 2).map((genre: string) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {item.genre.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{item.genre.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.mediaNumber && (
                          <Badge variant="secondary" className="text-xs">
                            #{item.mediaNumber}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.onlineRating || "-"}</TableCell>
                      <TableCell>{item.userRating ? `${item.userRating}/10` : "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Badge variant={item.watched ? "default" : "outline"} className="text-xs px-1">
                            {item.watched ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Badge>
                          <Badge variant={item.backedUp ? "default" : "outline"} className="text-xs px-1">
                            <Database className="h-3 w-3" />
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile simplified table view - only title and year */}
            <div className="md:hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-surface-hover"
                      onClick={() => handleMediaClick(item.id)}
                    >
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid view (default)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
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
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <FilterControls 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                watchedFilter={watchedFilter}
                setWatchedFilter={setWatchedFilter}
                backupFilter={backupFilter}
                setBackupFilter={setBackupFilter}
                mediaNumberFilter={mediaNumberFilter}
                setMediaNumberFilter={setMediaNumberFilter}
              />
              
              <FilterPopover
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                watchedFilter={watchedFilter}
                setWatchedFilter={setWatchedFilter}
                backupFilter={backupFilter}
                setBackupFilter={setBackupFilter}
                mediaNumberFilter={mediaNumberFilter}
                setMediaNumberFilter={setMediaNumberFilter}
              />
              
              <SortControls
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              
              {/* View Toggle */}
              <div className="flex border border-border rounded-md bg-surface">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none border-r border-border"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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