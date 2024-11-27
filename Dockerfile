FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl build-essential
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"
RUN poetry config virtualenvs.create false
COPY pyproject.toml /app/
RUN poetry install --no-dev --no-interaction --no-ansi
RUN pip list
COPY backend /app/backend
WORKDIR /app/backend
ENV PYTHONPATH=/app
EXPOSE 8080
CMD ["uvicorn", "backend.app:app", "--reload", "--host", "0.0.0.0", "--port", "8080", "--log-level", "info"]