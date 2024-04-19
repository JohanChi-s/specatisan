"use client";

import { useEffect, useState } from "react";
import { Doc } from "@blocksuite/store";
import { useEditor } from "./context";

const Sidebar = () => {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const { collection, editor } = useEditor()!;
	const [docs, setDocs] = useState<Doc[]>([]);

	useEffect(() => {
		if (!collection || !editor) return;
		const updateDocs = () => {
			setDocs([...collection.docs.values()]);
		};
		updateDocs();

		const disposable = [
			collection.slots.docUpdated.on(updateDocs),
			editor.slots.docLinkClicked.on(updateDocs),
		];

		// biome-ignore lint/complexity/noForEach: <explanation>
		return () => disposable.forEach((d) => d.dispose());
	}, [collection, editor]);

	return (
		<div className="sidebar">
			<div className="header">All Docs</div>
			<div className="doc-list">
				{docs.map((doc) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<div
						className={`doc-item ${editor?.doc === doc ? "active" : ""}`}
						key={doc.id}
						onClick={() => {
							if (editor) editor.doc = doc;
							setDocs([...collection.docs.values()]);
						}}
					>
						{doc.meta?.title || "Untitled"}
					</div>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
