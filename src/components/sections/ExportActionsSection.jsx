import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const SECTION_IDS = ["module", "classement", "retenues"];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function captureSections({ simplified = false } = {}) {
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    Boolean,
  );

  if (sections.length !== SECTION_IDS.length) {
    throw new Error("missing-sections");
  }

  const captures = [];
  for (const section of sections) {
    const canvas = await html2canvas(section, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: Math.max(document.documentElement.clientWidth, 1280),
      scrollY: -window.scrollY,
      foreignObjectRendering: !simplified,
      onclone: (clonedDoc) => {
        const clonedSection = clonedDoc.getElementById(section.id);
        if (!clonedSection) {
          return;
        }

        // External images (e.g. flag CDN) can taint canvas and break PDF/PNG export.
        const externalImages = clonedSection.querySelectorAll(
          "img[src^='http://'], img[src^='https://']",
        );

        externalImages.forEach((img) => {
          img.style.visibility = "hidden";
        });

        if (simplified) {
          clonedDoc
            .querySelectorAll("style, link[rel='stylesheet']")
            .forEach((node) => node.remove());

          clonedDoc.documentElement.style.background = "#ffffff";
          clonedDoc.documentElement.style.color = "#0f172a";
          clonedDoc.body.style.background = "#ffffff";
          clonedDoc.body.style.color = "#0f172a";

          const safeStyle = clonedDoc.createElement("style");
          safeStyle.textContent = `
            #${section.id}, #${section.id} * {
              color: #0f172a !important;
              background-image: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
              filter: none !important;
            }

            #${section.id} {
              background: #ffffff !important;
              border: 1px solid #dbeafe !important;
              border-radius: 14px !important;
              padding: 12px !important;
            }

            #${section.id} h1,
            #${section.id} h2,
            #${section.id} h3,
            #${section.id} h4,
            #${section.id} th {
              color: #0646c4 !important;
            }

            #${section.id} table {
              width: 100% !important;
              border-collapse: collapse !important;
              background: #ffffff !important;
            }

            #${section.id} th,
            #${section.id} td {
              border: 1px solid #dbeafe !important;
              padding: 6px 8px !important;
              text-align: left !important;
              background: #ffffff !important;
            }
          `;

          clonedDoc.head.appendChild(safeStyle);
        }
      },
    });

    if (isCanvasLikelyBlank(canvas)) {
      throw new Error("blank-capture");
    }

    captures.push(canvas);
  }

  return captures;
}

function isCanvasLikelyBlank(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || canvas.width === 0 || canvas.height === 0) {
    return true;
  }

  const sampleSize = 24;
  let nonWhiteCount = 0;
  let samples = 0;

  for (let y = 0; y < sampleSize; y += 1) {
    for (let x = 0; x < sampleSize; x += 1) {
      const px = Math.floor((x / (sampleSize - 1)) * (canvas.width - 1));
      const py = Math.floor((y / (sampleSize - 1)) * (canvas.height - 1));
      const [r, g, b, a] = ctx.getImageData(px, py, 1, 1).data;

      const isVisible = a > 10 && !(r > 245 && g > 245 && b > 245);
      if (isVisible) {
        nonWhiteCount += 1;
      }
      samples += 1;
    }
  }

  return nonWhiteCount / samples < 0.01;
}

