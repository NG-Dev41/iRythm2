FROM nginx:1.17.1-alpine

COPY ./dist/traceqa /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
