// Mount: <div id="tattty-generate-root" data-version="{{ product.metafields.custom.version }}" data-customer-id="{{ customer.id }}"></div>
// Then include this script after that div.
(function () {
  var WORKER_URL = "https://api.tattty.com";
  var UPLOAD_URL = "https://model.avi-kay2019.workers.dev";
  var PLACEHOLDER_URL = "https://tattty-uploads.tattty.com/TaTTTyBold.png";

  var styles = {
    page: "min-height:680px;width:100%;background:#e9e9e9;display:flex;align-items:center;justify-content:center;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box;",
    outerWrap: "position:relative;width:100%;max-width:1320px;display:flex;gap:24px;align-items:flex-start;",
    outerWrapRow: "flex-direction:row;",
    outerWrapColumn: "flex-direction:column;",
    card: "position:relative;flex:0 0 480px;width:100%;background:linear-gradient(135deg,#f7f7f7 0%,#ffffff 40%,#f0f0f0 100%);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.25);padding:40px 48px 48px;overflow:hidden;box-sizing:border-box;",
    cardFullWidth: "flex:1 1 100%;",
    label:
      "display:block;font-size:13px;font-weight:700;letter-spacing:1px;color:#222;text-transform:uppercase;margin-bottom:10px;",
    labelRegular:
      "display:block;font-size:15px;font-weight:500;color:#222;margin-bottom:10px;",
    required: "color:#d62828;",
    textarea:
      "width:100%;box-sizing:border-box;min-height:160px;border:1px solid #1a1a1a;border-radius:8px;padding:16px;font-size:15px;font-family:inherit;resize:vertical;box-shadow:0 6px 14px rgba(0,0,0,0.18);margin-bottom:28px;outline:none;",
    row: "display:flex;flex-wrap:wrap;gap:32px;margin-bottom:36px;",
    col: "flex:1 1 220px;min-width:220px;",
    select:
      "width:100%;box-sizing:border-box;border:1px solid #1a1a1a;border-radius:8px;padding:10px 14px;font-size:15px;font-family:inherit;background:#fff;box-shadow:0 6px 14px rgba(0,0,0,0.18);outline:none;",
    fileRow:
      "display:flex;align-items:stretch;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;box-shadow:0 6px 14px rgba(0,0,0,0.18);",
    chooseFileBtn:
      "background:#2b2b2b;color:#fff;border:none;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;",
    fileName:
      "flex:1;display:flex;align-items:center;padding:0 14px;font-size:14px;color:#444;background:#fff;",
    hint: "font-size:12px;color:#888;margin-top:8px;",
    generateBtn:
      "display:block;width:100%;max-width:420px;margin:0 auto;background:linear-gradient(135deg,#3a3a3a,#111);color:#fff;border:none;border-radius:8px;padding:16px 0;font-size:20px;font-style:italic;font-family:Georgia,'Times New Roman',serif;letter-spacing:1px;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,0.3);",

    rightPanel:
      "position:relative;flex:1 1 0;min-width:0;background:linear-gradient(135deg,#f7f7f7 0%,#ffffff 40%,#f0f0f0 100%);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.25);box-sizing:border-box;padding:16px;",
    rightPanelFullWidth: "flex:1 1 100%;",

    idlePlaceholder:
      "width:100%;height:100%;min-height:300px;border-radius:10px;overflow:hidden;background:#f0f0f0;display:flex;align-items:center;justify-content:center;",
    idlePlaceholderImg: "width:100%;height:100%;object-fit:cover;opacity:0.5;",

    grid: "display:grid;grid-template-columns:repeat(2,1fr);gap:14px;height:100%;",
    imageCard:
      "position:relative;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.15);background:#fff;",
    image:
      "width:100%;aspect-ratio:1/1;object-fit:cover;display:block;cursor:pointer;",
    imageCardLoading: "background:#f0f0f0;",
    spinner:
      "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;",
    spinnerCircle:
      "width:36px;height:36px;border:3px solid rgba(0,0,0,0.15);border-top-color:#222;border-radius:50%;animation:tattty-spin 0.8s linear infinite;",
    imageActions:
      "position:absolute;bottom:6px;right:6px;display:flex;gap:6px;",
    iconBtn:
      "background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:6px;width:30px;height:30px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;",

    lightboxOverlay:
      "position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;",
    lightboxImage:
      "max-width:min(90%,800px);max-height:70%;object-fit:contain;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);",
    lightboxClose:
      "position:absolute;top:20px;right:24px;background:transparent;border:none;color:#fff;font-size:36px;line-height:1;cursor:pointer;",
    lightboxNav:
      "position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:32px;width:48px;height:48px;border-radius:50%;cursor:pointer;",
    lightboxActions: "display:flex;gap:14px;margin-top:20px;",
    lightboxActionBtn:
      "background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:10px 18px;font-size:14px;cursor:pointer;",
  };

  var spinnerKeyframes =
    "@keyframes tattty-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}";
  if (!document.getElementById("tattty-spinner-keyframes")) {
    var styleTag = document.createElement("style");
    styleTag.id = "tattty-spinner-keyframes";
    styleTag.textContent = spinnerKeyframes;
    document.head.appendChild(styleTag);
  }

  function el(tag, style, attrs) {
    var node = document.createElement(tag);
    if (style) node.style.cssText = style;
    if (attrs) {
      for (var key in attrs) {
        if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  function mount(root) {
    var version = root.getAttribute("data-version") || "";
    var customerId = root.getAttribute("data-customer-id") || "";

    var state = {
      prompt: "",
      outputs: 4,
      fileName: "No file chosen",
      isGenerating: false,
      images: [],
      lightboxIndex: null,
      file: null,
    };

    function isMobile() {
      return window.innerWidth <= 768;
    }

    var page = el("div", styles.page);
    var outerWrap = el("div", styles.outerWrap + styles.outerWrapRow);
    page.appendChild(outerWrap);

    var card = el("div", styles.card);

    var promptLabel = el("label", styles.label, {
      text: "PROMPT",
      for: "tattty-prompt",
    });
    var textarea = el("textarea", styles.textarea, {
      id: "tattty-prompt",
      rows: "5",
    });
    textarea.addEventListener("input", function (e) {
      state.prompt = e.target.value;
    });

    var row = el("div", styles.row);

    var outputsCol = el("div", styles.col);
    var outputsLabel = el("label", styles.label, { for: "tattty-outputs" });
    outputsLabel.appendChild(document.createTextNode("OUTPUTS "));
    var requiredSpan = el("span", styles.required, { text: "*" });
    outputsLabel.appendChild(requiredSpan);
    var select = el("select", styles.select, { id: "tattty-outputs" });
    [1, 2, 3, 4].forEach(function (n) {
      var opt = el("option", null, { value: n, text: String(n) });
      if (n === 4) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", function (e) {
      state.outputs = Number(e.target.value);
      renderIdleOrGrid();
    });
    outputsCol.appendChild(outputsLabel);
    outputsCol.appendChild(select);

    var fileCol = el("div", styles.col);
    var fileLabel = el("label", styles.labelRegular, {
      text: "File upload optional",
    });
    var fileRow = el("div", styles.fileRow);
    var chooseBtn = el("button", styles.chooseFileBtn, {
      type: "button",
      text: "Choose File",
    });
    var fileNameSpan = el("span", styles.fileName, { text: "No file chosen" });
    var fileInput = el("input", "display:none;", {
      type: "file",
      accept: ".jpeg,.jpg,.png,.webp",
    });
    chooseBtn.addEventListener("click", function () {
      fileInput.click();
    });
    fileInput.addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      state.file = f || null;
      fileNameSpan.textContent = f ? f.name : "No file chosen";
    });
    fileRow.appendChild(chooseBtn);
    fileRow.appendChild(fileNameSpan);
    fileRow.appendChild(fileInput);
    var hint = el("div", styles.hint, {
      text: "Accepted file types: jpeg, webp, png, jpg. Each file must be under 10MB",
    });
    fileCol.appendChild(fileLabel);
    fileCol.appendChild(fileRow);
    fileCol.appendChild(hint);

    row.appendChild(outputsCol);
    row.appendChild(fileCol);

    var generateBtn = el("button", styles.generateBtn, {
      type: "button",
      text: "Generate Now",
    });

    card.appendChild(promptLabel);
    card.appendChild(textarea);
    card.appendChild(row);
    card.appendChild(generateBtn);

    var rightPanel = el("div", styles.rightPanel);

    var idlePlaceholder = el("div", styles.idlePlaceholder);
    var idleImg = el("img", styles.idlePlaceholderImg, {
      src: PLACEHOLDER_URL,
      alt: "Idle placeholder",
    });
    idlePlaceholder.appendChild(idleImg);

    var grid = el("div", styles.grid + "display:none;");

    rightPanel.appendChild(idlePlaceholder);
    rightPanel.appendChild(grid);

    outerWrap.appendChild(card);
    outerWrap.appendChild(rightPanel);

    var lightbox = null;

    function applyLayout() {
      if (isMobile()) {
        outerWrap.style.cssText = styles.outerWrap + styles.outerWrapColumn;
        card.style.cssText = styles.card + styles.cardFullWidth;
        rightPanel.style.cssText = styles.rightPanel + styles.rightPanelFullWidth;
      } else {
        outerWrap.style.cssText = styles.outerWrap + styles.outerWrapRow;
        card.style.cssText = styles.card;
        rightPanel.style.cssText = styles.rightPanel;
      }
    }
    window.addEventListener("resize", applyLayout);
    applyLayout();

    function renderIdleOrGrid() {
      var showGrid = state.isGenerating || state.images.length > 0;
      idlePlaceholder.style.display = showGrid ? "none" : "flex";
      grid.style.display = showGrid ? "grid" : "none";
    }

    function buildSlot(idx, url) {
      var imageCard = el(
        "div",
        styles.imageCard + (url ? "" : styles.imageCardLoading)
      );

      if (url) {
        var img = el("img", styles.image, {
          src: url,
          alt: "Generated result " + (idx + 1),
        });
        img.addEventListener("click", function () {
          openLightbox(idx);
        });
        var actions = el("div", styles.imageActions);
        var downloadBtn = el("button", styles.iconBtn, {
          type: "button",
          "aria-label": "Download image",
          title: "Download",
          text: "⬇",
        });
        downloadBtn.addEventListener("click", function () {
          downloadImage(url, idx);
        });
        var shareBtn = el("button", styles.iconBtn, {
          type: "button",
          "aria-label": "Share image",
          title: "Share",
          text: "⤴",
        });
        shareBtn.addEventListener("click", function () {
          shareImage(url);
        });
        actions.appendChild(downloadBtn);
        actions.appendChild(shareBtn);
        imageCard.appendChild(img);
        imageCard.appendChild(actions);
      } else {
        var spinnerWrap = el("div", styles.spinner);
        var spinnerCircle = el("div", styles.spinnerCircle);
        spinnerWrap.appendChild(spinnerCircle);
        imageCard.appendChild(spinnerWrap);
      }

      return imageCard;
    }

    function renderGrid() {
      grid.innerHTML = "";
      var count = state.images.length > 0 ? state.images.length : state.outputs;
      for (var i = 0; i < count; i++) {
        var url = state.images[i] || null;
        grid.appendChild(buildSlot(i, url));
      }
    }

    function downloadImage(url, idx) {
      fetch(url)
        .then(function (res) {
          return res.blob();
        })
        .then(function (blob) {
          var link = el("a", null, {
            href: URL.createObjectURL(blob),
            download: "generated-" + (idx + 1) + ".png",
          });
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch(function (err) {
          console.error("Download failed:", err);
        });
    }

    function shareImage(url) {
      if (navigator.share) {
        navigator.share({ url: url }).catch(function (err) {
          console.error("Share failed:", err);
        });
      } else {
        navigator.clipboard.writeText(url).then(function () {
          alert("Link copied to clipboard");
        });
      }
    }

    function openLightbox(idx) {
      state.lightboxIndex = idx;
      renderLightbox();
    }

    function closeLightbox() {
      state.lightboxIndex = null;
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
    }

    function renderLightbox() {
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
      if (state.lightboxIndex === null) return;
      var idx = state.lightboxIndex;
      var url = state.images[idx];
      if (!url) return;

      lightbox = el("div", styles.lightboxOverlay);
      lightbox.addEventListener("click", function () {
        closeLightbox();
      });

      var lbClose = el("button", styles.lightboxClose, {
        type: "button",
        "aria-label": "Close preview",
        text: "×",
      });
      lbClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeLightbox();
      });
      lightbox.appendChild(lbClose);

      if (idx > 0) {
        var prevBtn = el("button", styles.lightboxNav + "left:20px;", {
          type: "button",
          "aria-label": "Previous image",
          text: "‹",
        });
        prevBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(idx - 1);
        });
        lightbox.appendChild(prevBtn);
      }
      if (idx < state.images.length - 1) {
        var nextBtn = el("button", styles.lightboxNav + "right:20px;", {
          type: "button",
          "aria-label": "Next image",
          text: "›",
        });
        nextBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(idx + 1);
        });
        lightbox.appendChild(nextBtn);
      }

      var lbImg = el("img", styles.lightboxImage, {
        src: url,
        alt: "Generated result " + (idx + 1),
      });
      lbImg.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      lightbox.appendChild(lbImg);

      var lbActions = el("div", styles.lightboxActions);
      lbActions.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      var lbDownload = el("button", styles.lightboxActionBtn, {
        type: "button",
        text: "⬇ Download",
      });
      lbDownload.addEventListener("click", function () {
        downloadImage(url, idx);
      });
      var lbShare = el("button", styles.lightboxActionBtn, {
        type: "button",
        text: "⤴ Share",
      });
      lbShare.addEventListener("click", function () {
        shareImage(url);
      });
      lbActions.appendChild(lbDownload);
      lbActions.appendChild(lbShare);
      lightbox.appendChild(lbActions);

      document.body.appendChild(lightbox);
    }

    function setGenerating(value) {
      state.isGenerating = value;
      generateBtn.disabled = value;
      generateBtn.textContent = value ? "Generating…" : "Generate Now";
    }

    generateBtn.addEventListener("click", function () {
      if (!state.prompt.trim()) return;
      setGenerating(true);
      state.images = [];
      renderIdleOrGrid();
      renderGrid();

      var uploadPromise = Promise.resolve("");
      if (state.file) {
        var formData = new FormData();
        formData.append("file", state.file);
        uploadPromise = fetch(UPLOAD_URL, { method: "POST", body: formData })
          .then(function (res) {
            if (!res.ok) throw new Error("Upload failed: " + res.status);
            return res.json();
          })
          .then(function (data) {
            return data.url;
          });
      }

      uploadPromise
        .then(function (uploadUrl) {
          return fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              version: version,
              prompt: state.prompt,
              numOutputs: state.outputs,
              uploads: uploadUrl,
              customer_id: customerId,
            }),
          });
        })
        .then(function (res) {
          if (!res.ok) throw new Error("Worker returned " + res.status);
          return res.json();
        })
        .then(function (data) {
          state.images = data.urls;
          renderGrid();
        })
        .catch(function (err) {
          console.error("Generation failed:", err);
        })
        .finally(function () {
          setGenerating(false);
        });
    });

    root.appendChild(page);
  }

  function init() {
    var root = document.getElementById("tattty-generate-root");
    if (root) mount(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
