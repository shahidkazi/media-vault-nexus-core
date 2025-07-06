import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Database, Film, Tv, FileText, Plus } from "lucide-react";

const Burn = () => {
  // Mock data for pending backup items
  const mockPendingItems = {
    movies: [
      { id: "1", title: "The Matrix", fileSize: 3.2, mediaNumber: "M001", quality: "4K" },
      { id: "2", title: "Inception", fileSize: 4.1, mediaNumber: "M002", quality: "4K" },
      { id: "3", title: "Interstellar", fileSize: 5.8, mediaNumber: "M003", quality: "4K" },
      { id: "4", title: "The Dark Knight", fileSize: 3.9, mediaNumber: "M004", quality: "1080p" },
      { id: "5", title: "Pulp Fiction", fileSize: 2.1, mediaNumber: "M005", quality: "1080p" },
      { id: "6", title: "Fight Club", fileSize: 2.8, mediaNumber: "M006", quality: "1080p" },
      { id: "7", title: "The Godfather", fileSize: 3.5, mediaNumber: "M007", quality: "4K" },
      { id: "8", title: "Goodfellas", fileSize: 2.4, mediaNumber: "M008", quality: "1080p" }
    ],
    tvSeries: [
      { id: "9", title: "Breaking Bad S1", fileSize: 8.2, mediaNumber: "T001", quality: "1080p", episodes: 7 },
      { id: "10", title: "The Wire S1", fileSize: 9.1, mediaNumber: "T002", quality: "1080p", episodes: 13 },
      { id: "11", title: "Game of Thrones S1", fileSize: 7.8, mediaNumber: "T003", quality: "4K", episodes: 10 },
      { id: "12", title: "Stranger Things S1", fileSize: 6.4, mediaNumber: "T004", quality: "4K", episodes: 8 }
    ],
    miniSeries: [
      { id: "13", title: "Band of Brothers", fileSize: 12.5, mediaNumber: "MS001", quality: "4K", episodes: 10 },
      { id: "14", title: "Chernobyl", fileSize: 8.9, mediaNumber: "MS002", quality: "4K", episodes: 5 }
    ]
  };

  const [selectedGroups, setSelectedGroups] = useState<{[key: string]: any[]}>({
    movies: [],
    tvSeries: [],
    miniSeries: []
  });

  const maxSizeGB = 23;

  // Knapsack algorithm to find optimal combination
  const findOptimalCombination = (items: any[], maxSize: number) => {
    const n = items.length;
    const dp = Array(n + 1).fill(null).map(() => Array(Math.floor(maxSize * 10) + 1).fill(0));
    const keep = Array(n + 1).fill(null).map(() => Array(Math.floor(maxSize * 10) + 1).fill(false));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= Math.floor(maxSize * 10); w++) {
        const itemSize = Math.floor(items[i - 1].fileSize * 10);
        if (itemSize <= w) {
          const valueWith = itemSize + dp[i - 1][w - itemSize];
          const valueWithout = dp[i - 1][w];
          if (valueWith > valueWithout) {
            dp[i][w] = valueWith;
            keep[i][w] = true;
          } else {
            dp[i][w] = valueWithout;
          }
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find items
    const result = [];
    let w = Math.floor(maxSize * 10);
    for (let i = n; i > 0 && w > 0; i--) {
      if (keep[i][w]) {
        result.push(items[i - 1]);
        w -= Math.floor(items[i - 1].fileSize * 10);
      }
    }

    return result;
  };

  const generateOptimalGroup = (type: 'movies' | 'tvSeries' | 'miniSeries') => {
    const items = mockPendingItems[type];
    const optimal = findOptimalCombination(items, maxSizeGB);
    setSelectedGroups(prev => ({ ...prev, [type]: optimal }));
  };

  const getTotalSize = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.fileSize, 0);
  };

  const getProgress = (items: any[]) => {
    return (getTotalSize(items) / maxSizeGB) * 100;
  };

  const BurnGroup = ({ title, icon: Icon, items, type }: { 
    title: string; 
    icon: any; 
    items: any[]; 
    type: 'movies' | 'tvSeries' | 'miniSeries' 
  }) => {
    const selectedItems = selectedGroups[type];
    const totalSize = getTotalSize(selectedItems);
    const progress = getProgress(selectedItems);

    return (
      <Card className="bg-surface-elevated border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-accent" />
              <span>{title}</span>
            </div>
            <Button 
              onClick={() => generateOptimalGroup(type)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Size: {totalSize.toFixed(1)} GB</span>
              <span>{maxSizeGB} GB max</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {selectedItems.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-surface rounded-md">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{item.mediaNumber}</Badge>
                        <Badge variant="outline" className="text-xs">{item.quality}</Badge>
                        {item.episodes && <span>{item.episodes} episodes</span>}
                      </div>
                    </div>
                    <span className="text-sm font-medium">{item.fileSize} GB</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Total: {selectedItems.length} items</span>
                <span>{totalSize.toFixed(1)} GB</span>
              </div>
            </div>
          )}

          {selectedItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click "Optimize" to generate optimal burn group</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Burn Groups</h1>
        <p className="text-muted-foreground">
          Optimize media groups for backup to maximize {maxSizeGB}GB capacity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BurnGroup
          title="Movies"
          icon={Film}
          items={mockPendingItems.movies}
          type="movies"
        />
        
        <BurnGroup
          title="TV Series"
          icon={Tv}
          items={mockPendingItems.tvSeries}
          type="tvSeries"
        />
        
        <BurnGroup
          title="Mini Series"
          icon={FileText}
          items={mockPendingItems.miniSeries}
          type="miniSeries"
        />
      </div>

      <Card className="mt-8 bg-surface-elevated border-border">
        <CardHeader>
          <CardTitle>Available Items for Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-surface border border-border">
              <TabsTrigger value="movies">Movies ({mockPendingItems.movies.length})</TabsTrigger>
              <TabsTrigger value="tv">TV Series ({mockPendingItems.tvSeries.length})</TabsTrigger>
              <TabsTrigger value="mini">Mini Series ({mockPendingItems.miniSeries.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="movies" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPendingItems.movies.map(item => (
                  <div key={item.id} className="p-3 bg-surface rounded-md border border-border">
                    <div className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{item.mediaNumber}</Badge>
                        <Badge variant="outline" className="text-xs">{item.quality}</Badge>
                      </div>
                      <div className="text-sm font-medium text-accent">{item.fileSize} GB</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tv" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPendingItems.tvSeries.map(item => (
                  <div key={item.id} className="p-3 bg-surface rounded-md border border-border">
                    <div className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{item.mediaNumber}</Badge>
                        <Badge variant="outline" className="text-xs">{item.quality}</Badge>
                        <span className="text-xs">{item.episodes} episodes</span>
                      </div>
                      <div className="text-sm font-medium text-accent">{item.fileSize} GB</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mini" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPendingItems.miniSeries.map(item => (
                  <div key={item.id} className="p-3 bg-surface rounded-md border border-border">
                    <div className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{item.mediaNumber}</Badge>
                        <Badge variant="outline" className="text-xs">{item.quality}</Badge>
                        <span className="text-xs">{item.episodes} episodes</span>
                      </div>
                      <div className="text-sm font-medium text-accent">{item.fileSize} GB</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Burn;