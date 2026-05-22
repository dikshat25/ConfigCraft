import React, { useState, useEffect } from 'react';
import { crudService } from '../../services';
import EmptyState from '../ui/EmptyState';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { Table, Database, Trash2, ArrowUpDown } from 'lucide-react';
import { getLabel } from '../../engine/localizationEngine';
import { useLocale } from '../../hooks/useLocale';
import toast from 'react-hot-toast';

export default function DynamicTable({ configId, config }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  const { locale } = useLocale();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await crudService.list(configId, { page, limit: 10, sort, order });
      setData(res.data.records);
      setTotal(res.data.total);
    } catch (err) {
      // errors handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [configId, page, sort, order]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await crudService.delete(configId, id);
      toast.success('Record deleted');
      fetchRecords();
    } catch (err) {
      // errors handled
    }
  };

  if (!config || !config.fields || config.fields.length === 0) {
    return <EmptyState icon={<Table size={24} />} title="No columns defined" description="This configuration has no fields." />;
  }

  if (loading && data.length === 0) {
    return <div className="p-12 flex justify-center"><Spinner /></div>;
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        icon={<Database size={24} />}
        title="No records found"
        description="There are no records to display for this app yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border-subtle bg-bg-secondary">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-subtle">
              {config.fields.map(field => (
                <th 
                  key={field.name} 
                  className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-border-subtle transition-colors"
                  onClick={() => handleSort(field.name)}
                >
                  <div className="flex items-center gap-1">
                    {getLabel(field.label, locale)}
                    {sort === field.name && <ArrowUpDown size={12} className="text-accent-emerald" />}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.map(record => (
              <tr key={record.id} className="hover:bg-bg-tertiary/50 transition-colors">
                {config.fields.map(field => {
                  let val = record.data[field.name];
                  if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
                  if (val === null || val === undefined) val = '-';
                  return (
                    <td key={field.name} className="px-4 py-3 text-sm text-text-primary whitespace-nowrap">
                      {String(val)}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="text-text-tertiary hover:text-accent-danger transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div>Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} results</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="px-2 py-1" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <Button variant="ghost" className="px-2 py-1" disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
