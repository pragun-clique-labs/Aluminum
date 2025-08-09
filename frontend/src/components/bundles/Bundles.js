import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bundles')
          .select('*')
          .limit(50);
        if (error) throw error;
        setBundles(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading bundles...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-lg mb-4">bundles</h2>
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">id</th>
              <th className="p-2">description</th>
              <th className="p-2">routes</th>
              <th className="p-2">mcps</th>
              <th className="p-2">project_id</th>
              <th className="p-2">created_at</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-2 font-mono text-xs">{b.id}</td>
                <td className="p-2">{b.description}</td>
                <td className="p-2">{Array.isArray(b.routes) ? b.routes.join(', ') : ''}</td>
                <td className="p-2">{Array.isArray(b.mcps) ? b.mcps.join(', ') : ''}</td>
                <td className="p-2 font-mono text-xs">{b.project_id}</td>
                <td className="p-2">{b.created_at}</td>
              </tr>
            ))}
            {bundles.length === 0 && (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={6}>no bundles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bundles;


