FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl build-essential
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"
RUN poetry config virtualenvs.create false
COPY pyproject.toml /app/
RUN poetry install --no-dev --no-interaction --no-ansi
RUN pip list
COPY service-account.json /app/service-account.json
COPY origins-url.json /app./origins-url.json
COPY backend /app/backend
WORKDIR /app/backend
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["uvicorn", "backend.app:app", "--reload", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]