"use client";

import React from "react";
import { initEditor } from "./editor";
import { EditorContext } from "./context";

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
	const { editor, collection } = initEditor();

	return (
		<EditorContext.Provider value={{ editor, collection }}>
			{children}
		</EditorContext.Provider>
	);
};
