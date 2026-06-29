import { ShieldCheck } from "@gravity-ui/icons";

export default function CommentList({ comments }) {
  if (!comments?.length) {
    return (
      <div className="p-md bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl text-on-surface-variant dark:text-inverse-on-surface text-body-large italic">
        No comments yet. Be the first to share your thoughts on this artwork.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm custom-scrollbar max-h-[400px] overflow-y-auto pr-sm">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-md p-md bg-surface-container-lowest dark:bg-inverse-surface/40 border border-outline-variant/20 dark:border-outline-variant/10 rounded-xl shadow-sm"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container dark:bg-inverse-surface shrink-0">
            <img
              src={comment.avatar || "https://via.placeholder.com/40?text=?"}
              alt={comment.user}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-sm">
              <span className="font-bold text-on-background dark:text-inverse-on-surface">
                {comment.user}
              </span>
              <span className="text-outline text-body-small dark:text-outline-variant">
                {comment.date}
              </span>
              {comment.isOwner && (
                <span className="bg-secondary-fixed text-on-secondary-fixed px-xs py-[2px] rounded text-[10px] uppercase font-bold tracking-tighter">
                  Owner
                </span>
              )}
            </div>
            <p className="text-on-surface-variant dark:text-inverse-on-surface text-body-large">
              {comment.text}
            </p>
            <button className="text-primary text-body-small font-semibold self-start hover:underline">
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
