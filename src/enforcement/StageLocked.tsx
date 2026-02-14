import { Link } from "react-router";
import { Lock } from "lucide-react";

export default function StageLocked() {
  const currentStage = 1;
  const attemptedStage = 4;
  const attemptedStageName = "REVENUE SYSTEM";
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Revenue Map</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 6 OF 7</div>
          <h1 className="text-2xl mb-2">STAGE LOCKED</h1>
          <p className="text-sm text-gray-600">Attempting to access locked stage</p>
        </div>
        
        {/* Lock Message */}
        <div className="mb-8 p-12 border-4 border-gray-400 bg-gray-100 text-center">
          <Lock className="w-20 h-20 mx-auto mb-6 text-gray-400" />
          
          <div className="text-3xl font-bold mb-4">
            STAGE {attemptedStage} IS LOCKED
          </div>
          
          <div className="max-w-lg mx-auto mb-8">
            <div className="text-sm mb-6">
              You are trying to access <strong>Stage {attemptedStage}: {attemptedStageName}</strong>, 
              but you are currently at <strong>Stage {currentStage}</strong>.
            </div>
            
            <div className="p-6 border-2 border-gray-400 bg-white text-left mb-6">
              <div className="font-bold mb-2">WHY IS THIS LOCKED?</div>
              <div className="text-sm space-y-2">
                <div>
                  Vendoura stages unlock sequentially. You cannot skip ahead.
                </div>
                <div className="mt-3">
                  <strong>Stage progression:</strong>
                </div>
                <div className="pl-4 space-y-1">
                  <div>Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5</div>
                  <div className="text-xs text-gray-600 mt-2">
                    Each stage builds on the previous. You must complete Stage {currentStage} 
                    (and all stages before {attemptedStage}) to unlock this stage.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-2 border-black bg-white text-left mb-8">
              <div className="font-bold mb-2">TO UNLOCK STAGE {attemptedStage}:</div>
              <div className="text-sm space-y-2 mb-4">
                You must complete all previous stages first:
              </div>
              <div className="space-y-2">
                <div className="p-3 border border-black bg-gray-50">
                  <div className="font-bold mb-1">Stage 1: Revenue Baseline</div>
                  <div className="text-xs text-gray-600">Status: IN PROGRESS (1/2 reports)</div>
                </div>
                <div className="p-3 border border-gray-400 bg-gray-200 opacity-60">
                  <div className="font-bold mb-1">Stage 2: Revenue Diagnosis</div>
                  <div className="text-xs text-gray-600">Status: LOCKED</div>
                </div>
                <div className="p-3 border border-gray-400 bg-gray-200 opacity-60">
                  <div className="font-bold mb-1">Stage 3: Revenue Amplification</div>
                  <div className="text-xs text-gray-600">Status: LOCKED</div>
                </div>
              </div>
            </div>
            
            <Link 
              to="/screens/map" 
              className="inline-block bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 mb-4"
            >
              VIEW REVENUE MAP
            </Link>
            
            <div className="text-xs text-gray-600">
              See your current stage and what's required to unlock next stages
            </div>
          </div>
        </div>
        
        {/* Current Progress */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">YOUR CURRENT PROGRESS:</div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 border-2 border-black">
              <div className="text-xs text-gray-500 mb-1">CURRENT STAGE</div>
              <div className="text-2xl font-bold">Stage {currentStage}</div>
            </div>
            <div className="p-4 border-2 border-black">
              <div className="text-xs text-gray-500 mb-1">CURRENT WEEK</div>
              <div className="text-2xl font-bold">Week 3 of 12</div>
            </div>
            <div className="p-4 border-2 border-black">
              <div className="text-xs text-gray-500 mb-1">NEXT UNLOCK</div>
              <div className="text-sm font-bold">Stage 2</div>
            </div>
          </div>
          
          <div className="p-4 border border-black bg-gray-50">
            <div className="font-bold mb-2">TO UNLOCK STAGE 2:</div>
            <div className="text-sm">
              Complete 1 more valid weekly report (currently 1/2 complete)
            </div>
          </div>
        </div>
        
        {/* Why Sequential */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">WHY STAGES MUST BE SEQUENTIAL:</div>
          <div className="text-sm space-y-3">
            <div>
              <strong>Stage 1 (Baseline):</strong> You need to know your starting point before you can improve.
            </div>
            <div>
              <strong>Stage 2 (Diagnosis):</strong> You need to test tactics to find what works best.
            </div>
            <div>
              <strong>Stage 3 (Amplification):</strong> You need to know what works before you can amplify it.
            </div>
            <div>
              <strong>Stage 4 (System):</strong> You need a working process before you can document it.
            </div>
            <div>
              <strong>Stage 5 (Scale):</strong> You need a documented system before you can scale it.
            </div>
            <div className="mt-4 pt-3 border-t border-gray-300">
              Skipping stages means skipping the learning that makes later stages possible.
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="p-6 border-2 border-black bg-white">
          <div className="font-bold mb-2">FOCUS ON YOUR CURRENT STAGE:</div>
          <div className="text-sm mb-4">
            Instead of looking ahead, focus on completing Stage {currentStage}. 
            Each stage unlocks automatically when its requirements are met.
          </div>
          <Link 
            to="/screens/dashboard" 
            className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
          >
            RETURN TO DASHBOARD
          </Link>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Locked stages are not clickable/accessible</div>
            <div>• Attempting to access shows this block screen</div>
            <div>• No bypass or "preview" mode</div>
            <div>• Stages unlock automatically when criteria met</div>
            <div>• Forces founders to focus on current stage</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-gray-400 bg-gray-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            Sequential unlocking prevents founders from jumping ahead or getting distracted by future stages. 
            It forces focus on the current requirement. The lock is simple and non-negotiable: 
            do the current work, unlock the next stage.
          </div>
        </div>
      </div>
    </div>
  );
}
