import { createContext, useCallback, useContext, useState } from "react";

export const ThreadsContext = createContext({
  threads: [],
  selectedThreads: [],
  selectedThread: null,

  onClickThread: () => null,
  deleteThread: () => null,
  resolveThread: () => null,
  unresolveThread: () => null,
  onCloseThread: () => null,
  selectThread: () => null,
  unselectThread: () => null,
  onUpdateComment: () => null,
  onHoverThread: () => null,
  onLeaveThread: () => null,
});

export const ThreadsProvider = ({
  children,
  threads = [],
  selectedThreads = [],
  onClickThread = (threadId) => {},
  onDeleteThread = (threadId) => {},
  onResolveThread = (threadId) => {},
  onUnresolveThread = (threadId) => {},
  onUpdateComment = (threadId, commentId, content, metaData) => {},
  onHoverThread = (threadId) => {},
  onLeaveThread = (threadId) => {},
}) => {
  const [selectedThread, setSelectedThread] = useState(null);

  const handleThreadClick = useCallback(
    (threadId) => {
      setSelectedThread((currentThreadId) => {
        if (currentThreadId !== threadId) {
          onClickThread(threadId);
          setSelectedThread(threadId);
        }
        return currentThreadId !== threadId ? threadId : null;
      });
    },
    [onClickThread]
  );

  const onCloseThread = useCallback(() => {
    setSelectedThread(null);
  }, []);

  const providerValue = {
    threads,
    selectedThreads,
    selectedThread,

    deleteThread: onDeleteThread,
    resolveThread: onResolveThread,
    unresolveThread: onUnresolveThread,
    onClickThread: handleThreadClick,
    onCloseThread,
    onUpdateComment,
    selectThread: () => null,
    unselectThread: () => null,
    onHoverThread,
    onLeaveThread,
  };

  return (
    <ThreadsContext.Provider value={providerValue}>
      {children}
    </ThreadsContext.Provider>
  );
};

export const useThreadsState = () => {
  return useContext(ThreadsContext);
};
