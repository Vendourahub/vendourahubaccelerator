import { useState } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, FileCheck } from 'lucide-react';

interface Evidence {
  id: string;
  founder_name: string;
  week_number: number;
  evidence_type: 'screenshot' | 'invoice' | 'contract' | 'other';
  evidence_urls: string[];
  revenue_generated: number;
  created_at: string;
  tactic_used?: string;
}

interface EvidenceViewerProps {
  evidence: Evidence[];
  onClose: () => void;
}

export function EvidenceViewer({ evidence, onClose }: EvidenceViewerProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Count by type
  const counts = {
    all: evidence.length,
    screenshot: evidence.filter(e => e.evidence_type === 'screenshot').length,
    invoice: evidence.filter(e => e.evidence_type === 'invoice').length,
    contract: evidence.filter(e => e.evidence_type === 'contract').length,
    other: evidence.filter(e => e.evidence_type === 'other').length
  };

  // Filter evidence
  const filteredEvidence = selectedType === 'all' 
    ? evidence 
    : evidence.filter(e => e.evidence_type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screenshot':
        return <ImageIcon className="w-4 h-4" />;
      case 'invoice':
        return <FileText className="w-4 h-4" />;
      case 'contract':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'screenshot':
        return 'bg-blue-100 text-blue-700';
      case 'invoice':
        return 'bg-green-100 text-green-700';
      case 'contract':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold">Evidence Submissions</h2>
            <p className="text-sm text-neutral-600 mt-1">
              View and download all submitted evidence
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-6 border-b border-neutral-200 overflow-x-auto">
          {[
            { key: 'all', label: 'All Evidence' },
            { key: 'screenshot', label: 'Screenshots' },
            { key: 'invoice', label: 'Invoices' },
            { key: 'contract', label: 'Contracts' },
            { key: 'other', label: 'Other' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === tab.key
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {tab.label} ({counts[tab.key as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Evidence Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredEvidence.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvidence.map((item) => (
                <div
                  key={item.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1">{item.founder_name}</div>
                      <div className="text-xs text-neutral-600">Week {item.week_number}</div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(item.evidence_type)}`}>
                      {getTypeIcon(item.evidence_type)}
                      {item.evidence_type}
                    </span>
                  </div>

                  {/* Evidence Preview/Links */}
                  <div className="space-y-2 mb-3">
                    {item.evidence_urls && item.evidence_urls.length > 0 ? (
                      item.evidence_urls.map((url, index) => (
                        <div key={index} className="relative group">
                          {isImageUrl(url) ? (
                            <div
                              onClick={() => setPreviewUrl(url)}
                              className="cursor-pointer"
                            >
                              <img
                                src={url}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-neutral-600" />
                              <span className="text-sm text-neutral-700 flex-1 truncate">
                                Document {index + 1}
                              </span>
                              <ExternalLink className="w-4 h-4 text-neutral-400" />
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-neutral-500 italic">No files attached</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="pt-3 border-t border-neutral-200 space-y-1">
                    <div className="text-xs text-neutral-600">
                      <span className="font-medium">Revenue:</span> ₦{item.revenue_generated.toLocaleString()}
                    </div>
                    {item.tactic_used && (
                      <div className="text-xs text-neutral-600">
                        <span className="font-medium">Tactic:</span> {item.tactic_used}
                      </div>
                    )}
                    <div className="text-xs text-neutral-500">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <button
                      onClick={() => setSelectedEvidence(item)}
                      className="w-full px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No evidence submitted yet for this filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewUrl}
              alt="Evidence preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <a
              href={previewUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-neutral-100 transition-colors flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedEvidence && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEvidence(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedEvidence.founder_name}</h3>
                  <p className="text-sm text-neutral-600">Week {selectedEvidence.week_number} Evidence</p>
                </div>
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-neutral-700 mb-1">Evidence Type</div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(selectedEvidence.evidence_type)}`}>
                  {getTypeIcon(selectedEvidence.evidence_type)}
                  {selectedEvidence.evidence_type}
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-neutral-700 mb-1">Revenue Generated</div>
                <div className="text-2xl font-bold text-green-600">
                  ₦{selectedEvidence.revenue_generated.toLocaleString()}
                </div>
              </div>

              {selectedEvidence.tactic_used && (
                <div>
                  <div className="text-sm font-medium text-neutral-700 mb-1">Tactic Used</div>
                  <div className="text-neutral-900">{selectedEvidence.tactic_used}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-neutral-700 mb-1">Submitted</div>
                <div className="text-neutral-600">
                  {new Date(selectedEvidence.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {selectedEvidence.evidence_urls && selectedEvidence.evidence_urls.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-neutral-700 mb-2">Attached Files ({selectedEvidence.evidence_urls.length})</div>
                  <div className="space-y-2">
                    {selectedEvidence.evidence_urls.map((url, index) => (
                      <div key={index}>
                        {isImageUrl(url) ? (
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="w-full rounded-lg border border-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPreviewUrl(url)}
                          />
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-neutral-600" />
                            <span className="flex-1 text-sm text-neutral-700">Document {index + 1}</span>
                            <ExternalLink className="w-4 h-4 text-neutral-400" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