async function buildCombinedCanvas(canvases, t, generatedAt) {
  const width = Math.max(...canvases.map((canvas) => canvas.width));
  const gap = 28;
  const headerHeight = 170;
  const footerHeight = 44;
  const totalHeight =
    headerHeight +
    footerHeight +
    canvases.reduce((sum, canvas) => sum + canvas.height, 0) +
    gap * (canvases.length - 1);

  const combined = document.createElement("canvas");
  combined.width = width;
  combined.height = totalHeight;

  const ctx = combined.getContext("2d");
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, totalHeight);

  ctx.fillStyle = "#0646c4";
  ctx.fillRect(0, 0, width, headerHeight);

  const logo = await loadImage("/images/logo_fifve.jpeg");
  const logoSize = 88;
  const logoY = 24;
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    40 + logoSize / 2,
    logoY + logoSize / 2,
    logoSize / 2,
    0,
    Math.PI * 2,
  );
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(logo, 40, logoY, logoSize, logoSize);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px Arial";
  ctx.fillText("FIFVE 2026", 154, 68);
  ctx.font = "400 22px Arial";
  ctx.fillText(t.exportDocumentTitle, 154, 106);

  ctx.font = "600 18px Arial";
  ctx.fillStyle = "#cfe0ff";
  ctx.fillText(`${t.generatedOn}: ${generatedAt}`, 40, 148);

  let y = headerHeight;
  for (const canvas of canvases) {
    const x = Math.floor((width - canvas.width) / 2);
    ctx.drawImage(canvas, x, y);
    y += canvas.height + gap;
  }

  ctx.fillStyle = "#64748b";
  ctx.font = "600 16px Arial";
  ctx.fillText("www.fifve.com", 40, totalHeight - 16);

  return combined;
}

function imageToDataUrl(image, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);

  return canvas.toDataURL("image/png");
}

function drawPdfHeader(pdf, t, generatedAt, logoDataUrl) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(6, 70, 196);
  pdf.rect(0, 0, pageWidth, 28, "F");

  if (logoDataUrl) {
    pdf.addImage(logoDataUrl, "PNG", 10, 4, 16, 16);
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("FIFVE 2026", 30, 12);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(t.exportDocumentTitle, 30, 18);

  pdf.setTextColor(207, 224, 255);
  pdf.setFontSize(8);
  pdf.text(`${t.generatedOn}: ${generatedAt}`, 10, 25);
}

function getSectionLabels(t) {
  return [t.sectionModule, t.sectionRanking, t.sectionSelected];
}

function addCanvasToPdfInSlices(pdf, sourceCanvas, options) {
  const {
    t,
    generatedAt,
    logoDataUrl,
    sectionLabel,
    needsFirstAddPage,
    setFirstPageUsed,
  } = options;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 10;
  const contentTop = 36;
  const contentBottomMargin = 10;
  const contentWidth = pageWidth - marginX * 2;
  const contentMaxHeight = pageHeight - contentTop - contentBottomMargin;

  const chunkHeightPx = Math.max(
    1,
    Math.floor((contentMaxHeight * sourceCanvas.width) / contentWidth),
  );

  let sourceY = 0;
  let isFirstSlice = true;

  while (sourceY < sourceCanvas.height) {
    if (!isFirstSlice || needsFirstAddPage()) {
      pdf.addPage();
    }

    setFirstPageUsed();

    drawPdfHeader(pdf, t, generatedAt, logoDataUrl);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(sectionLabel, marginX, 33);

    const currentChunkHeight = Math.min(
      chunkHeightPx,
      sourceCanvas.height - sourceY,
    );
    const chunkCanvas = document.createElement("canvas");
    chunkCanvas.width = sourceCanvas.width;
    chunkCanvas.height = currentChunkHeight;

    const chunkCtx = chunkCanvas.getContext("2d");
    chunkCtx.fillStyle = "#ffffff";
    chunkCtx.fillRect(0, 0, chunkCanvas.width, chunkCanvas.height);
    chunkCtx.drawImage(
      sourceCanvas,
      0,
      sourceY,
      sourceCanvas.width,
      currentChunkHeight,
      0,
      0,
      chunkCanvas.width,
      chunkCanvas.height,
    );

    const imageData = chunkCanvas.toDataURL("image/jpeg", 0.95);
    const renderedHeight =
      (chunkCanvas.height * contentWidth) / chunkCanvas.width;
    pdf.addImage(
      imageData,
      "JPEG",
      marginX,
      contentTop,
      contentWidth,
      renderedHeight,
    );

    sourceY += currentChunkHeight;
    isFirstSlice = false;
  }
}

