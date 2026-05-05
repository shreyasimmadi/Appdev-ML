from docling.document_converter import DocumentConverter
import os

converter = DocumentConverter()

# Drop your PDFs in backend/data/raw_pdfs/
PDF_DIR = "backend/data/raw_pdfs"
OUT_DIR = "backend/data/parsed_md"
os.makedirs(OUT_DIR, exist_ok=True)

for filename in os.listdir(PDF_DIR):
    if filename.endswith(".pdf"):
        source = os.path.join(PDF_DIR, filename)
        result = converter.convert(source)
        markdown_content = result.document.export_to_markdown()

        out_path = os.path.join(OUT_DIR, filename.replace(".pdf", ".md"))
        with open(out_path, "w") as f:
            f.write(markdown_content)

        print(f"✅ Extracted: {filename}")