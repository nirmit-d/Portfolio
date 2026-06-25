import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useListBots, useCreateBot, useUpdateBot, useDeleteBot, useListContactMessages, useVerifyAdmin, getListBotsQueryKey, getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SiPython, SiTypescript, SiJavascript, SiDiscord } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { FiTrash2, FiEdit2, FiLogOut, FiPlus } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const verifyAdmin = useVerifyAdmin();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAdmin.mutate({ data: { password } }, {
      onSuccess: (data) => {
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("adminToken", data.token);
          toast({ title: "Logged in successfully" });
        } else {
          toast({ title: "Invalid password", variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: "Invalid password", variant: "destructive" });
      }
    });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Admin Access</CardTitle>
            <CardDescription className="text-center">Enter your password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card"
                />
              </div>
              <Button type="submit" className="w-full" disabled={verifyAdmin.isPending}>
                {verifyAdmin.isPending ? "Verifying..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono text-primary font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            View Site
          </Link>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <FiLogOut className="mr-2" /> Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bots" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bots" className="mt-6 space-y-8">
          <BotManager token={token} />
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6 space-y-8">
          <MessageManager token={token} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BotManager({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: bots = [], isLoading } = useListBots({ request: { headers: { Authorization: `Bearer ${token}` } }});
  
  const createBot = useCreateBot({ request: { headers: { Authorization: `Bearer ${token}` } }});
  const deleteBot = useDeleteBot({ request: { headers: { Authorization: `Bearer ${token}` } }});
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "", description: "", language: "Python", features: "", status: "active", inviteUrl: "", githubUrl: "", iconEmoji: "", sortOrder: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = formData.features.split(",").map(f => f.trim()).filter(Boolean);
    
    createBot.mutate({
      data: {
        ...formData,
        features: featuresList,
        status: formData.status as any,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Bot added successfully" });
        queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
        setFormData({ name: "", description: "", language: "Python", features: "", status: "active", inviteUrl: "", githubUrl: "", iconEmoji: "", sortOrder: 0 });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteBot.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Bot deleted" });
          queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="grid md:grid-cols-[350px_1fr] gap-8">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Add New Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Icon Emoji</Label>
              <Input placeholder="🤖" value={formData.iconEmoji} onChange={e => setFormData({...formData, iconEmoji: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.language} onValueChange={v => setFormData({...formData, language: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Features (comma separated)</Label>
              <Input placeholder="Moderation, Tickets, Music" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Invite URL</Label>
              <Input value={formData.inviteUrl} onChange={e => setFormData({...formData, inviteUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
            </div>
            <Button type="submit" className="w-full" disabled={createBot.isPending}>
              {createBot.isPending ? "Saving..." : "Add Bot"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground p-8">Loading bots...</div>
        ) : bots.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">No bots found.</div>
        ) : (
          bots.map(bot => (
            <Card key={bot.id} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{bot.iconEmoji || "🤖"}</span>
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{bot.language}</Badge>
                        <Badge variant={bot.status === 'active' ? 'default' : bot.status === 'development' ? 'outline' : 'secondary'} className="text-xs">
                          {bot.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(bot.id)} disabled={deleteBot.isPending}>
                      <FiTrash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{bot.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function MessageManager({ token }: { token: string }) {
  const { data: messages = [], isLoading } = useListContactMessages({ request: { headers: { Authorization: `Bearer ${token}` } }});

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center text-muted-foreground p-8">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">No messages found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {messages.map(msg => (
            <Card key={msg.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{msg.name}</CardTitle>
                    <CardDescription className="flex flex-col mt-1">
                      <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                      {msg.discordHandle && <span className="text-xs mt-1 text-muted-foreground flex items-center gap-1"><SiDiscord /> {msg.discordHandle}</span>}
                    </CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </CardHeader>
              <CardContent>
                {msg.subject && <div className="font-semibold text-sm mb-2">{msg.subject}</div>}
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">{msg.message}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}