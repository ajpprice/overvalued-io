"use client";
import * as React from 'react';

export interface FilterTabsProps {
  tabs: string[];
  active: string;
  onChange?: (tab: string) => void;
}

export function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--ov-hairline)' }}>
      {tabs.map(t => (
        <div
          key={t}
          onClick={() => onChange?.(t)}
          style={{
            padding: '12px 18px',
            cursor: 'pointer',
            borderBottom: active === t ? '2px solid var(--ov-red)' : '2px solid transparent',
            color: active === t ? '#fff' : 'var(--ov-fg-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: active === t ? 700 : 400,
            marginBottom: -1,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}