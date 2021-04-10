import type { Transformer } from "unified";
import type { YamlNode } from "remark-frontmatter";
import type { custom_vfile } from "./types";

import yaml from "js-yaml";
import Message from "vfile-message";
import visit from "unist-util-visit";
import { make_session_slug_processor } from "./slug";

const make_slug = make_session_slug_processor({
	preserve_unicode: false,
	separator: "-",
});

/**
 * Parse the frontmatter contained with markdown files. This frontmatter is available on the
 * 				`data.frontmatter` property of the returned `vFile`.
 */
export function parse_frontmatter(): Transformer {
	return function transformer(tree, vFile: custom_vfile) {
		visit(tree, "yaml", (node: YamlNode) => {
			try {
				const data = yaml.load(node.value) as Record<string, unknown>;
				if (data) {
					// @ts-ignore
					vFile.data.frontmatter = data;

					if (!vFile.data.section_title) {
						vFile.data.section_title = make_slug(
							//@ts-ignore

							vFile.data.frontmatter.title,
							vFile.data.seen_slugs
						);
					}
				}
			} catch (e) {
				vFile.messages.push(new Message("YAML failed to parse", e));
			}
		});
	};
}