import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, X } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "tv-series" | "mini-series";
  year: number;
  quality: string;
  genre: string[];
  director?: string;
  onlineRating?: string;
  description?: string;
  mediaNumber?: string;
  fileSize?: string;
  edition?: string;
  poster?: string;
  imdbId?: string;
}

interface MediaEditDialogProps {
  media: MediaItem;
  onSave: (updatedMedia: MediaItem) => void;
}

const MediaEditDialog = ({ media, onSave }: MediaEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<MediaItem>(media);
  const [newGenre, setNewGenre] = useState("");

  const handleSave = () => {
    onSave(editData);
    setIsOpen(false);
  };

  const addGenre = () => {
    if (newGenre.trim() && !editData.genre.includes(newGenre.trim())) {
      setEditData(prev => ({
        ...prev,
        genre: [...prev.genre, newGenre.trim()]
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genreToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle>Edit Media Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={editData.year}
                onChange={(e) => setEditData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={editData.type}
                onValueChange={(value: "movie" | "tv-series" | "mini-series") => 
                  setEditData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tv-series">TV Series</SelectItem>
                  <SelectItem value="mini-series">Mini Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={editData.quality}
                onValueChange={(value) => setEditData(prev => ({ ...prev, quality: value }))}
              >
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4K">4K</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="SD">SD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                value={editData.director || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, director: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="onlineRating">Online Rating</Label>
              <Input
                id="onlineRating"
                value={editData.onlineRating || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, onlineRating: e.target.value }))}
                className="bg-surface border-border"
                placeholder="e.g., 8.5/10"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="mediaNumber">Media Number</Label>
              <Input
                id="mediaNumber"
                value={editData.mediaNumber || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, mediaNumber: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="fileSize">File Size</Label>
              <Input
                id="fileSize"
                value={editData.fileSize || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, fileSize: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                value={editData.edition || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, edition: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="poster">Poster URL</Label>
              <Input
                id="poster"
                value={editData.poster || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, poster: e.target.value }))}
                className="bg-surface border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="imdbId">IMDB ID</Label>
              <Input
                id="imdbId"
                value={editData.imdbId || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, imdbId: e.target.value }))}
                className="bg-surface border-border"
                placeholder="tt1234567"
              />
            </div>
            
            <div>
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {editData.genre.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                    <button
                      onClick={() => removeGenre(genre)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Add genre"
                  className="bg-surface border-border"
                  onKeyPress={(e) => e.key === 'Enter' && addGenre()}
                />
                <Button variant="outline" onClick={addGenre}>Add</Button>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editData.description || ""}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-surface border-border min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaEditDialog;