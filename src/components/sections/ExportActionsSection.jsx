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

async function captureSections() {
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
      },
    });
    captures.push(canvas);
  }

  return captures;
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

      const generatedAt = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());

      const canvases = await captureSections();
      const combined = await buildCombinedCanvas(canvases, t, generatedAt);

      if (format === "png") {
        setStatus(t.creatingPng);
        const pngUrl = combined.toDataURL("image/png");
        downloadBlobUrl(pngUrl, `${filenamePrefix}-ranking-pack.png`);
        setStatus(t.successPng);
        return;
      }

      setStatus(t.creatingPdf);
      const imageData = combined.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (combined.height * contentWidth) / combined.width;
      const printableHeight = pageHeight - margin * 2;

      let remainingHeight = contentHeight;
      let yPosition = margin;

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        yPosition,
        contentWidth,
        contentHeight,
      );
      remainingHeight -= printableHeight;

      while (remainingHeight > 0) {
        yPosition = margin - (contentHeight - remainingHeight);
        pdf.addPage();
        pdf.addImage(
          imageData,
          "PNG",
          margin,
          yPosition,
          contentWidth,
          contentHeight,
        );
        remainingHeight -= printableHeight;
      }

      pdf.save(`${filenamePrefix}-ranking-pack.pdf`);
      setStatus(t.successPdf);
    } catch (error) {
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
          <p
            className="mt-3 text-sm font-medium text-slate-700"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
