import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Tv, Database, Eye, EyeOff, TrendingUp } from "lucide-react";
import heroImage from "@/assets/movie-hero.jpg";

const Dashboard = () => {
  // Mock data - would come from your data store
  const stats = {
    totalMovies: 142,
    totalSeries: 38,
    totalWatched: 95,
    totalUnwatched: 85,
    totalBackedUp: 156,
    totalToBackup: 24,
    total4K: 67,
    total1080p: 89,
    totalSD: 24
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-surface flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroImage})` 
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
            Media Vault
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Your personal digital media collection manager
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your media collection</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Movies"
            value={stats.totalMovies}
            icon={Film}
            change="+12 this month"
            trend="up"
          />
          <StatsCard
            title="TV Series"
            value={stats.totalSeries}
            icon={Tv}
            change="+3 this month"
            trend="up"
          />
          <StatsCard
            title="Watched"
            value={stats.totalWatched}
            icon={Eye}
            change={`${Math.round((stats.totalWatched / (stats.totalWatched + stats.totalUnwatched)) * 100)}% completion`}
            trend="neutral"
          />
          <StatsCard
            title="Backed Up"
            value={stats.totalBackedUp}
            icon={Database}
            change={`${stats.totalToBackup} remaining`}
            trend="up"
          />
        </div>

        {/* Charts and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span>Media Quality Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">4K Ultra HD</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(stats.total4K / (stats.total4K + stats.total1080p + stats.totalSD)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats.total4K}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">1080p HD</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(stats.total1080p / (stats.total4K + stats.total1080p + stats.totalSD)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats.total1080p}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Standard Definition</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-muted h-2 rounded-full"
                        style={{ width: `${(stats.totalSD / (stats.total4K + stats.total1080p + stats.totalSD)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats.totalSD}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-accent" />
                <span>Backup Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {Math.round((stats.totalBackedUp / (stats.totalBackedUp + stats.totalToBackup)) * 100)}%
                  </div>
                  <p className="text-muted-foreground">of collection backed up</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.totalBackedUp / (stats.totalBackedUp + stats.totalToBackup)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{stats.totalBackedUp} backed up</span>
                  <span>{stats.totalToBackup} pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-accent" />
                <span>Watch Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {Math.round((stats.totalWatched / (stats.totalWatched + stats.totalUnwatched)) * 100)}%
                  </div>
                  <p className="text-muted-foreground">of collection watched</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.totalWatched / (stats.totalWatched + stats.totalUnwatched)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{stats.totalWatched} watched</span>
                  <span>{stats.totalUnwatched} unwatched</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;