import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "@/data/books";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, BookOpen, List } from "lucide-react";
import { useState, useEffect } from "react";

const MOCK_CHAPTERS = [
  "Chapter 1: The Beginning",
  "Chapter 2: The Journey",
  "Chapter 3: The Discovery",
  "Chapter 4: The Challenge",
  "Chapter 5: The Climax",
  "Chapter 6: The Resolution",
];

const MOCK_CONTENT: Record<number, string> = {
  0: `The morning sun cast long shadows across the cobblestone streets as our protagonist stepped out into a world that seemed both familiar and entirely new. There was a crispness to the air that suggested change was coming—a subtle shift in the wind that carried with it the promise of adventure.\n\nFor years, the routine had been the same: wake, work, sleep, repeat. But today was different. Today, a letter had arrived—unexpected, mysterious, bearing a seal that hadn't been seen in generations.\n\nThe envelope was thick, made of a paper that felt almost like cloth. The ink was a deep burgundy, and the handwriting was elegant, deliberate. Every curve of every letter spoke of intention and care. This was not a casual correspondence.\n\n"You have been chosen," it read. "Come to the library at midnight. Tell no one."\n\nAnd so begins our story—not with a bang, but with a whisper. A whisper that would echo through the halls of time and change everything.`,
  1: `The journey began at dawn, with nothing but a worn leather satchel and the mysterious letter tucked safely inside a coat pocket. The road stretched endlessly ahead, winding through valleys painted in golds and greens.\n\nEach step brought new revelations. The world, it seemed, was far larger and more complex than anyone had imagined. Villages appeared where maps showed nothing. Rivers flowed in directions that defied geography. And the people—the people were extraordinary.\n\nAn old woman at a crossroads offered cryptic advice: "Follow the birds, not the road. The road knows where it wants to go, but the birds know where you need to be."\n\nIt made no sense at the time. But nothing about this journey made sense. Not yet.`,
  2: `Deep within the ancient forest, hidden beneath centuries of fallen leaves and forgotten paths, lay something remarkable. A door. Not attached to any wall or structure—just a door, standing alone in a clearing, its wood dark with age.\n\nThe handle was warm to the touch, despite the cool forest air. And when it turned—when the door swung open—what lay beyond was impossible. A library, vast and infinite, its shelves stretching upward into a sky that wasn't a sky but a ceiling painted to look like one.\n\nBooks. Millions of them. Each one humming with a quiet energy, as if the words inside were alive, waiting, breathing.`,
  3: `But the library was not unguarded. From the shadows emerged a figure—tall, cloaked, with eyes that seemed to hold the light of distant stars.\n\n"You've read the letter," the figure said. It was not a question.\n\n"I have."\n\n"Then you know why you're here. The question is: are you ready for what comes next?"\n\nThe challenge was simple in concept but terrifying in execution. To find the one book, among millions, that contained the truth. The truth about everything—about the world, about time, about the very nature of reality itself.`,
  4: `Time lost all meaning inside the library. Hours felt like minutes, and minutes felt like days. The search consumed everything—every thought, every breath, every heartbeat.\n\nAnd then, on a shelf tucked into a forgotten corner, behind a collection of poetry from a civilization that had never existed, it appeared. A small book, barely larger than a hand, bound in a material that shifted color with the light.\n\nThe moment it was opened, the library began to change. The shelves trembled. The painted sky cracked. And through those cracks poured a light so pure, so brilliant, that it was impossible to look away.`,
  5: `In the end, the truth was not what anyone expected. It was not a secret formula or a hidden prophecy. It was simply this: every story ever told, every book ever written, every word ever spoken—they were all connected. Threads in an infinite tapestry.\n\nThe library was not a place. It was a living record of every possibility, every choice, every dream. And the letter had not been an invitation—it had been a reminder. A reminder that stories matter. That words have power. That the act of reading is, in itself, a kind of magic.\n\nAnd with that understanding came peace. The door was still there, standing alone in the clearing. But now it felt like coming home.`,
};

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const book = getBookById(id || "");

  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login?redirect=/reader/" + id);
  }, [isAuthenticated, navigate, id]);

  if (!book || !isAuthenticated) return null;

  const progress = Math.round(((currentChapter + 1) / MOCK_CHAPTERS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur h-12 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/book/${book.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium truncate max-w-[200px]">{book.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowToc(!showToc)}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* TOC sidebar */}
        {showToc && (
          <aside className="w-64 border-r bg-card p-4 shrink-0">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Table of Contents
            </h3>
            <ul className="space-y-1">
              {MOCK_CHAPTERS.map((ch, i) => (
                <li key={i}>
                  <button
                    onClick={() => { setCurrentChapter(i); setShowToc(false); }}
                    className={`text-sm w-full text-left px-2 py-1.5 rounded transition-colors ${
                      i === currentChapter
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {ch}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Reader content */}
        <div className="flex-1 flex flex-col">
          {/* Settings panel */}
          {showSettings && (
            <div className="border-b bg-card p-4">
              <div className="max-w-md mx-auto flex items-center gap-4">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Font Size</span>
                <span className="text-xs">A</span>
                <Slider
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                  min={14}
                  max={28}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-bold">A</span>
              </div>
            </div>
          )}

          <article
            className="flex-1 max-w-2xl mx-auto w-full px-6 py-10"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            <h2 className="text-2xl font-bold mb-6">{MOCK_CHAPTERS[currentChapter]}</h2>
            {(MOCK_CONTENT[currentChapter] || "Content loading...").split("\n\n").map((p, i) => (
              <p key={i} className="mb-4 text-foreground/85">{p}</p>
            ))}
          </article>

          {/* Navigation */}
          <div className="border-t bg-background p-4">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                disabled={currentChapter === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{progress}% complete</div>
                <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentChapter(Math.min(MOCK_CHAPTERS.length - 1, currentChapter + 1))}
                disabled={currentChapter === MOCK_CHAPTERS.length - 1}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
