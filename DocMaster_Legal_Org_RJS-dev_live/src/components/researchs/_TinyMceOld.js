import React from "react";
import { Editor } from "@tinymce/tinymce-react";

class TinyMce extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorKey: "tinyMCEDMEditor" + this.makeid() + this.props.keyId,
      inValue: this.props.intitialContent,
    };
  }

  makeid() {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  handleEditorChange = (content, editor) => {
    //console.log("Content was updated:", content);
    this.props.onEditorChange(content);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.intitialContent != nextProps.intitialContent) {
      //console.log("componentWillReceiveProps_.nextProps.intitialContent", nextProps.intitialContent);
      this.setState({ inValue: nextProps.intitialContent });
    } else {
      //console.log("componentWillReceiveProps_.this.props.intitialContent", this.props.intitialContent);
      this.setState({ inValue: this.props.intitialContent });
    }
  }

  render() {
    //console.log("Render_intitialContent", this.props.intitialContent);
    //console.log("this.state.inValue", this.state.inValue);
    // menubar: false,
    // pagebreak_split_block: true,
    return (
      <Editor
        key={this.state.editorKey}
        id={this.state.editorKey}
        // initialValue={this.props.intitialContent}
        // value={this.props.intitialContent}
        value={this.state.inValue}
        onEditorChange={this.handleEditorChange}
        init={{
          selector: "textarea", // change this value according to your HTML
          menubar: "insert table", //edit
          force_br_newlines: false,
          force_p_newlines: false,
          forced_root_block: "",
          height: this.props.height != undefined ? this.props.height : 300,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "nonbreaking pagebreak table nonbreaking save spellchecker searchreplace print textpattern",
          ],
          toolbar:
            "undo redo | styleselect | fontselect fontsizeselect | bold italic backcolor | pagebreak  |\
            alignleft aligncenter alignright alignjustify | spellchecker| searchreplace |\
            bullist numlist outdent indent | removeformat | nonbreaking | save | toolbar | lineheight | code |\
            table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | help",
          font_formats:
            "Mangal=Mangal;Nirmala UI=Nirmala UI;Kruti Dev=Kruti Dev 010;Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman, times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva;",
          // preview_styles:"font-family",
          // content_css:"../../stylesheets/custom.css"
          fontsize_formats:
            "8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
        }}
      />
    );
  }
}
/*
previous Toolbars: | print | preview
insertdatetime | 
*/
export default TinyMce;
