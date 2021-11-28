import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { readFileSync } from "fs";

import matter from "gray-matter";

const TestComponent = () => <p>Test component works</p>;
const components = { TestComponent };

export default function TestPage({
  source,
  frontMatter,
}: {
  source: MDXRemoteSerializeResult;
  frontMatter: Record<string, any>;
}) {
  return (
    <div className="wrapper">
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export async function getStaticProps() {
  const sourceFromFile = readFileSync("posts/test.mdx");
  const { content, data } = matter(sourceFromFile);
  const mdxSource = await serialize(content, { scope: data });
  return { props: { source: mdxSource, frontMatter: data } };
}
