# Stage 1: Build the virtual environment and download static assets
FROM python:3.12-slim AS builder

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set environment variables:
# - UV_COMPILE_BYTECODE: compiles python files to bytecode for faster container startup
# - UV_LINK_MODE: avoids filesystem issues with hardlinks inside docker
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Install dependencies using cache mount (leverage pyproject.toml and uv.lock caching)
RUN --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Download spaCy model and NLTK data inside the builder virtualenv
# Download NLTK data to a separate directory outside /app to prevent shadowing by mounts
RUN .venv/bin/python -m spacy download en_core_web_sm && \
    .venv/bin/python -c "import nltk; nltk.download('vader_lexicon', download_dir='/nltk_data')"


# Stage 2: Minimal runtime image
FROM python:3.12-slim

# Create a non-privileged user for security best practices
RUN useradd -u 10001 -m appuser

WORKDIR /app

# Copy the pre-built virtual environment with correct ownership
COPY --chown=appuser:appuser --from=builder /app/.venv /app/.venv

# Copy pre-downloaded NLTK data to the home directory of the appuser (so it's not shadowed by bind mounts)
COPY --chown=appuser:appuser --from=builder /nltk_data /home/appuser/nltk_data

# Copy only the application source code files and models with correct ownership
COPY --chown=appuser:appuser api.py predict.py preprocessing.py config.py ./
COPY --chown=appuser:appuser models/ ./models/

# Use the non-privileged user
USER appuser

# Set environment variables:
# - PATH: adds the virtual environment's binary folder to PATH
# - PYTHONUNBUFFERED: ensures logs are output immediately
# - NLTK_DATA: tells NLTK where to find the downloaded data
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    NLTK_DATA="/home/appuser/nltk_data"

# Expose the port the app runs on
EXPOSE 8000

# Run the API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]