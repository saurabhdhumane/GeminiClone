import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ResultDisplay = ({ resultData }) => {
    const parseResponse = (response) => {
        const codeBlockRegex = /```([\s\S]*?)```/g;
        let parts = response.split(codeBlockRegex);

        return parts.map((part, index) => {
            if (index % 2 === 0) {
                return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            } else {
                return (
                    <div key={index}>
                        <SyntaxHighlighter language="bash" style={docco}>
                            {part}
                        </SyntaxHighlighter>
                        <CopyToClipboard text={part}>
                            <button>Copy</button>
                        </CopyToClipboard>
                    </div>
                );
            }
        });
    };

    return <div>{parseResponse(resultData)}</div>;
};

export default ResultDisplay;
