FROM nginx:1.27.1-bookworm
LABEL authors="Li Chaoyi <icylydia@gmail.com>"

COPY dist/* /usr/share/nginx/html/

RUN --mount=type=secret,id=version cat /run/secrets/version > /usr/share/nginx/html/version
