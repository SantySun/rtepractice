import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class EditorConvertToHTML extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.uploadImageCallBack = this.uploadImageCallBack.bind(this);
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://192.168.20.6:4000/api/file/');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="border container">
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor border"
          onEditorStateChange={(editorState) => this.onEditorStateChange(editorState)}
          toolbar={{
            inline: { inDropdown: false },
            list: { inDropdown: false },
            textAlign: { inDropdown: false },
            link: { inDropdown: false },
            history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: false } },
          }}
        />
        <p style={{ width: "auto" }}
        // disabled
        >{draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        </p>
      </div>
    );
  }
}
export default EditorConvertToHTML;
