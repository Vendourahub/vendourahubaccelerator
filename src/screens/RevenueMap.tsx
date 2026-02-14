import { Link } from "react-router";
import { Lock, Unlock, CheckCircle } from "lucide-react";

export default function RevenueMap() {
  const currentStage = 1;
  const currentWeek = 3;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Revenue Map</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 5 OF 6</div>
          <h1 className="text-2xl mb-2">REVENUE MAP</h1>
          <p className="text-sm text-gray-600">Your progression through 5 stages</p>
        </div>
        
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold">Current Week:</span> {currentWeek} of 12
            </div>
            <div>
              <span className="font-bold">Current Stage:</span> Stage {currentStage}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Stage 1 */}
          <StageCard 
            number={1}
            name="REVENUE BASELINE"
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
            name="REVENUE DIAGNOSIS"
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
            name="REVENUE AMPLIFICATION"
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
            name="REVENUE SYSTEM"
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
            name="REVENUE SCALE"
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
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">HOW STAGES UNLOCK:</div>
          <div className="text-sm space-y-1">
            <div>• Stages unlock automatically when requirements are met</div>
            <div>• Complete requirements = next stage becomes visible</div>
            <div>• Locked stages show what's needed to unlock them</div>
            <div>• You cannot skip stages</div>
            <div>• Stages unlock based on COMPLETION, not TIME</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">SCREEN FUNCTION:</div>
          <div className="text-sm">Shows progression path. Makes lock status visible. Explains unlock conditions. No ambiguity about what's next.</div>
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
  const getBorderColor = () => {
    switch (status) {
      case 'complete': return 'border-green-600';
      case 'in-progress': return 'border-black';
      case 'locked': return 'border-gray-400';
    }
  };
  
  const getBgColor = () => {
    switch (status) {
      case 'complete': return 'bg-green-50';
      case 'in-progress': return 'bg-white';
      case 'locked': return 'bg-gray-100';
    }
  };
  
  const getIcon = () => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-6 h-6" />;
      case 'in-progress': return <Unlock className="w-6 h-6" />;
      case 'locked': return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'complete': return 'COMPLETE';
      case 'in-progress': return 'IN PROGRESS';
      case 'locked': return 'LOCKED';
    }
  };
  
  return (
    <div className={`border-2 ${getBorderColor()} ${getBgColor()} p-6`}>
      <div className="flex items-start gap-4 mb-4">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold text-lg">STAGE {number}: {name}</div>
            <div className="text-xs font-bold">{getStatusText()}</div>
          </div>
          <div className="text-xs text-gray-500">{weeks}</div>
        </div>
      </div>
      
      {status === 'locked' && lockReason && (
        <div className="mb-4 p-3 border border-gray-400 bg-gray-200 text-sm">
          🔒 {lockReason}
        </div>
      )}
      
      <div className="mb-4">
        <div className="text-sm font-bold mb-1">OBJECTIVE:</div>
        <div className="text-sm">{objective}</div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-bold mb-2">REQUIREMENTS:</div>
        <ul className="text-sm space-y-1">
          {requirements.map((req, i) => (
            <li key={i} className={status === 'locked' ? 'text-gray-500' : ''}>
              → {req}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-bold mb-1">PROGRESS:</div>
        <div className="text-sm">{progress}</div>
      </div>
      
      <div className="pt-3 border-t border-gray-300">
        <div className="text-xs font-bold mb-1">UNLOCK CONDITION:</div>
        <div className="text-xs text-gray-600">{unlockCondition}</div>
      </div>
    </div>
  );
}
