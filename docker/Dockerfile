FROM nginx
COPY ./dist /secondkill-admin
RUN rm /etc/nginx/conf.d/default.conf
ADD secondkill-admin.conf /etc/nginx/conf.d