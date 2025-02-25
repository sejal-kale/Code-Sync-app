import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ACTIONS from '../Actions';

const MonacoEditorComponent = ({ roomId, socketRef, onCodeChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(() => {
    // Retrieve the stored code from local storage
    const savedCode = localStorage.getItem('editorCode');
    return savedCode || '';
  });
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      return;
    }

    const handleCodeChange = ({ code }) => {
      console.log('Received CODE_CHANGE from server. New code:', code);
      if (code !== null && editorRef.current) {
        setCode(code);
        localStorage.setItem('editorCode', code);  // Update local storage with the new code
        console.log('Editor value updated to:', code);
      }
    };

    console.log('Socket is connected, setting up event listener.');
    socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    return () => {
      console.log('Cleaning up event listener for CODE_CHANGE');
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    };
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    console.log('Editor content changed:', value);

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
    localStorage.setItem('editorCode', value);  // Update local storage with the new code
  };

  const editorDidMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    console.log('Editor is mounted, setting initial value.');
    editor.setValue(code);
  };

  return (
    <MonacoEditor
      height="100vh"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
      editorDidMount={editorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: '20',
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