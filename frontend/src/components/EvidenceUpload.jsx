import React, { useRef } from 'react'
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Info, CheckCircle2 } from 'lucide-react'

export function EvidenceUpload({
  imagePreviewUrl,
  onImageSelect,
  onImageRemove,
  selectedFileName = null,
  disabled = false
}) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageSelect(reader.result, file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageRemove()
  }

  const handleReplace = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
        id="evidence-file-input"
      />

      {!imagePreviewUrl ? (
        /* Upload Area */
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            border: '1.5px dashed rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = 'var(--gold-primary)'
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.06)'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'
            }
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Upload size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.92rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em'
              }}
            >
              UPLOAD EVIDENCE
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Select screenshot of completed work, photo of handwritten code, workout, or project (PNG, JPG)
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            background: '#070b14',
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.8)'
          }}
        >
          <img
            src={imagePreviewUrl}
            alt="Quest Evidence Preview"
            style={{
              width: '100%',
              maxHeight: '220px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Action buttons on top of preview */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 2
            }}
          >
            <button
              type="button"
              onClick={handleReplace}
              disabled={disabled}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.6)',
                borderRadius: '6px',
                color: '#38bdf8',
                padding: '0.4rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-title)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              <RefreshCw size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(244, 63, 94, 0.6)',
                borderRadius: '6px',
                color: '#fb7185',
                padding: '0.4rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-title)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>

          {/* Bottom Confirmation Strip */}
          <div
            style={{
              padding: '0.6rem 1rem',
              background: 'rgba(8, 12, 22, 0.95)',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} />
              <span>Evidence attached: {selectedFileName || 'evidence.png'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ready for verification</span>
          </div>
        </div>
      )}

      {/* Supporting Evidence Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          marginTop: '0.75rem',
          padding: '0.65rem 0.9rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45
        }}
      >
        <Info size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Supporting Evidence Note:</strong> Uploading an image provides supporting reference telemetry. It does not automatically grant rewards; the submission will be queued for system verification.
        </span>
      </div>
    </div>
  )
}

export default EvidenceUpload
