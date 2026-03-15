import JSZip from "jszip";

/**
 * Build a zip archive from a map of file paths to content strings.
 * Files are placed inside a root folder named after the project.
 */
export async function buildProjectZip(
  files: Record<string, string>,
  projectName: string
): Promise<Buffer> {
  const zip = new JSZip();
  const folder = zip.folder(projectName);

  if (!folder) {
    throw new Error("Failed to create zip folder");
  }

  for (const [filePath, content] of Object.entries(files)) {
    folder.file(filePath, content);
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return buffer;
}
