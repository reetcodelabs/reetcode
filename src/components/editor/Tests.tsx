import { useEffect } from "react";

export function EditorTests() {
  useEffect(() => {
    console.log("my first time rendering.");
  }, []);

  return <h1>Editor tests</h1>;
}

export default EditorTests;
