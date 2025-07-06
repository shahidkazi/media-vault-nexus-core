import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Database, Settings as SettingsIcon, FileJson, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = (format: 'json' | 'csv' | 'xlsx') => {
    // Mock export - would generate actual file
    toast({
      title: "Export Started",
      description: `Exporting collection data as ${format.toUpperCase()}`,
    });
  };

  const handleImport = () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }

    // Mock import - would process actual file
    toast({
      title: "Import Started",
      description: `Processing ${importFile.name}`,
    });
    setImportFile(null);
  };

  const handleBackup = () => {
    toast({
      title: "Backup Created",
      description: "Full database backup has been created",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Database Restored",
      description: "Collection has been restored from backup",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your Media Vault preferences and data</p>
      </div>

      <Tabs defaultValue="import-export" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface-elevated border border-border">
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export */}
            <Card className="bg-surface-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-accent" />
                  <span>Export Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export your entire media collection to various formats
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleExport('json')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                  
                  <Button 
                    onClick={() => handleExport('csv')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  
                  <Button 
                    onClick={() => handleExport('xlsx')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel (XLSX)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Import */}
            <Card className="bg-surface-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-accent" />
                  <span>Import Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import media data from JSON, CSV, or Excel files
                </p>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="import-file">Select File</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".json,.csv,.xlsx"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="bg-surface border-border"
                    />
                  </div>
                  
                  {importFile && (
                    <p className="text-sm text-foreground">
                      Selected: {importFile.name}
                    </p>
                  )}
                  
                  <Button 
                    onClick={handleImport}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!importFile}
                  >
                    Import Data
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Supported formats:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>JSON: Full media data with all attributes</li>
                    <li>CSV: Basic media information</li>
                    <li>XLSX: Excel spreadsheet format</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup */}
            <Card className="bg-surface-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-accent" />
                  <span>Database Backup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a complete backup of your Media Vault database
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Last Backup</span>
                      <span className="text-sm text-muted-foreground">Never</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Backup Size</span>
                      <span className="text-sm text-muted-foreground">-</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleBackup}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Create Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restore */}
            <Card className="bg-surface-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-accent" />
                  <span>Database Restore</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Restore your database from a previous backup
                </p>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="backup-file">Select Backup File</Label>
                    <Input
                      id="backup-file"
                      type="file"
                      accept=".backup,.json"
                      className="bg-surface border-border"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleRestore}
                    className="w-full"
                    variant="outline"
                  >
                    Restore Database
                  </Button>
                </div>
                
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-xs text-destructive">
                    Warning: Restoring will replace all current data. Make sure to backup first.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-accent" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-quality">Default Quality</Label>
                  <select 
                    id="default-quality"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground"
                  >
                    <option value="4K">4K Ultra HD</option>
                    <option value="1080p">1080p HD</option>
                    <option value="720p">720p HD</option>
                    <option value="SD">Standard Definition</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="items-per-page">Items per Page</Label>
                  <select 
                    id="items-per-page"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="96">96</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tmdb-api">TMDB API Key</Label>
                  <Input
                    id="tmdb-api"
                    type="password"
                    placeholder="Enter your TMDB API key"
                    className="bg-surface border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for automatic metadata fetching
                  </p>
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;