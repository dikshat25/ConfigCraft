import React, { useState } from 'react';
import DynamicField from './DynamicField';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { Layers } from 'lucide-react';
import { crudService } from '../../services';
import toast from 'react-hot-toast';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 border border-accent-danger rounded-lg bg-accent-danger/10 text-accent-danger">Form rendering completely failed.</div>;
    }
    return this.props.children;
  }
}

export default function DynamicForm({ configId, config, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config || !config.fields || config.fields.length === 0) {
    return (
      <EmptyState 
        icon={<Layers size={24} />}
        title="No fields defined"
        description="This configuration has no fields to render."
      />
    );
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await crudService.create(configId, formData);
      toast.success('Record created successfully');
      setFormData({});
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        const fieldErrors = {};
        err.details.forEach(detail => {
          fieldErrors[detail.field] = detail.message;
        });
        setErrors(fieldErrors);
        toast.error('Please fix the validation errors in the form.');
      } else {
        // Handled by axios interceptor
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlobalErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {config.fields.map(field => (
            <DynamicField 
              key={field.name}
              field={field}
              value={formData[field.name] || (field.type === 'checkbox' ? false : '')}
              onChange={(e) => {
                const val = field.type === 'checkbox' ? e.target.checked : e.target.value;
                handleChange(field.name, val);
              }}
              error={errors[field.name]}
            />
          ))}
        </div>
        <div className="pt-4 border-t border-border-subtle flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </div>
      </form>
    </GlobalErrorBoundary>
  );
}
