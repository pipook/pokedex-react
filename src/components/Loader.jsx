import { Ripples } from "@uiball/loaders";

function Loader() {
  return (
    <div className="container-loader">
      <Ripples size={45} speed={2} color="black" />
    </div>
  );
}

export default Loader;
