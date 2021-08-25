FROM registry.access.redhat.com/ubi8/python-36:latest

ENV PORT 1919
EXPOSE $PORT/tcp

USER 0
RUN dnf repolist && \
    dnf --enablerepo=* update -y && \
    dnf clean all && \
    rm -rf /var/cache/dnf/ /var/tmp/* /tmp/* /var/tmp/.???* /tmp/.???*
ADD simaen_api ./simaen_api
ADD insert_runs.py .
ADD setup.py ./
ADD requirements.txt ./requirements.txt
RUN mkdir -p /opt/simaen-api/simaen_api
RUN chown -R 1001:0 ./
RUN chown  -R 1001:0 /opt/simaen-api/simaen_api

USER 1001
RUN pip install -r requirements.txt --no-cache-dir 
RUN python setup.py install

CMD [ "sh", "-c", "simaen -o 0.0.0.0 -p ${PORT} -v"  ]
