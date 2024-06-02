import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { useUser } from "./useUsers";

export const ThreadComposer = ({ threadId, provider, user }) => {
  const userData = useUser(user);
  const [comment, setComment] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!comment) {
        return;
      }

      if (provider) {
        provider.addComment(threadId, {
          content: comment,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          data: { userName: userData.name, userAvatar: userData.avatar },
        });
        setComment("");
      }
    },
    [comment, provider, threadId, userData.avatar, userData.name]
  );

  return (
    <form className="flex items-center gap-1" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Comment ..."
        value={comment}
        className="outline-none"
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      <Button variant={"default"} type="submit">
        Send
      </Button>
    </form>
  );
};
