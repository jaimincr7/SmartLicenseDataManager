import { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

function Version() {
    const file_name = 'version.md';
    const [post, setPost] = useState('');

    useEffect(() => {
        import(`./version/${file_name}`)
            .then(res => {
                fetch(res.default)
                    .then(res => res.text())
                    .then(res => setPost(res));
            });
    });

    return (
            <div className="container">
                <Markdown>
                    {post}
                </Markdown>
            </div>
    );
}

export default Version;