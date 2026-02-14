import { Link } from "react-router";

export default function HandoffIndex() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/refined" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Refined Screens</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">PHASE 6 — DESIGN-TO-CODE HANDOFF</h1>
          <p className="text-neutral-600">Comprehensive engineering documentation. Zero interpretation needed.</p>
        </div>
        
        <div className="mb-12 p-8 bg-white border border-neutral-200 rounded-sm">
          <div className="font-semibold mb-4">HANDOFF DOCUMENTATION INCLUDES:</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Data Models:</strong> Database schema, field types, relationships, indexes</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>API Endpoints:</strong> REST/GraphQL schema, request/response formats, auth requirements</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>State Logic:</strong> Lock conditions, unlock triggers, status transitions, automatic actions</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Validation Rules:</strong> Client-side and server-side validation, error messages</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Component Specs:</strong> React component props, states, event handlers</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-12">
          <HandoffLink 
            to="/handoff/data-models"
            title="1. Data Models"
            description="Database schema for all entities: User, Cohort, WeeklyReport, Stage, etc."
          />
          
          <HandoffLink 
            to="/handoff/api-endpoints"
            title="2. API Endpoints"
            description="Complete REST API specification with request/response examples"
          />
          
          <HandoffLink 
            to="/handoff/state-logic"
            title="3. State Logic & Business Rules"
            description="Lock conditions, unlock triggers, automatic notifications, stage transitions"
          />
          
          <HandoffLink 
            to="/handoff/validation-rules"
            title="4. Validation Rules"
            description="Field validation, error messages, client/server validation split"
          />
          
          <HandoffLink 
            to="/handoff/component-specs"
            title="5. Component Specifications"
            description="React component props, states, event handlers, reusable patterns"
          />
        </div>
        
        <div className="p-8 bg-white border border-neutral-200 rounded-sm mb-8">
          <div className="font-semibold mb-3">✓ EXIT CONDITION MET:</div>
          <div className="text-sm text-neutral-700">
            Engineers can build the entire system with zero interpretation needed. Every field, endpoint, lock condition, validation rule, and component is explicitly defined.
          </div>
        </div>
        
        <div className="p-8 bg-green-50 border-2 border-green-600 rounded-sm">
          <Link to="/testing" className="block">
            <div className="font-semibold mb-2">→ PROCEED TO PHASE 7: FOUNDER TESTING</div>
            <div className="text-sm text-neutral-700">
              Validate revenue movement with real founders. Ignore UX opinions. Watch the data.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function HandoffLink({ 
  to, 
  title, 
  description 
}: { 
  to: string; 
  title: string; 
  description: string;
}) {
  return (
    <Link 
      to={to} 
      className="block p-6 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors"
    >
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
    </Link>
  );
}
