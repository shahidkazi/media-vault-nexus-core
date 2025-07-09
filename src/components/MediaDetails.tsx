import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Film, Tv, Eye, EyeOff, Database, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  };
  onToggleWatched: (id: string) => void;
  onToggleBackup: (id: string) => void;
}

const MediaDetails = ({ media, onToggleWatched, onToggleBackup }: MediaDetailsProps) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Poster and Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-surface-elevated border-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {media.poster ? (
                  <img
                    src={media.poster}
                    alt={media.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-surface"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-surface rounded-lg flex items-center justify-center">
                    {getTypeIcon()}
                  </div>
                )}
                
                <div className="flex justify-center space-x-2">
                  <Button
                    variant={media.watched ? "default" : "outline"}
                    onClick={() => onToggleWatched(media.id)}
                    className="flex-1"
                  >
                    {media.watched ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                    {media.watched ? "Watched" : "Mark Watched"}
                  </Button>
                  <Button
                    variant={media.backedUp ? "default" : "outline"}
                    onClick={() => onToggleBackup(media.id)}
                    className="flex-1"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {media.backedUp ? "Backed Up" : "Mark Backed Up"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-2">
          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                {getTypeIcon()}
                <CardTitle className="text-2xl">{media.title}</CardTitle>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {media.genre.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
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
                {media.onlineRating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{media.onlineRating}</span>
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
                                <div className="flex flex-col space-y-1">
                                  {episode.watched && (
                                    <Badge variant="secondary" className="text-xs w-fit">
                                      Watched
                                    </Badge>
                                  )}
                                  {episode.backedUp && (
                                    <Badge variant="secondary" className="text-xs w-fit">
                                      Backed Up
                                    </Badge>
                                  )}
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
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  E{episode.episode}
                                </Badge>
                                <span className="font-medium text-sm">{episode.title}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {episode.watched && (
                                  <Badge variant="secondary" className="text-xs">
                                    Watched
                                  </Badge>
                                )}
                                {episode.backedUp && (
                                  <Badge variant="secondary" className="text-xs">
                                    Backed Up
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {episode.plot && (
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {episode.plot}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaDetails;