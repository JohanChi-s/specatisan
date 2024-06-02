import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { CommentCard } from "./ComponentCard";
import { ThreadCard } from "./ThreadCard";
import { ThreadComposer } from "./ThreadComposer";
import { useThreadsState } from "./ThreadContext";

const CommentItem = ({
  commentId,
  avatar,
  userName,
  content,
  createdAt,
  onEdit,
  onDelete,
}) => {
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div>
      <CommentCard
        avatar={avatar}
        name={userName}
        content={content}
        createdAt={createdAt}
        isComposing={isComposing}
        onEdit={(val) => {
          setIsComposing(false);
          if (val) {
            onEdit(val);
          }
        }}
      />
      <div className="flex items-center justify-between gap-1">
        {!isComposing ? (
          <Button
            size={"sm"}
            variant={"link"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsComposing(true);
            }}
          >
            Edit
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            variant={"destructive"}
            size={"smallIcon"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(commentId);
            }}
          >
            <XIcon size={12} />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export const ThreadsListItem = ({ thread, provider, active, open, user }) => {
  const {
    onClickThread,
    deleteThread,
    onHoverThread,
    onLeaveThread,
    resolveThread,
    unresolveThread,
  } = useThreadsState();
  const classNames = ["threadsList--item"];

  if (active || open) {
    classNames.push("threadsList--item--active");
  }

  const firstComment = thread.comments && thread.comments[0];

  const handleDeleteClick = useCallback(() => {
    deleteThread(thread.id);
  }, [thread.id, deleteThread]);

  const handleResolveClick = useCallback(() => {
    resolveThread(thread.id);
  }, [thread.id, resolveThread]);

  const handleUnresolveClick = useCallback(() => {
    unresolveThread(thread.id);
  }, [unresolveThread, thread.id]);

  const editComment = useCallback(
    (commentId, val) => {
      provider.updateComment(thread.id, commentId, { content: val });
    },
    [provider, thread.id]
  );

  const deleteComment = useCallback(
    (commentId) => {
      provider.deleteComment(thread.id, commentId);
    },
    [provider, thread.id]
  );

  return (
    <div
      onMouseEnter={() => onHoverThread(thread.id)}
      onMouseLeave={() => onLeaveThread(thread.id)}
    >
      <ThreadCard
        id={thread.id}
        active={active || open}
        onClick={!open ? onClickThread : null}
      >
        {firstComment && firstComment.data ? (
          <>
            <CommentItem
              commentId={firstComment.id}
              avatar={firstComment.data.userAvatar}
              userName={firstComment.data.userName}
              content={firstComment.content}
              createdAt={firstComment.createdAt}
              key={firstComment.id}
              onEdit={(val) => editComment(firstComment.id, val)}
            />
          </>
        ) : null}
        {open ? (
          <>
            <div className="pl-4 border-l-2 border-neutral-100">
              <div className="flex flex-col gap-1.5 mt-2">
                {thread.comments.slice(1).map((comment) => (
                  <CommentItem
                    commentId={comment.id}
                    avatar={comment.data.userAvatar}
                    userName={comment.data.userName}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    onEdit={(val) => editComment(comment.id, val)}
                    onDelete={deleteComment}
                    key={comment.id}
                  />
                ))}
              </div>
              <div className="mt-2">
                <ThreadComposer
                  threadId={thread.id}
                  provider={provider}
                  user={user}
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={handleDeleteClick}
              >
                Delete thread
              </Button>
              {!thread.resolvedAt ? (
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={handleResolveClick}
                >
                  Resolve thread
                </Button>
              ) : (
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={handleUnresolveClick}
                >
                  Unresolve thread
                </Button>
              )}
            </div>
            {thread.resolvedAt ? (
              <div className="mt-2 text-xs text-neutral-500">
                Resolved at {new Date(thread.resolvedAt).toLocaleDateString()}{" "}
                {new Date(thread.resolvedAt).toLocaleTimeString()}
              </div>
            ) : null}
          </>
        ) : null}
      </ThreadCard>
    </div>
  );
};
