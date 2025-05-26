'use client'
export default function LanguageSwitcher() {
  return (
    <div style={{
      display: 'flex',
      gap: '5px',
      background: 'var(--header-bg)',
      padding: '5px',
      borderRadius: '4px'
    }}>
      <button style={{ padding: '5px 10px' }}>EN</button>
      <button style={{ padding: '5px 10px' }}>ES</button>
    </div>
  )
}