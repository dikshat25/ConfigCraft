import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export default function Signup() {
  const { signup, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (field, value) => {
    try {
      if (field !== 'confirmPassword') {
        signupSchema.pick({ [field]: true }).parse({ [field]: value });
      } else {
        if (value !== formData.password) throw new Error('Passwords do not match');
      }
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      } else {
        setValidationErrors(prev => ({ ...prev, [field]: err.message }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await signup({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      // Handled by hook
    }
  };

  const pwdStrength = formData.password.length > 8 ? 'Strong' : (formData.password.length > 4 ? 'Fair' : 'Weak');
  const pwdColor = pwdStrength === 'Strong' ? 'text-accent-emerald' : (pwdStrength === 'Fair' ? 'text-accent-amber' : 'text-accent-danger');

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md p-8 bg-bg-secondary border border-border-subtle rounded-2xl shadow-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Create an account</h1>
          <p className="text-text-secondary text-sm mt-2">Start building with ConfigCraft</p>
        </div>

        {authError && (
          <div className="mb-6 p-3 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-sm font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            name="name"
            required 
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
          />
          <Input 
            label="Email Address" 
            name="email"
            type="email" 
            required 
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
          />
          <div>
            <Input 
              label="Password" 
              name="password"
              type="password" 
              required 
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password}
            />
            {formData.password && !validationErrors.password && (
              <p className={`text-xs mt-1 font-medium ${pwdColor}`}>Strength: {pwdStrength}</p>
            )}
          </div>
          <Input 
            label="Confirm Password" 
            name="confirmPassword"
            type="password" 
            required 
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
          />

          <Button type="submit" className="w-full mt-4" disabled={loading || Object.keys(validationErrors).length > 0}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account? <Link to="/login" className="text-accent-emerald hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
