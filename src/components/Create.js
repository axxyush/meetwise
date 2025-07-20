import Sidebar from "./Siderbar";
import Upload from "./Upload";

function Create() {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <Upload />
      </div>
    </>
  );
}

export default Create;
