import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
    ClassicEditor,
    Autoformat,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    SelectAll,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    Undo,
    AccessibilityHelp,
    AutoLink,
    Code,
    CodeBlock,
    GeneralHtmlSupport,
    HtmlEmbed,
    ShowBlocks,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import Ink from "react-ink";

export default function Editor({
    initValue = "",
    placeholder = "",
    handleSubmit,
    textButton = "Send",
}) {
    const editorContainerRef = useRef(null);
    const [value, setValue] = useState("");
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    useEffect(() => {
        setIsLayoutReady(true);
        if (editorContainerRef.curernt) {
            editorContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        return () => {
            setIsLayoutReady(false);
        };
    }, []);

    const editorConfig = {
        toolbar: {
            items: [
                "undo",
                "redo",
                "|",
                "showBlocks",
                "|",
                "heading",
                "|",
                "bold",
                "italic",
                "code",
                "|",
                "link",
                "insertTable",
                "codeBlock",
                "htmlEmbed",
            ],
            shouldNotGroupWhenFull: false,
        },
        plugins: [
            AccessibilityHelp,
            Autoformat,
            AutoLink,
            Autosave,
            BalloonToolbar,
            Bold,
            Code,
            CodeBlock,
            Essentials,
            GeneralHtmlSupport,
            Heading,
            HtmlEmbed,
            Italic,
            Link,
            Paragraph,
            SelectAll,
            ShowBlocks,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Undo,
        ],
        balloonToolbar: ["bold", "italic", "|", "link"],
        heading: {
            options: [
                {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                },
                {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                },
                {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                },
                {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                },
                {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                },
                {
                    model: "heading5",
                    view: "h5",
                    title: "Heading 5",
                    class: "ck-heading_heading5",
                },
                {
                    model: "heading6",
                    view: "h6",
                    title: "Heading 6",
                    class: "ck-heading_heading6",
                },
            ],
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true,
                },
            ],
        },
        initialData: `${initValue}`,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            decorators: {
                toggleDownloadable: {
                    mode: "manual",
                    label: "Downloadable",
                    attributes: {
                        download: "file",
                    },
                },
            },
        },
        placeholder: `${placeholder}`,
        table: {
            contentToolbar: [
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "tableProperties",
                "tableCellProperties",
            ],
        },
    };

    return (
        <div className="flex-1 w-full ">
            <div className="w-full">
                <div
                    className="editor-container editor-container_classic-editor "
                    ref={editorContainerRef}
                >
                    <div className="editor-container__editor font-normal">
                        <div>
                            {isLayoutReady && (
                                <CKEditor
                                    data={initValue}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setValue(data);
                                    }}
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full">
                <button
                    type="button"
                    onClick={() => {
                        handleSubmit(value);
                    }}
                    className="relative bg-black rounded-lg text-white text-sm px-2 py-1 mt-2 inline-block"
                >
                    <Ink></Ink>
                    {textButton}
                </button>
            </div>
        </div>
    );
}
