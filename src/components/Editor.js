// Editor page code with debug of console log

import React, { useRef, useEffect, useState } from 'react';
import { Editor } from "@monaco-editor/react";
import ACTIONS from '../Actions';

const MonacoEditorComponent = ({ roomId, socketRef, onCodeChange }) => {
    const editorRef = useRef(null);
    const [code, setCode] = useState(() => {
        return localStorage.getItem(`editorCode_${roomId}`) || '';
    });
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        if (!socketRef.current) {
            console.warn("⚠️ Socket reference is NULL. Skipping event setup.");
            return;
        }

        console.log("✅ Setting up socket event listener for CODE_CHANGE");

        const handleCodeChange = ({ code }) => {
          console.log("📩 Received CODE_CHANGE from server:", code);
      
          if (code === null) {
              console.warn("🚨 Received NULL code from server, ignoring...");
              return; // Stop the loop here!
          }
      
          if (!editorRef.current) {
              console.warn("⚠️ Editor ref is NULL, retrying in 500ms...");
              setTimeout(() => handleCodeChange({ code }), 500);
              return;
          }
      
          const currentValue = editorRef.current.getValue();
          if (currentValue !== code) {
              console.log("✏️ Updating editor content:", code);
              editorRef.current.setValue(code);
              setCode(code);
              localStorage.setItem(`editorCode_${roomId}`, code);
          }
      };
      

        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            console.log("🗑 Cleaning up event listener for CODE_CHANGE");
            socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        };
    }, [socketRef.current, roomId]);

    const handleEditorChange = (value) => {
        console.log('📝 Editor content changed:', value);

        if (editorRef.current && isEditorReady) {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId,
                code: value,
            });
        }

        if (onCodeChange) {
            onCodeChange(value);
        }

        setCode(value);
        localStorage.setItem(`editorCode_${roomId}`, value);
    };

    const editorDidMount = (editor) => {
        console.log("🎨 Editor mounted, setting initial value.",editor);
        editorRef.current = editor;
        
        setIsEditorReady(true);

        if (code) {
            console.log("🔄 Syncing initial code to room:", code);
            editor.setValue(code);

            if (socketRef.current) {
                setTimeout(() => {
                    console.log("📤 Emitting initial CODE_CHANGE after editor mount.");
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }, 500); // Delay to ensure editor is ready
            }
        }
    };

    return (
        <Editor
            height="100vh"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={editorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 18,
                lineNumbers: 'on',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                quickSuggestionsDelay: 10,
                acceptSuggestionOnEnter: 'on',
                suggestSelection: 'first',
            }}
        />
    );
};

export default MonacoEditorComponent;
