import BlogSocialImage from "@/components/BlogSocialImage";

export const revalidate = 300;

/** Preserve legacy card URLs without a file-metadata convention overriding article images. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return BlogSocialImage({ params });
}
