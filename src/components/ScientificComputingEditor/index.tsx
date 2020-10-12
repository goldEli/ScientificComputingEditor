import React from "react";
import { monaco } from "@monaco-editor/react";

interface ScientificComputingEditorProps {}

const ScientificComputingEditor: React.FC<ScientificComputingEditorProps> = (
  props
) => {
  React.useEffect(() => {
    monaco
      .init()
      .then((monacoInstance) => {
        // Register a new language
        monacoInstance.languages.register({ id: "mySpecialLanguage" });

        // Register a tokens provider for the language
        monacoInstance.languages.setMonarchTokensProvider("mySpecialLanguage", {
          tokenizer: {
            root: [
              [/\[error.*/, "custom-error"],
              [/\[notice.*/, "custom-notice"],
              [/\[info.*/, "custom-info"],
              [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
              [/eval/, "custom-date"]
            ]
          },
          keywords: [
            "abstract",
            "continue",
            "for",
            "new",
            "switch",
            "assert",
            "goto",
            "do",
            "if",
            "private",
            "this",
            "break",
            "protected",
            "throw",
            "else",
            "public",
            "enum",
            "return",
            "catch",
            "try",
            "interface",
            "static",
            "class",
            "finally",
            "const",
            "super",
            "while",
            "true",
            "false"
          ]
        });

        // Define a new theme that contains only rules that match this language
        monacoInstance.editor.defineTheme("myCoolTheme", {
          base: "vs",
          colors: {},
          inherit: false,
          rules: [
            { token: "custom-info", foreground: "808080" },
            { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
            { token: "custom-notice", foreground: "FFA500" },
            { token: "custom-date", foreground: "008800" },
            { token: "custom-eval", foreground: "ff0000" }
          ]
        });

        // Register a completion item provider for the new language
        monacoInstance.languages.registerCompletionItemProvider(
          "mySpecialLanguage",
          {
            provideCompletionItems: () => {
              var suggestions = [
                {
                  label: "simpleText",
                  kind: monacoInstance.languages.CompletionItemKind.Text,
                  insertText: "simpleText"
                },
                {
                  label: "testing",
                  kind: monacoInstance.languages.CompletionItemKind.Keyword,
                  insertText: "testing(${1:condition})",
                  insertTextRules:
                    monacoInstance.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet
                },
                {
                  label: "ifelse",
                  kind: monacoInstance.languages.CompletionItemKind.Snippet,
                  insertText: [
                    "if (${1:condition}) {",
                    "\t$0",
                    "} else {",
                    "\t",
                    "}"
                  ].join("\n"),
                  insertTextRules:
                    monacoInstance.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: "If-Else Statement"
                }
              ];
              return { suggestions: suggestions };
            }
          }
        );

        monacoInstance.editor.create(document.getElementById("container"), {
          theme: "myCoolTheme",
          value: getCode(),
          language: "mySpecialLanguage"
        });
      })
      .catch((error) =>
        console.error(
          "An error occurred during initialization of Monaco: ",
          error
        )
      );
  }, []);
  return <div style={{ height: "600px" }} id="container"></div>;
};

function getCode() {
  return [
    "[Sun Mar 7 16:02:00 2004] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations",
    "[Sun Mar 7 16:02:00 2004] [info] Server built: Feb 27 2004 13:56:37",
    "[Sun Mar 7 16:02:00 2004] [notice] Accept mutex: sysvsem (Default: sysvsem)"
  ].join("\n");
}

export default ScientificComputingEditor;
