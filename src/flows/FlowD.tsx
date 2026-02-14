import { Link } from "react-router";
import { useState } from "react";
import { ArrowDown, AlertTriangle, Lock, Unlock } from "lucide-react";

export default function FlowD() {
  const [scenario, setScenario] = useState<'no-commit' | 'no-evidence' | 'no-report' | 'stage-lock' | 'cohort-removal'>('no-commit');
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Index</Link>
        
        <h1 className="text-2xl mb-2">FLOW D — Stage Locking Logic</h1>
        <p className="mb-8 text-gray-600">What happens when founders don't complete required actions</p>
        
        <div className="mb-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">⚠️ VENDOURA'S ENFORCEMENT MECHANISM</div>
          <div className="text-sm">This is what differentiates Vendoura from other programs. Passive behavior has immediate, visible consequences.</div>
        </div>
        
        <div className="mb-8">
          <div className="font-bold mb-4">SELECT SCENARIO:</div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setScenario('no-commit')}
              className={`border-2 border-black p-4 text-left ${scenario === 'no-commit' ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="font-bold">Scenario 1</div>
              <div className="text-sm">No weekly commit submitted</div>
            </button>
            
            <button 
              onClick={() => setScenario('no-evidence')}
              className={`border-2 border-black p-4 text-left ${scenario === 'no-evidence' ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="font-bold">Scenario 2</div>
              <div className="text-sm">No execution evidence</div>
            </button>
            
            <button 
              onClick={() => setScenario('no-report')}
              className={`border-2 border-black p-4 text-left ${scenario === 'no-report' ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="font-bold">Scenario 3</div>
              <div className="text-sm">No weekly report submitted</div>
            </button>
            
            <button 
              onClick={() => setScenario('stage-lock')}
              className={`border-2 border-black p-4 text-left ${scenario === 'stage-lock' ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="font-bold">Scenario 4</div>
              <div className="text-sm">Stage requirements incomplete</div>
            </button>
            
            <button 
              onClick={() => setScenario('cohort-removal')}
              className={`border-2 border-black p-4 text-left ${scenario === 'cohort-removal' ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="font-bold">Scenario 5</div>
              <div className="text-sm">2 consecutive weeks missed</div>
            </button>
          </div>
        </div>
        
        {scenario === 'no-commit' && <ScenarioNoCommit />}
        {scenario === 'no-evidence' && <ScenarioNoEvidence />}
        {scenario === 'no-report' && <ScenarioNoReport />}
        {scenario === 'stage-lock' && <ScenarioStageLock />}
        {scenario === 'cohort-removal' && <ScenarioCohortRemoval />}
      </div>
    </div>
  );
}

function ScenarioNoCommit() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-6">
        <div className="font-bold mb-2">SCENARIO 1: No Weekly Commit Submitted</div>
        <div className="text-sm mb-4">Deadline: Monday 9am — Founder did not submit commit</div>
        
        <div className="space-y-4">
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5" />}
            title="IMMEDIATE CONSEQUENCE (Monday 9:01am)"
            items={[
              "Dashboard shows: 'WEEK LOCKED - No commit submitted'",
              "Report submission form: DISABLED (grayed out)",
              "Mentor receives notification: 'Founder X missed commit'",
              "Founder sees: 'Cannot proceed until commit submitted'"
            ]}
          />
          
          <StateBlock 
            icon={<Lock className="w-5 h-5" />}
            title="WHAT IS LOCKED"
            items={[
              "Cannot submit weekly report on Friday",
              "Cannot access diagnose step",
              "Cannot access adjust step",
              "Stage progress: FROZEN (counter does not increment)"
            ]}
          />
          
          <StateBlock 
            icon={<Unlock className="w-5 h-5" />}
            title="HOW TO UNLOCK"
            items={[
              "Submit commit (even if late)",
              "System allows late submission with penalty",
              "Late submission = mentor visibility flag remains",
              "Once submitted, can proceed with report on Friday"
            ]}
          />
        </div>
      </div>
      
      <div className="p-4 border-2 border-red-600 bg-red-50 text-sm">
        <strong>Enforcement Rule:</strong> This week does NOT count toward stage requirements even if completed late. Founder must complete extra week to compensate.
      </div>
    </div>
  );
}

function ScenarioNoEvidence() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-6">
        <div className="font-bold mb-2">SCENARIO 2: No Execution Evidence</div>
        <div className="text-sm mb-4">Founder submits report but includes no evidence files</div>
        
        <div className="space-y-4">
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5" />}
            title="IMMEDIATE CONSEQUENCE (Friday after submission)"
            items={[
              "Report marked as: 'INCOMPLETE - No evidence'",
              "Mentor receives notification: 'Founder X submitted without evidence'",
              "Dashboard shows: 'Report rejected - Evidence required'",
              "Founder can resubmit until deadline"
            ]}
          />
          
          <StateBlock 
            icon={<Lock className="w-5 h-5" />}
            title="WHAT IS LOCKED"
            items={[
              "Report does not count as 'complete'",
              "Stage progress: FROZEN",
              "Diagnose runs but flags 'evidence missing'",
              "Week counted as MISSED for removal review"
            ]}
          />
          
          <StateBlock 
            icon={<Unlock className="w-5 h-5" />}
            title="HOW TO UNLOCK"
            items={[
              "Resubmit report with evidence before deadline",
              "After deadline: must wait until next week",
              "Evidence can be: screenshots, receipts, emails, contracts",
              "Mentor validates evidence is legitimate"
            ]}
          />
        </div>
      </div>
      
      <div className="p-4 border-2 border-red-600 bg-red-50 text-sm">
        <strong>Enforcement Rule:</strong> Report without evidence = report not submitted. Counts as MISS for consecutive miss tracking.
      </div>
    </div>
  );
}

function ScenarioNoReport() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-6">
        <div className="font-bold mb-2">SCENARIO 3: No Weekly Report Submitted</div>
        <div className="text-sm mb-4">Deadline: Friday 6pm — Founder did not submit report</div>
        
        <div className="space-y-4">
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5" />}
            title="IMMEDIATE CONSEQUENCE (Friday 6:01pm)"
            items={[
              "Dashboard shows: 'WEEK MISSED - No report submitted'",
              "Mentor receives URGENT notification",
              "Stage progress: FROZEN",
              "Week marked as MISS #1 (tracking for removal)"
            ]}
          />
          
          <StateBlock 
            icon={<Lock className="w-5 h-5" />}
            title="WHAT IS LOCKED"
            items={[
              "Stage cannot advance",
              "Next week's commit: LOCKED until report submitted",
              "Revenue map: frozen at current stage",
              "Community access: warning banner visible"
            ]}
          />
          
          <StateBlock 
            icon={<Unlock className="w-5 h-5" />}
            title="HOW TO UNLOCK"
            items={[
              "Submit late report (allowed until Sunday 6pm)",
              "Late report marked as such (permanent record)",
              "After Sunday 6pm: week is permanently missed",
              "Must complete extra week to meet stage requirements"
            ]}
          />
        </div>
      </div>
      
      <div className="p-4 border-2 border-red-600 bg-red-50 text-sm">
        <strong>Critical:</strong> If this is MISS #2 in a row → proceed to SCENARIO 5 (Cohort Removal Review)
      </div>
    </div>
  );
}

function ScenarioStageLock() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-6">
        <div className="font-bold mb-2">SCENARIO 4: Stage Requirements Incomplete</div>
        <div className="text-sm mb-4">Founder reaches expected timeline but hasn't met stage unlock criteria</div>
        
        <div className="space-y-4">
          <StateBlock 
            icon={<Lock className="w-5 h-5" />}
            title="EXAMPLE: STAGE 1 → STAGE 2"
            items={[
              "Requirement: 2 consecutive valid weekly reports",
              "Founder status: Only 1 valid report (1 was missed)",
              "Timeline: Week 3 (expected to be in Stage 2)",
              "Result: LOCKED at Stage 1"
            ]}
          />
          
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5" />}
            title="WHAT FOUNDER SEES"
            items={[
              "Revenue Map: Stage 2 is grayed out/locked",
              "Dashboard: 'Complete Stage 1 requirements to unlock'",
              "Progress bar: Shows 1/2 reports complete",
              "Mentor note: May include guidance on catch-up"
            ]}
          />
          
          <StateBlock 
            icon={<Unlock className="w-5 h-5" />}
            title="HOW TO UNLOCK"
            items={[
              "Complete remaining requirements (submit valid report)",
              "System auto-unlocks when criteria met",
              "No manual approval needed (unless mentor overridden)",
              "Founder continues from where they are (no restart)"
            ]}
          />
        </div>
      </div>
      
      <div className="p-4 border-2 border-black bg-gray-50 text-sm">
        <strong>Design principle:</strong> Stages unlock based on COMPLETION, not TIME. Founder can take 14 weeks if needed, but must meet all criteria.
      </div>
    </div>
  );
}

function ScenarioCohortRemoval() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-red-600 p-6">
        <div className="font-bold mb-2 text-red-600">⚠️ SCENARIO 5: 2 Consecutive Weeks Missed</div>
        <div className="text-sm mb-4">Most severe lock condition — triggers removal review</div>
        
        <div className="space-y-4">
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            title="IMMEDIATE CONSEQUENCE"
            items={[
              "Account status: UNDER REVIEW",
              "Mentor receives: 'Founder X - Removal Review Required'",
              "Dashboard shows: 'Your participation is under review'",
              "All platform access: LIMITED (read-only)"
            ]}
            critical={true}
          />
          
          <StateBlock 
            icon={<Lock className="w-5 h-5 text-red-600" />}
            title="WHAT IS LOCKED"
            items={[
              "Cannot submit new commits",
              "Cannot submit reports",
              "Cannot access community",
              "Calendar invites: Paused"
            ]}
            critical={true}
          />
          
          <StateBlock 
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            title="REVIEW PROCESS"
            items={[
              "Mentor schedules 1-on-1 call (mandatory)",
              "Founder must explain circumstances",
              "Options: 1) Reinstate with plan 2) Move to next cohort 3) Remove",
              "Decision made within 48 hours"
            ]}
            critical={true}
          />
        </div>
      </div>
      
      <div className="p-4 border-2 border-red-600 bg-red-50 text-sm">
        <strong>Why this is necessary:</strong> 2 consecutive misses indicates disengagement. Vendoura is designed for committed founders. Inactive members hurt cohort momentum.
      </div>
      
      <div className="p-4 border-2 border-black bg-gray-50 text-sm">
        <strong>Reinstatement criteria:</strong> Founder must submit makeup reports for both missed weeks + demonstrate specific plan to prevent future misses.
      </div>
    </div>
  );
}

function StateBlock({ 
  icon, 
  title, 
  items, 
  critical = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  items: string[];
  critical?: boolean;
}) {
  return (
    <div className={`p-4 border ${critical ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div className="font-bold text-sm">{title}</div>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="text-xs">→ {item}</div>
        ))}
      </div>
    </div>
  );
}
