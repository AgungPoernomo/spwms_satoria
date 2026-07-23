import { useState } from 'react';

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors relative focus:outline-none ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
