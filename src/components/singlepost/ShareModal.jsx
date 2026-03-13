import { FaCopy, FaWhatsapp, FaTimes as FaClose } from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";

const ShareModal = ({ postUrl, postTitle, shareCount, copied, onCopy, onClose }) => {
  const shareText = `Check out this gist on AmeboNaija: ${postTitle}`;

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={20} color="white" />,
      bg: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + postUrl)}`,
    },
    {
      label: "X (Twitter)",
      icon: <FaXTwitter size={20} color="white" />,
      bg: "#000000",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Snapchat",
      icon: <FaSnapchat size={20} color="black" />,
      bg: "#FFFC00",
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Instagram",
      icon: <RiInstagramFill size={20} color="white" />,
      bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      url: `https://www.instagram.com/`,
      note: "Copy link first, then paste on IG",
    },
    {
      label: "Messages",
      icon: <MdMessage size={20} color="white" />,
      bg: "#34C759",
      url: `sms:?body=${encodeURIComponent(shareText + " " + postUrl)}`,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px 20px 0 0",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          paddingBottom: "36px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="fw-bold mb-0" style={{ fontSize: "16px" }}>
            Share this gist
          </h6>
          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{ color: "var(--gray)", padding: "4px 8px" }}
          >
            <FaClose size={16} />
          </button>
        </div>

        {/* SOCIAL BUTTONS */}
        <div className="d-flex justify-content-around mb-4">
          {shareLinks.map((s) => (
            <div key={s.label} className="text-center">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
                title={s.note || s.label}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {s.icon}
                </div>
                <small style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "600" }}>
                  {s.label}
                </small>
              </a>
            </div>
          ))}
        </div>

        {/* COPY LINK */}
        <div
          className="d-flex align-items-center gap-2 p-2 rounded"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg)" }}
        >
          <p
            className="mb-0 flex-grow-1"
            style={{
              fontSize: "12px",
              color: "var(--gray)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {postUrl}
          </p>
          <button
            onClick={onCopy}
            className="btn btn-sm fw-semibold d-flex align-items-center gap-1 flex-shrink-0"
            style={{
              backgroundColor: copied ? "var(--green)" : "var(--light-green)",
              color: copied ? "white" : "var(--green)",
              fontSize: "12px",
            }}
          >
            <FaCopy size={11} /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;