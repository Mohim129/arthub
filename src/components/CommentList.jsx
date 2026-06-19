import { ShieldCheck } from "@gravity-ui/icons";

export default function CommentList({ comments }) {
  return (
    <div className="flex flex-col gap-sm custom-scrollbar max-h-[400px] overflow-y-auto pr-sm">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-md p-md bg-white border border-surface-container rounded-xl shadow-sm"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
            <img
              src={comment.avatar}
              alt={comment.user}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-sm">
              <span className="font-bold text-on-background">
                {comment.user}
              </span>
              <span className="text-outline text-body-small">
                {comment.date}
              </span>
              {comment.isOwner && (
                <span className="bg-secondary-fixed text-on-secondary-fixed px-xs py-[2px] rounded text-[10px] uppercase font-bold tracking-tighter">
                  Owner
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-body-large">
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
