import { useCallback, useEffect, useState } from "react";

export const useThreads = (provider, editor, user) => {
  const [threads, setThreads] = useState();

  useEffect(() => {
    if (provider) {
      const updateHandler = () => {
        setThreads(provider.getThreads());
      };

      provider.watchThreads(updateHandler);
      provider.on("synced", updateHandler);

      return () => {
        provider.unwatchThreads(updateHandler);
        provider.off("synced", updateHandler);
      };
    }
  }, [provider]);

  const createThread = useCallback(() => {
    const input = window.prompt("Comment content");

    if (!input) {
      return;
    }

    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setThread({
        content: input,
        commentData: { userName: user.email, userAvatar: user.avatar || "" },
      })
      .run();
  }, [editor, user]);

  const removeThread = useCallback(() => {
    editor.chain().focus().removeThread().run();
  }, [editor]);

  return { threads, createThread, removeThread };
};
