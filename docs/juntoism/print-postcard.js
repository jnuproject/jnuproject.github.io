const postcardWidth = 1200;
const postcardHeight = 1776;
const pointsPerMillimeter = 72 / 25.4;
const verticalBleed = 60; // 5 mm at 12 pixels per millimeter.

export function openPostcard(event) {
  const photo = event.currentTarget.closest(".result-page").querySelector(".result-image");
  if (!photo?.naturalWidth || !photo.naturalHeight) return;

  const page = document.createElement("canvas");
  page.width = postcardWidth;
  page.height = postcardHeight;
  const context = page.getContext("2d");
  if (!context) return;

  const photoWidth = photo.naturalWidth;
  const photoHeight = photo.naturalHeight;
  const scale = Math.min(page.width / photoWidth, (page.height - 2 * verticalBleed) / photoHeight);
  const width = Math.round(photo.naturalWidth * scale);
  const height = Math.round(photo.naturalHeight * scale);
  const x = Math.floor((page.width - width) / 2);
  const y = Math.floor((page.height - height) / 2);
  context.fillStyle = "#fff";
  context.fillRect(0, 0, page.width, page.height);
  if (photoWidth * postcardHeight === photoHeight * postcardWidth) {
    // Repeat the frame's outer pixels into the area the printer may crop.
    context.drawImage(photo, 0, 0, photoWidth, 1, 0, 0, page.width, y);
    context.drawImage(photo, 0, photoHeight - 1, photoWidth, 1, 0, y + height, page.width, page.height - y - height);
    context.drawImage(photo, 0, 0, 1, photoHeight, 0, y, x, height);
    context.drawImage(photo, photoWidth - 1, 0, 1, photoHeight, x + width, y, page.width - x - width, height);
  }
  context.drawImage(photo, x, y, width, height);

  const base64 = page.toDataURL("image/jpeg", 0.95).split(",")[1];
  const jpeg = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
  const url = URL.createObjectURL(postcardPDF(jpeg));
  const printWindow = window.open(url, "_blank");
  if (!printWindow) {
    URL.revokeObjectURL(url);
    window.alert("이 사이트의 팝업을 허용한 뒤 다시 인쇄해 주세요.");
    return;
  }

  // Safari gives embedded PDFs web-page margins. Print the loaded PDF as a
  // top-level document so the selected borderless paper settings apply.
  const deadline = performance.now() + 5000;
  function showPrintDialog() {
    if (printWindow.closed) {
      URL.revokeObjectURL(url);
      return;
    }
    if (printWindow.location.href !== url || printWindow.document.readyState !== "complete") {
      if (performance.now() < deadline) window.setTimeout(showPrintDialog, 100);
      return;
    }
    printWindow.addEventListener("afterprint", () => {
      window.setTimeout(() => {
        printWindow.close();
        URL.revokeObjectURL(url);
      }, 0);
    }, { once: true });
    printWindow.focus();
    printWindow.print();
  }

  window.setTimeout(showPrintDialog, 600);
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
