import NoteLi from "./noteli";

const TOP = 30;
const RIGHT = 30;

function DisplayOnScreenNotes({ notes }) {
  return (
    <div>
      {/* {notes.map((note, i) => (
        <NoteLi
          key={note.id}
          {...note}
          top={TOP + i * 60}
          right={RIGHT + i * 20}
          zIndex={999 + i}
          displayClose={true}
        />
      ))} */}
      <NoteLi notes={notes} />
    </div>
  );
}

export default DisplayOnScreenNotes;
