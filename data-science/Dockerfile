FROM python:3.12-slim

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency definition files first to leverage Docker layer caching
COPY pyproject.toml uv.lock ./

# Install dependencies using cache mount (extremely fast)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev --link-mode=copy

# Copy api files
COPY api.py api_predict.py ./

# Path
ENV PATH="/app/.venv/bin:$PATH"

# Run the API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]