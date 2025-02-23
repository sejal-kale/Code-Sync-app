import React, { useEffect, useState } from 'react'
import { basicSetup, EditorView } from "codemirror"
import { Editor } from "@monaco-editor/react";

const EditorC = () => {
    const [code, setCode] = useState('//Write Your code here...')



    return <Editor
        height="100vh"
        language="javascript"
        theme="vs-dark"
        fo
        value={code}
        options={{
            padding: { top: 30 },
            fontSize: 18, // Adjust font size
            minimap: { enabled: false }, // Disable minimap
            lineNumbers: "on", // Show line numbers
            autoClosingBrackets: "always", // Auto-close brackets () {} []
            autoClosingQuotes: "always", // Auto-close quotes "" ''
            autoSurround: "brackets", // Auto-wrap selection with brackets or quotes
            tabCompletion: "on", // Suggest closing tags while typing
        }
        }
        onChange={(value) => setCode(value)}
    />;

}

export default EditorC