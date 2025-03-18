import { useDispatch, useSelector } from "react-redux";
import Note from "./note";
import { useEffect } from "react";
import { fetchStickyNotes } from "./stickyNotesApi";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";
import CreateandFilterStickyNotes from "./CreateandFilterStickyNotes";

const TOP = 30;
const RIGHT = 30;

function StickyNotes() {
  const { notes, notesCopy, isLoading, error } = useSelector(
    (store) => store.stickyNotes
  );
  const { user: userData } = userStore((state) => state);
  const dispatch = useDispatch();

  useEffect(
    function () {
      dispatch(fetchStickyNotes(userData.id));
    },
    [dispatch, userData.id]
  );

  if (isLoading) toast.success("Loading..");
  if (error !== null) toast.error(`${error}`, { autoClose: 3000 });

  return (
    <div>
      <CreateandFilterStickyNotes />
      {notesCopy.length > 0 ? (
        notesCopy.map((note, i) => (
          <Note
            key={note.id}
            {...note}
            top={TOP + i * 60}
            right={RIGHT + i * 20}
            zIndex={999 + i}
          />
        ))
      ) : (
        <div className="mt-2 ms-2">No Notes Found</div>
      )}
      {}
    </div>
  );
}

export default StickyNotes;
