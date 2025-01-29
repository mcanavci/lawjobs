import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'İçerik yazın...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="relative">
      <div
        className={`prose max-w-none border rounded-md p-4 min-h-[200px] ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <div className="flex gap-2 border-b pb-2 mb-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor?.isActive('bold')
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor?.isActive('italic')
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
              editor?.isActive('bulletList')
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
            }`}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${
              editor?.isActive('orderedList')
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
            }`}
          >
            1.
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
} 