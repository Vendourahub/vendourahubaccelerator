import { Link } from "react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function FlowA() {
  const [currentState, setCurrentState] = useState<'start' | 'application' | 'baseline' | 'screening' | 'accepted' | 'rejected'>('start');
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Index</Link>
        
        <h1 className="text-2xl mb-2">FLOW A — Application → Admission</h1>
        <p className="mb-8 text-gray-600">How founders enter the system</p>
        
        <div className="space-y-8">
          {/* Start */}
          <StateBox 
            active={currentState === 'start'}
            title="START"
            description="Founder lands on application"
            onClick={() => setCurrentState('start')}
          />
          
          <Arrow />
          
          {/* Application */}
          <StateBox 
            active={currentState === 'application'}
            title="APPLICATION FORM"
            description="Required fields: Name, Email, Business description, Current revenue state"
            onClick={() => setCurrentState('application')}
            rules={[
              "All fields mandatory",
              "No 'idea stage' allowed",
              "Must have business entity or revenue attempt"
            ]}
          />
          
          <Arrow />
          
          {/* Revenue Baseline Capture */}
          <StateBox 
            active={currentState === 'baseline'}
            title="REVENUE BASELINE CAPTURE"
            description="Founder inputs current revenue numbers"
            onClick={() => setCurrentState('baseline')}
            rules={[
              "Last 30 days revenue: $___",
              "Last 90 days revenue: $___",
              "Primary revenue source: ___",
              "Zero revenue allowed (must explain attempt)"
            ]}
          />
          
          <Arrow />
          
          {/* Commitment Screening */}
          <StateBox 
            active={currentState === 'screening'}
            title="COMMITMENT SCREENING"
            description="Questions that predict completion likelihood"
            onClick={() => setCurrentState('screening')}
            rules={[
              "Can you commit 15 hours/week? YES/NO",
              "Will you submit weekly revenue reports? YES/NO",
              "Comfortable with mentor visibility on misses? YES/NO",
              "Any 'NO' answer = auto-reject"
            ]}
          />
          
          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <Arrow />
              <StateBox 
                active={currentState === 'accepted'}
                title="ACCEPTED"
                description="Founder admitted to next cohort"
                onClick={() => setCurrentState('accepted')}
                rules={[
                  "Email sent with cohort assignment",
                  "Calendar invite for Week 1",
                  "Access credentials created",
                  "Proceeds to FLOW B →"
                ]}
                color="border-green-600"
              />
            </div>
            
            <div className="flex-1">
              <Arrow />
              <StateBox 
                active={currentState === 'rejected'}
                title="REJECTED"
                description="Application denied"
                onClick={() => setCurrentState('rejected')}
                rules={[
                  "Reason: Failed commitment screening",
                  "OR: No revenue attempt documented",
                  "OR: 'Idea stage' only",
                  "Can reapply after 90 days"
                ]}
                color="border-red-600"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">FLOW A LOCK CONDITIONS:</div>
          <ul className="text-sm space-y-1">
            <li>• Incomplete application = cannot proceed</li>
            <li>• Any "NO" in commitment screening = auto-reject</li>
            <li>• No revenue baseline = manual review required</li>
            <li>• Rejected applicants cannot access system</li>
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
