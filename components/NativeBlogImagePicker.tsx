"use client";

import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import { nativeBlogImages, nativeBlogImage, type NativeBlogFeaturedImage } from "@/lib/native-blog-content";

/** Selecting an approved local asset requires no upload or additional account access. */
export default function NativeBlogImagePicker({ value, onChange, disabled = false, required = false, idPrefix }: {
  value?: NativeBlogFeaturedImage; onChange: (value: NativeBlogFeaturedImage | undefined) => void;
  disabled?: boolean; required?: boolean; idPrefix: string;
}) {
  return <div className="nbe-image-picker nbe-field-full">
    <label htmlFor={`${idPrefix}-image`}>Featured picture <span>{required ? "Choose a picture for this article." : "Optional for an existing article."}</span></label>
    <select id={`${idPrefix}-image`} value={value?.assetId ?? ""} disabled={disabled} required={required}
      onChange={event => {
        const image = nativeBlogImages.find(item => item.assetId === event.target.value);
        onChange(image ? { assetId: image.assetId, alt: image.alt } : undefined);
      }}>
      <option value="">Choose a picture</option>
      {nativeBlogImages.map(image => <option key={image.assetId} value={image.assetId}>{image.label}</option>)}
    </select>
    <p className="nbe-hint">Choose the scene that fits your article. These licensed pictures are hosted on this website.</p>
    {value && <><label htmlFor={`${idPrefix}-image-alt`}>Picture description <span>Describe what the picture shows.</span></label>
      <input id={`${idPrefix}-image-alt`} value={value.alt} disabled={disabled} minLength={10} maxLength={250} required
        onChange={event => onChange({ ...value, alt: event.target.value })} />
      <BlogFeaturedImage cover={nativeBlogImage(value)} thumbnail />
    </>}
  </div>;
}
