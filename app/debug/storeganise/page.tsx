// app/debug/storeganise/page.tsx
import { getSites } from '@/lib/api/storeganise';

export const dynamic = 'force-dynamic';

export default async function StoreganiseDebugPage() {
  let sites: any[] = [];
  let error = null;

  try {
    sites = await getSites();
  } catch (e: any) {
    error = e.message || 'An unknown error occurred';
    if (e.name === 'StoreganiseError') {
      error += ` (Status: ${e.status})`;
    }
  }


  // Helper to extract string from potential LocalizedString object
  const getString = (val: any) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') return val.en || Object.values(val)[0] || JSON.stringify(val);
    return 'N/A';
  };

  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Storeganise API Debug</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline ml-2">Successfully connected to API</span>
          </div>
        )}
      </div>

      {sites.length > 0 && (
        <div className="space-y-6 text-black ">
          <section>
            <h2 className="text-xl font-semibold mb-2">Sites Found: {sites.length}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site: any) => (
                <div key={site.id} className="border p-4 rounded shadow bg-white flex flex-col gap-2">
                  <div className="h-40 bg-gray-200 relative mb-2">
                    {site.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={site.image} alt={getString(site.title)} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg">{getString(site.title)}</h3>
                  <p className="text-xs text-gray-500 font-mono">{site.code}</p>

                  <div className="text-sm space-y-1">
                    <p>📍 {getString(site.address)}</p>
                    <p>📧 {site.email}</p>
                    <p>📞 {site.phone}</p>
                  </div>

                  <h4 className="font-semibold mt-3 text-sm border-b pb-1">Unit Types ({site.unitTypes?.length || 0})</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {site.unitTypes && site.unitTypes.length > 0 ? (
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {site.unitTypes.map((ut: any) => (
                          <li key={ut.id}>
                            <span className="font-semibold">{getString(ut.title)}</span>
                            <span className="text-gray-600 ml-1">
                              {ut.width}x{ut.depth} {site.measure}
                            </span>
                            {ut.price > 0 && (
                              <span className="ml-1 text-green-600 font-bold">
                                {ut.price} {ut.currency}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No unit types available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Raw Response (First Item)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs border">
              {JSON.stringify(sites[0], null, 2)}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}
