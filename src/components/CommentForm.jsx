"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Person } from "@gravity-ui/icons";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit?.(text);
      setText("");
    }
  };

  return (
    <div className="flex gap-sm p-sm bg-surface-container-low rounded-xl">
      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex-shrink-0 flex items-center justify-center">
        <Person className="text-primary" />
      </div>
      <div className="flex-grow flex flex-col gap-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-surface border-surface-variant rounded-lg p-sm text-body-large focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24"
          placeholder="Write a comment about this piece..."
        />
        <div className="flex justify-end">
          <Button
            onPress={handleSubmit}
            className="bg-primary text-on-primary px-md py-xs rounded-lg font-semibold hover:opacity-80 transition-opacity"
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
