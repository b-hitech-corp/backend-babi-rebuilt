FROM node:20


WORKDIR /app

COPY . .

RUN npm install

COPY startup.sh /usr/src/app/startup.sh
RUN chmod +x /usr/src/app/startup.sh

CMD ["/usr/src/app/startup.sh"]