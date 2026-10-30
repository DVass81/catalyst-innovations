import type { FocusEvent } from "react";
import { set, unset, useFormValue, type StringInputProps } from "sanity";

/** Reference a source's stable array key, rather than its changing position. */
export function SourceInput(props: StringInputProps) {
  const sources = useFormValue(["sources"]) as Array<{ _key?: string; title?: string }> | undefined;
  return <select
    id={props.elementProps.id}
    disabled={props.readOnly}
    value={props.value || ""}
    onFocus={(event) => props.elementProps.onFocus(event as unknown as FocusEvent<HTMLInputElement>)}
    onBlur={(event) => props.elementProps.onBlur(event as unknown as FocusEvent<HTMLInputElement>)}
    onChange={(event) => props.onChange(event.target.value ? set(event.target.value) : unset())}
    style={{ width: "100%", padding: "0.8rem", borderRadius: 6, background: "transparent", color: "inherit", border: "1px solid #8093aa" }}
  >
    <option value="">No section-specific reference</option>
    {(sources || []).filter((source) => source._key).map((source) =>
      <option value={source._key} key={source._key}>{source.title || "Untitled source"}</option>,
    )}
  </select>;
}
