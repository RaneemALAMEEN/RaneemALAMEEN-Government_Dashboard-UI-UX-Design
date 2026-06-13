import { useState, useEffect } from 'react';
import { Shield, Key, X, Eye, EyeOff, CheckCircle2, Loader2, Usb } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSigned: () => void;
  documentTitle?: string;
}

type KeyStatus = 'detecting' | 'found' | 'not-found';

export function SignatureModal({ isOpen, onClose, onSigned, documentTitle }: SignatureModalProps) {
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('detecting');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setKeyStatus('detecting');
      setPin('');
      setSigning(false);
      setSigned(false);
      return;
    }
    // Simulate key detection
    const t = setTimeout(() => setKeyStatus('found'), 1800);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSign = async () => {
    if (pin.length < 4) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 2200));
    setSigning(false);
    setSigned(true);
    setTimeout(() => {
      onSigned();
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget && !signing) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ direction: 'rtl' }}>

        {/* Header */}
        <div
          className="p-5 border-b"
          style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #054239 0%, #428177 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">التوقيع الإلكتروني الآمن</h3>
                <p className="text-xs text-white/70">
                  {documentTitle ?? 'توقيع المعاملة الرسمية'}
                </p>
              </div>
            </div>
            {!signing && !signed && (
              <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Success State */}
          {signed ? (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(66,129,119,0.12)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#428177' }} />
              </div>
              <h3 className="mb-2" style={{ color: 'var(--primary)' }}>
                تم توقيع المعاملة إلكترونياً بنجاح
              </h3>
              <p className="text-sm opacity-60">
                تم ختم المستند وإرساله للمرحلة التالية
              </p>
            </div>
          ) : (
            <>
              {/* Instruction */}
              <p className="text-sm opacity-60 mb-5 leading-relaxed">
                يرجى توصيل مفتاح الأمان الإلكتروني الخاص بك ثم إدخال رمز PIN لإتمام عملية التوقيع.
              </p>

              {/* Key Detection Status */}
              <div
                className="p-4 rounded-xl border mb-5"
                style={{
                  borderColor: keyStatus === 'found' ? 'rgba(66,129,119,0.3)' : 'var(--border)',
                  backgroundColor: keyStatus === 'found' ? 'rgba(66,129,119,0.05)' : 'var(--beige)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: keyStatus === 'found' ? 'rgba(66,129,119,0.1)' : 'rgba(5,66,57,0.06)',
                    }}
                  >
                    {keyStatus === 'detecting' ? (
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} />
                    ) : keyStatus === 'found' ? (
                      <Usb className="w-5 h-5" style={{ color: '#428177' }} />
                    ) : (
                      <Key className="w-5 h-5 opacity-40" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">
                      {keyStatus === 'detecting' && 'جاري البحث عن مفتاح الأمان...'}
                      {keyStatus === 'found' && 'تم اكتشاف مفتاح الأمان بنجاح'}
                      {keyStatus === 'not-found' && 'لم يتم اكتشاف مفتاح الأمان'}
                    </p>
                    <p className="text-xs mt-0.5 opacity-50">
                      {keyStatus === 'detecting' && 'يرجى الانتظار...'}
                      {keyStatus === 'found' && 'eToken Pro — Serial: AE3F9D2C'}
                      {keyStatus === 'not-found' && 'تأكد من توصيل مفتاح USB'}
                    </p>
                  </div>
                  {keyStatus === 'found' && (
                    <div className="mr-auto w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#428177' }} />
                  )}
                </div>
              </div>

              {/* PIN Field */}
              <div className="mb-5">
                <label className="text-sm opacity-70 mb-2 block">رمز PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="أدخل رمز PIN الخاص بمفتاحك"
                    disabled={keyStatus !== 'found' || signing}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none tracking-widest"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: keyStatus === 'found' ? 'white' : 'var(--beige)',
                      opacity: keyStatus !== 'found' ? 0.5 : 1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-all"
                    disabled={keyStatus !== 'found'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pin.length > 0 && pin.length < 4 && (
                  <p className="text-xs mt-1" style={{ color: '#6b1f2a' }}>رمز PIN يجب أن يكون 4 أرقام على الأقل</p>
                )}
              </div>

              {/* Security Notice */}
              <div
                className="p-3 rounded-lg text-xs leading-relaxed mb-5"
                style={{ backgroundColor: 'rgba(5,66,57,0.04)', color: 'var(--charcoal-medium)' }}
              >
                🔒 عملية التوقيع تتم بشكل آمن ومشفر وفق معايير PKI الحكومية. لا تشارك رمز PIN مع أي شخص.
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSign}
                  disabled={keyStatus !== 'found' || pin.length < 4 || signing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                  {signing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> جاري التوقيع...</>
                  ) : (
                    <><Shield className="w-4 h-4" /> توقيع واعتماد المعاملة</>
                  )}
                </button>
                {!signing && (
                  <button
                    onClick={onClose}
                    className="px-5 py-3 rounded-xl text-sm border transition-all hover:bg-gray-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
