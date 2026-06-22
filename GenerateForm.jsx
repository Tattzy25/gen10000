import React, { useState, useRef, useEffect } from "react";

const WORKER_URL = "https://api.tattty.com";
const UPLOAD_URL = "https://model.avi-kay2019.workers.dev";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// version  <- Liquid: {{ product.metafields.custom.version }}
// customerId <- Liquid: {{ customer.id }}
export default function GenerateForm({ version, customerId }) {
  const [prompt, setPrompt] = useState("");
  const [outputs, setOutputs] = useState(4);
  const [fileName, setFileName] = useState("No file chosen");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);
  const isMobile = useIsMobile();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "No file chosen");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setDrawerOpen(true);
    setImages([]);

    try {
      let uploadUrl = "";
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch(UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          throw new Error(`Upload failed: ${uploadRes.status}`);
        }
        const uploadData = await uploadRes.json();
        uploadUrl = uploadData.url;
      }

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          prompt,
          numOutputs: outputs,
          uploads: uploadUrl,
          customer_id: customerId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Worker returned ${res.status}`);
      }

      const data = await res.json();
      setImages(data.urls);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url, idx) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `generated-${idx + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleShare = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <label style={styles.label} htmlFor="prompt">
          PROMPT
        </label>
        <textarea
          id="prompt"
          style={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder=""
          rows={5}
        />

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label} htmlFor="outputs">
              OUTPUTS <span style={styles.required}>*</span>
            </label>
            <select
              id="outputs"
              style={styles.select}
              value={outputs}
              onChange={(e) => setOutputs(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.col}>
            <label style={styles.labelRegular}>File upload optional</label>
            <div style={styles.fileRow}>
              <button
                type="button"
                style={styles.chooseFileBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </button>
              <span style={styles.fileName}>{fileName}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpeg,.jpg,.png,.webp"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div style={styles.hint}>
              Accepted file types: jpeg, webp, png, jpg. Each file must be under 10MB
            </div>
          </div>
        </div>

        <button
          type="button"
          style={styles.generateBtn}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating…" : "Generate Now"}
        </button>

        {/* Overlay behind the drawer */}
        {drawerOpen && (
          <div
            style={styles.overlay}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Results drawer: slides out from the right edge of THIS card on desktop, bottom edge on mobile */}
        <div
          style={{
            ...styles.drawer,
            ...(isMobile ? styles.drawerMobile : styles.drawerDesktop),
            ...(drawerOpen
              ? isMobile
                ? styles.drawerMobileOpen
                : styles.drawerDesktopOpen
              : isMobile
              ? styles.drawerMobileClosed
              : styles.drawerDesktopClosed),
          }}
        >
          <div style={styles.drawerHeader}>
            <span style={styles.drawerTitle}>Results</span>
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setDrawerOpen(false)}
              aria-label="Close results"
            >
              ×
            </button>
          </div>

          <div style={styles.drawerBody}>
            {isGenerating && images.length === 0 && (
              <div style={styles.statusText}>Generating your images…</div>
            )}

            {!isGenerating && images.length === 0 && (
              <div style={styles.statusText}>
                Your generated images will show up here.
              </div>
            )}

            <div style={styles.grid}>
              {images.map((url, idx) => (
                <div key={idx} style={styles.imageCard}>
                  <img
                    src={url}
                    alt={`Generated result ${idx + 1}`}
                    style={styles.image}
                    onClick={() => setLightboxIndex(idx)}
                  />
                  <div style={styles.imageActions}>
                    <button
                      type="button"
                      style={styles.iconBtn}
                      onClick={() => handleDownload(url, idx)}
                      aria-label="Download image"
                      title="Download"
                    >
                      ⬇
                    </button>
                    <button
                      type="button"
                      style={styles.iconBtn}
                      onClick={() => handleShare(url)}
                      aria-label="Share image"
                      title="Share"
                    >
                      ⤴
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox — also contained within this card */}
        {lightboxIndex !== null && images[lightboxIndex] && (
          <div
            style={styles.lightboxOverlay}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              style={styles.lightboxClose}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close preview"
            >
              ×
            </button>

            {lightboxIndex > 0 && (
              <button
                type="button"
                style={{ ...styles.lightboxNav, left: "20px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            {lightboxIndex < images.length - 1 && (
              <button
                type="button"
                style={{ ...styles.lightboxNav, right: "20px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}

            <img
              src={images[lightboxIndex]}
              alt={`Generated result ${lightboxIndex + 1}`}
              style={styles.lightboxImage}
              onClick={(e) => e.stopPropagation()}
            />

            <div
              style={styles.lightboxActions}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                style={styles.lightboxActionBtn}
                onClick={() =>
                  handleDownload(images[lightboxIndex], lightboxIndex)
                }
              >
                ⬇ Download
              </button>
              <button
                type="button"
                style={styles.lightboxActionBtn}
                onClick={() => handleShare(images[lightboxIndex])}
              >
                ⤴ Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "680px",
    width: "100%",
    background: "#e9e9e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxSizing: "border-box",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "880px",
    height: "600px",
    background:
      "linear-gradient(135deg, #f7f7f7 0%, #ffffff 40%, #f0f0f0 100%)",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    padding: "40px 48px 48px",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#222",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  labelRegular: {
    display: "block",
    fontSize: "15px",
    fontWeight: 500,
    color: "#222",
    marginBottom: "10px",
  },
  required: {
    color: "#d62828",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "160px",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
    marginBottom: "28px",
    outline: "none",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    marginBottom: "36px",
  },
  col: {
    flex: "1 1 220px",
    minWidth: "220px",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "15px",
    fontFamily: "inherit",
    background: "#fff",
    boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
    outline: "none",
  },
  fileRow: {
    display: "flex",
    alignItems: "stretch",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
  },
  chooseFileBtn: {
    background: "#2b2b2b",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  fileName: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    fontSize: "14px",
    color: "#444",
    background: "#fff",
  },
  hint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "8px",
  },
  generateBtn: {
    display: "block",
    width: "100%",
    maxWidth: "420px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #3a3a3a, #111)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "16px 0",
    fontSize: "20px",
    fontStyle: "italic",
    fontFamily: "Georgia, 'Times New Roman', serif",
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
  },

  // Overlay
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 40,
  },

  // Drawer base
  drawer: {
    position: "absolute",
    background: "#fafafa",
    boxShadow: "0 0 30px rgba(0,0,0,0.3)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-out",
  },
  drawerDesktop: {
    top: 0,
    right: 0,
    height: "100%",
    width: "min(420px, 90%)",
  },
  drawerDesktopOpen: {
    transform: "translateX(0)",
  },
  drawerDesktopClosed: {
    transform: "translateX(100%)",
  },
  drawerMobile: {
    left: 0,
    bottom: 0,
    width: "100%",
    height: "70%",
    borderRadius: "16px 16px 0 0",
  },
  drawerMobileOpen: {
    transform: "translateY(0)",
  },
  drawerMobileClosed: {
    transform: "translateY(100%)",
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderBottom: "1px solid #e2e2e2",
  },
  drawerTitle: {
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#222",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "26px",
    lineHeight: 1,
    color: "#444",
    cursor: "pointer",
    padding: "0 4px",
  },
  drawerBody: {
    padding: "20px",
    overflowY: "auto",
    flex: 1,
  },
  statusText: {
    fontSize: "14px",
    color: "#777",
    textAlign: "center",
    padding: "30px 10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  imageCard: {
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    background: "#fff",
  },
  image: {
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    display: "block",
    cursor: "pointer",
  },
  imageActions: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    display: "flex",
    gap: "6px",
  },
  iconBtn: {
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    width: "30px",
    height: "30px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Lightbox
  lightboxOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  lightboxImage: {
    maxWidth: "min(90%, 800px)",
    maxHeight: "70%",
    objectFit: "contain",
    borderRadius: "8px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  },
  lightboxClose: {
    position: "absolute",
    top: "20px",
    right: "24px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "36px",
    lineHeight: 1,
    cursor: "pointer",
  },
  lightboxNav: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    fontSize: "32px",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  lightboxActions: {
    display: "flex",
    gap: "14px",
    marginTop: "20px",
  },
  lightboxActionBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
