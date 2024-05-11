# Steps to install application on Digital Ocean Droplet

1. Create a droplet. Starting with $7/m Premium AMD and selecting Docker image.
2. SSH into server
3. Install Github CLI on server (using this guide)[https://github.com/cli/cli/blob/trunk/docs/install_linux.md]
4. gh cli login on server.
5. Create folder called `~/code` for all the code
6. Clone the rce repo using `gh repo clone reetcodelabs/rce.reetcode.com`
7. Build the rce docker repository using command `docker build -f Dockerfile . --platform linux/x86_64 -t rce.reetcode.com`
8. Start docker container using command `docker run -d --name rce.reetcode.com -p 50051:50051 rce.reetcode.com`
9. Enable port for rce with `sudo ufw allow 50051` (for testing)
9. Setup postgres using this URL https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-22-04-quickstart

Add password for postgres user using command `alter user reetcode with encrypted password 'reetcode'`
Grant database access using command `grant all privileges on database reetcode to reetcode`;

10. Clone reetcode codebase
11. Install node using this article https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
12. Setup pm2 and nginx for nextjs https://docs.digitalocean.com/developer-center/deploying-a-next.js-application-on-a-digitalocean-droplet/
Start command: `pm2 start npm --name "staging.reetcode.com" -- start`
12. Set up certbot using https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04#prerequisites
13. Configure cert using command `sudo certbot --nginx -d staging.reetcode.com -d www.staging.reetcode.com`
