import { Link } from "react-router";

export default function FlowIndex() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl mb-2">VENDOURA — PHASE 1: FLOW ARCHITECTURE</h1>
        <p className="mb-8 text-gray-600">System wireframes: grayscale, logic-only, no design</p>
        
        <div className="space-y-4">
          <FlowLink 
            to="/flow-a"
            title="FLOW A — Application → Admission"
            description="Application · Revenue baseline capture · Commitment screening · Accept/Reject state"
          />
          
          <FlowLink 
            to="/flow-b"
            title="FLOW B — Cohort Entry → Week 1"
            description="Assigned cohort · Assigned revenue track · Stage 1 unlocked · Weekly loop visible"
          />
          
          <FlowLink 
            to="/flow-c"
            title="FLOW C — Weekly Revenue Execution Loop"
            description="Commit → Execute → Report → Diagnose → Adjust → Loop reset [MOST IMPORTANT]"
          />
          
          <FlowLink 
            to="/flow-d"
            title="FLOW D — Stage Locking Logic"
            description="What happens if: No commit · No execution proof · No report"
          />
          
          <FlowLink 
            to="/flow-e"
            title="FLOW E — Graduation"
            description="Revenue delta validation · Revenue System Document completion · Exit state"
          />
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-black">
          <Link to="/page-inventory" className="block border-2 border-black p-6 hover:bg-gray-100">
            <div className="font-bold mb-2">→ PROCEED TO PHASE 2: PAGE INVENTORY</div>
            <div className="text-sm text-gray-600">Decide what screens must exist (no design yet)</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FlowLink({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="block border-2 border-black p-6 hover:bg-gray-100">
      <div className="font-bold mb-2">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </Link>
  );
}
