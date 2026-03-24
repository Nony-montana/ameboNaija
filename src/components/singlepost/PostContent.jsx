const PostContent = ({ post }) => {
  return (
    <>
      {/* COVER IMAGE */}
      {post.image && (
        <div className="mb-4" style={{ borderRadius: "8px", overflow: "hidden" }}>
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", maxHeight: "450px", objectFit: "contain" }}
          />
        </div>
      )}

      {/* TAGS */}
      {post.tags?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                backgroundColor: "var(--light-green)",
                color: "var(--green)",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.9",
          color: "var(--text)",
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          whiteSpace: "pre-wrap",
        }}
      >
        {post.content}
      </div>
    </>
  );
};

export default PostContent;