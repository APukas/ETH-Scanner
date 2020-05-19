FROM heidiks/rabbitmq-delayed-message-exchange

COPY definitions.json /etc/rabbitmq/

RUN chmod 777 /etc/rabbitmq/definitions.json

WORKDIR /var/lib/rabbitmq/