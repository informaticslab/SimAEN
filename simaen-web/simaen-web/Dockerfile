FROM registry.access.redhat.com/ubi8/nodejs-14:latest AS dev
USER 0
ADD simaen-web .
RUN chown -R 1001:0 ./
USER 1001
RUN npm ci
ENV PORT 3000
EXPOSE $PORT/tcp 
ENV REACT_APP_API_URL http://localhost:8080/api
CMD [ "sh", "-c", "npm start" ]

FROM registry.access.redhat.com/ubi8/nodejs-14:latest AS build
USER 0
RUN chown -R 1001:0 ./
USER 1001
COPY --from=dev /opt/app-root/src ./
RUN npm run build

FROM registry.access.redhat.com/ubi8/httpd-24:latest AS prod
USER 0
RUN chown -R 1001:0 /var/www/html/
USER 1001
COPY --from=build /opt/app-root/src/build/ /var/www/html/
COPY .htaccess /var/www/html/
RUN echo 'ProxyPass /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf
RUN echo 'ProxyPassReverse /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf

CMD [ "run-httpd" ]




