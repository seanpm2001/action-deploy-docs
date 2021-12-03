import { suite } from "uvu";
import * as assert from "uvu/assert";

import { format } from "./format_api";

import api from "./fixtures/api-docs-markdown.js";
import api_output from "./fixtures/api-docs-html.js";

const _format = suite("transform docs");

// format.skip("formats the api docs", () => {
// 	const output = format_api("./api-docs.md", api, "docs");

// 	assert.equal(output, api_output);
// });

// this is because we concat the api docs
// separate md files become a single html page
// duplicate slugs are bad

// format.skip("duplicate slugs should throw an error", () => {
// 	assert.throws(() => {
// 		format_api("./api-docs.md", api, "docs");
// 		format_api("./api-docs.md", api, "docs");
// 	}, /Duplicate slug Template_syntax/);
// });

_format("formats", async () => {
	const md = `### hello

This is some paragraph text

___

this is more text

and this

\`\`\`js
console.log('boo')
\`\`\`
	
`;
	const x = await format({
		file: "boo.md",
		markdown: md,
		project: "svelte",
		docs_type: "docs",
		dir: "docs/boo",
		level: 3,
	});

	// console.log(x);
});

_format("formats", async () => {
	const md = `### Table

| Branch  | Commit           |
| ------- | ---------------- |
| main    | 0123456789abcdef |
| staging | fedcba9876543210 |`;

	const x = await format({
		file: "boo.md",
		markdown: md,
		project: "svelte",
		docs_type: "docs",
		dir: "docs/boo",
		level: 3,
	});

	assert.equal(x.contents, `<h3 id="false-table">Table</h3>
<table>
<thead>
<tr>
<th>Branch</th>
<th>Commit</th>
</tr>
</thead>
<tbody>
<tr>
<td>main</td>
<td>0123456789abcdef</td>
</tr>
<tr>
<td>staging</td>
<td>fedcba9876543210</td>
</tr>
</tbody>
</table>`);
});

_format.run();
