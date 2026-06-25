import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useListBots, useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SiPython, SiTypescript, SiDiscord, SiGithub, SiPostgresql } from "react-icons/si";
import { FaJava, FaTerminal, FaServer, FaCode } from "react-icons/fa";
import { FiExternalLink, FiMail, FiSend } from "react-icons/fi";

const AnimatedSection = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <HeroSection />
      <AboutSection />
      <BotsSection />
      <ContactSection />
      
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Nirmit. All rights reserved.</p>
        <p className="mt-1 flex items-center justify-center gap-2">
          <SiDiscord className="text-primary" /> @Nirmit1950
        </p>
      </footer>
    </div>
  );
}

function HeroSection() {
  const text = "Discord Bot Developer";
  
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-16 px-4 md:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-purple-500/10 blur-[100px] mix-blend-screen" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for new projects
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tighter mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="block text-primary">Nirmit.</span>
          <span className="block text-foreground/80 text-4xl md:text-5xl lg:text-6xl mt-2">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.03, duration: 0.3 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          I architect production-grade Discord communities. 
          Specializing in powerful, scalable bots written in Python and Java.
        </motion.p>

        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium" asChild>
            <a href="#bots">View My Work</a>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border hover:bg-secondary" asChild>
            <a href="#contact">
              <SiDiscord className="mr-2 h-5 w-5 text-[#5865F2]" />
              Connect on Discord
            </a>
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}

function AboutSection() {
  const skills = [
    { name: "Python", icon: <SiPython className="text-[#3776AB]" /> },
    { name: "Java", icon: <FaJava className="text-[#007396]" /> },
    { name: "Discord.py", icon: <SiDiscord className="text-primary" /> },
    { name: "JDA", icon: <FaCode className="text-[#f89820]" /> },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
    { name: "Linux/DevOps", icon: <FaTerminal className="text-foreground" /> },
  ];

  return (
    <AnimatedSection id="about" className="py-24 px-4 md:px-8 bg-secondary/30 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6 flex items-center gap-3">
            <FaTerminal className="text-primary" /> System.about()
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              I don't just write scripts; I build systems. My focus is on creating resilient, high-performance Discord applications that handle thousands of events seamlessly.
            </p>
            <p>
              Whether it's complex moderation pipelines, distributed music nodes, intricate ticket systems, or alliance management tools, I write code that works, scales, and stays maintainable.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="text-4xl mb-3">{skill.icon}</div>
              <span className="font-mono text-sm font-medium">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function BotsSection() {
  const { data: bots = [], isLoading } = useListBots();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'development': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="bots" className="py-24 px-4 md:px-8 relative min-h-[50vh]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-mono font-bold">Featured Bots</h2>
            <div className="h-[1px] flex-1 bg-border/60 ml-4" />
          </div>
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[300px] rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot, idx) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl border border-border group-hover:scale-110 transition-transform duration-300">
                        {bot.iconEmoji || "🤖"}
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-background/50 border border-border text-xs font-mono backdrop-blur-md">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)} ${bot.status === 'active' ? 'animate-pulse' : ''}`} />
                        <span className="capitalize">{bot.status}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-mono group-hover:text-primary transition-colors">{bot.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground line-clamp-3 h-[4.5rem]">
                      {bot.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          {bot.language === 'Python' ? <SiPython className="mr-1" /> : bot.language === 'Java' ? <FaJava className="mr-1" /> : null}
                          {bot.language}
                        </Badge>
                        {bot.features?.map(feature => (
                          <Badge key={feature} variant="outline" className="border-border">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      {bot.inviteUrl && (
                        <Button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20" asChild>
                          <a href={bot.inviteUrl} target="_blank" rel="noreferrer">
                            Invite Bot <FiExternalLink className="ml-2" />
                          </a>
                        </Button>
                      )}
                      {bot.githubUrl && (
                        <Button variant="outline" size="icon" className="border-border hover:bg-secondary" asChild>
                          <a href={bot.githubUrl} target="_blank" rel="noreferrer">
                            <SiGithub className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", discordHandle: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate({ data: formData }, {
      onSuccess: () => {
        setSubmitted(true);
        toast({ title: "Message sent", description: "I'll get back to you shortly." });
      },
      onError: () => {
        toast({ title: "Failed to send", description: "Please try again later.", variant: "destructive" });
      }
    });
  };

  return (
    <AnimatedSection id="contact" className="py-24 px-4 md:px-8 bg-secondary/20 relative">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6">Let's Build.</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Need a custom solution for your server? Looking for an experienced developer for a large-scale project? Drop a message.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                <SiDiscord className="text-primary text-xl" />
              </div>
              <div>
                <div className="font-medium text-foreground">Discord</div>
                <div className="font-mono text-sm">@Nirmit1950</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                <FiMail className="text-primary text-xl" />
              </div>
              <div>
                <div className="font-medium text-foreground">Email</div>
                <div className="font-mono text-sm">hello@nirmit.dev</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-card border-border shadow-2xl shadow-primary/5">
          <CardContent className="p-6 md:p-8">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-mono">Transmission Complete</h3>
                <p className="text-muted-foreground">Your message has been securely delivered to my terminal.</p>
                <Button variant="outline" className="mt-8" onClick={() => { setSubmitted(false); setFormData({name: "", email: "", subject: "", discordHandle: "", message: ""})}}>
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                    <Label>Name</Label>
                    <Input required className="bg-background/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                    <Label>Email</Label>
                    <Input required type="email" className="bg-background/50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                    <Label>Subject <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input className="bg-background/50" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
                    <Label>Discord Tag <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input className="bg-background/50" placeholder="@username" value={formData.discordHandle} onChange={e => setFormData({...formData, discordHandle: e.target.value})} />
                  </motion.div>
                </div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-2 pb-2">
                  <Label>Message</Label>
                  <Textarea required className="min-h-[120px] bg-background/50" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={submitContact.isPending}>
                    {submitContact.isPending ? "Transmitting..." : (
                      <>Execute Send <FiSend className="ml-2" /></>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedSection>
  );
}