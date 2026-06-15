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
  const [pinArray, setPinArray] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setKeyStatus('detecting');
      setPinArray(['', '', '', '', '', '']);
      setErrorMsg('');
      setSigning(false);
      setSigned(false);
      return;
    }
    // Simulate key detection
    const t = setTimeout(() => setKeyStatus('found'), 1500);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Watch pinArray changes to auto-verify when 6 digits are typed
  useEffect(() => {
    const fullPin = pinArray.join('');
    if (fullPin.length === 6) {
      if (fullPin === '123456') {
        setErrorMsg('');
        handleSuccessSign();
      } else {
        setErrorMsg('رمز PIN غير صحيح. يرجى كتابة الرمز الصحيح الخاص بك.');
        setPinArray(['', '', '', '', '', '']);
        // Focus first box
        setTimeout(() => {
          document.getElementById('pin-input-0')?.focus();
        }, 50);
      }
    }
  }, [pinArray]);

  if (!isOpen) return null;

  const handleSuccessSign = async () => {
    setSigning(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSigning(false);
    setSigned(true);
    setTimeout(() => {
      onSigned();
      onClose();
    }, 3500);
  };

  const handlePinChange = (val: string, index: number) => {
    const newVal = val.replace(/\D/g, '').slice(-1);
    const newPinArray = [...pinArray];
    newPinArray[index] = newVal;
    setPinArray(newPinArray);
    setErrorMsg('');

    if (newVal !== '' && index < 5) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (pinArray[index] === '' && index > 0) {
        const newPinArray = [...pinArray];
        newPinArray[index - 1] = '';
        setPinArray(newPinArray);
        const prevInput = document.getElementById(`pin-input-${index - 1}`);
        prevInput?.focus();
        setErrorMsg('');
      } else {
        const newPinArray = [...pinArray];
        newPinArray[index] = '';
        setPinArray(newPinArray);
        setErrorMsg('');
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newPinArray = [...pinArray];
    for (let i = 0; i < pastedData.length; i++) {
      newPinArray[i] = pastedData[i];
    }
    setPinArray(newPinArray);
    setErrorMsg('');

    const nextIdx = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`pin-input-${nextIdx}`);
    nextInput?.focus();
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
                <h3 className="text-white font-medium">التوقيع الإلكتروني الآمن</h3>
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
                <CheckCircle2 className="w-8 h-8 animate-bounce" style={{ color: '#428177' }} />
              </div>
              <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--primary)' }}>
                تم توقيع المعاملة إلكترونياً بنجاح
              </h3>
              <p className="text-sm opacity-90 px-4 leading-relaxed" style={{ color: 'var(--primary)' }}>
                تم التوقيع بواسطة الموظف المعتمد وانتقلت المعاملة للمرحلة التالية (إلى دائرة التخطيط والموارد البشرية).
              </p>
            </div>
          ) : (
            <>
              {/* USB Key Instruction */}
              {keyStatus !== 'found' ? (
                <div
                  className="p-3.5 rounded-xl text-xs leading-relaxed mb-5 border border-dashed flex items-start gap-2.5 animate-pulse"
                  style={{ backgroundColor: 'rgba(107,31,42,0.03)', borderColor: 'rgba(107,31,42,0.18)', color: '#6b1f2a' }}
                >
                  <span className="text-base shrink-0">🔌</span>
                  <div>
                    <p className="font-bold mb-0.5">الرجاء إدخال الفلاشة:</p>
                    <p>يرجى توصيل الفلاشة الخاصة بك التي تحتوي على مفتاح الأمان والتوقيع الإلكتروني الخاص بالموظف للبدء.</p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3.5 rounded-xl text-xs leading-relaxed mb-5 border flex items-start gap-2.5"
                  style={{ backgroundColor: 'rgba(66,129,119,0.05)', borderColor: 'rgba(66,129,119,0.2)', color: '#428177' }}
                >
                  <span className="text-base shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-0.5">تم التحقق من الفلاشة:</p>
                    <p>تم الكشف عن مفتاح الأمان والتوقيع الإلكتروني بنجاح. يرجى إدخال رمز PIN للموظف المكون من 6 أرقام لتوقيع المعاملة.</p>
                  </div>
                </div>
              )}

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
                    ) : (
                      <Usb className="w-5 h-5" style={{ color: '#428177' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">
                      {keyStatus === 'detecting' && 'جاري البحث عن مفتاح الأمان (الفلاشة)...'}
                      {keyStatus === 'found' && 'تم اكتشاف مفتاح الأمان (USB Key) بنجاح'}
                    </p>
                    <p className="text-xs mt-0.5 opacity-50">
                      {keyStatus === 'detecting' && 'يرجى الانتظار...'}
                      {keyStatus === 'found' && 'Secure eToken — Serial: AE3F9D2C'}
                    </p>
                  </div>
                  {keyStatus === 'found' && (
                    <div className="mr-auto w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#428177' }} />
                  )}
                </div>
              </div>

              {/* PIN Field */}
              <div className="mb-5">
                <label className="text-sm opacity-70 mb-3 block text-center font-medium">رمز PIN للموظف (6 أرقام)</label>
                <div className="flex justify-center gap-2.5" style={{ direction: 'ltr' }}>
                  {pinArray.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pin-input-${idx}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      disabled={keyStatus !== 'found' || signing}
                      className="w-12 h-12 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all"
                      style={{
                        borderColor: errorMsg ? 'var(--destructive)' : digit ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: keyStatus === 'found' ? 'white' : 'var(--beige)',
                        color: 'var(--primary)',
                        boxShadow: digit && !errorMsg ? '0 0 0 2px rgba(5,66,57,0.15)' : 'none',
                      }}
                    />
                  ))}
                </div>
                {errorMsg && (
                  <p className="text-xs text-center mt-3 font-medium" style={{ color: 'var(--destructive)' }}>
                    ❌ {errorMsg}
                  </p>
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
              <div className="flex gap-3 justify-between">
                {signing ? (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: 'var(--primary)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري توقيع المعاملة واعتمادها...
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-sm border transition-all hover:bg-gray-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--charcoal-medium)' }}
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
