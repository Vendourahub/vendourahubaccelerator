import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'push' | 'sms';
  active: boolean;
}

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onClose: () => void;
}

export function TemplateEditor({ template, onSave, onClose }: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState(template);

  const handleSave = () => {
    onSave(editedTemplate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold">Edit Template</h2>
            <p className="text-sm text-neutral-600 mt-1">{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Template Type Badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-700">Type:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              template.type === 'email' ? 'bg-blue-100 text-blue-700' :
              template.type === 'push' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {template.type.toUpperCase()}
            </span>
          </div>

          {/* Subject (for email only) */}
          {template.type === 'email' && (
            <div>
              <label className="block text-sm font-medium mb-2">Subject Line</label>
              <input
                type="text"
                value={editedTemplate.subject}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Enter email subject"
              />
            </div>
          )}

          {/* Body */}
          <div>
            <label className="block text-sm font-medium mb-2">Message Body</label>
            <textarea
              value={editedTemplate.body}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
              placeholder="Enter template body..."
            />
            <div className="mt-2 text-xs text-neutral-600">
              <strong>Available variables:</strong> {'{'}founder_name{'}'}, {'{'}week_number{'}'}, {'{'}stage_number{'}'}, {'{'}deadline_time{'}'}, {'{'}platform_url{'}'}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-medium text-neutral-700 mb-3">Preview</div>
            {template.type === 'email' && editedTemplate.subject && (
              <div className="mb-3">
                <div className="text-xs text-neutral-600 mb-1">Subject:</div>
                <div className="font-medium">{editedTemplate.subject}</div>
              </div>
            )}
            <div className="text-xs text-neutral-600 mb-1">Body:</div>
            <div className="whitespace-pre-wrap text-sm bg-white p-3 rounded border border-neutral-200">
              {editedTemplate.body || <span className="text-neutral-400 italic">No content yet...</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
