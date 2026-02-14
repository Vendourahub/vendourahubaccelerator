import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Info, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface HelpSection {
  title: string;
  content: string | React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'tip';
}

interface HelpPanelProps {
  sections: HelpSection[];
  storageKey?: string;
}

export function HelpPanel({ sections, storageKey = 'help_panel_open' }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isOpen));
  }, [isOpen, storageKey]);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getColors = (type?: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'success': return 'bg-green-50 border-green-200 text-green-900';
      case 'tip': return 'bg-purple-50 border-purple-200 text-purple-900';
      default: return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600';
      case 'success': return 'text-green-600';
      case 'tip': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 transition-all hover:scale-110"
        title={isOpen ? 'Hide Help' : 'Show Help'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
      </button>

      {/* Help Panel - Slide Out */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-neutral-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-neutral-700" />
              <h3 className="font-bold text-lg">Page Guide</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getColors(section.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${getIconColor(section.type)}`}>
                    {getIcon(section.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">{section.title}</h4>
                    {typeof section.content === 'string' ? (
                      <p className="text-sm leading-relaxed opacity-90">{section.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed opacity-90">{section.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <p className="text-xs text-neutral-600 text-center">
              This help panel can be toggled anytime using the{' '}
              <HelpCircle className="w-3 h-3 inline" /> button
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// Inline tooltip component for contextual help
export function HelpTooltip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className={`p-1 text-neutral-400 hover:text-neutral-600 transition-colors ${className}`}
      >
        <Info className="w-4 h-4" />
      </button>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-neutral-900 text-white text-xs rounded-lg shadow-xl bottom-full left-1/2 -translate-x-1/2 mb-2">
          {children}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-neutral-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
