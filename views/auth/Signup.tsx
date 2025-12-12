import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await authService.signup(formData.name, formData.email, formData.password);
        // On success, move to OTP verification step
        onSignupSuccess(formData.email);
    } catch (err: any) {
        setError(err.message || 'Signup failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
        
        <Input 
          label="Full Name" 
          placeholder="John Doe"
          icon={<User size={18} />}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />

        <Input 
          label="Email" 
          type="email" 
          placeholder="name@example.com"
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <Input 
          label="Password" 
          type="password" 
          placeholder="Create a strong password"
          icon={<Lock size={18} />}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength={6}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account? <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">Log in</button>
      </p>
    </div>
  );
};