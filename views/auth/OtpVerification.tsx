import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onVerificationSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCheckEmail = () => {
    setLoading(true);
    setError('');
    setSuccess('Please check your email and click the verification link. Once verified, you can proceed to create your channel.');
    
    // In a real app, you might want to poll for verification status
    // For now, we'll just show a success message and allow manual progression
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Check your email</h1>
          <p className="text-zinc-400 mt-2">We sent a verification link to {email}</p>
        </div>
      </div>

      <div className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{success}</div>}
        
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Verification email sent!</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Click the verification link in your email to activate your account. 
            The link will expire in 24 hours.
          </p>
          
          <Button onClick={handleCheckEmail} className="w-full mb-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'I\'ve verified my email'}
          </Button>
          
          {success && (
            <Button onClick={onVerificationSuccess} className="w-full" variant="outline">
              Continue to Channel Setup
            </Button>
          )}
        </div>
        
        <div className="text-center text-sm text-zinc-500">
          Didn't receive the email? Check your spam folder or <button type="button" className="text-primary hover:underline font-medium">resend verification email</button>
        </div>
      </div>
    </div>
  );
};