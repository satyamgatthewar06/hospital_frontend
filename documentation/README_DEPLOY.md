# Deployment guide

Steps to build and run the project using Docker Compose (local or server):

1. Ensure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` and other secrets are set in the project root `.env`.

2. From the project root run:

```bash
docker-compose build
docker-compose up -d
```

3. Verify services:
- Backend: http://<host>:5000/api/health
- Frontend: http://<host>:3000

4. Production notes:
- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` in environment (do NOT store in repo).
- Use a managed database or a secure, backed-up MySQL server instead of the local volume for production.
- Add SSL with a reverse proxy (Nginx on the host) or use a cloud load balancer + certs.
- Monitor logs (`docker-compose logs -f backend`) and add a process manager or orchestrator (Kubernetes, ECS) for scaling.

5. Alternative single-server deploy (VPS):
- Install Docker and Docker Compose.
- Copy repo to server, create a production `.env` with secrets.
- Run `docker-compose up -d`.

6. Cloud deploy shortcuts:
- You can push images to a registry (Docker Hub / GitHub Container Registry) and deploy using cloud services (AWS ECS, Azure App Service, DigitalOcean Apps).

If you want, I can also:
- Create Kubernetes manifests.
- Add a GitHub Actions workflow to build and push images.
- Add automated health checks and log rotation.
