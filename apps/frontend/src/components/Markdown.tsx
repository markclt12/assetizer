import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";

export function Markdown({ children, columns }: { children: string; columns?: boolean }) {
  return (
    <div className={`${styles.markdown} ${columns ? styles.columns : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
          table: ({ node: _node, ...props }) => (
            <div className={styles.tableWrap}>
              <table {...props} />
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
