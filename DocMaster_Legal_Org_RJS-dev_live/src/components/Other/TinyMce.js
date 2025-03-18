import React from "react";
import { Editor } from "@tinymce/tinymce-react";

class TinyMce extends React.Component {
  handleEditorChange = (content, editor) => {
    // console.log("Content was updated:", content);
    this.props.onEditorChange(content);
  };

  render() {
    return (
      <Editor
        value={this.props.intitialContent}
        onEditorChange={this.handleEditorChange}
        init={{
          selector: "textarea", // change this value according to your HTML
          pagebreak_split_block: true,
          height: 700,
          menubar: false,
          indentation: "80pt",
          indent_use_margin: true,
          plugins: [
            // 'advlist autolink lists link image charmap print preview anchor',
            // 'searchreplace visualblocks code fullscreen textpattern',
            // 'insertdatetime media table paste code help wordcount',
            // 'nonbreaking pagebreak table nonbreaking save spellchecker searchreplace '
            "print lists",
          ],
          //   formats:{title:'Format', items: 'lineheight' },
          //   insertdatetime_dateformat: '%Y-%m-%d',
          toolbar:
            "undo redo | bold italic backcolor | pagebreak |\
                        alignleft aligncenter alignright alignjustify | insertdatetime |\
                        bullist numlist outdent indent | removeformat | help | nonbreaking | save | toolbar | lineheight | code | ",
          // setup:  function(editor) {
          //   editor.ui.registry.addButton("myButton", {
          //     text: '<<-To Print/Download Document',
          //     // icon: "arrow-left",

          //     // icon: false,
          //     onAction:
          //     function () {
          //       // alert("Clicked !!!!!")
          //       // editor.value.print()
          //       // null
          //       // console.log(TinyMce.value)
          //       // Plugin()
          //       // this.printValueHandler()
          //       // window.print()
          //     }
          //   })
          // }
        }}
      />
      // <Editor
      //   value={this.props.intitialContent}
      //   onEditorChange={this.handleEditorChange}
      //   init={{
      //     selector: "textarea", // change this value according to your HTML
      //     menubar: "insert table edit",
      //     pagebreak_split_block: true,
      //     force_br_newlines : false,
      //     force_p_newlines : false,
      //     forced_root_block : '',
      //     height: 600,
      //     plugins: [
      //       "advlist autolink lists link image charmap print preview anchor",
      //       "searchreplace visualblocks code fullscreen",
      //       "insertdatetime media table paste code help wordcount",
      //       "nonbreaking pagebreak table nonbreaking save spellchecker searchreplace print textpattern",
      //     ],
      //     //formats:{title:'Format', items: 'lineheight' },
      //     //insertdatetime_dateformat: '%Y-%m-%d',
      //     toolbar:
      //       "undo redo | formatselect | bold italic backcolor | pagebreak | print | preview |\
      //       alignleft aligncenter alignright alignjustify | insertdatetime | spellchecker| searchreplace |\
      //       bullist numlist outdent indent | removeformat | help | nonbreaking | save | toolbar | lineheight | code |\
      //       table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      //   }}
      // />
    );
  }
}

export default TinyMce;
