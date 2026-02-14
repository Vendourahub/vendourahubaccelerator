import { Link } from "react-router";
import { useState } from "react";
import { ArrowDown } from "lucide-react";

export default function FlowB() {
  const [currentState, setCurrentState] = useState<'start' | 'assignment' | 'track' | 'stage1' | 'loop'>('start');
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Index</Link>
        
        <h1 className="text-2xl mb-2">FLOW B — Cohort Entry → Week 1</h1>
        <p className="mb-8 text-gray-600">First week initialization sequence</p>
        
        <div className="space-y-8">
          {/* Accepted from Flow A */}
          <StateBox 
            active={currentState === 'start'}
            title="← FROM FLOW A: ACCEPTED"
            description="Founder received acceptance email + credentials"
            onClick={() => setCurrentState('start')}
          />
          
          <Arrow />
          
          {/* Cohort Assignment */}
          <StateBox 
            active={currentState === 'assignment'}
            title="COHORT ASSIGNMENT"
            description="Founder assigned to specific cohort group"
            onClick={() => setCurrentState('assignment')}
            rules={[
              "Cohort ID: COHORT_2026_03",
              "Start date: March 3, 2026",
              "Cohort size: 12 founders",
              "Assigned mentor: [NAME]"
            ]}
          />
          
          <Arrow />
          
          {/* Revenue Track Assignment */}
          <StateBox 
            active={currentState === 'track'}
            title="REVENUE TRACK ASSIGNED"
            description="Based on baseline revenue from application"
            onClick={() => setCurrentState('track')}
            rules={[
              "IF baseline = $0-1k/mo → TRACK: Launch",
              "IF baseline = $1k-10k/mo → TRACK: Scale",
              "IF baseline = $10k+/mo → TRACK: System",
              "Track determines mentor focus areas"
            ]}
          />
          
          <Arrow />
          
          {/* Stage 1 Unlocked */}
          <StateBox 
            active={currentState === 'stage1'}
            title="STAGE 1: REVENUE BASELINE UNLOCKED"
            description="First stage becomes visible and active"
            onClick={() => setCurrentState('stage1')}
            rules={[
              "Stage 1 objective: Establish current revenue capability",
              "Required: 2 consecutive weekly reports",
              "Stages 2-5: LOCKED (not visible)",
              "Revenue Map shows only Stage 1"
            ]}
          />
          
          <Arrow />
          
          {/* Weekly Loop Visible */}
          <StateBox 
            active={currentState === 'loop'}
            title="WEEKLY LOOP VISIBLE"
            description="Founder can see and begin Week 1 loop"
            onClick={() => setCurrentState('loop')}
            rules={[
              "Dashboard shows: Week 1 of 12",
              "Current step: COMMIT (due Monday 9am)",
              "All 5 steps visible: Commit → Execute → Report → Diagnose → Adjust",
              "Timer: Days until first commit deadline",
              "Proceeds to FLOW C →"
            ]}
            color="border-green-600"
          />
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">FLOW B INITIALIZATION RULES:</div>
          <ul className="text-sm space-y-1">
            <li>• Founder cannot access platform before cohort start date</li>
            <li>• Only Stage 1 is visible on first login</li>
            <li>• Weekly loop begins immediately (no grace period)</li>
            <li>• First commit due: Monday 9am of Week 1</li>
            <li>• Miss first commit = immediate mentor visibility flag</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StateBox({ 
  active, 
  title, 
  description, 
  onClick, 
  rules,
  color = "border-black"
}: { 
  active: boolean; 
  title: string; 
  description: string; 
  onClick: () => void;
  rules?: string[];
  color?: string;
}) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 ${color} p-6 cursor-pointer ${active ? 'bg-gray-200' : 'bg-white'}`}
    >
      <div className="font-bold mb-2">{title}</div>
      <div className="text-sm mb-4">{description}</div>
      {rules && (
        <div className="text-xs text-gray-600 space-y-1">
          {rules.map((rule, i) => (
            <div key={i}>→ {rule}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="w-6 h-6" />
    </div>
  );
}
