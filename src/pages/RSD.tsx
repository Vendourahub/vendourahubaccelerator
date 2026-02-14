// RSD Page - Revenue System Document (unlocked at Stage 4)
import { Link } from "react-router";
import { getFounderData } from "../lib/auth";
import { founderService } from "../lib/founderService";

interface RSDSection {
  id: string;
  title: string;
  description: string;
  content: string;
  wordCount: number;
}

export default function RSD() {
  const [founder, setFounder] = useState<any>(null);
  const [sections, setSections] = useState<RSDSection[]>([]);
  const [status, setStatus] = useState<"draft" | "submitted" | "approved" | "revision">("draft");
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    loadFounderData();
  }, []);

  const loadFounderData = async () => {
    try {
      const storedFounder = getFounderData();
      if (storedFounder) {
        setFounder(storedFounder);
      }

      // Load live data from Supabase
      const profile = await founderService.getMyProfile();
      if (profile) {
        setFounder(profile);
      }

      // Initialize RSD sections
      initializeSections();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const initializeSections = () => {
    const defaultSections: RSDSection[] = [
      {
        id: "overview",
        title: "1. Revenue Tactic Overview",
        description: "What is your proven revenue tactic? Name it and describe it in 2-3 sentences.",
        content: "",
        wordCount: 0
      },
      {
        id: "audience",
        title: "2. Target Audience",
        description: "Who exactly are you targeting? Be specific about demographics, pain points, and buying triggers.",
        content: "",
        wordCount: 0
      },
      {
        id: "process",
        title: "3. Step-by-Step Process",
        description: "Document your exact process from first contact to payment. Include all steps, timing, and sequences.",
        content: "",
        wordCount: 0
      },
      {
        id: "scripts",
        title: "4. Scripts & Templates",
        description: "Paste the exact scripts, email templates, or messaging you use. Include variations that work.",
        content: "",
        wordCount: 0
      },
      {
        id: "tools",
        title: "5. Tools & Resources",
        description: "List all tools, platforms, and resources needed to execute this tactic.",
        content: "",
        wordCount: 0
      },
      {
        id: "metrics",
        title: "6. Key Metrics",
        description: "What numbers do you track? Include conversion rates, average deal size, and $ per hour.",
        content: "",
        wordCount: 0
      },
      {
        id: "obstacles",
        title: "7. Common Obstacles & Solutions",
        description: "What problems did you encounter? How did you solve them? Help future you avoid mistakes.",
        content: "",
        wordCount: 0
      },
      {
        id: "optimization",
        title: "8. Optimization Notes",
        description: "What makes this tactic work better? What have you learned from testing?",
        content: "",
        wordCount: 0
      }
    ];

    setSections(defaultSections);
  };

  const handleContentChange = (sectionId: string, content: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content,
          wordCount: content.trim().split(/\s+/).filter(w => w.length > 0).length
        };
      }
      return section;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In production, save to revenue_system_documents table
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      alert("RSD saved successfully!");
    } catch (error) {
      console.error("Error saving RSD:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all sections have content
    const emptySections = sections.filter(s => s.wordCount < 50);
    if (emptySections.length > 0) {
      alert(`Please complete all sections. ${emptySections.length} section(s) need more detail (minimum 50 words each).`);
      return;
    }

    const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
    if (totalWords < 1000) {
      alert(`Your RSD needs more detail. Current: ${totalWords} words. Minimum: 1000 words.`);
      return;
    }

    setLoading(true);
    try {
      // In production, submit for mentor review
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("submitted");
      alert("RSD submitted for mentor review! You'll receive feedback within 48 hours.");
    } catch (error) {
      console.error("Error submitting RSD:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!founder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStage = founder.current_stage || founder.currentStage || 1;
  const isLocked = currentStage < 4;
  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
  const completionPercent = Math.min(100, (totalWords / 1000) * 100);

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
          <Lock className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Revenue System Document Locked</h1>
          <p className="text-lg text-neutral-600 mb-8">
            The RSD unlocks at Stage 4: Revenue System.<br />
            You're currently at Stage {currentStage}.
          </p>
          <div className="space-y-3 text-left max-w-md mx-auto mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-neutral-700">Complete Stages 1-3 to unlock RSD</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
              <p className="text-neutral-500">Stage 4: Document your revenue system</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
              <p className="text-neutral-500">Get mentor approval on your RSD</p>
            </div>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            View Stage Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Revenue System Document (RSD)</h1>
            <p className="text-neutral-600">
              Document your proven revenue tactic so anyone can replicate your success
            </p>
          </div>
          <div className="text-right">
            <div className={`text-sm mb-1 ${
              status === 'approved' ? 'text-green-600' :
              status === 'submitted' ? 'text-blue-600' :
              status === 'revision' ? 'text-orange-600' :
              'text-neutral-600'
            }`}>
              {status === 'approved' ? '✓ Approved' :
               status === 'submitted' ? 'Under Review' :
               status === 'revision' ? 'Needs Revision' :
               'Draft'}
            </div>
            <div className="text-2xl font-bold">{totalWords} words</div>
            <div className="text-xs text-neutral-500">Min: 1000 words</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-600">Completion</span>
            <span className="font-medium">{completionPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {lastSaved && (
          <div className="mt-4 text-sm text-neutral-600">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Status Banner */}
      {status === "revision" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 mb-2">Mentor Feedback: Revision Required</h3>
              <p className="text-orange-800 mb-3">
                Your mentor has requested revisions before approval. Review their feedback below and update your RSD.
              </p>
              <div className="bg-white p-4 rounded-lg border border-orange-200 text-sm text-neutral-900">
                <strong>Mentor Notes:</strong> Great start! Need more detail in sections 3 & 4. Add specific numbers and examples.
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "submitted" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">RSD Submitted for Review</h3>
              <p className="text-blue-800">
                Your mentor will review your RSD within 48 hours. You'll receive feedback via email and in your dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RSD Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <p className="text-neutral-600 text-sm">{section.description}</p>
              <div className="text-xs text-neutral-500 mt-2">
                {section.wordCount} words {section.wordCount < 50 && <span className="text-orange-600">(need 50 minimum)</span>}
              </div>
            </div>
            <textarea
              value={section.content}
              onChange={(e) => handleContentChange(section.id, e.target.value)}
              disabled={status === "submitted" || status === "approved"}
              className="w-full border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-lg min-h-48 transition-colors disabled:bg-neutral-50 disabled:cursor-not-allowed"
              placeholder={`Write your ${section.title.toLowerCase()} here...`}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {status === "draft" || status === "revision" ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-neutral-300 text-neutral-900 rounded-lg hover:border-neutral-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || totalWords < 1000}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
          <div className="text-center text-sm text-neutral-600 mt-4">
            Save your progress anytime. Submit when all sections are complete.
          </div>
        </div>
      ) : null}

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">RSD Writing Guidelines</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✓ Write for someone who knows nothing about your tactic</li>
              <li>✓ Include specific examples, numbers, and screenshots</li>
              <li>✓ Be detailed enough that you could hand this to a VA and they could execute</li>
              <li>✓ Document what works AND what doesn't work</li>
              <li>✓ Include actual scripts/templates you use word-for-word</li>
              <li>✓ Minimum 1000 words total across all sections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}