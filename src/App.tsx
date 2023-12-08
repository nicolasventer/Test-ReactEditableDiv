import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

const Counter = () => {
	const [count, setCount] = useState(0);
	// Do not forget to set contentEditable={false}
	return (
		<button contentEditable={false} onClick={() => setCount((count) => count + 1)}>
			count is {count}
		</button>
	);
};

const RedInput = () => {
	const [text, setText] = useState("hello");
	// Do not forget to set contentEditable={false}
	return <input contentEditable={false} style={{ color: "red" }} value={text} onChange={(e) => setText(e.target.value)} />;
};

const COMPONENTS = [Counter, RedInput];
const SPLITER = "@";

const insertAfter = (textContent: string, existingNode: Node) => {
	const tmpDiv = document.createElement("div");
	tmpDiv.textContent = textContent;
	return existingNode.parentNode!.insertBefore(tmpDiv, existingNode.nextSibling);
};

const EditableDiv = () => {
	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const innerHTML = e.currentTarget.innerHTML;
		for (const Comp of COMPONENTS) {
			if (innerHTML.includes(SPLITER + Comp.name)) {
				e.currentTarget.childNodes.forEach((child) => {
					const textContent = child.textContent ?? "";
					const index = textContent.indexOf(SPLITER + Comp.name);
					if (index !== -1) {
						const textBefore = textContent.slice(0, index);
						const textAfter = textContent.slice(index + SPLITER.length + Comp.name.length);
						child.textContent = textBefore;
						// then insert new div after current child
						const child_ = insertAfter("", child);
						// replace new div with Component
						const newChild = ReactDOM.createRoot(child_);
						newChild.render(<Comp />);
						// if there is text after --> create new div
						if (textAfter) insertAfter(textAfter, child_);
					}
				});
			}
		}
	};

	return (
		<div
			key={Math.random()}
			style={{ border: "solid white" }}
			contentEditable
			suppressContentEditableWarning
			spellCheck={false}
			onInput={handleInput}
		></div>
	);
};

const App = () => <EditableDiv />;

export default App;
