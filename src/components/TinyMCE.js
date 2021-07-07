import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

const TinyMCE = () => {

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
        console.log(editorRef.current.getContent());
        }
    };

    let initialValue = ""

    return (
        <Editor 
            apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
            onInit={(evt, editor) => editorRef.current = editor}
            init={{
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
            }}
        />
    )
}

export default TinyMCE
