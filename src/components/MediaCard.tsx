import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, Tv, Eye, EyeOff, Database } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "tv-series" | "mini-series";
  year: number;
  quality: string;
  genre: string[];
  watched: boolean;
  backedUp: boolean;
  posterUrl?: string;
  mediaNumber?: string;
}

interface MediaCardProps {
  media: MediaItem;
  onToggleWatched: (id: string) => void;
  onToggleBackup: (id: string) => void;
}

const MediaCard = ({ media, onToggleWatched, onToggleBackup }: MediaCardProps) => {
  const getTypeIcon = () => {
    switch (media.type) {
      case "movie":
        return <Film className="h-4 w-4" />;
      case "tv-series":
      case "mini-series":
        return <Tv className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
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

  return (
    <Card className="bg-surface-elevated border-border hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <h3 className="font-semibold text-foreground line-clamp-1">{media.title}</h3>
          </div>
          <span className="text-sm text-muted-foreground">{media.year}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getQualityColor(media.quality)}>
            {media.quality}
          </Badge>
          {media.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {media.mediaNumber && (
            <Badge variant="secondary" className="text-xs">
              #{media.mediaNumber}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={media.watched ? "default" : "outline"}
              onClick={() => onToggleWatched(media.id)}
              className="h-8 px-2"
            >
              {media.watched ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant={media.backedUp ? "default" : "outline"}
              onClick={() => onToggleBackup(media.id)}
              className="h-8 px-2"
            >
              <Database className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;