import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Film, Tv, Eye, EyeOff, Database, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MediaEditDialog from "./MediaEditDialog";

interface CastMember {
  character: string;
  actor: string;
}

interface Episode {
  season: number;
  episode: number;
  title: string;
  plot: string;
  watched: boolean;
  backedUp: boolean;
}

interface MediaDetailsProps {
  media: {
    id: string;
    title: string;
    type: "movie" | "tv-series" | "mini-series";
    year: number;
    quality: string;
    genre: string[];
    director?: string;
    onlineRating?: string;
    description?: string;
    watched: boolean;
    backedUp: boolean;
    pendingBackup?: boolean;
    mediaNumber?: string;
    fileSize?: string;
    edition?: string;
    loaned?: boolean;
    loanedTo?: string;
    poster?: string;
    cast?: CastMember[];
    episodes?: Episode[];
    seasons?: number;
    totalEpisodes?: number;
    imdbId?: string;
    language?: string;
    userRating?: number;
  };
  allMediaItems?: any[];
  onToggleWatched: (id: string) => void;
  onToggleBackup: (id: string) => void;
  onUpdateMedia?: (updatedMedia: any) => void;
}

const MediaDetails = ({ media, allMediaItems, onToggleWatched, onToggleBackup, onUpdateMedia }: MediaDetailsProps) => {
  const navigate = useNavigate();

  const getTypeIcon = () => {
    switch (media.type) {
      case "movie":
        return <Film className="h-5 w-5" />;
      case "tv-series":
      case "mini-series":
        return <Tv className="h-5 w-5" />;
      default:
        return <Film className="h-5 w-5" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "4k":
        return "bg-primary text-primary-foreground";
      case "1080p":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const groupedEpisodes = media.episodes?.reduce((acc, episode) => {
    const season = episode.season;
    if (!acc[season]) acc[season] = [];
    acc[season].push(episode);
    return acc;
  }, {} as Record<number, Episode[]>);

  // Get related media items with the same media number
  const relatedMedia = allMediaItems?.filter(item => 
    item.mediaNumber === media.mediaNumber && item.id !== media.id
  ) || [];

  const handleRelatedMediaClick = (mediaId: string) => {
    navigate(`/media/${mediaId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          
          {onUpdateMedia && (
            <MediaEditDialog 
              media={media} 
              onSave={onUpdateMedia}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 lg:flex lg:gap-6 gap-6">
        {/* Poster and Quick Actions */}
        <div className="lg:flex-shrink-0 lg:max-w-xs">
          <Card className="bg-surface-elevated border-border lg:h-full">
            <CardContent className="p-6 lg:h-full lg:flex lg:flex-col lg:justify-between">
              <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center">
                {media.poster ? (
                  <img
                    src={media.poster}
                    alt={media.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-surface max-w-48 mx-auto"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-surface rounded-lg flex items-center justify-center max-w-48 mx-auto">
                    {getTypeIcon()}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 justify-center mt-4">
                <Button
                  variant={media.watched ? "default" : "outline"}
                  onClick={() => onToggleWatched(media.id)}
                  size="sm"
                  className="px-3"
                >
                  {media.watched ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={media.backedUp ? "default" : "outline"}
                  onClick={() => onToggleBackup(media.id)}
                  size="sm"
                  className="px-3"
                >
                  <Database className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Details */}
        <div className="lg:flex-1">
          <Card className="bg-surface-elevated border-border h-fit lg:h-full">
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon()}
                  <CardTitle className="text-2xl">{media.title}</CardTitle>
                  {/* Desktop badges next to title */}
                  <div className="hidden lg:flex lg:items-center lg:gap-2 lg:ml-4">
                    <Badge className={getQualityColor(media.quality)}>
                      {media.quality}
                    </Badge>
                    {media.mediaNumber && (
                      <Badge variant="secondary">
                        #{media.mediaNumber}
                      </Badge>
                    )}
                    {media.pendingBackup && (
                      <Badge variant="destructive">
                        Pending Backup
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {media.genre.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
                {/* Mobile badges below genres */}
                <div className="flex flex-wrap gap-2 lg:hidden">
                  <Badge className={getQualityColor(media.quality)}>
                    {media.quality}
                  </Badge>
                  {media.mediaNumber && (
                    <Badge variant="secondary">
                      #{media.mediaNumber}
                    </Badge>
                  )}
                  {media.pendingBackup && (
                    <Badge variant="destructive">
                      Pending Backup
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{media.year}</span>
                </div>
                {media.language && (
                  <div>
                    <span className="text-muted-foreground">Language: </span>
                    <span>{media.language}</span>
                  </div>
                )}
                {media.onlineRating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>IMDB: {media.onlineRating}</span>
                  </div>
                )}
                {media.userRating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>My Rating: {media.userRating}/10</span>
                  </div>
                )}
                {media.director && (
                  <div>
                    <span className="text-muted-foreground">Director: </span>
                    <span>{media.director}</span>
                  </div>
                )}
                {media.fileSize && (
                  <div>
                    <span className="text-muted-foreground">File Size: </span>
                    <span>{media.fileSize}</span>
                  </div>
                )}
                {media.edition && (
                  <div>
                    <span className="text-muted-foreground">Edition: </span>
                    <span>{media.edition}</span>
                  </div>
                )}
                {media.loaned && media.loanedTo && (
                  <div>
                    <span className="text-muted-foreground">Loaned to: </span>
                    <span>{media.loanedTo}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">IMDB: </span>
                  <a href={`https://www.imdb.com/title/${media.imdbId || ''}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View on IMDB
                  </a>
                </div>
              </div>

              {media.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{media.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cast Table */}
      {media.cast && media.cast.length > 0 && (
        <Card className="mt-6 bg-surface-elevated border-border">
          <CardHeader>
            <CardTitle>Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Character</TableHead>
                  <TableHead>Actor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {media.cast.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.character}</TableCell>
                    <TableCell>{member.actor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Episodes Table */}
      {media.episodes && media.episodes.length > 0 && groupedEpisodes && (
        <Card className="mt-6 bg-surface-elevated border-border">
          <CardHeader>
            <CardTitle>Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(groupedEpisodes)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([season, episodes]) => (
                <div key={season} className="mb-8 last:mb-0">
                  <h3 className="font-semibold text-lg mb-4">Season {season}</h3>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Episode</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Plot</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {episodes
                          .sort((a, b) => a.episode - b.episode)
                          .map((episode, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">E{episode.episode}</TableCell>
                              <TableCell>{episode.title}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {episode.plot && (
                                  <span className="line-clamp-2">{episode.plot}</span>
                                )}
                              </TableCell>
                               <TableCell>
                                <div className="flex space-x-1">
                                  <Badge variant={episode.watched ? "default" : "outline"} className="text-xs">
                                    <Eye className="h-3 w-3" />
                                  </Badge>
                                  <Badge variant={episode.backedUp ? "default" : "outline"} className="text-xs">
                                    <Database className="h-3 w-3" />
                                  </Badge>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {episodes
                      .sort((a, b) => a.episode - b.episode)
                      .map((episode, index) => (
                        <Card key={index} className="bg-surface border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                E{episode.episode}
                              </Badge>
                              <span className="font-medium text-sm">{episode.title}</span>
                            </div>
                            {episode.plot && (
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {episode.plot}
                              </p>
                            )}
                            <div className="flex gap-1">
                              <Badge variant={episode.watched ? "default" : "outline"} className="text-xs px-1">
                                {episode.watched ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              </Badge>
                              <Badge variant={episode.backedUp ? "default" : "outline"} className="text-xs px-1">
                                <Database className="h-3 w-3" />
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Related Media */}
      {relatedMedia.length > 0 && (
        <Card className="mt-6 bg-surface-elevated border-border">
          <CardHeader>
            <CardTitle>Related Media (#{media.mediaNumber})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedMedia.map((item) => (
                <Card
                  key={item.id}
                  className="bg-surface border-border cursor-pointer hover:bg-surface-hover transition-colors"
                  onClick={() => handleRelatedMediaClick(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-surface rounded-md flex items-center justify-center text-muted-foreground flex-shrink-0">
                          {item.type === "movie" ? <Film className="h-5 w-5" /> : <Tv className="h-5 w-5" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.year} • {item.quality}
                        </p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant={item.watched ? "default" : "outline"} className="text-xs px-1">
                            {item.watched ? <Eye className="h-2 w-2" /> : <EyeOff className="h-2 w-2" />}
                          </Badge>
                          <Badge variant={item.backedUp ? "default" : "outline"} className="text-xs px-1">
                            <Database className="h-2 w-2" />
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaDetails;