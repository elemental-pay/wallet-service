FROM python:3.9-slim

# RUN apt-get update \
#     && apt-get -y install libpq-dev gcc \
#     && pip install psycopg2

# Create app directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

# ENTRYPOINT ["python", "-m", "flask", "run"]
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
