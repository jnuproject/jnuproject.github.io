const postcardWidth = 1200;
const postcardHeight = 1776;
const pointsPerMillimeter = 72 / 25.4;

export function openPostcard(event) {
  const photo = event.currentTarget.closest(".result-page").querySelector(".result-image");
  if (!photo?.naturalWidth || !photo.naturalHeight) return;

  const page = document.createElement("canvas");
  page.width = postcardWidth;
  page.height = postcardHeight;
  const context = page.getContext("2d");
  if (!context) return;

  const scale = Math.min(page.width / photo.naturalWidth, page.height / photo.naturalHeight);
  const width = Math.round(photo.naturalWidth * scale);
  const height = Math.round(photo.naturalHeight * scale);
  const x = Math.floor((page.width - width) / 2);
  const y = Math.floor((page.height - height) / 2);
  context.fillStyle = "#fff";
  context.fillRect(0, 0, page.width, page.height);
  context.drawImage(photo, x, y, width, height);

  const base64 = page.toDataURL("image/jpeg", 0.95).split(",")[1];
  const jpeg = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
  const url = URL.createObjectURL(postcardPDF(jpeg));
  window.open(url, "_blank", "noopener");
  window.setTimeout(() => URL.revokeObjectURL(url), 10 * 60 * 1000);
}

export function postcardPDF(jpeg) {
  // A single JPEG on a single 100 × 148 mm page. PDF coordinates use points.
  const width = (100 * pointsPerMillimeter).toFixed(6);
  const height = (148 * pointsPerMillimeter).toFixed(6);
  const paintPhoto = `q\n${width} 0 0 ${height} 0 0 cm\n/Photo Do\nQ\n`;
  const objects = [
    ["<< /Type /Catalog /Pages 2 0 R /ViewerPreferences << /PrintScaling /None >> >>"],
    ["<< /Type /Pages /Count 1 /Kids [3 0 R] >>"],
    [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}]\n/Resources << /XObject << /Photo 4 0 R >> >> /Contents 5 0 R >>`],
    [`<< /Type /XObject /Subtype /Image /Width ${postcardWidth} /Height ${postcardHeight}\n/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`, jpeg, "\nendstream"],
    [`<< /Length ${paintPhoto.length} >>\nstream\n${paintPhoto}endstream`],
  ];

  // The cross-reference table records the byte offset of each PDF object.
  const encode = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let length = 0;
  function append(part) {
    const bytes = typeof part === "string" ? encode.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  }

  append("%PDF-1.6\n");
  append(new Uint8Array([37, 226, 227, 207, 211, 10]));
  objects.forEach((parts, index) => {
    offsets.push(length);
    append(`${index + 1} 0 obj\n`);
    parts.forEach(append);
    append("\nendobj\n");
  });
  const xref = length;
  append(`xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`);
  offsets.forEach(offset => append(`${String(offset).padStart(10, "0")} 00000 n \n`));
  append(`trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks, { type: "application/pdf" });
}
