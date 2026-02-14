import { Link } from "react-router";
import { Lock, CheckCircle } from "lucide-react";

export default function RefinedMap() {
  const currentStage = 1;
  const currentWeek = 3;
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="font-semibold">Vendoura</div>
          <div className="text-sm text-neutral-600">Revenue Map</div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-8 py-12">
        <Link to="/refined" className="text-sm text-neutral-600 hover:text-black mb-8 inline-block">← Back to Refined Index</Link>
        
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Revenue Map</div>
          <h1 className="text-3xl mb-6">Your Progression Through 5 Stages</h1>
          
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-neutral-600">Current Week:</span>
              <span className="ml-2 font-medium">{currentWeek} of 12</span>
            </div>
            <div>
              <span className="text-neutral-600">Current Stage:</span>
              <span className="ml-2 font-medium">Stage {currentStage}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Stage 1 */}
          <StageCard 
            number={1}
            name="Revenue Baseline"
            weeks="Weeks 1-2"
            status="in-progress"
            objective="Establish current revenue capability"
            requirements={[
              "Log all existing revenue sources",
              "Document current sales process",
              "Submit 2 consecutive weekly reports with evidence",
              "Calculate weekly revenue average"
            ]}
            progress="1/2 reports complete"
            unlockCondition="2 valid weekly reports submitted"
          />
          
          {/* Stage 2 */}
          <StageCard 
            number={2}
            name="Revenue Diagnosis"
            weeks="Weeks 3-4"
            status="locked"
            objective="Identify highest-leverage revenue action"
            requirements={[
              "Test 3 different revenue tactics",
              "Report $ per hour for each tactic",
              "Identify single best-performing action",
              "Get mentor approval on diagnosis"
            ]}
            progress="Not started"
            unlockCondition="Stage 1 complete (2 valid reports)"
            lockReason="Waiting for Stage 1 completion"
          />
          
          {/* Stage 3 */}
          <StageCard 
            number={3}
            name="Revenue Amplification"
            weeks="Weeks 5-8"
            status="locked"
            objective="2x revenue from best tactic"
            requirements={[
              "Commit only to diagnosed best tactic",
              "Weekly revenue must show upward trend",
              "Document what's working (becomes playbook)",
              "Hit 2x baseline by week 8"
            ]}
            progress="Not started"
            unlockCondition="Stage 2 complete (3 tactics tested + mentor approval)"
            lockReason="Waiting for Stage 2 unlock"
          />
          
          {/* Stage 4 */}
          <StageCard 
            number={4}
            name="Revenue System"
            weeks="Weeks 9-11"
            status="locked"
            objective="Make it repeatable without you"
            requirements={[
              "Document every step of revenue process",
              "Test process with someone else executing",
              "Build Revenue System Document (RSD)",
              "Revenue continues during documentation"
            ]}
            progress="Not started"
            unlockCondition="Stage 3 complete (2x revenue achieved)"
            lockReason="Waiting for Stage 3 unlock"
          />
          
          {/* Stage 5 */}
          <StageCard 
            number={5}
            name="Revenue Scale"
            weeks="Week 12"
            status="locked"
            objective="Validation for next phase"
            requirements={[
              "Demonstrate 4x baseline revenue",
              "Show 3 consecutive weeks of sustainability",
              "Present RSD to cohort",
              "Exit interview with mentor"
            ]}
            progress="Not started"
            unlockCondition="Stage 4 complete (RSD complete + revenue maintained)"
            lockReason="Waiting for Stage 4 unlock"
          />
        </div>
        
        <div className="mt-12 bg-white border border-neutral-200 p-8 rounded-sm">
          <div className="font-medium mb-4">How Stages Unlock</div>
          <div className="text-sm text-neutral-600 space-y-2">
            <div>• Stages unlock automatically when requirements are met</div>
            <div>• Complete requirements = next stage becomes visible</div>
            <div>• Locked stages show what's needed to unlock them</div>
            <div>• You cannot skip stages</div>
            <div>• Stages unlock based on completion, not time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageCard({
  number,
  name,
  weeks,
  status,
  objective,
  requirements,
  progress,
  unlockCondition,
  lockReason
}: {
  number: number;
  name: string;
  weeks: string;
  status: 'complete' | 'in-progress' | 'locked';
  objective: string;
  requirements: string[];
  progress: string;
  unlockCondition: string;
  lockReason?: string;
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'complete': 
        return {
          border: 'border-green-200',
          bg: 'bg-white',
          headerBg: 'bg-green-50',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          badge: 'bg-green-100 text-green-700',
          badgeText: 'Complete'
        };
      case 'in-progress': 
        return {
          border: 'border-blue-200',
          bg: 'bg-white',
          headerBg: 'bg-blue-50',
          icon: <div className="w-6 h-6 border-2 border-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>,
          badge: 'bg-blue-100 text-blue-700',
          badgeText: 'In Progress'
        };
      case 'locked': 
        return {
          border: 'border-neutral-200',
          bg: 'bg-neutral-50',
          headerBg: 'bg-neutral-100',
          icon: <Lock className="w-6 h-6 text-neutral-400" />,
          badge: 'bg-neutral-100 text-neutral-500',
          badgeText: 'Locked'
        };
    }
  };
  
  const styles = getStatusStyles();
  
  return (
    <div className={`border-2 ${styles.border} ${styles.bg} rounded-sm overflow-hidden`}>
      <div className={`${styles.headerBg} p-6 flex items-start gap-4`}>
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-lg font-semibold">Stage {number}: {name}</div>
              <div className="text-xs text-neutral-600">{weeks}</div>
            </div>
            <div className={`text-xs px-3 py-1 rounded-sm ${styles.badge} font-medium`}>
              {styles.badgeText}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {status === 'locked' && lockReason && (
          <div className="mb-6 p-4 bg-neutral-100 border border-neutral-200 rounded-sm text-sm text-neutral-600">
            🔒 {lockReason}
          </div>
        )}
        
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Objective</div>
          <div className="text-sm">{objective}</div>
        </div>
        
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Requirements</div>
          <div className="space-y-2">
            {requirements.map((req, i) => (
              <div key={i} className={`text-sm flex items-start gap-2 ${status === 'locked' ? 'text-neutral-500' : 'text-neutral-700'}`}>
                <span className="mt-1">•</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Progress</div>
          <div className="text-sm font-medium">{progress}</div>
        </div>
        
        <div className="pt-4 border-t border-neutral-200">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Unlock Condition</div>
          <div className="text-xs text-neutral-600">{unlockCondition}</div>
        </div>
      </div>
    </div>
  );
}
