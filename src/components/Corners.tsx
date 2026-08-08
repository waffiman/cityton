/**
 * The four "+" registration marks every framed object in this system wears.
 * Always render inside an element that also carries the `blueprint` class.
 */
export default function Corners() {
  return (
    <>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
    </>
  );
}
