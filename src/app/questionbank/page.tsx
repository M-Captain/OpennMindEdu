
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SubjectCard } from "@/components/ui/subject-card";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Bookmark,
  LayoutGrid,
  FileText,
  HelpCircle,
  Layers3,
  Circle,
  CheckCircle2,
  MinusCircle,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

// Import local images for subjects (assuming they are in src/app)
import itImage from '../it.png';
import englishLitImage from '../english_lit.png';
import socialSciImage from '../social_sci.png';
import englishCommImage from '../english_comm.png';
import mathImage from '../maths.png';
import scienceImage from '../science.png';
import hindiImage from '../hindi.png';

interface SubjectForQB {
  id: string;
  title: string;
  grade: string;
  imageUrl: StaticImageData | string;
  bgColorClass: string;
  dataAiHint?: string;
  board: string; // e.g., "CBSE"
}

interface Chapter {
  id: string;
  name: string;
  questionCount: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface SelectedSubjectDetails {
  id: string;
  board: string;
  subjectName: string;
  grade: string;
  chapters: Chapter[];
  imageUrl?: StaticImageData | string; // For background
}

const qbSubjects: SubjectForQB[] = [
  { id: 'math-10', title: "Mathematics", grade: "Class 10", board: "CBSE", imageUrl: mathImage, bgColorClass: "bg-teal-100 dark:bg-teal-900/30", dataAiHint: "math formula" },
  { id: 'science-10', title: "Science", grade: "Class 10", board: "CBSE", imageUrl: scienceImage, bgColorClass: "bg-indigo-100 dark:bg-indigo-900/30", dataAiHint: "science atom" },
  { id: 'english-10', title: "English L&L", grade: "Class 10", board: "CBSE", imageUrl: englishLitImage, bgColorClass: "bg-pink-100 dark:bg-pink-900/30", dataAiHint: "english literature book"},
  { id: 'social-sci-10', title: "Social Science", grade: "Class 10", board: "CBSE", imageUrl: socialSciImage, bgColorClass: "bg-orange-100 dark:bg-orange-900/30", dataAiHint: "social science globe" },
  { id: 'hindi-10', title: "Hindi", grade: "Class 10", board: "CBSE", imageUrl: hindiImage, bgColorClass: "bg-red-100 dark:bg-red-900/30", dataAiHint: "hindi script" },
];

const chaptersBySubject: Record<string, Chapter[]> = {
  'math-10': [
    { id: 'real-numbers', name: "Real Numbers", questionCount: 212, status: 'in_progress' },
    { id: 'polynomials', name: "Polynomials", questionCount: 154, status: 'completed' },
    { id: 'linear-equations', name: "Pair of Linear Equations in Two Variables", questionCount: 199, status: 'not_started' },
    { id: 'quadratic-equations', name: "Quadratic Equations", questionCount: 420, status: 'not_started' },
    { id: 'arithmetic-progressions', name: "Arithmetic Progressions", questionCount: 540, status: 'not_started' },
    { id: 'triangles', name: "Triangles", questionCount: 210, status: 'not_started' },
    { id: 'coordinate-geometry', name: "Coordinate Geometry", questionCount: 340, status: 'not_started' },
    { id: 'trigonometry-intro', name: "Introduction to Trigonometry", questionCount: 411, status: 'not_started' },
    { id: 'trigonometry-apps', name: "Some Applications of Trigonometry", questionCount: 269, status: 'not_started' },
  ],
  'science-10': [
    { id: 'chem-reactions', name: "Chemical Reactions and Equations", questionCount: 180, status: 'completed' },
    { id: 'acids-bases', name: "Acids, Bases and Salts", questionCount: 205, status: 'in_progress' },
    { id: 'metals-nonmetals', name: "Metals and Non-metals", questionCount: 230, status: 'not_started' },
  ],
  'english-10': [
     { id: 'letter-god', name: "A Letter to God", questionCount: 50, status: 'completed' },
     { id: 'dust-snow', name: "Dust of Snow & Fire and Ice", questionCount: 35, status: 'in_progress' },
  ],
  'social-sci-10': [
    { id: 'nationalism-india', name: "Nationalism in India", questionCount: 150, status: 'in_progress' },
    { id: 'resources-dev', name: "Resources and Development", questionCount: 120, status: 'not_started' },
  ],
  'hindi-10': [
     { id: 'surdas-pad', name: "सूरदास के पद", questionCount: 60, status: 'completed' },
     { id: 'ram-lakshman', name: "राम-लक्ष्मण-परशुराम संवाद", questionCount: 75, status: 'not_started' },
  ],
};

const getStatusIcon = (status: Chapter['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'in_progress':
      return <MinusCircle className="w-5 h-5 text-yellow-500" />; 
    case 'not_started':
    default:
      return <Circle className="w-5 h-5 text-muted-foreground/70" />;
  }
};


export default function QuestionBankPage() {
  const [selectedSubject, setSelectedSubject] = useState<SelectedSubjectDetails | null>(null);
  const [activeTab, setActiveTab] = useState<string>("questionbank");

  const subjectSelectionRef = useRef<HTMLDivElement>(null);
  const chapterListRef = useRef<HTMLDivElement>(null);
  const chapterHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedSubject && subjectSelectionRef.current) {
      const title = subjectSelectionRef.current.querySelector('.page-title');
      const subtitle = subjectSelectionRef.current.querySelector('.page-subtitle');
      const cards = subjectSelectionRef.current.querySelectorAll('.subject-card-item');
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
      if (title) tl.fromTo(title, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.4 });
      if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
      if (cards.length > 0) tl.fromTo(cards, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.05 }, "-=0.2");
    
    } else if (selectedSubject && chapterListRef.current && chapterHeaderRef.current) {
      const listItems = chapterListRef.current.querySelectorAll('li > a'); // Target the anchor tags inside li for stagger
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
      tl.fromTo(chapterHeaderRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(chapterListRef.current.querySelector('.tabs-list'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4}, "-=0.3")
        .fromTo(listItems, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3 }, "-=0.2");
    }
  }, [selectedSubject]);

  const handleSubjectSelect = (subject: SubjectForQB) => {
    setSelectedSubject({
      id: subject.id,
      board: subject.board,
      subjectName: subject.title,
      grade: subject.grade,
      chapters: chaptersBySubject[subject.id] || [],
      imageUrl: subject.imageUrl, 
    });
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  if (!selectedSubject) {
    return (
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main ref={subjectSelectionRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <div> {/* Wrapper for GSAP targeting */}
              <div className="flex items-center gap-3 mb-6 page-title">
                 <BookOpen className="w-7 h-7 text-primary" />
                 <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Question Bank
                 </h1>
              </div>
              <h2
                className="text-xl md:text-2xl font-semibold text-foreground mb-6 page-subtitle"
              >
                Select a Subject
              </h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {qbSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    className="cursor-pointer subject-card-item"
                  >
                    <SubjectCard
                      title={subject.title}
                      imageUrl={subject.imageUrl}
                      bgColorClass={subject.bgColorClass}
                      className="w-full h-[280px] md:h-[300px]" 
                      data-ai-hint={subject.dataAiHint || subject.title.toLowerCase().split(" ")[0]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Chapter List View
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main 
          className="flex-1 overflow-y-auto bg-muted/20 dark:bg-zinc-900/30"
        >
          {/* Background and Header Section */}
          <div
            ref={chapterHeaderRef}
            className="relative p-6 md:p-8 pt-6 md:pt-8 bg-gradient-to-br from-primary/20 to-background dark:from-primary/10 dark:to-zinc-900/50 min-h-[200px] md:min-h-[220px] flex flex-col justify-end"
          >
             {selectedSubject.imageUrl && (
               <Image
                  src={selectedSubject.imageUrl}
                  alt={`${selectedSubject.subjectName} background`}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 z-[-1] opacity-10 dark:opacity-5 blur-sm"
                  priority
               />
             )}
            <div className="container mx-auto max-w-5xl relative z-10">
              <Button variant="ghost" onClick={handleBackToSubjects} className="mb-3 text-sm text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 px-2 py-1 h-auto -ml-2">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Subjects
              </Button>
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <span>{selectedSubject.board}</span>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span>{selectedSubject.subjectName} {selectedSubject.grade}</span>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {selectedSubject.subjectName} {selectedSubject.grade}
                </h1>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:scale-110 active:scale-95">
                  <Bookmark className="w-5 h-5" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs and Content Section */}
          <div ref={chapterListRef} className="container mx-auto max-w-5xl p-0 md:p-0 -mt-2 md:-mt-4 relative z-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center bg-transparent py-2 tabs-list">
                <TabsList className="bg-card/70 dark:bg-zinc-800/70 backdrop-blur-md border border-border/20 shadow-md rounded-lg px-1.5 py-1 h-auto">
                  <TabsTrigger value="all" className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 dark:hover:bg-muted/30 data-[state=active]:shadow-sm rounded-md">
                    <LayoutGrid className="w-4 h-4 mr-1.5" /> All
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 dark:hover:bg-muted/30 data-[state=active]:shadow-sm rounded-md">
                    <FileText className="w-4 h-4 mr-1.5" /> Notes
                  </TabsTrigger>
                  <TabsTrigger value="questionbank" className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 dark:hover:bg-muted/30 data-[state=active]:shadow-sm rounded-md">
                    <HelpCircle className="w-4 h-4 mr-1.5" /> Questionbank
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 dark:hover:bg-muted/30 data-[state=active]:shadow-sm rounded-md">
                    <Layers3 className="w-4 h-4 mr-1.5" /> Flashcards
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="questionbank" className="mt-0"> 
                <div
                  className="bg-card dark:bg-zinc-800/80 border border-border/20 rounded-xl shadow-xl backdrop-blur-md"
                >
                  {selectedSubject.chapters.length > 0 ? (
                    <ul className="divide-y divide-border/10 dark:divide-border/5">
                      {selectedSubject.chapters.map((chapter, index) => (
                        <li key={chapter.id}>
                          <Link href={`/questionbank/${selectedSubject.id}/${chapter.id}`} passHref legacyBehavior>
                            <a
                              className="flex items-center justify-between p-4 hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors duration-150 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                            >
                              <div className="flex items-center gap-3">
                                {getStatusIcon(chapter.status)}
                                <span className="text-sm font-medium text-foreground">{chapter.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {chapter.questionCount} questions
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
                              </div>
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No chapters available for this subject yet.
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="all">
                 <Card className="bg-card dark:bg-zinc-800/80 border border-border/20 rounded-xl shadow-xl backdrop-blur-md p-6">
                   <p className="text-muted-foreground">"All" content coming soon.</p>
                 </Card>
              </TabsContent>
              <TabsContent value="notes">
                 <Card className="bg-card dark:bg-zinc-800/80 border border-border/20 rounded-xl shadow-xl backdrop-blur-md p-6">
                    <p className="text-muted-foreground">"Notes" content coming soon.</p>
                 </Card>
              </TabsContent>
              <TabsContent value="flashcards">
                 <Card className="bg-card dark:bg-zinc-800/80 border border-border/20 rounded-xl shadow-xl backdrop-blur-md p-6">
                    <p className="text-muted-foreground">"Flashcards" content coming soon.</p>
                 </Card>
              </TabsContent>
            </Tabs>
          </div>
           <div className="pb-8"></div> 
        </main>
      </div>
    </div>
  );
}
