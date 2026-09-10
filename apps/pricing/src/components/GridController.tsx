import { useState } from "react";
import { IconLayoutColumns } from "@tabler/icons-react";

export function GridController() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        id="layout-grid-overlay"
        className="layout-grid-overlay shell"
        hidden={!visible}
        aria-hidden="true"
      >
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>
      <button
        type="button"
        className="grid-controller"
        aria-controls="layout-grid-overlay"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        <IconLayoutColumns size={18} aria-hidden="true" />
        <span>Layout grid</span>
        <span className="grid-controller-switch" aria-hidden="true" />
      </button>
    </>
  );
}
