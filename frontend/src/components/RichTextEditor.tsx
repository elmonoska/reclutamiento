import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
};

export default function RichTextEditor({ value, onChange, onBlur, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || "",
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onBlur: () => {
            onBlur?.();
        },
        editorProps: {
            attributes: {
                class:
                    "min-h-[120px] px-4 py-3 outline-none text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline",
            },
        },
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor.isActive("bold"),
            isItalic: editor.isActive("italic"),
            isUnderline: editor.isActive("underline"),
            isBulletList: editor.isActive("bulletList"),
            isOrderedList: editor.isActive("orderedList"),
        }),
    });

    // Sincronización segura con React Hook Form (ej. al limpiar el formulario)
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== undefined && value !== current && !editor.isFocused) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400">
                Cargando editor...
            </div>
        );
    }

    const buttonClass = (active: boolean) =>
        `min-w-8 h-8 px-2 inline-flex items-center justify-center text-sm font-medium rounded transition select-none ${active ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition">
            <div className="flex flex-wrap items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${buttonClass(editorState.isBold)} font-bold`}
                    title="Negrita"
                >
                    B
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${buttonClass(editorState.isItalic)} italic`}
                    title="Cursiva"
                >
                    I
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`${buttonClass(editorState.isUnderline)} underline`}
                    title="Subrayado"
                >
                    U
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={buttonClass(editorState.isBulletList)}
                    title="Viñetas"
                >
                    •
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={buttonClass(editorState.isOrderedList)}
                    title="Lista numerada"
                >
                    1.
                </button>
            </div>
            <EditorContent editor={editor} />
            <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}