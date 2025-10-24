export const loadCodeSyntaxHighlight = async () => {
  const Prism = (await import("prismjs")).default;

  await Promise.all([
    import("prismjs/themes/prism.css"),
    import(
      "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css"
    ),
    import("prismjs/components/prism-javascript"),
    import("prismjs/components/prism-typescript"),
    import("@toast-ui/editor-plugin-code-syntax-highlight"),
  ]);

  const codeSyntaxHighlight = (
    await import("@toast-ui/editor-plugin-code-syntax-highlight")
  ).default;

  return { codeSyntaxHighlight, Prism };
};
