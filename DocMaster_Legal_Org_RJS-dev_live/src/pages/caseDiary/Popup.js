function Popup({
  title,
  onClose,
  height,
  maxWidth,
  children,
  minHeight = "600px",
  displayClose = true,
}) {
  return (
    <div>
      <div
        className="modal fade show"
        style={{
          display: "block",
        }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: maxWidth }}
        >
          <div className="modal-content" style={{ minHeight }}>
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                {title}
              </h6>
              {displayClose && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => onClose(false)}
                  aria-label="Close"
                ></button>
              )}
            </div>
            <div className="container mt-2" style={{ overflow: "hidden" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default Popup;
