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
  poster?: string;
  mediaNumber?: string;
}

interface MediaCardProps {
  media: MediaItem;
  onToggleWatched: (id: string) => void;
  onToggleBackup: (id: string) => void;
  onClick?: (id: string) => void;
}

const MediaCard = ({ media, onToggleWatched, onToggleBackup, onClick }: MediaCardProps) => {
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
      <CardContent className="p-0">
        {/* Poster */}
        <div 
          className="aspect-[2/3] bg-surface rounded-t-lg overflow-hidden cursor-pointer"
          onClick={() => onClick?.(media.id)}
        >
          {media.poster ? (
            <img
              src={media.poster}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getTypeIcon()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <div 
            className="mb-2 cursor-pointer" 
            onClick={() => onClick?.(media.id)}
          >
            <h3 className="font-semibold text-foreground line-clamp-1 mb-1 text-sm">{media.title}</h3>
            <span className="text-xs text-muted-foreground">{media.year}</span>
           </div>
        
        {/* Quality, Media Number, Status */}
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge className={getQualityColor(media.quality)}>
            {media.quality}
          </Badge>
          {media.mediaNumber && (
            <Badge variant="secondary" className="text-xs">
              #{media.mediaNumber}
            </Badge>
          )}
          <Badge variant={media.watched ? "default" : "outline"} className="text-xs px-1">
            {media.watched ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Badge>
          <Badge variant={media.backedUp ? "default" : "outline"} className="text-xs px-1">
            <Database className="h-3 w-3" />
          </Badge>
        </div>
        
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={media.watched ? "default" : "outline"}
            onClick={() => onToggleWatched(media.id)}
            className="h-6 px-1 flex-1"
          >
            {media.watched ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant={media.backedUp ? "default" : "outline"}
            onClick={() => onToggleBackup(media.id)}
            className="h-6 px-1 flex-1"
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