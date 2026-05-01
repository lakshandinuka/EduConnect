import React, { useEffect, useState } from 'react';

export const PdfViewerWrapper = ({ pdfUrl, title = 'PDF Viewer' }) => {
  const [scale, setScale] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(Boolean(pdfUrl));
  const [error, setError] = useState(null);
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    let revokedUrl = '';
    setObjectUrl('');
    setError(null);
    setLoading(Boolean(pdfUrl));

    if (!pdfUrl) {
      return undefined;
    }

    const loadPdf = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(pdfUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          throw new Error('Could not load the PDF.');
        }
        const blob = await response.blob();
        revokedUrl = URL.createObjectURL(blob);
        setObjectUrl(revokedUrl);
      } catch {
        setError('Could not load the PDF. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [pdfUrl]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 10, 50));
  const handleReset = () => setScale(100);
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      {/* Toolbar */}
      <div className="bg-gray-200 border-b border-gray-300 p-3 flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

        <div className="flex items-center gap-2">
          <button onClick={handleZoomOut} className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-gray-50 text-sm" aria-label="Zoom out">−</button>
          <span className="text-sm font-medium text-gray-700 w-12 text-center">{scale}%</span>
          <button onClick={handleZoomIn} className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-gray-50 text-sm" aria-label="Zoom in">+</button>
          <button onClick={handleReset} className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-gray-50 text-sm" aria-label="Reset zoom">Reset</button>
          <button onClick={handleFullscreen} className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-gray-50 text-sm" aria-label="Toggle fullscreen">
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {loading && <div className="p-6 text-gray-700">Loading PDF…</div>}
        {error && <div className="p-6 text-red-600">{error}</div>}
        {!error && objectUrl && (
          <iframe
            title="pdf-viewer"
            src={objectUrl}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Could not load the PDF. Please try again.');
            }}
            className={`${loading ? 'hidden' : 'block'} border-0`}
            style={{
              width: `${10000 / scale}%`,
              height: isFullscreen ? `${10000 / scale}vh` : `${7000 / scale}vh`,
              transform: `scale(${scale / 100})`,
              transformOrigin: 'top left',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewerWrapper;
