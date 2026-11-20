import { Fragment, type ReactNode } from "react";
import { parseBlogBody, parseBlogInline, type BlogInline } from "@/lib/native-blog-content";

function inline(nodes: BlogInline[], insideLink = false): ReactNode[] {
  return nodes.map((node, index) => {
    if (node.type === "text") return <Fragment key={index}>{node.text.split("\n").map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && <br />}{line}</Fragment>)}</Fragment>;
    if (node.type === "bold") return <strong key={index}>{inline(node.children, insideLink)}</strong>;
    if (node.type === "italic") return <em key={index}>{inline(node.children, insideLink)}</em>;
    if (insideLink) return <Fragment key={index}>{inline(node.children, true)}</Fragment>;
    return <a key={index} href={node.href} target="_blank" rel="noopener noreferrer">{inline(node.children, true)}</a>;
  });
}

export function NativeBlogBody({ body, className = "native-blog-body" }: { body: string; className?: string }) {
  return <div className={className}>{parseBlogBody(body).map((block, index) => {
    if (block.type === "rule") return <hr key={index} />;
    if (block.type === "heading") {
      const Heading = block.level === 3 ? "h3" : "h2";
      return <Heading id={block.id} key={block.id}>{inline(parseBlogInline(block.text))}</Heading>;
    }
    if (block.type === "ul") return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(parseBlogInline(item))}</li>)}</ul>;
    if (block.type === "ol") return <ol key={index} start={block.start}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(parseBlogInline(item))}</li>)}</ol>;
    if (block.type === "blockquote") return <blockquote key={index}><p>{inline(parseBlogInline(block.text))}</p></blockquote>;
    return <p key={index}>{inline(parseBlogInline(block.text))}</p>;
  })}</div>;
}

export default NativeBlogBody;
