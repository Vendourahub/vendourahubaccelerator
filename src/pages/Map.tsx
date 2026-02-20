// Map Page - Stage progression and $ per hour tracking
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Award, CheckCircle, Target, Lock } from "lucide-react";
import { getFounderData } from "../lib/auth";
import { wrappedFounderService as founderService } from "../lib/founderServiceWrapper";
import { formatCurrency } from "../lib/currency";

interface StageData {
  stage: number;
  name: string;
  description: string;
  requirements: string[];
  status: "locked" | "in-progress" | "complete";
  dollarPerHour?: number;
  revenueTarget?: number;
  currentRevenue?: number;
}

export default function Map() {
  const [founder, setFounder] = useState<any>(null);
  const [stages, setStages] = useState<StageData[]>([]);
  const [loading, setLoading] = useState(true);

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
        buildStageData(profile);
      } else if (storedFounder) {
        buildStageData(storedFounder);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const buildStageData = (founderData: any) => {
    const currentStage = founderData.current_stage || founderData.currentStage || 1;
    const baseline = founderData.baseline_revenue_30d || founderData.revenueBaseline30d || 0;

    const stageList: StageData[] = [
      {
        stage: 1,
        name: "Revenue Baseline",
        description: "Establish your current revenue capability",
        requirements: [
          "Complete 2 weeks of commits & reports",
          "Establish baseline $ per hour",
          "No missed deadlines"
        ],
        status: currentStage > 1 ? "complete" : currentStage === 1 ? "in-progress" : "locked",
        dollarPerHour: currentStage >= 1 ? 15000 : undefined,
        revenueTarget: baseline,
        currentRevenue: baseline
      },
      {
        stage: 2,
        name: "Revenue Diagnosis",
        description: "Test 3 tactics, identify best $ per hour",
        requirements: [
          "Test 3 different revenue tactics (3 weeks)",
          "Calculate $ per hour for each tactic",
          "Identify winning tactic (highest $/hr)",
          "Complete tactic comparison analysis"
        ],
        status: currentStage > 2 ? "complete" : currentStage === 2 ? "in-progress" : "locked",
        dollarPerHour: currentStage >= 2 ? 25000 : undefined,
        revenueTarget: baseline * 1.5,
        currentRevenue: currentStage >= 2 ? baseline * 1.3 : 0
      },
      {
        stage: 3,
        name: "Revenue Amplification",
        description: "2x revenue from best tactic",
        requirements: [
          "Focus exclusively on winning tactic",
          "2x your best $ per hour from Stage 2",
          "Maintain execution consistency",
          "Document what's working"
        ],
        status: currentStage > 3 ? "complete" : currentStage === 3 ? "in-progress" : "locked",
        dollarPerHour: currentStage >= 3 ? 50000 : undefined,
        revenueTarget: baseline * 2,
        currentRevenue: currentStage >= 3 ? baseline * 1.8 : 0
      },
      {
        stage: 4,
        name: "Revenue System",
        description: "Document repeatable process",
        requirements: [
          "Write Revenue System Document",
          "Define exact playbook for your tactic",
          "Include scripts, templates, tools",
          "Get mentor approval on RSD"
        ],
        status: currentStage > 4 ? "complete" : currentStage === 4 ? "in-progress" : "locked",
        dollarPerHour: currentStage >= 4 ? 75000 : undefined,
        revenueTarget: baseline * 3,
        currentRevenue: currentStage >= 4 ? baseline * 2.5 : 0
      },
      {
        stage: 5,
        name: "Revenue Scale",
        description: "Validate 4x baseline revenue",
        requirements: [
          "Achieve 4x baseline revenue",
          "Maintain high $ per hour",
          "Prove system is repeatable",
          "Graduate from program"
        ],
        status: currentStage > 5 ? "complete" : currentStage === 5 ? "in-progress" : "locked",
        dollarPerHour: currentStage >= 5 ? 100000 : undefined,
        revenueTarget: baseline * 4,
        currentRevenue: currentStage >= 5 ? baseline * 4 : 0
      }
    ];

    setStages(stageList);
  };

  if (loading || !founder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading stage map...</p>
        </div>
      </div>
    );
  }

  const currentStage = founder.current_stage || founder.currentStage || 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Stage Map</h1>
            <p className="text-neutral-600">
              Track your progression through the 5 stages from baseline to 4x revenue
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600 mb-1">Current Position</div>
            <div className="text-3xl font-bold">Stage {currentStage}</div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Baseline Revenue</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(founder.baseline_revenue_30d || founder.revenueBaseline30d || 0)}
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Current $ per Hour</div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(stages[currentStage - 1]?.dollarPerHour || 0)}
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">Target Revenue</div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(stages[currentStage - 1]?.revenueTarget || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Cards */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <StageCard
            key={stage.stage}
            stage={stage}
            isCurrent={stage.stage === currentStage}
          />
        ))}
      </div>

      {/* Bottom Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">How Stage Progression Works</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✓ Stages unlock sequentially - complete requirements to advance</li>
              <li>✓ Each stage requires meeting revenue targets + $ per hour goals</li>
              <li>✓ Missing deadlines prevents stage advancement</li>
              <li>✓ RSD (Revenue System Document) required to reach Stage 4</li>
              <li>✓ Graduation requires completing Stage 5 (4x baseline revenue)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageCard({ stage, isCurrent }: { stage: StageData; isCurrent: boolean }) {
  const statusConfig = {
    complete: {
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      textColor: "text-green-900"
    },
    "in-progress": {
      icon: <Target className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      textColor: "text-blue-900"
    },
    locked: {
      icon: <Lock className="w-6 h-6" />,
      color: "text-neutral-400",
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      textColor: "text-neutral-600"
    }
  };

  const config = statusConfig[stage.status];

  return (
    <div
      className={`bg-white rounded-xl border-2 ${
        isCurrent ? "border-neutral-900 shadow-lg" : config.border
      } p-6 transition-all ${stage.status !== "locked" ? "hover:shadow-md" : "opacity-70"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`${config.color}`}>{config.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold">Stage {stage.stage}</h2>
              {isCurrent && (
                <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold rounded-full">
                  CURRENT
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1">{stage.name}</h3>
            <p className="text-neutral-600">{stage.description}</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {stage.status !== "locked" && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-neutral-50 rounded-lg">
          <div>
            <div className="text-xs text-neutral-600 mb-1">$ per Hour</div>
            <div className="text-lg font-bold">
              {stage.dollarPerHour ? formatCurrency(stage.dollarPerHour) : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-600 mb-1">Target Revenue</div>
            <div className="text-lg font-bold">
              {stage.revenueTarget ? formatCurrency(stage.revenueTarget) : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-600 mb-1">Current Revenue</div>
            <div className="text-lg font-bold">
              {stage.currentRevenue ? formatCurrency(stage.currentRevenue) : "—"}
            </div>
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-neutral-900 mb-3">Requirements:</div>
        {stage.requirements.map((req, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                stage.status === "complete"
                  ? "border-green-600 bg-green-600"
                  : "border-neutral-300"
              }`}
            >
              {stage.status === "complete" && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span
              className={`text-sm ${
                stage.status === "complete" ? "text-neutral-600 line-through" : "text-neutral-900"
              }`}
            >
              {req}
            </span>
          </div>
        ))}
      </div>

      {/* Special RSD Link for Stage 4 */}
      {stage.stage === 4 && stage.status === "in-progress" && (
        <Link
          to="/rsd"
          className="mt-4 block w-full text-center py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
        >
          Work on Revenue System Document →
        </Link>
      )}
    </div>
  );
}