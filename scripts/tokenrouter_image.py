#!/usr/bin/env python3
import argparse
import base64
import json
import os
import sys
from pathlib import Path

import requests


DEFAULT_MODEL = "openai/gpt-5.4-image-2"
DEFAULT_BASE_URL = "https://api.tokenrouter.com"


def load_dotenv(path: Path = Path(".env.local")) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def build_endpoint(base_url: str) -> str:
    normalized = base_url.rstrip("/")
    if normalized.endswith("/v1"):
        return f"{normalized}/images/generations"
    return f"{normalized}/v1/images/generations"


def read_prompt(args: argparse.Namespace) -> str:
    if args.prompt and args.prompt_file:
        raise SystemExit("Use --prompt or --prompt-file, not both.")
    if args.prompt_file:
        return Path(args.prompt_file).read_text(encoding="utf-8").strip()
    if args.prompt:
        return args.prompt.strip()
    raise SystemExit("Provide --prompt or --prompt-file.")


def write_image(item: dict, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if item.get("b64_json"):
        output_path.write_bytes(base64.b64decode(item["b64_json"]))
        return

    if item.get("url"):
        response = requests.get(item["url"], timeout=180)
        response.raise_for_status()
        output_path.write_bytes(response.content)
        return

    raise SystemExit(f"Image response did not include b64_json or url: {json.dumps(item)[:500]}")


def main() -> None:
    load_dotenv()

    parser = argparse.ArgumentParser(description="Generate an image through TokenRouter's OpenAI-compatible image API.")
    parser.add_argument("--prompt")
    parser.add_argument("--prompt-file")
    parser.add_argument("--input", help="JSONL batch file. Each row may include prompt, out, size, quality, output_format, n, and model.")
    parser.add_argument("--out")
    parser.add_argument("--out-dir")
    parser.add_argument("--model", default=os.getenv("TOKENROUTER_MODEL", DEFAULT_MODEL))
    parser.add_argument("--base-url", default=os.getenv("TOKENROUTER_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--size", default="2048x1152")
    parser.add_argument("--quality", default="medium")
    parser.add_argument("--output-format", default="png")
    parser.add_argument("--n", type=int, default=1)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    api_key = os.getenv("TOKENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key and not args.dry_run:
        raise SystemExit("Set TOKENROUTER_API_KEY before generating images.")

    endpoint = build_endpoint(args.base_url)

    jobs = []
    if args.input:
        input_path = Path(args.input)
        if not input_path.exists():
            raise SystemExit(f"Input file not found: {input_path}")
        out_dir = Path(args.out_dir or "output/imagegen/tokenrouter")
        for index, line in enumerate(input_path.read_text(encoding="utf-8").splitlines(), start=1):
            if not line.strip():
                continue
            row = json.loads(line)
            if not row.get("prompt"):
                raise SystemExit(f"Missing prompt on JSONL line {index}")
            output = row.get("out") or str(out_dir / f"image-{index}.png")
            jobs.append((row, Path(output)))
    else:
        if not args.out:
            raise SystemExit("Provide --out for single generation, or --input with optional --out-dir for batch generation.")
        jobs.append(
            (
                {
                    "prompt": read_prompt(args),
                    "model": args.model,
                    "size": args.size,
                    "quality": args.quality,
                    "output_format": args.output_format,
                    "n": args.n,
                },
                Path(args.out),
            )
        )

    def make_payload(job: dict) -> dict:
        return {
            "model": job.get("model", args.model),
            "prompt": job["prompt"],
            "size": job.get("size", args.size),
            "quality": job.get("quality", args.quality),
            "output_format": job.get("output_format", args.output_format),
            "n": int(job.get("n", args.n)),
        }

    if args.dry_run:
        print(
            json.dumps(
                [
                    {"endpoint": endpoint, "out": str(output_path), **make_payload(job)}
                    for job, output_path in jobs
                ],
                indent=2,
            )
        )
        return

    for job_index, (job, output_path) in enumerate(jobs, start=1):
        payload = make_payload(job)
        print(f"Generating {job_index}/{len(jobs)} -> {output_path}", file=sys.stderr)
        response = requests.post(
            endpoint,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=300,
        )
        if response.status_code >= 400:
            raise SystemExit(f"TokenRouter error {response.status_code}: {response.text[:2000]}")

        data = response.json()
        items = data.get("data") or []
        if not items:
            raise SystemExit(f"No image data returned: {json.dumps(data)[:1000]}")

        if len(items) == 1:
            write_image(items[0], output_path)
            print(f"Wrote {output_path}")
            continue

        for index, item in enumerate(items, start=1):
            indexed_path = output_path.with_name(f"{output_path.stem}-{index}{output_path.suffix}")
            write_image(item, indexed_path)
            print(f"Wrote {indexed_path}")


if __name__ == "__main__":
    main()
