import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";

interface CommentCardProps {
  avatar?: string;
  name: string;
  createdAt: string | number | Date;
  content: string;
  isComposing: boolean;
  onEdit?: (newContent: string) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  avatar,
  name,
  createdAt,
  content,
  isComposing,
  onEdit,
}) => {
  const [composeValue, setComposeValue] = useState<string>("");

  useEffect(() => {
    if (isComposing) {
      setComposeValue(content);
    }
  }, [content, isComposing]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onEdit) {
        onEdit(composeValue);
      }
    },
    [composeValue, onEdit]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComposeValue(e.currentTarget.value);
  };

  return (
    <div className="flex gap-2">
      {avatar && (
        <Avatar>
          <AvatarImage src={avatar} alt={name} className="w-8 h-8" />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-sm font-bold leading-none">
            {name?.split("@")[0] || "anonymous"}
          </div>
          <div className="text-xs font-medium leading-none text-gray-500">
            {new Date(createdAt).toLocaleTimeString()}
          </div>
        </div>
        {isComposing ? (
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <Input
              className="flex-1 min-w-0 text-base outline-none"
              type="text"
              value={composeValue}
              onChange={handleChange}
            />
            <Button variant={"default"} size={"sm"} type="submit">
              Save
            </Button>
          </form>
        ) : (
          <div className="text-sm">{content}</div>
        )}
      </div>
    </div>
  );
};
