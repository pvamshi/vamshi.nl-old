import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { readFileSync } from "fs";

import matter from "gray-matter";
import { useRouter } from "next/dist/client/router";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";

const TestComponent = () => <p>Test component works</p>;
const components = { TestComponent };

export const getStaticProps: GetStaticProps = async (context) => {
  const { title } = context.params as { title: string } & ParsedUrlQuery;
  const sourceFromFile = readFileSync(`posts/${title}.mdx`);
  const { content, data } = matter(sourceFromFile);
  const mdxSource = await serialize(content, { scope: data });
  return { props: { source: mdxSource, frontMatter: data } };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    fallback: false,
    paths: [{ params: { title: "test" } }],
  };
};
export default function Blog({
  source,
  frontMatter,
}: {
  source: MDXRemoteSerializeResult;
  frontMatter: Record<string, any>;
}) {
  const router = useRouter();
  const { title } = router.query;
  return (
    <div className="wrapper">
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...source} components={components} />
    </div>
  );
}
