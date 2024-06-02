import { useThreadsState } from "./ThreadContext";
import { ThreadsListItem } from "./ThreadListItem";

export const ThreadsList = ({ provider, user }) => {
  const { threads, selectedThreads, selectedThread } = useThreadsState();

  if (!threads) {
    return null;
  }

  const unresolvedThreads = threads.filter((t) => !t.resolvedAt);
  const resolvedThreads = threads.filter((t) => !!t.resolvedAt);

  if (unresolvedThreads.length === 0 && resolvedThreads.length === 0) {
    return <div className="text-sm font-medium text-center">No threads</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {unresolvedThreads && unresolvedThreads.length > 0 ? (
        <div>
          <div className="mb-2 text-sm font-medium">Open threads</div>
          <div className="flex flex-col gap-2">
            {unresolvedThreads.map((t) => (
              <ThreadsListItem
                thread={t}
                key={t.id}
                active={
                  selectedThreads.includes(t.id) || selectedThread === t.id
                }
                open={selectedThread === t.id}
                provider={provider}
                user={user}
              />
            ))}
          </div>
        </div>
      ) : null}
      {resolvedThreads && resolvedThreads.length > 0 ? (
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-400">
            Resolved threads
          </div>
          <div className="flex flex-col gap-2">
            {resolvedThreads.map((t) => (
              <ThreadsListItem
                thread={t}
                key={t.id}
                active={
                  selectedThreads.includes(t.id) || selectedThread === t.id
                }
                open={selectedThread === t.id}
                provider={provider}
                user={user}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
