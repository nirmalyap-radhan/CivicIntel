"""
Document Chunking and Text Preprocessing for CivicIntel RAG.
Segments government policies and gazettes into semantically coherent passages
while preserving section headings and hierarchical context.
"""

import re
from typing import Any, Dict, List


class DocumentChunker:
    """
    Splits long policy and audit texts into indexed chunks.
    Detects section headers and retains structural context.
    """

    def __init__(self, target_chunk_size: int = 500, chunk_overlap: int = 80):
        self.target_chunk_size = target_chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(self, text: str) -> List[Dict[str, Any]]:
        """
        Splits raw text into a list of chunk dictionaries with:
        - chunk_index
        - chunk_text
        - section_heading
        - page_or_paragraph
        - token_count
        """
        if not text or not text.strip():
            return []

        # Split into paragraphs or major blocks
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
        chunks: List[Dict[str, Any]] = []
        current_heading = "General Overview"
        chunk_idx = 0

        current_buffer: List[str] = []
        current_len = 0

        heading_pattern = re.compile(
            r"^(#+\s*|Section\s+\d+|Article\s+\d+|Chapter\s+\d+|Clause\s+\d+|Audit\s+Observation\s+\d+|Rule\s+\d+)",
            re.IGNORECASE,
        )

        for para in paragraphs:
            # Check if this paragraph is or begins with a section heading
            first_line = para.split("\n")[0].strip()
            if heading_pattern.match(first_line) or len(first_line) < 80 and first_line.endswith(":"):
                current_heading = first_line.lstrip("#").strip()

            para_len = len(para)

            # If a single paragraph is longer than target_chunk_size, split by sentences
            if para_len > self.target_chunk_size * 1.5:
                sentences = re.split(r"(?<=[.!?])\s+", para)
                for sent in sentences:
                    sent = sent.strip()
                    if not sent:
                        continue
                    if current_len + len(sent) > self.target_chunk_size and current_buffer:
                        chunk_text = " ".join(current_buffer)
                        chunks.append({
                            "chunk_index": chunk_idx,
                            "chunk_text": chunk_text,
                            "section_heading": current_heading,
                            "page_or_paragraph": f"Para {chunk_idx + 1}",
                            "token_count": len(chunk_text.split()),
                        })
                        chunk_idx += 1
                        # Retain overlap from end of current buffer
                        overlap_words = chunk_text[-self.chunk_overlap:].split()[1:]
                        current_buffer = overlap_words + [sent]
                        current_len = sum(len(w) for w in current_buffer)
                    else:
                        current_buffer.append(sent)
                        current_len += len(sent)
            else:
                if current_len + para_len > self.target_chunk_size and current_buffer:
                    chunk_text = " ".join(current_buffer)
                    chunks.append({
                        "chunk_index": chunk_idx,
                        "chunk_text": chunk_text,
                        "section_heading": current_heading,
                        "page_or_paragraph": f"Para {chunk_idx + 1}",
                        "token_count": len(chunk_text.split()),
                    })
                    chunk_idx += 1
                    # Keep small overlap
                    overlap_words = chunk_text[-self.chunk_overlap:].split()[1:]
                    current_buffer = overlap_words + [para]
                    current_len = sum(len(w) for w in current_buffer)
                else:
                    current_buffer.append(para)
                    current_len += para_len

        # Flush remaining buffer
        if current_buffer:
            chunk_text = " ".join(current_buffer)
            chunks.append({
                "chunk_index": chunk_idx,
                "chunk_text": chunk_text,
                "section_heading": current_heading,
                "page_or_paragraph": f"Para {chunk_idx + 1}",
                "token_count": len(chunk_text.split()),
            })

        return chunks
