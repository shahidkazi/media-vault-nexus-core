import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MediaDetails from "@/components/MediaDetails";
import NotFound from "./NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const MediaDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<any>(null);
  const [allMediaItems, setAllMediaItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchMediaDetails();
      fetchAllMedia();
    }
  }, [user, id]);

  const fetchMediaDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch the specific media item
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (mediaError) throw mediaError;
      
      if (!mediaData) {
        setNotFound(true);
        return;
      }

      // Fetch episodes for this media item
      const { data: episodesData } = await supabase
        .from('episodes')
        .select('*')
        .eq('media_id', mediaData.id)
        .order('season', { ascending: true })
        .order('episode', { ascending: true });

      // Map database format to UI format
      const typeMap: Record<string, string> = {
        "Movie": "movie",
        "TV Series": "tv-series",
        "Mini Series": "mini-series"
      };

      const formattedMedia = {
        id: mediaData.id,
        title: mediaData.title,
        type: typeMap[mediaData.type] || mediaData.type.toLowerCase(),
        genre: mediaData.genres || [],
        quality: mediaData.quality || "N/A",
        watched: mediaData.seen,
        backedUp: mediaData.backed_up,
        mediaNumber: mediaData.media_number,
        poster: mediaData.poster_url || "/placeholder.svg",
        cast: mediaData.cast_members || [],
        edition: mediaData.edition,
        imdbUrl: mediaData.imdb_url,
        tmdbUrl: mediaData.tmdb_url,
        year: new Date().getFullYear(), // You may want to add a year column
        episodes: episodesData?.map(ep => ({
          season: ep.season,
          episode: ep.episode,
          title: ep.title || `Episode ${ep.episode}`,
          plot: "",
          watched: ep.seen,
          backedUp: ep.backed_up
        })) || []
      };

      setMedia(formattedMedia);
    } catch (error: any) {
      console.error('Error fetching media details:', error);
      toast({
        title: "Error",
        description: "Failed to load media details",
        variant: "destructive",
      });
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMedia = async () => {
    try {
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;

      const typeMap: Record<string, string> = {
        "Movie": "movie",
        "TV Series": "tv-series",
        "Mini Series": "mini-series"
      };

      const formattedMedia = (mediaData || []).map(item => ({
        id: item.id,
        title: item.title,
        type: typeMap[item.type] || item.type.toLowerCase(),
        genre: item.genres || [],
        quality: item.quality,
        watched: item.seen,
        backedUp: item.backed_up,
        mediaNumber: item.media_number,
        poster: item.poster_url || "/placeholder.svg",
        year: new Date().getFullYear(),
      }));

      setAllMediaItems(formattedMedia);
    } catch (error: any) {
      console.error('Error fetching all media:', error);
    }
  };

  const handleToggleWatched = async (mediaId: string) => {
    try {
      const currentWatchedStatus = media?.watched;
      
      const { error } = await supabase
        .from('media')
        .update({ seen: !currentWatchedStatus })
        .eq('id', mediaId);

      if (error) throw error;

      setMedia((prev: any) => ({ ...prev, watched: !currentWatchedStatus }));
      
      toast({
        title: "Success",
        description: `Marked as ${!currentWatchedStatus ? 'watched' : 'unwatched'}`,
      });
    } catch (error: any) {
      console.error('Error toggling watched status:', error);
      toast({
        title: "Error",
        description: "Failed to update watched status",
        variant: "destructive",
      });
    }
  };

  const handleToggleBackup = async (mediaId: string) => {
    try {
      const currentBackupStatus = media?.backedUp;
      
      const { error } = await supabase
        .from('media')
        .update({ backed_up: !currentBackupStatus })
        .eq('id', mediaId);

      if (error) throw error;

      setMedia((prev: any) => ({ ...prev, backedUp: !currentBackupStatus }));
      
      toast({
        title: "Success",
        description: `Marked as ${!currentBackupStatus ? 'backed up' : 'not backed up'}`,
      });
    } catch (error: any) {
      console.error('Error toggling backup status:', error);
      toast({
        title: "Error",
        description: "Failed to update backup status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMedia = async (updatedMedia: any) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({
          title: updatedMedia.title,
          genres: updatedMedia.genre,
          quality: updatedMedia.quality,
          media_number: updatedMedia.mediaNumber,
          edition: updatedMedia.edition,
        })
        .eq('id', updatedMedia.id);

      if (error) throw error;

      setMedia(updatedMedia);
      
      toast({
        title: "Success",
        description: "Media updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating media:', error);
      toast({
        title: "Error",
        description: "Failed to update media",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading media details...</p>
      </div>
    );
  }

  if (notFound || !media) {
    return <NotFound />;
  }

  return (
    <MediaDetails
      media={media}
      allMediaItems={allMediaItems}
      onToggleWatched={handleToggleWatched}
      onToggleBackup={handleToggleBackup}
      onUpdateMedia={handleUpdateMedia}
    />
  );
};

export default MediaDetailsPage;