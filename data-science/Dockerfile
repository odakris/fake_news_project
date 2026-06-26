# syntax=docker/dockerfile:1

# ============================================================
#  Builder stage — install deps, download models. Discarded.
# ============================================================
# Exact patch match to .python-version (3.12.12) so the venv's interpreter
# exists in the runtime stage and uv needs no managed python download.
FROM python:3.12.12-slim AS builder

# uv from official image (build-time only, not in final image)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# - UV_COMPILE_BYTECODE: precompile .pyc for faster startup
# - UV_LINK_MODE=copy: avoid hardlink issues in docker
# - UV_PYTHON_DOWNLOADS=0: use the base image python, don't fetch another
# NLTK_DATA points inside the venv so it survives compose's bind-mount of
# ./data-science:/app (the /app/.venv anonymous volume preserves it).
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0 \
    NLTK_DATA=/app/.venv/nltk_data

WORKDIR /app

# Dependency layer (cached unless pyproject/uv.lock change)
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# App code + install the project itself
COPY . .

# Guard: fail fast if model weights are still Git LFS pointer files.
# Without `git lfs pull` on the host, *.safetensors are ~134-byte text stubs
# ("version https://git-lfs.github.com/spec/v1"), which crash at runtime with
# the cryptic "SafetensorError: header too large". Catch it here with a clear fix.
RUN set -e; \
    for f in $(find models -name '*.safetensors'); do \
        if head -c 64 "$f" | grep -q 'git-lfs.github.com'; then \
            echo "ERROR: '$f' is a Git LFS pointer, not the real model weights." >&2; \
            echo "Run 'git lfs install && git lfs pull' on the host, then rebuild." >&2; \
            exit 1; \
        fi; \
    done

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# spaCy model + NLTK data both install inside the venv (preserved by the
# /app/.venv volume in compose, and copied wholesale in the runtime stage).
RUN uv run python -m spacy download en_core_web_sm && \
    uv run python -c "import nltk; nltk.download('vader_lexicon', download_dir='/app/.venv/nltk_data')"

# ============================================================
#  Runtime stage — clean image, only what the API needs.
# ============================================================
FROM python:3.12.12-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH" \
    NLTK_DATA=/app/.venv/nltk_data

WORKDIR /app

# Single copy of the finished build: venv + app + model files + nltk data.
# No uv binary, no duplicate venv layer, no build toolchain.
COPY --from=builder /app /app

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
