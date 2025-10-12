FROM nginx:stable-alpine-perl

LABEL author="Alex.YANG"

WORKDIR /home

COPY dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]