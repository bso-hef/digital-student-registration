import JSZip from "jszip";

export async function buildZip(
  files: Array<{ name: string; blob: Blob }>,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const zip = new JSZip();
  for (const f of files) zip.file(f.name, f.blob);
  return zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (m) => onProgress?.(m.percent ?? 0),
  );
}
