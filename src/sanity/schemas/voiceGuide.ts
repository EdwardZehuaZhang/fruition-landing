export default {
  name: "voiceGuide",
  title: "Voice Guide",
  type: "document",
  // Singleton - only one of these. Studio structure can pin it via desk structure.
  fields: [
    { name: "title", title: "Title", type: "string", initialValue: "Fruition Voice Guide" },
    {
      name: "body",
      title: "Voice guide body (plain text - injected verbatim into Marketa system prompts)",
      type: "text",
      rows: 40,
      description:
        "Tone, vocabulary, structure, banned phrases. Updated by Josh / Nikhil. Fetched at draft + revise time by n8n via GROQ.",
    },
    {
      name: "version",
      title: "Version",
      type: "string",
      description: "Bump on each material edit so n8n logs can identify which version produced which draft.",
      initialValue: "v0.1",
    },
    { name: "updatedAt", title: "Last updated", type: "datetime" },
  ],
  preview: {
    select: { title: "title", subtitle: "version" },
  },
}
