import React from "react";
import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from "tinymce/tinymce";

// Theme
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";

// importing the plugin js.
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/hr";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/print";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
import "tinymce/plugins/help";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/save";

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from "tinymce/skins/content/default/content.min.css";
import contentUiCss from "tinymce/skins/ui/oxide/content.min.css";

// import test from ""
//class TinyMce extends React.Component {
class TinyMce extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorKey: "tinyMCEDMEditor" + this.makeid() + this.props.formId,
      inValue: this.props.intitialContent,
    };
  }

  makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
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
    // <Editor tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}>

    return (
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        // onInit={(evt,editor)=>editorRef.current=editor}
        key={this.state.editorKey}
        id={this.state.editorKey}
        // initialValue={this.props.intitialContent}
        // value={this.props.intitialContent}
        value={this.state.inValue}
        onEditorChange={this.handleEditorChange}
        init={{
          // skin: false,
          // content_css: false,
          // content_style: [contentCss, contentUiCss].join('\n'),
          selector: "textarea", // change this value according to your HTML
          menubar: "insert table edit",
          force_br_newlines: false,
          force_p_newlines: false,
          forced_root_block: "",
          height: 600,
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
