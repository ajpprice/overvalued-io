import * as React from 'react';

/**
 * OVERVALUED · Disclaimer banner.
 * Fixed to the bottom of every page. Required by ✱ THE LAWYERS ✱.
 */
export function DisclaimerBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        background: 'var(--ov-red)',
        color: '#fff',
        padding: '8px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textAlign: 'center',
        borderTop: '1px solid #4a0e15',
      }}
    >
      ⚠ NOT FINANCIAL ADVICE · FOR ENTERTAINMENT &amp; CATHARSIS · DO YOUR OWN DD · SHORT SELLING CAN LOSE MORE THAN YOUR PRINCIPAL ⚠
    </div>
  );
}
