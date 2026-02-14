import { Link } from "react-router";
import { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";

export default function RSD() {
  const currentStage = 1;
  const isUnlocked = false; // RSD unlocks at Stage 4
  
  const [sections, setSections] = useState({
    process: "",
    whatWorks: "",
    whatDoesnt: "",
    dollarPerHour: "",
    scalePlan: ""
  });
  
  const completionPercentage = 0;
  
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b-2 border-black p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-bold">VENDOURA</div>
            <div className="text-sm">Revenue System Document</div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-8">
          <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
          
          <div className="mb-8">
            <div className="text-xs text-gray-500 mb-1">SCREEN 6 OF 6</div>
            <h1 className="text-2xl mb-2">REVENUE SYSTEM DOCUMENT</h1>
            <p className="text-sm text-gray-600">Build your repeatable revenue playbook</p>
          </div>
          
          <div className="border-2 border-gray-400 bg-gray-100 p-12 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <div className="text-xl font-bold mb-4">RSD LOCKED</div>
            <div className="text-sm mb-6 max-w-lg mx-auto">
              The Revenue System Document unlocks at Stage 4: Revenue System. 
              You are currently at Stage {currentStage}.
            </div>
            <div className="text-sm text-gray-600 mb-8">
              To unlock RSD, you must:
            </div>
            <div className="max-w-md mx-auto text-left mb-8">
              <div className="space-y-2 text-sm">
                <div className="p-3 border-2 border-gray-400 bg-white">
                  → Complete Stage 1: Revenue Baseline (2 valid reports)
                </div>
                <div className="p-3 border-2 border-gray-400 bg-white">
                  → Complete Stage 2: Revenue Diagnosis (3 tactics tested)
                </div>
                <div className="p-3 border-2 border-gray-400 bg-white">
                  → Complete Stage 3: Revenue Amplification (2x baseline)
                </div>
              </div>
            </div>
            <Link 
              to="/screens/map" 
              className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
            >
              VIEW REVENUE MAP
            </Link>
          </div>
          
          <div className="mt-12 p-6 border-2 border-black bg-gray-50">
            <div className="font-bold mb-2">WHY RSD IS LOCKED:</div>
            <div className="text-sm">You cannot document a revenue system before you've built one. Stage 4 requires you to create a repeatable process, then document it here.</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Revenue System Document</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 6 OF 6</div>
          <h1 className="text-2xl mb-2">REVENUE SYSTEM DOCUMENT</h1>
          <p className="text-sm text-gray-600">Build your repeatable revenue playbook</p>
        </div>
        
        {/* Completion Status */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">COMPLETION STATUS</div>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
          </div>
          <div className="bg-gray-200 h-4">
            <div 
              className="bg-black h-4" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2">
            RSD must be 100% complete to graduate from Vendoura
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">RSD PURPOSE:</div>
          <div className="text-sm mb-4">
            Document your revenue process so it can be repeated without you. This is your playbook.
          </div>
          <div className="text-sm">
            <span className="font-bold">Mentor will review:</span> Completeness, specificity, evidence-backed claims
          </div>
        </div>
        
        {/* Section 1: Revenue Process */}
        <RSDSection 
          number={1}
          title="REVENUE PROCESS"
          description="Step-by-step: How do you generate revenue? Be specific enough that someone else could follow it."
          value={sections.process}
          onChange={(value) => setSections({ ...sections, process: value })}
          placeholder="Example:&#10;1. Identify past clients who haven't purchased in 90+ days&#10;2. Send personalized email with 15% discount offer&#10;3. Follow up 3 days later with phone call&#10;4. If interested, send proposal within 24 hours&#10;5. Close within 7 days or mark as 'nurture'&#10;&#10;Each step includes: who does it, how long it takes, what tools are used."
          autoPopulatedData={[
            "From your Week 5 report: 'Cold calling past clients works best between 10am-12pm'",
            "From your Week 7 report: 'Email open rate highest on Tuesdays'"
          ]}
        />
        
        {/* Section 2: What Works */}
        <RSDSection 
          number={2}
          title="WHAT WORKS"
          description="Proven tactics that generate revenue. Include $ per hour data."
          value={sections.whatWorks}
          onChange={(value) => setSections({ ...sections, whatWorks: value })}
          placeholder="Example:&#10;• Tactic: Personalized email to past clients&#10;  $ per hour: $127&#10;  Win rate: 40%&#10;  Best when: Sent on Tuesday mornings&#10;  Evidence: Weeks 5, 7, 9 reports&#10;&#10;• Tactic: Phone follow-up after email&#10;  $ per hour: $89&#10;  Win rate: 25%&#10;  Best when: Called within 3 days of email"
          autoPopulatedData={[
            "Week 6: Tactic 'Cold calls' - $45/hour",
            "Week 8: Tactic 'Email outreach' - $127/hour",
            "Week 10: Tactic 'Referrals' - $203/hour"
          ]}
        />
        
        {/* Section 3: What Doesn't Work */}
        <RSDSection 
          number={3}
          title="WHAT DOESN'T WORK"
          description="Failed tactics. Document so you don't repeat mistakes."
          value={sections.whatDoesnt}
          onChange={(value) => setSections({ ...sections, whatDoesnt: value })}
          placeholder="Example:&#10;• LinkedIn cold messaging: 2% response rate, $12/hour, not worth time&#10;• Trade show booths: $3,000 cost, 2 leads, negative ROI&#10;• Generic email blasts: <1% open rate, spam complaints"
          autoPopulatedData={[
            "Week 4 report: 'Facebook ads generated 0 qualified leads'",
            "Week 6 report: 'Cold LinkedIn messages: 1% response rate'"
          ]}
        />
        
        {/* Section 4: Dollar Per Hour Analysis */}
        <RSDSection 
          number={4}
          title="$ PER HOUR BY TACTIC"
          description="Ranked list of tactics by revenue efficiency."
          value={sections.dollarPerHour}
          onChange={(value) => setSections({ ...sections, dollarPerHour: value })}
          placeholder="Example:&#10;1. Referral calls: $203/hour (best)&#10;2. Email to past clients: $127/hour&#10;3. Follow-up calls: $89/hour&#10;4. Cold calls: $45/hour&#10;5. LinkedIn messages: $12/hour (worst)&#10;&#10;Recommendation: Focus 80% of time on top 3 tactics."
          autoPopulatedData={[
            "Calculated from 8 weeks of reports:",
            "Tactic A: $203/hour avg",
            "Tactic B: $127/hour avg",
            "Tactic C: $89/hour avg"
          ]}
        />
        
        {/* Section 5: Scale Plan */}
        <RSDSection 
          number={5}
          title="HOW TO SCALE"
          description="What would you do to 10x revenue? What bottlenecks need to be removed?"
          value={sections.scalePlan}
          onChange={(value) => setSections({ ...sections, scalePlan: value })}
          placeholder="Example:&#10;Current bottleneck: I can only make 20 calls per day&#10;&#10;To 10x:&#10;1. Hire 2 SDRs to make calls (I train them using this RSD)&#10;2. Build email sequence that nurtures leads automatically&#10;3. Create referral program (incentivize past clients)&#10;4. Current process handles 50 leads/week; need to scale to 500/week&#10;&#10;Investment needed: $8k/month for 2 SDRs&#10;Expected ROI: 5x within 90 days"
          autoPopulatedData={[]}
        />
        
        {/* Save Button */}
        <div className="border-2 border-black p-6 bg-gray-50">
          <div className="font-bold mb-4">SAVE & SUBMIT TO MENTOR</div>
          <div className="text-sm mb-6">
            Your mentor will review your RSD. They may request revisions before approving.
          </div>
          <button className="bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 w-full">
            SAVE PROGRESS
          </button>
          <button className="mt-3 border-2 border-black px-8 py-4 hover:bg-gray-100 w-full">
            SUBMIT FOR REVIEW
          </button>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">SCREEN FUNCTION:</div>
          <div className="text-sm">Forces documentation of revenue system. Auto-populates data from weekly reports. Mentor reviews for graduation approval.</div>
        </div>
      </div>
    </div>
  );
}

function RSDSection({
  number,
  title,
  description,
  value,
  onChange,
  placeholder,
  autoPopulatedData
}: {
  number: number;
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoPopulatedData: string[];
}) {
  return (
    <div className="mb-8 border-2 border-black p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-2xl font-bold">{number}</div>
        <div className="flex-1">
          <div className="font-bold mb-1">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
      
      {autoPopulatedData.length > 0 && (
        <div className="mb-4 p-4 border border-black bg-blue-50">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <div className="text-xs font-bold">AUTO-POPULATED DATA FROM YOUR REPORTS:</div>
          </div>
          <div className="text-xs space-y-1">
            {autoPopulatedData.map((data, i) => (
              <div key={i}>→ {data}</div>
            ))}
          </div>
        </div>
      )}
      
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-black p-4 min-h-64"
        placeholder={placeholder}
      />
    </div>
  );
}
