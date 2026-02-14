import { Link } from "react-router";

export default function ComponentSpecs() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">COMPONENT SPECIFICATIONS</h1>
          <p className="text-neutral-600">React component props, states, event handlers, reusable patterns</p>
        </div>
        
        {/* LoopStep Component */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">&lt;LoopStep /&gt;</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Purpose</div>
              <div className="text-sm text-neutral-700">
                Display single step in weekly revenue loop with status indicator
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Props</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`interface LoopStepProps {
  number: number;              // 1-5
  name: string;                // "Commit", "Execute", etc.
  status: 'complete' | 'in_progress' | 'pending' | 'locked';
  detail: string;              // Description text
  onClick?: () => void;        // Optional click handler
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Visual States</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm">
                  <div className="font-semibold mb-1">complete</div>
                  <div className="text-neutral-600">Border: green-200, BG: green-50, Badge: green</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <div className="font-semibold mb-1">in_progress</div>
                  <div className="text-neutral-600">Border: blue-200, BG: blue-50, Badge: blue</div>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded-sm">
                  <div className="font-semibold mb-1">pending</div>
                  <div className="text-neutral-600">Border: neutral-200, BG: white, Badge: neutral</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm">
                  <div className="font-semibold mb-1">locked</div>
                  <div className="text-neutral-600">Border: neutral-200, BG: neutral-50, Badge: neutral, Opacity: 0.6</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Usage Example</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`<LoopStep 
  number={1}
  name="Commit"
  status="complete"
  detail="Reach out to 10 past clients for referrals"
/>`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* StageCard Component */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">&lt;StageCard /&gt;</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Purpose</div>
              <div className="text-sm text-neutral-700">
                Display single stage in Revenue Map with lock status and requirements
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Props</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`interface StageCardProps {
  number: number;                  // 1-5
  name: string;                    // "REVENUE BASELINE"
  weeks: string;                   // "Weeks 1-2"
  status: 'complete' | 'in_progress' | 'locked';
  objective: string;               // Stage goal
  requirements: string[];          // Array of requirements
  progress: string;                // "1/2 reports complete"
  unlockCondition: string;         // What unlocks next stage
  lockReason?: string;             // Why locked (if status=locked)
  onClick?: () => void;            // Optional click handler
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Behavior</div>
              <ul className="text-sm space-y-2 text-neutral-700">
                <li>• If locked: show lockReason prominently, gray out requirements</li>
                <li>• If in_progress: highlight current progress</li>
                <li>• If complete: show checkmark icon, green accents</li>
                <li>• Click on locked stage: navigate to "Cannot Proceed" screen with context</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* AlertBanner Component */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">&lt;AlertBanner /&gt;</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Purpose</div>
              <div className="text-sm text-neutral-700">
                Display critical alerts, deadlines, and lock notifications
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Props</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`interface AlertBannerProps {
  type: 'critical' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;          // Optional custom icon
  title: string;                   // Alert headline
  message: string;                 // Alert body
  action?: {                       // Optional CTA
    label: string;
    onClick: () => void;
    href?: string;
  };
  dismissible?: boolean;           // Can be closed
  onDismiss?: () => void;          // Dismiss handler
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Visual States</div>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border-2 border-red-600 rounded-sm text-sm">
                  <strong>critical:</strong> Red border/bg, urgent messaging, always visible
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm">
                  <strong>warning:</strong> Amber border/bg, important but not blocking
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm text-sm">
                  <strong>info:</strong> Blue border/bg, informational messaging
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-sm text-sm">
                  <strong>success:</strong> Green border/bg, positive confirmation
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Usage Examples</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`// Critical deadline
<AlertBanner 
  type="critical"
  title="Critical Deadline: Friday 6pm"
  message="3 hours remaining. Missing this deadline will freeze your stage progress."
  action={{
    label: "Submit Report Now",
    href: "/report"
  }}
/>

// Week locked
<AlertBanner 
  type="critical"
  title="Week 3 Locked"
  message="You cannot proceed. No commit submitted by Monday 9am."
  action={{
    label: "Submit Commit Now",
    href: "/commit"
  }}
/>

// Late submission
<AlertBanner 
  type="warning"
  title="Late Submission Recorded"
  message="Your mentor has been notified. This is permanent on your record."
/>`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Form Patterns */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Form Patterns</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Standard Input Pattern</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`<div>
  <label className="block font-medium mb-3">
    Field Label
  </label>
  <input 
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full border border-neutral-300 focus:border-neutral-900 
               focus:outline-none p-4 rounded-sm transition-colors"
    placeholder="Placeholder text"
  />
  <div className="text-xs text-neutral-500 mt-2">
    Helper text explaining the field
  </div>
  {error && (
    <div className="text-xs text-red-600 mt-2">
      {error}
    </div>
  )}
</div>`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">File Upload Pattern</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`<div>
  <label className="block font-medium mb-3">
    Upload Evidence <span className="text-red-600">*</span>
  </label>
  <div 
    onClick={handleUpload}
    className="border-2 border-dashed border-neutral-300 
               hover:border-neutral-400 p-8 rounded-sm text-center 
               cursor-pointer transition-colors"
  >
    <Upload className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
    <div className="text-sm font-medium mb-1">Click to upload files</div>
    <div className="text-xs text-neutral-500">
      Accepted: PNG, JPG, PDF (max 10MB each)
    </div>
  </div>
  
  {files.length > 0 && (
    <div className="mt-4 space-y-2">
      {files.map((file, i) => (
        <div key={i} className="flex items-center justify-between 
                                p-3 bg-neutral-50 rounded-sm">
          <div>
            <div className="text-sm font-medium">{file.name}</div>
            <div className="text-xs text-neutral-500">{file.size}</div>
          </div>
          <button onClick={() => removeFile(i)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Submit Button Pattern</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`<button 
  onClick={handleSubmit}
  disabled={isSubmitting || hasErrors}
  className="w-full bg-neutral-900 text-white py-4 rounded-sm 
             hover:bg-neutral-800 disabled:opacity-50 
             disabled:cursor-not-allowed transition-colors font-medium"
>
  {isSubmitting ? 'Submitting...' : 'Submit Report'}
</button>`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Reusable Patterns Summary */}
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">DESIGN SYSTEM TOKENS:</div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-medium mb-3">Colors</div>
              <div className="space-y-2 text-xs">
                <div>• <code>neutral-50</code> - Page background</div>
                <div>• <code>neutral-900</code> - Primary text, buttons</div>
                <div>• <code>red-600</code> - Critical errors, locks</div>
                <div>• <code>amber-600</code> - Warnings, deadlines</div>
                <div>• <code>green-600</code> - Success, complete</div>
                <div>• <code>blue-600</code> - In progress, active</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-3">Spacing</div>
              <div className="space-y-2 text-xs">
                <div>• <code>p-4</code> - Small padding (16px)</div>
                <div>• <code>p-6</code> - Medium padding (24px)</div>
                <div>• <code>p-8</code> - Large padding (32px)</div>
                <div>• <code>gap-4, gap-6, gap-8</code> - Consistent gaps</div>
                <div>• <code>space-y-3, space-y-4, space-y-6</code> - Vertical rhythm</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-3">Typography</div>
              <div className="space-y-2 text-xs">
                <div>• <code>text-3xl</code> - Page titles</div>
                <div>• <code>text-xl</code> - Section headers</div>
                <div>• <code>text-sm</code> - Body text</div>
                <div>• <code>text-xs</code> - Helper text, labels</div>
                <div>• <code>font-semibold</code> - Headings</div>
                <div>• <code>font-medium</code> - Emphasis</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-3">Borders & Radius</div>
              <div className="space-y-2 text-xs">
                <div>• <code>border</code> - 1px (default)</div>
                <div>• <code>border-2</code> - 2px (emphasis)</div>
                <div>• <code>rounded-sm</code> - 2px (minimal)</div>
                <div>• <code>rounded-full</code> - Pills, badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
