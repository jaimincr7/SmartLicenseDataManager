import { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import './version/version.css';

function Version() {
  const file_name = 'version.md';
  const [post, setPost] = useState('');

  useEffect(() => {
    import(`./version/${file_name}`).then((res) => {
      fetch(res.default)
        .then((res) => res.text())
        .then((res) => setPost(res));
    });
  });

  return (
    <div className="container-version">
      <Markdown>{post}</Markdown>
    </div>
  );
}

export default Version;
