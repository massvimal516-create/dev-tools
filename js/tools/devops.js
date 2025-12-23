const devOut = msg =>
    document.getElementById('devopsOutput').textContent = msg;

// ---------- DOCKERFILE ----------
function generateDockerfile() {
    const base = document.getElementById('dockerBase').value || 'node:18-alpine';
    const port = document.getElementById('dockerPort').value || '3000';

    devOut(
        `FROM ${base}
WORKDIR /app
COPY . .
RUN npm install
EXPOSE ${port}
CMD ["npm","start"]`
    );
}

// ---------- KUBERNETES ----------
function generateK8s() {
    const app = document.getElementById('k8sApp').value || 'my-app';
    const image = document.getElementById('k8sImage').value || 'my-image:latest';

    devOut(
        `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${app}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${app}
  template:
    metadata:
      labels:
        app: ${app}
    spec:
      containers:
      - name: ${app}
        image: ${image}
        ports:
        - containerPort: 80`
    );
}

// ---------- ENV MANAGER ----------
function formatEnv() {
    const lines = document.getElementById('envInput').value
        .split('\n')
        .filter(l => l.includes('='));

    devOut(
        lines
            .map(l => l.trim())
            .join('\n')
    );
}

// ---------- LOG ANALYZER ----------
function analyzeLogs() {
    const logs = document.getElementById('logInput').value;

    const errors = (logs.match(/error/gi) || []).length;
    const warnings = (logs.match(/warn/gi) || []).length;
    const infos = (logs.match(/info/gi) || []).length;

    devOut(
        `Log Summary:
Errors: ${errors}
Warnings: ${warnings}
Info: ${infos}`
    );
}

// ---------- BUILD SIZE ----------
function analyzeBuild() {
    const lines = document.getElementById('sizeInput').value.split('\n');

    let total = 0;
    let output = 'Build Size Report:\n\n';

    lines.forEach(l => {
        const [file, size] = l.split(':');
        if (!file || !size) return;
        total += Number(size);
        output += `${file} → ${size} KB\n`;
    });

    output += `\nTotal Size: ${total} KB`;
    devOut(output);
}
