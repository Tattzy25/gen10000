// Mount: <div id="tattty-generate-root"
//             data-version="{{ product.metafields.custom.version }}"
//             data-customer-id="{{ customer.id }}"
//             data-trigger-word="{{ product.metafields.custom.trigger_word }}"
//             data-artist-model-rating="{{ product.metafields.custom.artist_model_rating }}"
//             data-image-url="{{ product.metafields.custom.image_url }}"></div>
// Then include this script after that div.
(function () {
  var WORKER_URL = "https://api.tattty.com";
  var UPLOAD_URL = "https://model.avi-kay2019.workers.dev";
  var FALLBACK_REFERENCE_IMAGE_URL = "https://tattty-uploads.tattty.com/TaTTTy-Logo-1024x1024%20(3).png";

  var styles = {
    page: "min-height:680px;width:100%;background:#e9e9e9;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Poppins',system-ui,-apple-system,sans-serif;box-sizing:border-box;",
    outer: "width:100%;max-width:1180px;height:680px;display:flex;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 1px 2px rgba(20,30,60,.04),0 26px 64px -36px rgba(40,80,170,.22);",
    outerRow: "flex-direction:row;",
    outerColumn: "flex-direction:column;height:auto;",

    leftPanel: "min-width:0;display:flex;flex-direction:column;padding:26px;box-sizing:border-box;",
    leftPanelRow: "flex:1;",
    leftPanelColumn: "flex:none;min-height:62vh;",

    dropZone: "flex:1;min-height:0;display:flex;align-items:center;justify-content:center;position:relative;border-radius:16px;background:#f6faff;",

    imageWrap: "position:relative;max-width:100%;max-height:100%;display:flex;align-items:center;justify-content:center;",
    previewImg: "max-width:100%;max-height:100%;border-radius:16px;object-fit:contain;box-shadow:0 12px 34px -20px rgba(0,0,0,.35);display:block;",
    removeBtn: "position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;border:none;background:rgba(255,255,255,.94);box-shadow:0 2px 10px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;",

    uploadPrompt: "display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;",
    uploadHint: "font-size:16px;color:#7c8088;",
    uploadBtnRow: "display:flex;gap:14px;margin-top:6px;",
    uploadBtn: "display:flex;align-items:center;gap:9px;padding:12px 20px;border-radius:12px;border:1px solid #dfe2e6;background:#fff;font-size:14.5px;font-weight:500;color:#141414;cursor:pointer;",
    uploadBtnSolid: "display:flex;align-items:center;gap:9px;padding:12px 20px;border-radius:12px;border:none;background:#f1f2f4;font-size:14.5px;font-weight:500;color:#141414;cursor:pointer;",
    cameraError: "font-size:13px;color:#c0392b;max-width:320px;",

    cameraWrap: "display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;",
    video: "max-width:100%;max-height:62vh;border-radius:16px;background:#000;",
    captureBtn: "padding:12px 26px;border-radius:12px;border:none;background:#16181a;color:#fff;font-size:14.5px;font-weight:600;cursor:pointer;",
    cancelBtn: "padding:12px 22px;border-radius:12px;border:1px solid #dfe2e6;background:#fff;color:#141414;font-size:14.5px;font-weight:500;cursor:pointer;",

    resultsOverlay: "position:absolute;inset:0;padding:2px;display:flex;align-items:center;justify-content:center;",
    resultsGrid: "display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);gap:10px;aspect-ratio:1;max-width:100%;max-height:100%;",
    resultsGridFitH: "height:100%;",
    resultsGridFitW: "width:100%;",
    resultTile: "position:relative;min-height:0;min-width:0;border-radius:12px;overflow:hidden;background:#f3f3f4;box-shadow:0 4px 10px rgba(0,0,0,.12);",
    shimmer: "position:absolute;inset:0;background:linear-gradient(110deg,#ececec 8%,#f6f6f6 18%,#ececec 33%);background-size:440px 100%;animation:tattty3-shimmer 1.4s infinite linear;display:flex;align-items:center;justify-content:center;",
    spinnerCircle: "width:38px;height:38px;border-radius:50%;border:3px solid #dadadd;border-top-color:#a9abb0;animation:tattty3-spin .9s linear infinite;",
    resultImg: "width:100%;height:100%;object-fit:cover;display:block;cursor:zoom-in;",
    resultActions: "position:absolute;bottom:8px;right:8px;display:flex;gap:7px;",
    resultActionBtn: "width:32px;height:32px;border-radius:8px;border:none;background:rgba(0,0,0,.6);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;",

    promptWrap: "flex:none;margin-top:18px;padding-top:16px;",
    textarea: "width:100%;min-height:58px;max-height:130px;resize:vertical;border:1px solid #e6e8ec;border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.45;color:#141414;outline:none;background:#fff;font-family:inherit;",
    noticeRow: "display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:5px;",
    notice: "flex:1;line-height:1.05;",
    noticeNormal: "font-size:12.5px;color:#8b8f96;font-weight:400;text-align:left;",
    noticeError: "font-size:16px;color:#c0392b;font-weight:600;text-align:center;",

    rightPanel: "flex:none;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;",
    rightPanelRow: "width:300px;padding:26px 26px 26px 0;",
    rightPanelColumn: "width:100%;padding:14px;",

    infoRow: "flex:none;padding:11px 14px;border-radius:14px;background:#f7f7f8;border:1px solid #ededf0;display:flex;align-items:center;justify-content:space-between;",
    infoLabel: "font-size:12.5px;color:#8b8f96;font-weight:500;",
    infoValue: "font-size:14px;font-weight:600;color:#141414;",
    triggerBadge: "font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;font-weight:600;color:#141414;background:#ececec;border:1px solid #e0e0e3;border-radius:8px;padding:5px 11px;",

    refImageWrap: "flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;overflow:hidden;",
    refImageBox: "width:100%;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:#f0f0f2;border:1px solid #ededf0;display:flex;align-items:center;justify-content:center;",
    refImagePlaceholder: "display:flex;flex-direction:column;align-items:center;gap:8px;color:#b4b7bd;text-align:center;padding:20px;font-size:12px;font-family:ui-monospace,Menlo,monospace;",
    refImg: "width:100%;height:100%;object-fit:cover;display:block;",

    outputsRow: "flex:none;padding:11px 14px;border-radius:14px;background:#f7f7f8;border:1px solid #ededf0;display:flex;align-items:center;gap:14px;",
    outputsLabel: "font-size:12.5px;color:#8b8f96;font-weight:500;flex:none;",
    outputsSlider: "flex:1;min-width:0;cursor:pointer;",
    outputsValue: "font-size:14px;font-weight:700;color:#141414;flex:none;min-width:14px;text-align:right;",

    generateBtn: "flex:none;width:100%;height:53.5px;display:flex;align-items:center;justify-content:center;border:none;border-radius:14px;padding:0 12px;line-height:1;font-family:'Rock Salt',cursive;font-size:17px;font-weight:600;color:#fff;background:#16181a;cursor:pointer;",

    lightboxOverlay: "position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;",
    lightboxClose: "position:absolute;top:16px;right:22px;background:none;border:none;color:#fff;font-size:36px;line-height:1;cursor:pointer;",
    lightboxNav: "position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:30px;line-height:1;cursor:pointer;",
    lightboxImg: "max-width:min(92%,760px);max-height:74vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.5);",
    lightboxActions: "display:flex;gap:12px;margin-top:18px;",
    lightboxActionBtn: "display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;cursor:pointer;",

    starsRow: "display:flex;align-items:center;gap:9px;",
    starsGroup: "display:flex;gap:2px;",
  };

  var keyframes =
    "@keyframes tattty3-spin{to{transform:rotate(360deg)}}" +
    "@keyframes tattty3-shimmer{0%{background-position:-440px 0}100%{background-position:440px 0}}" +
    ".tattty3-slider{-webkit-appearance:none;appearance:none;height:6px;border-radius:999px;background:#e4e5e8;outline:none;}" +
    ".tattty3-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#16181a;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.28);cursor:pointer;margin-top:-6px;}" +
    ".tattty3-slider::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#16181a;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.28);cursor:pointer;}" +
    ".tattty3-slider::-webkit-slider-runnable-track{height:6px;border-radius:999px;}" +
    ".tattty3-slider::-moz-range-track{height:6px;border-radius:999px;background:#e4e5e8;}";
  if (!document.getElementById("tattty3-keyframes")) {
    var styleTag = document.createElement("style");
    styleTag.id = "tattty3-keyframes";
    styleTag.textContent = keyframes;
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

  function svgIcon(pathHtml, size) {
    var s = size || 18;
    var wrap = el("span", "display:flex;");
    wrap.innerHTML =
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      pathHtml +
      "</svg>";
    return wrap.firstChild;
  }

  var ICONS = {
    upload: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    photo: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  };

  function mount(root) {
    var version = root.getAttribute("data-version") || "";
    var customerId = root.getAttribute("data-customer-id") || "";
    var triggerWord = root.getAttribute("data-trigger-word") || "trigger";
    var artistRatingAttr = parseFloat(root.getAttribute("data-artist-model-rating"));
    var artistRating = isNaN(artistRatingAttr) ? 4.8 : artistRatingAttr;
    var referenceImageUrl = root.getAttribute("data-image-url") || FALLBACK_REFERENCE_IMAGE_URL;

    var state = {
      imageSrc: null,
      file: null,
      prompt: "",
      outputs: 4,
      cameraOn: false,
      cameraError: "",
      results: [],
      view: "create",
      lightboxIndex: null,
      error: "",
    };
    var stream = null;
    var videoEl = null;

    function isMobile() {
      return window.innerWidth <= 860;
    }

    var page = el("div", styles.page);
    var outer = el("div", styles.outer + styles.outerRow);
    page.appendChild(outer);

    var leftPanel = el("div", styles.leftPanel + styles.leftPanelRow);
    var dropZone = el("div", styles.dropZone);
    var fileInput = el("input", "display:none;", { type: "file", accept: "image/*" });

    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && f.type.indexOf("image/") === 0) readFile(f);
    });

    fileInput.addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) readFile(f);
      e.target.value = "";
    });

    function readFile(f) {
      state.file = f;
      var reader = new FileReader();
      reader.onload = function () {
        state.imageSrc = reader.result;
        state.cameraOn = false;
        renderDropZone();
      };
      reader.readAsDataURL(f);
    }

    var promptWrap = el("div", styles.promptWrap);
    var textarea = el("textarea", styles.textarea, {
      rows: "3",
      placeholder: "Or describe your own style — type a prompt to generate without picking presets…",
    });
    textarea.addEventListener("input", function (e) {
      state.prompt = e.target.value;
      state.error = "";
      renderNotice();
    });
    var noticeRow = el("div", styles.noticeRow);
    var notice = el("span", styles.notice + styles.noticeNormal);
    noticeRow.appendChild(notice);
    promptWrap.appendChild(textarea);
    promptWrap.appendChild(noticeRow);

    leftPanel.appendChild(dropZone);
    leftPanel.appendChild(promptWrap);

    var rightPanel = el("div", styles.rightPanel + styles.rightPanelRow);

    var ratingRow = el("div", styles.infoRow);
    var ratingLabel = el("span", styles.infoLabel, { text: "Artist Model Rating" });
    var ratingRight = el("div", styles.starsRow);
    var starsGroup = el("div", styles.starsGroup);
    var ratingValueSpan = el("span", styles.infoValue);
    ratingRight.appendChild(starsGroup);
    ratingRight.appendChild(ratingValueSpan);
    ratingRow.appendChild(ratingLabel);
    ratingRow.appendChild(ratingRight);

    var triggerRow = el("div", styles.infoRow);
    var triggerLabel = el("span", styles.infoLabel, { text: "Trigger" });
    var triggerBadge = el("span", styles.triggerBadge);
    triggerRow.appendChild(triggerLabel);
    triggerRow.appendChild(triggerBadge);

    var refWrap = el("div", styles.refImageWrap);
    var refBox = el("div", styles.refImageBox);
    refWrap.appendChild(refBox);

    var creditRow = el("div", styles.infoRow);
    var creditLabel = el("span", styles.infoLabel, { text: "Credit Cost" });
    var creditValue = el("span", styles.infoValue);
    creditRow.appendChild(creditLabel);
    creditRow.appendChild(creditValue);

    var outputsRow = el("div", styles.outputsRow);
    var outputsLabel = el("span", styles.outputsLabel, { text: "Outputs" });
    var outputsSlider = el("input", styles.outputsSlider, {
      type: "range",
      min: "1",
      max: "4",
      step: "1",
      value: "4",
      class: "tattty3-slider",
    });
    var outputsValue = el("span", styles.outputsValue, { text: "4" });
    outputsSlider.addEventListener("input", function (e) {
      state.outputs = Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1));
      outputsValue.textContent = String(state.outputs);
      renderCredit();
    });
    outputsRow.appendChild(outputsLabel);
    outputsRow.appendChild(outputsSlider);
    outputsRow.appendChild(outputsValue);

    var generateBtn = el("button", styles.generateBtn, { type: "button", text: "Ink Me Up" });

    rightPanel.appendChild(ratingRow);
    rightPanel.appendChild(triggerRow);
    rightPanel.appendChild(refWrap);
    rightPanel.appendChild(creditRow);
    rightPanel.appendChild(outputsRow);
    rightPanel.appendChild(generateBtn);

    outer.appendChild(leftPanel);
    outer.appendChild(rightPanel);

    var lightbox = null;

    function applyLayout() {
      if (isMobile()) {
        outer.style.cssText = styles.outer + styles.outerColumn;
        leftPanel.style.cssText = styles.leftPanel + styles.leftPanelColumn;
        rightPanel.style.cssText = styles.rightPanel + styles.rightPanelColumn;
      } else {
        outer.style.cssText = styles.outer + styles.outerRow;
        leftPanel.style.cssText = styles.leftPanel + styles.leftPanelRow;
        rightPanel.style.cssText = styles.rightPanel + styles.rightPanelRow;
      }
    }
    window.addEventListener("resize", applyLayout);
    applyLayout();

    function renderStars() {
      starsGroup.innerHTML = "";
      var rating = artistRating;
      var filled = Math.round(rating);
      for (var i = 0; i < 5; i++) {
        var fillColor = i < filled ? "#16181a" : "#dcdce0";
        var star = el("span");
        star.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + fillColor + '" stroke="' + fillColor + '" stroke-width="1.2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        starsGroup.appendChild(star.firstChild);
      }
      ratingValueSpan.textContent = (Math.round(rating * 10) / 10).toFixed(1);
    }

    function renderTrigger() {
      triggerBadge.textContent = triggerWord;
    }

    function renderRefImage() {
      refBox.innerHTML = "";
      var img = el("img", styles.refImg, { src: referenceImageUrl, alt: "reference" });
      refBox.appendChild(img);
    }

    function renderCredit() {
      var n = Math.max(1, Math.min(4, state.outputs));
      creditValue.textContent = n + (n === 1 ? " credit" : " credits");
    }

    function renderNotice() {
      if (state.error) {
        notice.style.cssText = styles.notice + styles.noticeError;
        notice.textContent = state.error;
      } else {
        notice.style.cssText = styles.notice + styles.noticeNormal;
        notice.textContent = state.prompt.trim()
          ? "Custom prompt active."
          : "Describe a style, or set the number of outputs on the right and generate.";
      }
    }

    function buildUploadPrompt() {
      var wrap = el("div", styles.uploadPrompt);
      wrap.appendChild(svgIcon(ICONS.upload, 44));
      var hint = el("div", styles.uploadHint, { text: "Start camera, upload a photo, or drag and drop an image." });
      wrap.appendChild(hint);
      var btnRow = el("div", styles.uploadBtnRow);
      var camBtn = el("button", styles.uploadBtn, { type: "button" });
      camBtn.appendChild(svgIcon(ICONS.upload, 18));
      camBtn.appendChild(document.createTextNode(" Start Camera"));
      camBtn.addEventListener("click", startCamera);
      var upBtn = el("button", styles.uploadBtnSolid, { type: "button" });
      upBtn.appendChild(svgIcon(ICONS.photo, 18));
      upBtn.appendChild(document.createTextNode(" Upload Photo"));
      upBtn.addEventListener("click", function () {
        fileInput.click();
      });
      btnRow.appendChild(camBtn);
      btnRow.appendChild(upBtn);
      wrap.appendChild(btnRow);
      if (state.cameraError) {
        wrap.appendChild(el("div", styles.cameraError, { text: state.cameraError }));
      }
      return wrap;
    }

    function startCamera() {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (s) {
          stream = s;
          state.cameraOn = true;
          state.cameraError = "";
          renderDropZone();
        })
        .catch(function () {
          state.cameraError = "Camera unavailable here — upload or drag a photo instead.";
          renderDropZone();
        });
    }

    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(function (t) {
          t.stop();
        });
        stream = null;
      }
    }

    function buildCameraView() {
      var wrap = el("div", styles.cameraWrap);
      videoEl = el("video", styles.video);
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.srcObject = stream;
      videoEl.play().catch(function () {});
      var btnRow = el("div", "display:flex;gap:12px;");
      var captureBtn = el("button", styles.captureBtn, { type: "button", text: "Capture" });
      captureBtn.addEventListener("click", capturePhoto);
      var cancelBtn = el("button", styles.cancelBtn, { type: "button", text: "Cancel" });
      cancelBtn.addEventListener("click", function () {
        stopCamera();
        state.cameraOn = false;
        renderDropZone();
      });
      btnRow.appendChild(captureBtn);
      btnRow.appendChild(cancelBtn);
      wrap.appendChild(videoEl);
      wrap.appendChild(btnRow);
      return wrap;
    }

    function capturePhoto() {
      if (!videoEl) return;
      var c = document.createElement("canvas");
      c.width = videoEl.videoWidth || 720;
      c.height = videoEl.videoHeight || 960;
      c.getContext("2d").drawImage(videoEl, 0, 0, c.width, c.height);
      stopCamera();
      var src = c.toDataURL("image/png");
      if (c.toBlob) {
        c.toBlob(function (blob) {
          state.file = blob ? new File([blob], "capture.png", { type: "image/png" }) : null;
          state.imageSrc = src;
          state.cameraOn = false;
          renderDropZone();
        }, "image/png");
      } else {
        state.file = null;
        state.imageSrc = src;
        state.cameraOn = false;
        renderDropZone();
      }
    }

    function buildImagePreview() {
      var wrap = el("div", styles.imageWrap);
      var img = el("img", styles.previewImg, { src: state.imageSrc, alt: "upload" });
      var removeBtn = el("button", styles.removeBtn, { type: "button", "aria-label": "Remove image" });
      removeBtn.appendChild(svgIcon(ICONS.close, 19));
      removeBtn.addEventListener("click", function () {
        state.file = null;
        state.imageSrc = null;
        renderDropZone();
      });
      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      return wrap;
    }

    function buildResultTile(idx, item) {
      var tile = el("div", styles.resultTile);
      if (item.status === "loading") {
        var shimmer = el("div", styles.shimmer);
        shimmer.appendChild(el("div", styles.spinnerCircle));
        tile.appendChild(shimmer);
      } else if (item.status === "done" && item.src) {
        var img = el("img", styles.resultImg, { src: item.src, alt: item.label || "Generated result " + (idx + 1) });
        img.addEventListener("click", function () {
          openLightbox(idx);
        });
        tile.appendChild(img);
        var actions = el("div", styles.resultActions);
        var dlBtn = el("button", styles.resultActionBtn, { type: "button", title: "Download" });
        dlBtn.appendChild(svgIcon(ICONS.download, 16));
        dlBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          downloadImage(item);
        });
        var shareBtn = el("button", styles.resultActionBtn, { type: "button", title: "Share" });
        shareBtn.appendChild(svgIcon(ICONS.share, 16));
        shareBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          shareImage(item);
        });
        actions.appendChild(dlBtn);
        actions.appendChild(shareBtn);
        tile.appendChild(actions);
      }
      return tile;
    }

    function buildResultsOverlay() {
      var overlay = el("div", styles.resultsOverlay);
      var grid = el("div", styles.resultsGrid + (isMobile() ? styles.resultsGridFitW : styles.resultsGridFitH));
      state.results.forEach(function (item, idx) {
        grid.appendChild(buildResultTile(idx, item));
      });
      overlay.appendChild(grid);
      return overlay;
    }

    function renderDropZone() {
      dropZone.innerHTML = "";
      if (state.view === "results" && state.results.length > 0) {
        dropZone.appendChild(buildResultsOverlay());
        return;
      }
      if (state.imageSrc) {
        dropZone.appendChild(buildImagePreview());
      } else if (state.cameraOn) {
        dropZone.appendChild(buildCameraView());
      } else {
        dropZone.appendChild(buildUploadPrompt());
      }
    }

    function downloadImage(item) {
      if (!item.src) return;
      fetch(item.src)
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.blob();
        })
        .then(function (blob) {
          var a = el("a", null, {
            href: URL.createObjectURL(blob),
            download: ("tattty-" + (item.label || "image")).replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".png",
          });
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(function (err) {
          console.error("Download failed:", err);
        });
    }

    function shareImage(item) {
      if (!item.src) return;
      if (navigator.share) {
        navigator.share({ url: item.src }).catch(function (err) {
          if (err && err.name === "AbortError") return;
          console.error("Share failed:", err);
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(item.src).then(function () {
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
      renderLightbox();
    }

    function renderLightbox() {
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
      if (state.lightboxIndex === null) return;
      var idx = state.lightboxIndex;
      var item = state.results[idx];
      if (!item || !item.src) return;

      lightbox = el("div", styles.lightboxOverlay);
      lightbox.addEventListener("click", closeLightbox);

      var closeBtn = el("button", styles.lightboxClose, { type: "button", "aria-label": "Close" });
      closeBtn.appendChild(document.createTextNode("×"));
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeLightbox();
      });
      lightbox.appendChild(closeBtn);

      if (idx > 0) {
        var prevBtn = el("button", styles.lightboxNav + "left:18px;", { type: "button", "aria-label": "Previous" });
        prevBtn.textContent = "‹";
        prevBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(idx - 1);
        });
        lightbox.appendChild(prevBtn);
      }
      if (idx < state.results.length - 1) {
        var nextBtn = el("button", styles.lightboxNav + "right:18px;", { type: "button", "aria-label": "Next" });
        nextBtn.textContent = "›";
        nextBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(idx + 1);
        });
        lightbox.appendChild(nextBtn);
      }

      var img = el("img", styles.lightboxImg, { src: item.src, alt: item.label || "" });
      img.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      lightbox.appendChild(img);

      var actions = el("div", styles.lightboxActions);
      actions.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      var dlBtn = el("button", styles.lightboxActionBtn, { type: "button" });
      dlBtn.appendChild(svgIcon(ICONS.download, 17));
      dlBtn.appendChild(document.createTextNode(" Download"));
      dlBtn.addEventListener("click", function () {
        downloadImage(item);
      });
      var shareBtn = el("button", styles.lightboxActionBtn, { type: "button" });
      shareBtn.appendChild(svgIcon(ICONS.share, 17));
      shareBtn.appendChild(document.createTextNode(" Share"));
      shareBtn.addEventListener("click", function () {
        shareImage(item);
      });
      actions.appendChild(dlBtn);
      actions.appendChild(shareBtn);
      lightbox.appendChild(actions);

      document.body.appendChild(lightbox);
    }

    function runGeneration(prompt, n) {
      var uploadPromise = Promise.resolve("");
      if (state.file) {
        var fd = new FormData();
        fd.append("file", state.file);
        uploadPromise = fetch(UPLOAD_URL, { method: "POST", body: fd })
          .then(function (res) {
            if (!res.ok) {
              return res.text().then(function (t) {
                throw new Error("Upload failed (" + res.status + ")" + (t ? ": " + t.slice(0, 200) : ""));
              });
            }
            return res.json();
          })
          .then(function (data) {
            if (!data || !data.url) throw new Error("Upload returned no url. Response: " + JSON.stringify(data).slice(0, 200));
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
              prompt: prompt,
              numOutputs: n,
              uploads: uploadUrl,
              customer_id: customerId,
            }),
          });
        })
        .then(function (res) {
          if (!res.ok) {
            return res.text().then(function (t) {
              throw new Error("Worker failed (" + res.status + ")" + (t ? ": " + t.slice(0, 200) : ""));
            });
          }
          return res.json();
        })
        .then(function (data) {
          var urls = (data && data.urls) || [];
          if (!urls.length) throw new Error("Worker returned no urls. Response: " + JSON.stringify(data).slice(0, 200));
          state.results = state.results.map(function (item, i) {
            return urls[i] != null ? { key: item.key, label: item.label, status: "done", src: urls[i] } : item;
          });
          renderDropZone();
        })
        .catch(function (err) {
          console.error("Generation failed:", err);
          state.view = "create";
          state.results = [];
          state.error = err && err.message ? err.message : String(err);
          renderDropZone();
          renderNotice();
        });
    }

    generateBtn.addEventListener("click", function () {
      var p = state.prompt.trim();
      if (p.length < 10) {
        state.error = "PLEASE TYPE SOME SHIT FIRST";
        renderNotice();
        return;
      }
      state.error = "";
      var n = Math.max(1, Math.min(4, state.outputs));
      var items = [];
      for (var i = 0; i < n; i++) {
        items.push({ key: "o" + i, label: "Output #" + (i + 1), status: "loading", src: null });
      }
      state.view = "results";
      state.results = items;
      renderDropZone();
      renderNotice();
      runGeneration(p, n);
    });

    renderStars();
    renderTrigger();
    renderRefImage();
    renderCredit();
    renderNotice();
    renderDropZone();

    window.addEventListener("beforeunload", function () {
      stopCamera();
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
