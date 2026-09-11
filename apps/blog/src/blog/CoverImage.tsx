export function CoverImage({ src, alt, width = 4096, height = 2304 }: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return <img key={src} className="kb-cover kb-loading-cover" src={src} alt={alt} width={width} height={height}
    ref={(image) => { if (image) image.dataset.ready = String(image.complete && image.naturalWidth > 0); }}
    onLoad={(event) => { event.currentTarget.dataset.ready = 'true'; }} />;
}
