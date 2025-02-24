import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ACTIONS from '../Actions';

const MonacoEditorComponent = ({ roomId, socketRef, onCodeChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('');  // Store the code in local state to trigger rerenders
  const [isEditorReady, setIsEditorReady] = useState(false);  // To track editor mount

  useEffect(() => {
    if (!socketRef.current) {
      return;
    }

    // Set up the event listener when socketRef is available
    const handleCodeChange = ({ code }) => {
      console.log('Received CODE_CHANGE from server. New code:', code);
      if (code !== null && editorRef.current) {
        setCode(code);  // Update local state with the new code
        console.log('Editor value updated to:', code);
      }
    };

    // Debugging: Log when event listener is set
    console.log('Socket is connected, setting up event listener.');

    // Attach the event listener for code change
    socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    // Clean up the event listener on component unmount
    return () => {
      console.log('Cleaning up event listener for CODE_CHANGE');
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    };
  }, [socketRef.current]);  // Re-run this effect when socketRef changes

  // Trigger the code change to the server whenever the code changes locally
  const handleEditorChange = (value) => {
    console.log('Editor content changed:', value);

    // Prevent emitting changes if it's not an editor-triggered change
    if (editorRef.current && isEditorReady) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
      });
    }

    // Call the callback to lift the code up
    if (onCodeChange) {
      onCodeChange(value);
    }

    // Update local state
    setCode(value);
  };

  // Monaco editor did mount
  const editorDidMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);  // Set editor as ready after it mounts
    console.log('Editor is mounted, setting initial value.');
    editor.setValue(code);  // Set the initial value of the editor
  };

  return (
    <MonacoEditor
      height="100vh"
      language="javascript"
      theme="vs-dark" // Use dark theme for colorful text
      value={code}  // Use local state as the value of the editor
      onChange={handleEditorChange}
      editorDidMount={editorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize:'20',
        lineNumbers: 'on',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        suggestOnTriggerCharacters: true,  // This enables suggestion on trigger characters
        quickSuggestions: true,            // Enable suggestions while typing
        quickSuggestionsDelay: 10,         // Set delay to trigger suggestions
        acceptSuggestionOnEnter: 'on',     // Allow suggestions to be accepted on Enter
        suggestSelection: 'first', 

      }}
    />
  );
};

export default MonacoEditorComponent;
