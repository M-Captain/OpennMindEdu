
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Send } from "lucide-react";
import { motion } from 'framer-motion'; // Import motion
import { gsap } from 'gsap'; // Import GSAP

export default function BugReportPage() {
  const [bugDescription, setBugDescription] = React.useState("");
  const pageRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
    tl.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(cardRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.3");
  }, []);

  const handleBugSubmit = () => {
    console.log("Bug report submitted:", bugDescription);
    // Add logic to send the bug report (e.g., API call)
    setBugDescription(""); // Clear textarea after submission
    // Potentially show a success message
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main ref={pageRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-background">
          <h1
            ref={titleRef}
            className="text-3xl font-bold text-foreground"
          >
            Report a Bug
          </h1>
          <div ref={cardRef}>
            <Card className="bg-muted/50 dark:bg-card/80 border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bug className="w-5 h-5 text-destructive" /> {/* Set bug icon color to destructive */}
                  <span>Describe the Issue</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Help us improve OpennMind by reporting any bugs or issues you encounter.
                  Please be as detailed as possible.
                </p>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Bug Description</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    What happened? What did you expect to happen? Any steps to reproduce the issue?
                  </p>
                  <Textarea
                    placeholder="Enter bug description here..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    className="mb-3 min-h-[150px] bg-background dark:bg-input"
                  />
                  <Button
                    onClick={handleBugSubmit}
                    disabled={!bugDescription.trim()}
                    className="hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