async function exportCanvasesToPdf(canvases, t, generatedAt, filename) {
  const pdf = new jsPDF("p", "mm", "a4");
  const labels = getSectionLabels(t);

  let logoDataUrl = "";
  try {
    const logoImage = await loadImage("/images/logo_fifve.jpeg");
    logoDataUrl = imageToDataUrl(logoImage);
  } catch {
    logoDataUrl = "";
  }

  let firstPageUsed = false;

  canvases.forEach((canvas, index) => {
    addCanvasToPdfInSlices(pdf, canvas, {
      t,
      generatedAt,
      logoDataUrl,
      sectionLabel: labels[index] ?? `Section ${index + 1}`,
      needsFirstAddPage: () => firstPageUsed,
      setFirstPageUsed: () => {
        firstPageUsed = true;
      },
    });
  });

  pdf.save(filename);
}

function downloadBlobUrl(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ExportActionsSection({ t }) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [debugError, setDebugError] = useState("");

  const isDebugVisible = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const queryEnabled = params.get("debugExport") === "1";
    const storageEnabled =
      window.localStorage.getItem("fifve-export-debug") === "1";

    return import.meta.env.DEV || queryEnabled || storageEnabled;
  }, []);

  const filenamePrefix = useMemo(() => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `fifve-${yyyy}${mm}${dd}`;
  }, []);

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      setStatus(t.preparingExport);
      setDebugError("");

      const generatedAt = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());

      let usedFallbackCapture = false;
      let canvases;

      try {
        canvases = await captureSections();
      } catch (captureError) {
        const hasOklchIssue =
          captureError instanceof Error &&
          /oklch|unsupported color function|blank-capture/i.test(
            captureError.message,
          );

        if (!hasOklchIssue) {
          throw captureError;
        }

        usedFallbackCapture = true;
        setStatus(t.fallbackCapture);
        canvases = await captureSections({ simplified: true });
      }

      const combined = await buildCombinedCanvas(canvases, t, generatedAt);

      if (format === "png") {
        setStatus(t.creatingPng);
        const pngUrl = combined.toDataURL("image/png");
        downloadBlobUrl(pngUrl, `${filenamePrefix}-ranking-pack.png`);
        setStatus(usedFallbackCapture ? t.successPngFallback : t.successPng);
        return;
      }

      setStatus(t.creatingPdf);
      await exportCanvasesToPdf(
        canvases,
        t,
        generatedAt,
        `${filenamePrefix}-ranking-pack.pdf`,
      );
      setStatus(usedFallbackCapture ? t.successPdfFallback : t.successPdf);
    } catch (error) {
      const errorName =
        error instanceof Error && error.name ? error.name : "UnknownError";
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : String(error ?? "No details");

      if (isDebugVisible) {
        setDebugError(`${errorName}: ${errorMessage}`);
      }

      if (error instanceof Error && error.message === "missing-sections") {
        setStatus(t.errorMissingSections);
      } else if (
        error instanceof DOMException ||
        (error instanceof Error &&
          /tainted|security|cross-origin/i.test(error.message))
      ) {
        setStatus(t.errorCrossOrigin);
      } else {
        setStatus(t.errorGeneric);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-0 pt-8">
      <div className="rounded-3xl border border-blue-100 bg-linear-to-r from-white via-blue-50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#0646c4] md:text-2xl">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0646c4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              {t.downloadPdf}
            </button>

            <button
              type="button"
              onClick={() => handleExport("png")}
              disabled={isExporting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0646c4] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileImage size={16} />
              )}
              {t.downloadPng}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-[#0646c4]">
            <Download size={12} /> {t.includes}
          </span>
          <span>{t.sectionModule}</span>
          <span>•</span>
          <span>{t.sectionRanking}</span>
          <span>•</span>
          <span>{t.sectionSelected}</span>
          <span>•</span>
          <span>{t.withLogo}</span>
        </div>

        {status && (
          <div className="mt-3" role="status" aria-live="polite">
            <p className="text-sm font-medium text-slate-700">{status}</p>
            {isDebugVisible && debugError && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-mono text-xs text-amber-800">
                {t.debugLabel}: {debugError}
              </p>
            )}
            {isDebugVisible && (
              <p className="mt-2 text-xs text-slate-500">{t.debugHint}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
