import React, { createContext, useState } from 'react';
import run from '../config/gemini';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }

        // Process response to add bold and line breaks
        let formattedResponse = response
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold formatting
            .replace(/\n/g, "<br/>")  // Line breaks
            .replace(/```(.*?)```/gs, (match, p1) => {
                return `<pre><code>${p1}</code></pre>`;
            });

        let formattedResponseArray = formattedResponse.split(" ");
        for (let i = 0; i < formattedResponseArray.length; i++) {
            const nextWord = formattedResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
