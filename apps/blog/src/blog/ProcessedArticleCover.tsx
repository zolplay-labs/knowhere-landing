import { useEffect, useState } from 'react';
import settings from './local-fluid-cover/product-render-settings.json';
import type { MeshGradientRenderValues } from '../../../login/src/lib/fluid-gradient/mesh-gradient-renderer';

const covers = new Map<string, Promise<string>>();

function processCover(source: string) {
  if (!covers.has(source)) {
    covers.set(source, (async () => {
      const { createMeshGradientSurface } = await import('../../../login/src/lib/fluid-gradient/mesh-gradient-renderer');
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement('canvas');
      const surface = createMeshGradientSurface(canvas);
      try {
        surface.resize(1920, 1080, 1);
        surface.render({ ...settings, pixelDensity: 46, pixelEdgeJitter: 0.09 } as MeshGradientRenderValues, 0,
          { image, rotationDeg: 0, flipHorizontal: false, flipVertical: false });
        return canvas.toDataURL('image/png');
      } finally {
        surface.dispose();
      }
    })());
  }
  return covers.get(source)!;
}

export function ProcessedArticleCover({ source, label }: { source: string; label: string }) {
  const [processed, setProcessed] = useState<string>();
  useEffect(() => {
    let cancelled = false;
    processCover(source).then((result) => { if (!cancelled) setProcessed(result); });
    return () => { cancelled = true; };
  }, [source]);

  return <div className="kb-product-cover" style={{ position: 'relative', aspectRatio: '16 / 9', background: '#f0f2e6' }}>
    {processed && <img className="kb-cover" src={processed} width="1920" height="1080" alt={label} />}
    <div className="kb-lead-content-gradient" />
    <span className="kb-cover-type">{label}</span>
  </div>;
}
