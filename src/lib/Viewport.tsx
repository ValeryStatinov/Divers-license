// DO NOT MODIFY THIS FILE

import viewportManager from "./ViewportManager";

/**
 * Container for the main 3D viewport.
 *
 * Its size is determined by its parent's size.
 *
 * @constructor
 */
export default function Viewport() {
    return <div ref={(ref) => {
        if (ref === null) {
            return;
        }
        viewportManager.init3d(ref);
    }} style={{
        height: "100%",
        width: "100%",
        maxWidth: "100vw",
        maxHeight: "100vh",
    }} />;
}
