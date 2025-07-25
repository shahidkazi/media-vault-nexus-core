import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddMedia = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");

  const [cast, setCast] = useState<Array<{ character: string; actor: string }>>([]);
  const [episodes, setEpisodes] = useState<Array<{ 
    season: number; 
    episode: number; 
    title: string; 
    plot: string; 
    watched: boolean; 
    backedUp: boolean 
  }>>([]);
  const [newCastMember, setNewCastMember] = useState({ character: "", actor: "" });
  const [newEpisode, setNewEpisode] = useState({ 
    season: 1, 
    episode: 1, 
    title: "", 
    plot: "", 
    watched: false, 
    backedUp: false 
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    year: "",
    quality: "",
    mediaNumber: "",
    fileSize: "",
    edition: "",
    director: "",
    onlineRating: "",
    description: "",
    watched: false,
    backedUp: false,
    pendingBackup: false,
    loaned: false,
    loanedTo: ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      setGenres(prev => [...prev, newGenre.trim()]);
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    setGenres(prev => prev.filter(g => g !== genre));
  };

  const addCastMember = () => {
    if (newCastMember.character.trim() && newCastMember.actor.trim()) {
      setCast(prev => [...prev, { ...newCastMember }]);
      setNewCastMember({ character: "", actor: "" });
    }
  };

  const removeCastMember = (index: number) => {
    setCast(prev => prev.filter((_, i) => i !== index));
  };

  const addEpisode = () => {
    if (newEpisode.title.trim()) {
      setEpisodes(prev => [...prev, { ...newEpisode }]);
      setNewEpisode(prev => ({ 
        ...prev, 
        episode: prev.episode + 1, 
        title: "", 
        plot: "", 
        watched: false, 
        backedUp: false 
      }));
    }
  };

  const removeEpisode = (index: number) => {
    setEpisodes(prev => prev.filter((_, i) => i !== index));
  };

  const handleTMDBSearch = () => {
    // Mock search - would integrate with TMDB API
    toast({
      title: "TMDB Search",
      description: "This would search TMDB database for media information",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - would save to your data store
    toast({
      title: "Media Added",
      description: `${formData.title} has been added to your collection`,
    });
    
    // Reset form
    setFormData({
      title: "",
      type: "",
      year: "",
      quality: "",
      mediaNumber: "",
      fileSize: "",
      edition: "",
      director: "",
      onlineRating: "",
      description: "",
      watched: false,
      backedUp: false,
      pendingBackup: false,
      loaned: false,
      loanedTo: ""
    });
    setGenres([]);
    setCast([]);
    setEpisodes([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add Media</h1>
        <p className="text-muted-foreground">Add new movies, TV series, or mini series to your collection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TMDB Search */}
        <Card className="bg-surface-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-accent" />
              <span>Search TMDB</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search for media</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Enter movie or TV show title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface border-border"
                />
                <Button onClick={handleTMDBSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Search results would appear here with the ability to auto-populate the form
            </p>
          </CardContent>
        </Card>

        {/* Manual Entry Form */}
        <div className="lg:col-span-2">
          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-surface border border-border">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="cast">Cast</TabsTrigger>
                    <TabsTrigger value="episodes" disabled={formData.type === "movie"}>Episodes</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className="bg-surface border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger className="bg-surface border-border">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="tv-series">TV Series</SelectItem>
                            <SelectItem value="mini-series">Mini Series</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Release Year</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.year}
                          onChange={(e) => handleInputChange("year", e.target.value)}
                          className="bg-surface border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="director">Director</Label>
                        <Input
                          id="director"
                          value={formData.director}
                          onChange={(e) => handleInputChange("director", e.target.value)}
                          className="bg-surface border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="onlineRating">Online Rating</Label>
                        <Input
                          id="onlineRating"
                          placeholder="e.g., 8.5/10"
                          value={formData.onlineRating}
                          onChange={(e) => handleInputChange("onlineRating", e.target.value)}
                          className="bg-surface border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Genres</Label>
                      <div className="flex space-x-2 mb-2">
                        <Input
                          placeholder="Add genre..."
                          value={newGenre}
                          onChange={(e) => setNewGenre(e.target.value)}
                          className="bg-surface border-border"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
                        />
                        <Button type="button" onClick={addGenre}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <Badge key={genre} variant="secondary" className="flex items-center space-x-1">
                            <span>{genre}</span>
                            <button
                              type="button"
                              onClick={() => removeGenre(genre)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="bg-surface border-border"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quality">Quality</Label>
                        <Select value={formData.quality} onValueChange={(value) => handleInputChange("quality", value)}>
                          <SelectTrigger className="bg-surface border-border">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4K">4K Ultra HD</SelectItem>
                            <SelectItem value="1080p">1080p HD</SelectItem>
                            <SelectItem value="720p">720p HD</SelectItem>
                            <SelectItem value="SD">Standard Definition</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mediaNumber">Media #</Label>
                        <Input
                          id="mediaNumber"
                          value={formData.mediaNumber}
                          onChange={(e) => handleInputChange("mediaNumber", e.target.value)}
                          className="bg-surface border-border"
                          placeholder="e.g., 001, M-001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fileSize">File Size</Label>
                        <Input
                          id="fileSize"
                          value={formData.fileSize}
                          onChange={(e) => handleInputChange("fileSize", e.target.value)}
                          className="bg-surface border-border"
                          placeholder="e.g., 15.2 GB"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edition">Edition</Label>
                        <Input
                          id="edition"
                          value={formData.edition}
                          onChange={(e) => handleInputChange("edition", e.target.value)}
                          className="bg-surface border-border"
                          placeholder="e.g., Director's Cut, Extended"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cast" className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="character">Character</Label>
                          <Input
                            id="character"
                            placeholder="Character name"
                            value={newCastMember.character}
                            onChange={(e) => setNewCastMember(prev => ({ ...prev, character: e.target.value }))}
                            className="bg-surface border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="actor">Actor</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="actor"
                              placeholder="Actor name"
                              value={newCastMember.actor}
                              onChange={(e) => setNewCastMember(prev => ({ ...prev, actor: e.target.value }))}
                              className="bg-surface border-border"
                            />
                            <Button type="button" onClick={addCastMember}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {cast.length > 0 && (
                        <div className="space-y-2">
                          <Label>Cast Members</Label>
                          <div className="space-y-2">
                            {cast.map((member, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-md border border-border">
                                <div>
                                  <span className="font-medium">{member.character}</span>
                                  <span className="text-muted-foreground"> - {member.actor}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCastMember(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="episodes" className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="season">Season #</Label>
                          <Input
                            id="season"
                            type="number"
                            min="1"
                            value={newEpisode.season}
                            onChange={(e) => setNewEpisode(prev => ({ ...prev, season: parseInt(e.target.value) || 1 }))}
                            className="bg-surface border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="episodeNum">Episode #</Label>
                          <Input
                            id="episodeNum"
                            type="number"
                            min="1"
                            value={newEpisode.episode}
                            onChange={(e) => setNewEpisode(prev => ({ ...prev, episode: parseInt(e.target.value) || 1 }))}
                            className="bg-surface border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="episodeTitle">Episode Title</Label>
                          <Input
                            id="episodeTitle"
                            placeholder="Episode title"
                            value={newEpisode.title}
                            onChange={(e) => setNewEpisode(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-surface border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>&nbsp;</Label>
                          <Button type="button" onClick={addEpisode} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Episode
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="episodePlot">Episode Plot</Label>
                        <Textarea
                          id="episodePlot"
                          placeholder="Episode plot summary"
                          value={newEpisode.plot}
                          onChange={(e) => setNewEpisode(prev => ({ ...prev, plot: e.target.value }))}
                          className="bg-surface border-border"
                          rows={2}
                        />
                      </div>

                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="episodeWatched"
                            checked={newEpisode.watched}
                            onCheckedChange={(checked) => setNewEpisode(prev => ({ ...prev, watched: !!checked }))}
                          />
                          <Label htmlFor="episodeWatched">Watched</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="episodeBackedUp"
                            checked={newEpisode.backedUp}
                            onCheckedChange={(checked) => setNewEpisode(prev => ({ ...prev, backedUp: !!checked }))}
                          />
                          <Label htmlFor="episodeBackedUp">Backed Up</Label>
                        </div>
                      </div>

                      {episodes.length > 0 && (
                        <div className="space-y-2">
                          <Label>Episodes</Label>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {episodes.map((episode, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-md border border-border">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">S{episode.season}E{episode.episode}</span>
                                    <span>{episode.title}</span>
                                    <div className="flex space-x-1">
                                      {episode.watched && <Badge variant="secondary" className="text-xs">Watched</Badge>}
                                      {episode.backedUp && <Badge variant="secondary" className="text-xs">Backed Up</Badge>}
                                    </div>
                                  </div>
                                  {episode.plot && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{episode.plot}</p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEpisode(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="status" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="watched"
                          checked={formData.watched}
                          onCheckedChange={(checked) => handleInputChange("watched", checked)}
                        />
                        <Label htmlFor="watched">Watched</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="backedUp"
                          checked={formData.backedUp}
                          onCheckedChange={(checked) => handleInputChange("backedUp", checked)}
                        />
                        <Label htmlFor="backedUp">Backed Up</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pendingBackup"
                          checked={formData.pendingBackup}
                          onCheckedChange={(checked) => handleInputChange("pendingBackup", checked)}
                        />
                        <Label htmlFor="pendingBackup">Pending Backup</Label>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="loaned"
                            checked={formData.loaned}
                            onCheckedChange={(checked) => handleInputChange("loaned", checked)}
                          />
                          <Label htmlFor="loaned">Currently Loaned</Label>
                        </div>
                        {formData.loaned && (
                          <Input
                            placeholder="Loaned to..."
                            value={formData.loanedTo}
                            onChange={(e) => handleInputChange("loanedTo", e.target.value)}
                            className="bg-surface border-border ml-6"
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Media
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddMedia;